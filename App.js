/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

// import React, {Component} from 'react';
// import { Provider as PaperProvider } from 'react-native-paper';
// import { createAppContainer } from 'react-navigation';
// import RootNavigator from './src/root-navigator';
//
// const Root = createAppContainer(RootNavigator);
//
// export default class App extends Component {
//   render() {
//     return (
//       <PaperProvider>
//         <Root />
//       </PaperProvider>
//     );
//   }
// }

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  Button,
  StyleSheet,
  Text,
  View,
  Image,
  findNodeHandle,
  NativeEventEmitter,
  NativeModules,
  UIManager,
  DeviceEventEmitter,
  YellowBox
} from 'react-native';
// import AgoraRtcEngine from './components/AgoraRtcEngineModule'
// import AgoraRendererView from './components/AgoraRendererView'

import Signup from './screens/signup'
import Login from './screens/login'
import Starting from './screens/starting'
import SignupForm from './screens/signupForm'
import LoggedInScreen from './screens/loggedIn'
import Purchase from './screens/purchase'
import VideoCalling from './screens/videoCalling'
import InterpreterHome from './screens/intHomeScreen'
import CallIntLaterView from './screens/callIntlater'
import CallIntNowView from './screens/callIntNow'
import DrawerMenu from './screens/drawerMenu'
import FBLoginButton from './screens/FBLoginButton'
import LoaderPulse from './screens/loaderPulse'
import UploadImg from './screens/uploadImg'
import RatingSc from './screens/rating'
import SplashScreen from './screens/splashScreen';
import InterpreterAdditionalInfo from './screens/interpreterAdditionalInfo';
import InterpreterAdditionalInfoNext from './screens/interpreterAdditionalInfoNext';

import RequestIntOpt from './screens/requestInterpreterOptions';

import DeafAdditionalInfo from './screens/deafAdditionalInfo';
import RequestLaterTimeSelect from './screens/requestLaterTimeSelect';
import CallHistory from './screens/callHistory';
import SingleCallDetail from './screens/singleCallDetail';
import SingleCallInterpreter from './screens/singleCallInterpreter';
import Settings from './screens/settings';

import ChangeEmail from './screens/settingScreens/changeEmail';
import ChangeName from './screens/settingScreens/changeName';
import ChangeNumber from './screens/settingScreens/changeNumber';
import ChangePassword from './screens/settingScreens/changePassword';

import WebViewSc from './screens/webView';
import NeedHelp from './screens/needHelp';

import PromoDetail from './screens/promoCodes/promoDetail';
import PromoList from './screens/promoCodes/promoList';
// import AgoraScreen from './screens/agora.js';

import { createStackNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation'; // 1.0.0-beta.27
import RootNavigator from './src/root-navigator';
const Root = createAppContainer(RootNavigator);


const RootStack = createStackNavigator(
  {
    // LoaderScreen:{
    //   screen:LoaderPulse,
    // },
    // NeedHelpScreen:{
    //   screen:NeedHelp,
    // },
    // PurchaseScreen:{
    //   screen:Purchase,
    // },
    // RatingScreen:{
    //   screen:RatingSc,
    // },
    // ChangeEmailScreen:{
    //   screen:ChangeEmail,
    // },
    // SettingScreen:{
    //   screen:Settings,
    // },
    // SingleCallDetailScreen:{
    //   screen:SingleCallDetail,
    // },
    // CallHistoryScreen:{
    //   screen:CallHistory,
    // },
    // RequestInterpreterOptionsScreen:{
    //   screen:RequestIntOpt,
    // },
    // RequestLaterScreen:{
    //   screen:RequestLaterTimeSelect,
    // },
    // SignupFormScreen:{
    //   screen:SignupForm,
    // },
    // DeafAdditionalInfoScreen:{
    //   screen:DeafAdditionalInfo,
    // },
    // IntAdditionalInfoScreen:{
    //   screen:InterpreterAdditionalInfo,
    // },
    // IntAdditionalInfoNextScreen:{
    //   screen:InterpreterAdditionalInfoNext,
    // },
    // StartingScreen:{
    //   screen:Starting,
    // },
    // PromoListScreen:{
    //   screen:PromoList,
    // },


    Splash:{screen:SplashScreen},
    LoginScreen:{
      screen:Login,
    },
    UploadImgScreen:{
      screen:UploadImg,
    },
    SignupScreen: {
      screen: Signup,
    },
    SignupFormScreen:{
      screen:SignupForm,
    },
    LoggedInScreen:{
      screen:LoggedInScreen,
    },
    PurchaseScreen:{
      screen:Purchase,
    },
    VideoCallingScreen:{
      screen:VideoCalling,
    },
    InterpreterHomeScreen:{
      screen:InterpreterHome,
    },
    IntCallLaterScreen:{
      screen:CallIntLaterView,
    },
    IntCallNowScreen:{
      screen:CallIntNowView,
    },
    DrawerMenuScreen:{
      screen:DrawerMenu,
    },
    FBLoginButtonSc:{
      screen:FBLoginButton,
    },
    LoaderScreen:{
      screen:LoaderPulse,
    },
    RatingScreen:{
      screen:RatingSc,
    },
    IntAdditionalInfoScreen:{
      screen:InterpreterAdditionalInfo,
    },
    IntAdditionalInfoNextScreen:{
      screen:InterpreterAdditionalInfoNext,
    },
    DeafAdditionalInfoScreen:{
      screen:DeafAdditionalInfo,
    },
    RequestInterpreterOptionsScreen:{
      screen:RequestIntOpt,
    },
    RequestLaterScreen:{
      screen:RequestLaterTimeSelect,
    },
    CallHistoryScreen:{
      screen:CallHistory,
    },
    SingleCallDetailScreen:{
      screen:SingleCallDetail,
    },
    SingleCallInterpreterScreen:{
      screen:SingleCallDetail,
    },
    SettingScreen:{
      screen:Settings,
    },
    ChangeEmailScreen:{
      screen:ChangeEmail,
    },

    ChangeNameScreen:{
      screen:ChangeName,
    },
    ChangeNumberScreen:{
      screen:ChangeNumber,
    },
    ChangePasswordScreen:{
      screen:ChangePassword,
    },
    WebViewScreen:{
      screen:WebViewSc,
    },
    NeedHelpScreen:{
      screen:NeedHelp,
    },
    PromoListScreen:{
      screen:PromoList,
    },
    PromoDetailScreen:{
      screen:PromoDetail,
    },
    AgoraScreen:{
      screen:Root,
    }
  },
  {
    mode: 'modal',
    // headerMode: 'none',
  }
);
YellowBox.ignoreWarnings(['Warning: ...']);
const AppContainer = createAppContainer(RootStack);


export default class App extends Component {

  render() {
    console.disableYellowBox = true;
    console.log("APPPPP");

    return (
      <AppContainer />
    )
  }


}
