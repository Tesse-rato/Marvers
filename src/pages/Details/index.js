import React, { useEffect, useState } from 'react';
import { ScrollView, FlatList, Animated, Easing, Text } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {
  Container,
  ComicImage,
  Title,
  Space,
  Details,
  BackButton,
  HeroPreview,
  SaleDate,
  Creators,
  Creator,
  ComicImagePreview,
  Price,
  CopyRight,
} from './styles';

import { GLOBAL_CTX } from '../../store';
import { types } from '../../store/reducer';
import componentConfig from '../../components/config';
import { client } from '../../api';

import Hero from '../../components/Hero';

export default props => {

  const [globalState, setGlobalState] = React.useContext(GLOBAL_CTX);
  const [characterPreview, setCharactersPreview] = useState(null);
  const [comicImagens, setComicImagens] = useState(null);

  const { comicDetails: { results } } = globalState;
  const [comic] = results;

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

  const uri = thumbnail.path + '.' + thumbnail.extension + globalState.auth.accessParams;

  let onSaleDate = new Date(dates[0].date.split('T')[0]);
  onSaleDate = onSaleDate.toUTCString().split(' ').splice(0, 4).join(' ');

  let opacity = new Animated.Value(0);
  let translateX = new Animated.Value(500);
  let blur = new Animated.Value(0);

  const animContainer = (arg, cb) => {
    const transValue = arg ? 0 : 500;
    const opaciValue = arg ? 1 : 0;
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: transValue,
        duration: 500,
        easing: Easing.bezier(0.1, .05, .9, .05),
      }),
      Animated.timing(opacity, {
        toValue: opaciValue,
        duration: 250,
        easing: Easing.bezier(0.1, .05, .9, .05),
      })
    ]).start(cb ? cb : null);
  }

  const handleBackClick = () => {
    animContainer(false, () => {
      setTimeout(() => {
        setGlobalState({ action: types.SET_ENVIRONMENT, environment: { scene: types.SCENE_COMICS } });
      }, 500);
    });
  }

  const getInterpolate = () => {
    return ({
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
  }

  const handleEvent = () => Animated.event([{ nativeEvent: { contentOffset: { y: blur } } }]);

  useEffect(() => {
    if (globalState.environment.scene === types.SCENE_DETAILS) {
      animContainer(true);
    }

    if (!characterPreview) {
      setTimeout(() => {
        client(characters.collectionURI + globalState.auth.accessParams).then(({ data }) => {
          setCharactersPreview(data.results);
        }).catch(console.log);
      }, 500);
    }

  }, []);

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

      <ScrollView
        style={{ marginTop: 60 }}
        onScroll={handleEvent()}
      >
        <Space />

        <Title>{titleText}</Title>

        <SaleDate >{`Sale Date: ${onSaleDate}`}</SaleDate>

        {description && <Details>{description.replace(/<[^>]*>/g, "")}</Details>}

        {comic.textObjects.map((detail, index) => (
          <Details key={(id + index).toString()} style={{ fontSize: 10, color: '#AAA' }} >{detail.text.replace(/<[^>]*>/g, "")}</Details>
        ))}

        {prices.map(price => {
          if (price.type === 'printPrice') {
            price.type = "Versão Impressa";
          }
          else if (price.type === 'digitalPurchasePrice') {
            price.type = "Versão Digitial";
          }
          return <Price key={price.type + price.price}>{`${price.type}: $${price.price}`}</Price>
        })}

        <Text style={{ color: '#FFF', fontSize: 22, marginTop: 35, marginLeft: 5 }}>Heroes que estao nesse HQ</Text>
        {characterPreview && <FlatList
          data={characterPreview}
          renderItem={({ item }) => (
            <HeroPreview>
              <Hero {...item} />
            </HeroPreview>
          )}
          keyExtractor={item => item.id.toString()}
          horizontal
        />}


        <Creators>
          <Text style={{ color: '#FFF', fontSize: 22 }}>Criadores</Text>
          {creators.items.map(creator => (
            <Creator>{`${creator.name} - ${creator.role}`}</Creator>
          ))}
        </Creators>

        <Text style={{ color: '#FFF', fontSize: 22, marginTop: 15, marginLeft: 5 }}>Imagens relacionadas</Text>
        {images && <FlatList
          horizontal
          data={images}
          renderItem={({ item: { path, extension } }) => (
            <ComicImagePreview
              source={{ uri: `${path}.${extension}${globalState.auth.accessParams}` }}
              style={{ transform: [{ scale: .8 }] }}
            />
          )}
          keyExtractor={item => item.path}
        />}

        <CopyRight>
          {`Copyright © 1941-2017 Marvel Characters, Inc.
All Rights Reserved
 
This product is protected by copyright and distributed under
licenses restricting 
copying, distribution, and decompilation.`}
        </CopyRight>

      </ScrollView>
    </Container>
  );
};