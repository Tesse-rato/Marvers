
/**
 * A função desse component é muito simples
 * Apenas atualiza o ambiente da Store
 * Os outros componentes reagem a essa mudança
 * 
 * Seu conteudo de metodos é apenas para auxiliar na animação de feedback visual
 * Informar qual tela está selecionada no momento
 */

import React from 'react';
import { Animated, Dimensions, Easing } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { Container, BotButtom, Line } from './styles';
import { GLOBAL_CTX, types } from '../../store';
import Config from '../config';

const { width, height } = Dimensions.get('window');
const { botButIcoSize, botButtonWidth } = Config;

export default props => {

  const [globalState, setGlobalState] = React.useContext(GLOBAL_CTX);
  const [linePos, setLinePos] = React.useState(0); // Esse estade auxilia para nao perder o feedBack pro usuário
  const translateX = new Animated.Value(linePos);
  const { environment: { scene } } = globalState;

  // Essa estrutura ajuda na hora de animar e configurar o ambiente na mesma chamada de função
  const screens = [
    types.SCENE_CHARACTERS,
    types.SCENE_COMICS,
    types.SCENE_DETAILS,
  ]

  /**
   * Cada numero representa um botao e refrente ao botao é uma posicao na linha 
   * Esse numero tambem representa qual valor usar para configurar o ambiente
   * 
   * O valor linePos orienta todo esse componente
   */

  React.useEffect(() => {
    // Esse react reage a alteracões no ambiente que nao foram disparada pelos botoes deste componente
    // O map reduz muita linha de codigo
    alignLine();

  }, [globalState.environment]);

  const alignLine = () => screens.map((screen, index) => screen === scene ? animLine(index) : null);

  /**
   * 
   * @param {Value} value Valor para qual sera animado a linha
   * @param {Callbak} cb Se houver alguma secessidade de chamar alguma funcao apos a animacao
   */
  const animLine = (value, cb) => {
    Animated.timing(translateX, {
      toValue: value,
      duration: 200,
      delay: 2000,
      easing: Easing.elastic(1)
    }).start(() => {
      if (cb) cb();
      setLinePos(value);
    });
  }

  /**
   * 
   * @param {Value} value Valor que representa qual tela guardada em {screens} sera salva na scena do ambiente
   */
  const setEnvironment = value => {
    if (value === 2 && !globalState.comicDetails.results.length) {
      alert('Nenhuma comic selecionada');
      return alignLine();
    }

    setTimeout(() => {
      setGlobalState({ action: types.SET_ENVIRONMENT, environment: { scene: screens[value] } });
      setLinePos(value);
    }, 500);
  }

  return (
    <Container>
      <BotButtom onPress={() => { animLine(0, () => setEnvironment(0)) }} >
        <Ionicons color='#555' name='ios-body' size={botButIcoSize} />
      </BotButtom>
      <BotButtom onPress={() => { animLine(1, () => setEnvironment(1)) }} >
        <Entypo color='#555' name='open-book' size={botButIcoSize} />
      </BotButtom>
      <BotButtom onPress={() => { animLine(2, () => setEnvironment(2)) }} >
        <MaterialIcons color='#555' name='details' size={botButIcoSize} />
      </BotButtom>

      <Line
        style={{
          transform: [
            {
              translateX: translateX.interpolate({
                inputRange: [0, 1, 2],
                outputRange: [0, (width / 2) - botButtonWidth / 2, width - botButtonWidth],
              })
            },
            { scaleX: .5 }
          ]
        }}
      />

    </Container>
  );
};