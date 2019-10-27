import React, { useEffect, useState, useContext } from 'react';
import { ScrollView, FlatList, Animated, Easing, Text } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {  // Components
  Container,            // Container da aplicação
  ComicImage,           // Imagem da Comic
  Title,                // Titulo da Comic
  Space,                // Spaco vazio na lista, auxilia animações a maipulação do onScroll da lista
  Details,              // Texto configurada para mostrar os detalhes da Comic
  BackButton,           // Botao de posição absoluta para fechar a teld Detalils
  HeroPreview,          // Container para o component Hero, fornece ambiente para Hero ser montado nas dimensões
  SaleDate,             // Texto para mostrar quando a Comic entrou no mercado
  Creators,             // Container para lista de Cradores da Comic
  Creator,              // Text para criadores da Comic e suas funções na produção
  ComicImagePreview,    // Imagem para uma lista de imagens realcionada a Comic que a Marvel entrega na resposta
  Price,                // Texto para visualizar os preços Impreso e Digital da Comic
  CopyRight,            // Texto para CopyRigth da Marvel
} from './styles';

import { GLOBAL_CTX } from '../../store';
import { types } from '../../store/reducer';
import componentConfig from '../../components/config';
import { client } from '../../api';

import Hero from '../../components/Hero';

export default props => {

  const [globalState, setGlobalState] = useContext(GLOBAL_CTX);
  const [characterPreview, setCharactersPreview] = useState(null);

  const { comicDetails: { results } } = globalState;
  const [comic] = results; // Retirando dados da Comic da Store

  const {
    id,
    title: titleText,   // String com o titulo da comic
    characters,         // Objeto com dados de personagem que aparecem no quadrinho
    creators,           // Objeto com dados dos criadores
    dates,              // Array com as datas da comic
    description,        // String com descricções *Mas nem todas comics vem com esse campo
    images,             // Array com as imagens do quadrinho, a primeira imagem do array é a capa
    thumbnail,          // Objeto com caminho e extenção para thumbnail
    prices,             // Array com objtos que descreve os valores digitais e fisico para a comic
  } = comic;

  const uri = thumbnail.path + '.' + thumbnail.extension + globalState.auth.accessParams; // Uri pra as imagens fornecidas pela Marvel API

  const animTime = 500; // Tempo de animação para tela ser montada, algumas funções aguardam esse tempo tbm para performance
  const initTranslateX = 500; // Posição inicial da tela Details cofigurado para ser montada fora da tela

  let onSaleDate = new Date(dates[0].date.split('T')[0]);
  onSaleDate = onSaleDate.toUTCString().split(' ').splice(0, 4).join(' ');

  let opacity = new Animated.Value(0);
  let translateX = new Animated.Value(initTranslateX);
  let blur = new Animated.Value(0);

  const animContainer = (arg = true, cb) => {
    // Animação reage ao arg False ou True / Fechado - Aberto
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: arg ? 0 : initTranslateX,
        duration: animTime,
        easing: Easing.bezier(0.1, .05, .9, .05),
      }),
      Animated.timing(opacity, {
        toValue: arg ? 1 : 0,
        duration: animTime / 2,
        easing: Easing.bezier(0.1, .05, .9, .05),
      })
    ]).start(cb ? cb : null);
  }

  const handleBackClick = () => {
    // Essa funcção apenas altera o estado do ambiente
    // Outros componentes sabem reagir a isso
    animContainer(false, () => {
      setTimeout(() => {
        setGlobalState({ action: types.SET_ENVIRONMENT, environment: { scene: types.SCENE_COMICS } });
      }, animTime);
    });
  }

  const getInterpolate = () => ({
    // Para evitar poluição visual no JSX as interpolates sao configuradas aqui
    blur: blur.interpolate({
      inputRange: [0, 20, componentConfig.spaceHeight / 1.5],
      outputRange: [0, 0, .2],
      extrapolate: 'clamp'
    }),
    nonBlur: blur.interpolate({
      inputRange: [0, componentConfig.spaceHeight / 2],
      outputRange: [.6, 0],
      extrapolate: 'clamp'
    })
  });

  const handleEvent = () => Animated.event([{ nativeEvent: { contentOffset: { y: blur } } }]);

  useEffect(() => {
    /**
     * Esse effect manipula toda  alteração no state da store
     * Verificações sao feitas para não executar funções desnecessárias
     */


    if (!characterPreview) { // Requisição de personagems espera pra tela ser montada
      setTimeout(() => {
        client({ url: characters.collectionURI + globalState.auth.accessParams }).then(({ data }) => {
          setCharactersPreview(data.results);
        }).catch(err => console.log(err, 'Erro pegando Preview de Personagens'));
      }, animTime + 500); // Tempo de animação mais 500ms de delay
    }

  }, []);

  useEffect(() => {
    if (globalState.environment.scene === types.SCENE_DETAILS) {
      if (translateX._value > 0) {
        animContainer(true);
      }
    }
  }, [globalState]);

  return (
    <Container style={{ transform: [{ translateX }], opacity }} >

      <ComicImage
        style={{ opacity: getInterpolate().nonBlur }}
        source={{ uri }}
      />
      <ComicImage
        style={{ opacity: getInterpolate().blur }}
        blurRadius={3}
        source={{ uri }}
      />
      <BackButton onPress={handleBackClick}>
        <AntDesign color='#FFF' size={40} name='leftcircleo' />
      </BackButton>

      <ScrollView style={{ marginTop: 60 }} onScroll={handleEvent()} >

        <Space />

        <Title>{titleText}</Title>

        <SaleDate >{`Lançamento: ${onSaleDate}`}</SaleDate>

        { // Algums HQ nao vem com esse campo de descrição indefelismente
          description && <Details>{description.replace(/<[^>]*>/g, "")}</Details>
          // A descrição passa por uma no metodo replace para substituir tags html onde a Regex encontrar.
        }

        {
          comic.textObjects.map((detail, index) => ( // Site da marvel exige que qualquer aplicção que esteva consumindo API apresente esses dados
            <Details key={(id + index).toString()} style={{ fontSize: 10, color: '#AAA' }} >{detail.text.replace(/<[^>]*>/g, "")}</Details>
          ))
          // A descrição passa por uma no metodo replace para substituir tags html onde a Regex encontrar.
        }

        { // Mapa retorna preços, e para não correr risco de ser trocado o objeto é manipulado diretamente
          prices.map(({ type, price }) => {
            const print = 'printPrice', digital = 'digitalPurchasePrice';
            type = type === print ? "Versão Impressa" : type === digital ? "Versão Digitial" : "Preço";

            const key = type + price; // Preços não tem um ID
            return <Price key={key}>{`${type}: $${price}`}</Price>
          })
        }

        <Text
          style={{ color: '#FFF', fontSize: 22, marginTop: 35, marginLeft: 15, fontFamily: 'RobotoCondensed-BoldItalic' }}
        >
          Heroes que estao nesse HQ
        </Text>

        { // Para performance e evitar lags na animação a listagem de persogem espera para ser renderizado
          // Ao abrir a tela de Details executa solicitação para API marvel pegando persoagens da Comic
          characterPreview && <FlatList
            data={characterPreview}
            renderItem={({ item }) => (
              <HeroPreview>
                <Hero {...item} />
              </HeroPreview>
            )}
            keyExtractor={item => item.id.toString()}
            horizontal
          />
          // HeroPreview dispoem de um Container para o component Hero ser montado nas dimensões certas
        }

        <Creators>
          <Text
            style={{ color: '#FFF', fontSize: 24, fontFamily: 'RobotoCondensed-BoldItalic', marginBottom: 15 }}
          >
            Criadores
          </Text>

          { // Lista todos criadores e suas funcoes assinaladas
            creators.items.map((creator, index) => (
              <Creator key={'Creator: ' + index} >{`${creator.name} - ${creator.role}`}</Creator>
            ))
          }
        </Creators>

        <Text
          style={{ color: '#FFF', fontSize: 22, marginTop: 15, marginLeft: 5, fontFamily: 'RobotoCondensed-BoldItalic' }}
        >
          Imagens relacionadas
        </Text>

        { // Nos dados retornado pelo Detalhes da Comic tem um array com imagens relacionada a Comic
          // A primeira imgaem geralmente é a mesma imagem da thumbnail
          // As imagem também espera a tela Details ser montada
          images && <FlatList
            horizontal
            data={images}
            renderItem={({ item: { path, extension } }) => (
              <ComicImagePreview
                source={{ uri: `${path}.${extension}${globalState.auth.accessParams}` }}
                style={{ transform: [{ scale: .8 }] }}
              />
            )}
            keyExtractor={item => item.path}
          />
          // Porem algúmas possuem Preview ou Versões secundarias de Capa
        }

        <CopyRight>
          {`Copyright © 1941-2019 Marvel Characters, Inc.
All Rights Reserved
 
This product is protected by copyright and distributed under
licenses restricting 
copying, distribution, and decompilation.`}
        </CopyRight>

      </ScrollView>
    </Container>
  );
};