import React, {Component, PureComponent} from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity,
  Dimensions, Modal, NativeModules, Image, AsyncStorage, Alert
} from 'react-native';

import Toast, {DURATION} from 'react-native-easy-toast'

import EventBus from 'eventing-bus';
import {YellowBox} from 'react-native';

import {Surface, ActivityIndicator} from 'react-native-paper';

import {RtcEngine, AgoraView} from 'react-native-agora';
import io from 'socket.io-client';

import DropdownAlert from 'react-native-dropdownalert';
// import {APPID} from '../settings';
import axios from 'axios';
const {Agora} = NativeModules;
console.log(Agora)

if (!Agora) {
  throw new Error("Agora load failed in react-native, please check ur compiler environments");
}

const {
  FPS30,
  FixedLandscape,
  AudioProfileDefault,
  AudioScenarioDefault,
  Host,
  Adaptative
} = Agora;

// const channelProfile = navigation.getParam('channelProfile', 1);
const BtnEndCall = () => require('../../assets/images/btn_endcall.png');
const BtnMute = () => require('../../assets/images/btn_mute.png');
// const BtnSpeaker = () => require('../../assets/images/btn_speaker.png');
const BtnSwitchCamera = () => require('../../assets/images/btn_switch_camera.png');
// const BtnVideo = () => require('../../assets/images/btn_video.png');
// const EnableCamera = () => require('../../assets/images/enable_camera.png');
// const DisableCamera = () => require('../../assets/images/disable_camera.png');
// const EnablePhotoflash = () => require('../../assets/images/enable_photoflash.png');
// const DisablePhotoflash = () => require('../../assets/images/disable_photoflash.png');
const IconMuted = () => require('../../assets/images/icon_muted.png');
// const IconSpeaker = () => require('../../assets/images/icon_speaker.png');

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4'
  },
  absView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  videoView: {
    padding: 5,
    flexWrap: 'wrap',
    flexDirection: 'row',
    zIndex: 100,
  },
  localView: {
    flex: 1
  },
  remoteView: {
    width: 30,
    height: 30,
    // width: (width - 40) / 3,
    // height: (width - 40) / 3,
    margin: 5
  },
  bottomView: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around'
  }
});

class OperateButton extends PureComponent {
  render() {
    const {onPress, source, style, imgStyle = {width: 50, height: 50}} = this.props;
    return (
      <TouchableOpacity
        style={style}
        onPress={onPress}
        activeOpacity={.7}
      >
        <Image
          style={imgStyle}
          source={source}
        />

        <Toast ref="toast"/>
      </TouchableOpacity>
    )
  }
}

type Props = {
  channelProfile: Number,
  channelName: String,
  videoProfile: Number,
  clientRole: Number,
  onCancel: Function,
  uid: Number,
}

class AgoraRTCView extends Component<Props> {
  state = {
    user_type:'',
    peerIds: [],
    joinSucceed: false,
    isMute: false,
    hideButton: false,
    visible: false,
    selectedUid: undefined,
    animating: true,
    _id:''
  };

  static navigationOptions = {
    header: null
  };

shouldComponentUpdate(nextProps) { return nextProps.navigation.isFocused(); }

constructor(){
  super();
  AsyncStorage.getItem('channel').then((value) => {

         if (value !== null) {
           this.setState({channel_id:value})
             console.log("******* AsyncStorage channel_id :: ", value);

             var socketConfig = {
               transports: ['polling']
             }

             console.log("SocketConfig", socketConfig);
              this.socket = io('https://deaftawk-dev.herokuapp.com', socketConfig);

         }
     })


}



  componentWillMount () {

    // AsyncStorage.getItem('channel').then((value) => {
    //
    //     this.setState({channel_id:value});
    //
    // })

    AsyncStorage.getItem('type').then((value) => {

           if (value !== null) {
             console.log("____User Type :: ", value);
             this.setState({user_type:value})

             YellowBox.ignoreWarnings(['user_id: '+value]);

           }
           else {
             console.log("no type setected");
           }
         }
       )

       AsyncStorage.getItem('_id').then((value) => {

              if (value !== null) {
                console.log("____User id :: ", value);
                this.setState({_id:value})


              }
              else {
                console.log("no type setected");
              }
            }
          )


    var socketConfig = {
       transports: ['polling']
     }

     console.log("SocketConfig", socketConfig);
    this.socket = io('https://deaftawk-dev.herokuapp.com', socketConfig);

    const config = {
      appid: "ac684cf9d5b44f2cb487f85959836cff",
      channelProfile: this.props.channelProfile,
      videoProfile: this.props.videoProfile,
      clientRole: this.props.clientRole,
      videoEncoderConfig: {
        width: 360,
        height: 480,
        bitrate: 1,
        frameRate: FPS30,
        orientationMode: Adaptative,
      },
      audioProfile: AudioProfileDefault,
      audioScenario: AudioScenarioDefault
    }
    console.log("[CONFIG]", config);
    console.log("[CONFIG.encoderConfig", config.videoEncoderConfig);
    RtcEngine.on('videoSizeChanged', (data) => {
      console.log("[RtcEngine] videoSizeChanged ", data)
    })
    RtcEngine.on('firstRemoteVideoDecoded', (data) => {
        console.log('[RtcEngine] onFirstRemoteVideoDecoded', data);
    });
// --------- customs

    RtcEngine.on('connectionLost', (data) => {
        console.log('[RtcEngine] connectionLost', data);
    });

    RtcEngine.on('connectionStateChanged', (data) => {
        console.log('[RtcEngine] connectionStateChanged', data);
    });

    RtcEngine.on('reJoinChannelSuccess', (data) => {
        console.log('[RtcEngine] reJoinChannelSuccess', data);
    });

// ----------------
    RtcEngine.on('userJoined', (data) => {
        console.log('[RtcEngine] onUserJoined', data);
        const {peerIds} = this.state;
        if (peerIds.indexOf(data.uid) === -1) {
          this.setState({
            peerIds: [...peerIds, data.uid]
          })
        }
        this.setState({
          selectedUid: data.uid
        }, () => {
          this.setState({
            visible: true
          })
        })
      });
    RtcEngine.on('userOffline', (data) => {
        console.log('[RtcEngine] onUserOffline', data);
        this.setState({
            peerIds: this.state.peerIds.filter(uid => uid !== data.uid)
        })
        console.log('peerIds', this.state.peerIds, 'data.uid ', data.uid)
      });
    RtcEngine.on('joinChannelSuccess', (data) => {
        console.log('[RtcEngine] onJoinChannelSuccess', data);
        RtcEngine.startPreview();
        this.setState({
          joinSucceed: true,
          animating: false
        })
      });
    RtcEngine.on('audioVolumeIndication', (data) => {
        console.log('[RtcEngine] onAudioVolumeIndication', data);
      })
    RtcEngine.on('clientRoleChanged', (data) => {
        console.log("[RtcEngine] onClientRoleChanged", data);
      })
    RtcEngine.on('error', (data) => {
        console.log('[RtcEngine] onError', data, data.error );
        if (data.error === 17) {
          RtcEngine.leaveChannel().then(_ => {

            if(this.state.user_type=="deaf")
            {
              var data={
                comingFrom:"deaf",
                channel_id:this.state.channel_id
              }

              // this.props.navigation.navigate("RatingScreen", data);
            }
            else {

              var data={
                comingFrom:"interpreter",
                channel_id:this.state.channel_id
              }
              // this.props.navigation.navigate("InterpreterHomeScreen", "interpreter");
              // this.props.navigation.navigate("RatingScreen", data)
            }

            this.setState({
              joinSucceed: false
            })
            // const { state, goBack } = this.props.navigation;
            // this.props.onCancel(data);
            // goBack();
          });
        }
      });
    RtcEngine.init(config);
  }

  handleContinue=(e)=>{
    console.log("Continue called");

    var options={
      user_id:this.state._id,
      disconnectCall:false
    }

    var optionsAxios = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      url: 'https://deaftawk-dev.herokuapp.com/disconnectCheck',
      data:  options
    }
    console.log("####axios options :: ", optionsAxios);

    axios(optionsAxios)
    .then((response)=> {
      console.log("####disconnectCheck response :: ",response);

        console.log("response :: ", response);
        if(response.status==200)
        {
          console.log("####disconnectCheck response.status code :: ", response.status);
        }
    }).
    catch((err)=>{
      console.log("####Error occured :: ", err);
    })


  }

  handleCancelCall=(e)=>{
    console.log("cancel called");
    // setTimeout(()=>{
    //   this.emitCancel()
    // }, 10000)
  }

  handleCallDisconnect=(e)=>{
    this.emitCancel()
  }

  handleMinuteLeft=(e)=>{
    console.log("duration buss recieved");
    // this.dropdown.alertWithType('success', 'Success', 'Received data.');

    Alert.alert(
    'Alert',
    "Call will disconnect after 1 minute, Want to Continue call? press CONTINUE",
    [
      {
        text: 'CONTINUE',
        onPress: this.handleContinue,
        style: 'cancel',
      },
      {
        text: 'CANCEL', onPress: () => console.log('####Cancel Pressed')
      },
    ],
    {cancelable: false},
  )

  }


  componentDidMount () {

    EventBus.on("callEnded",this.handleCancel);
    EventBus.on("oneMinuteLeft", this.handleMinuteLeft)
    EventBus.on("noMinuteLeft", this.handleCallDisconnect)
    RtcEngine.getSdkVersion((version) => {
      console.log('[RtcEngine] getSdkVersion', version);
    })

    console.log('[joinChannel] ' + "channel1");
    RtcEngine.joinChannel(""+this.props.channelProfile, this.props.uid);
    RtcEngine.enableAudioVolumeIndication(500, 3);
  }

  shouldComponentUpdate(nextProps) { return nextProps.navigation.isFocused(); }


  componentWillUnmount () {
    if (this.state.joinSucceed) {
      RtcEngine.leaveChannel().then(res => {
        RtcEngine.removeAllListeners();
        RtcEngine.destroy();
      }).catch(err => {
        RtcEngine.removeAllListeners();
        RtcEngine.destroy();
        console.log("leave channel failed", err);
      })
    } else {
      RtcEngine.removeAllListeners();
      RtcEngine.destroy();
    }
  }


  emitCancel = () => {
    // EventBus.publish('callEnded', this.state.channel_id);
    EventBus.publish("clearConsumedInterval")
    console.log("_______ channel_id :: ", this.state.channel_id);
    this.socket.emit('callEnded', this.state.channel_id);
  }

  handleCancel = (e) => {


    EventBus.publish("closeStack")
    // const { goBack } = this.props.navigation;
    // console.log("______leaveChannel :: ", this.props);
    // this.socket.emit('callEnded', this.state.channel_id);
    // this.refs.toast.show('SocketId:'+this.state.channel_id);


    AsyncStorage.removeItem('channel')
    RtcEngine.leaveChannel().then(_ => {
      this.setState({
        joinSucceed: false
      });
      // goBack();
      // YellowBox.ignoreWarnings(["UserType:"+ this.state.user_type]);

        console.log("#### user type :: ", this.state.user_type);
            if(this.state.user_type=="deaf")
            {
              var data={
                comingFrom:"deaf",
                channel_id:this.state.channel_id
              }

              // this.props.navigation.navigate("LoggedInScreen");
              // this.props.navigation.popToTop();
              this.props.navigation.navigate("RatingScreen", data);
            }
            else {

              var data={
                comingFrom:"interpreter",
                channel_id:this.state.channel_id
              }
              // this.props.navigation.navigate("InterpreterHomeScreen", "interpreter");
              this.props.navigation.navigate("RatingScreen", data)
              // this.props.navigation.popToTop();

            }

    }).catch(err => {
      console.log("[agora]: err", err);
    })
  }

  switchCamera = () => {
    RtcEngine.switchCamera();
  }

  toggleAllRemoteAudioStreams = () => {
    this.setState({
      isMute: !this.state.isMute
    }, () => {
      RtcEngine.muteAllRemoteAudioStreams(this.state.isMute);
    })
  }

  toggleHideButtons = () => {
    this.setState({
      hideButton: !this.state.hideButton
    })
  }

  onPressVideo = (uid) => {
    this.setState({
      selectedUid: uid
    }, () => {
      this.setState({
        visible: true
      })
    })
  }

  toolBar = ({hideButton, isMute}) => {
    if (1 == 1) {
    return (
      <View>
        <View style={styles.bottomView}>
          <OperateButton
            onPress={this.toggleAllRemoteAudioStreams}
            source={isMute ? IconMuted() : BtnMute()}
          />
          <OperateButton
            style={{alignSelf: 'center', marginBottom: -10}}
            onPress={this.emitCancel}
            imgStyle={{width: 60, height: 60}}
            source={BtnEndCall()}
          />
          <OperateButton
            onPress={this.switchCamera}
            source={BtnSwitchCamera()}
          />
        </View>
      </View>)
    }
  }

  agoraPeerViews = ({visible, peerIds}) => {
    return (visible ?
    <View style={styles.videoView} /> :
    <View style={styles.videoView}>{
      peerIds.map((uid, key) => (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => this.onPressVideo(uid)}
        key={key}>
        <Text>uid: {uid}</Text>
        <AgoraView
            key={uid}
            style={styles.remoteView}
            zOrderMediaOverlay={true}
            remoteUid={uid}
        />
      </TouchableOpacity>
      ))
      }</View>)
  }

  selectedView = ({visible}) => {
    return (
    <Modal
      visible={visible}
      presentationStyle={'fullScreen'}
      animationType={'slide'}
      onRequestClose={() => {}}
      >
      <TouchableOpacity
        activeOpacity={1}
        style={{flex: 1}}
         >
        <AgoraView
          style={{flex: 1}}
          zOrderMediaOverlay={true}
          remoteUid={this.state.selectedUid}
        />

        <AgoraView style={styles.localView} showLocalVideo={true} />

        {this.toolBar(this.state)}
      </TouchableOpacity>
    </Modal>)
  }

  render () {
    if (!this.state.joinSucceed) {
      return (
      <View style={{flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator animating={this.state.animating} />
        <Toast ref="toast"/>
      </View>
      )
    }

    return (
      <View
        onPress={this.toggleHideButtons}
        style={styles.container}
      >
      <View>
        <DropdownAlert ref={ref => this.dropdown = ref} />
      </View>

        <AgoraView style={styles.localView} showLocalVideo={true} />


        {this.selectedView(this.state)}
      </View>
    )
  }
}

export default function AgoraRTCViewContainer(props) {
  const { navigation } = props;
  const channelProfile = navigation.getParam('channelProfile', 1);
  const clientRole = navigation.getParam('clientRole', Host);
  const channelName = navigation.getParam('channelName', 'agoratest');
  const uid = navigation.getParam('uid', Math.floor(Math.random() * 100));
  const onCancel = navigation.getParam('onCancel');

  return (
    <AgoraRTCView
      channelProfile={channelProfile}
      channelName={channelName}
      clientRole={clientRole}
      uid={uid}
      onCancel={onCancel}
      {...props}
    >
    </AgoraRTCView>
  );
}
