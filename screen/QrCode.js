/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  View,
  ToastAndroid,
  LogBox,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';

LogBox.ignoreLogs([
  'ViewPropTypes will be removed from React Native, along with all other PropTypes. We recommend that you migrate away from PropTypes and switch to a type system like TypeScript. If you need to continue using ViewPropTypes',
]);
export default class ScanScreen extends Component {
  state = {
    back: false,
    flash: false,
  };

  changeCamera = () => {
    this.setState({
      back: !this.state.back,
    });
  };

  flashController = () => {
    this.setState({
      flash: !this.state.flash,
    });
  };
  onSuccess = e => {
    Alert.alert('Result ', e.data, [
      {
        text: 'COPY',
        onPress: () => {
          Clipboard.setString(e.data);
          ToastAndroid.show(
            'copy successfull',
            ToastAndroid.SHORT,
            ToastAndroid.TOP,
          );
        },
      },
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
    ]);
  };

  render() {
    return (
      <View style={styles.container}>
        <QRCodeScanner
          fadeIn={true}
          showMarker={true}
          reactivate={true}
          reactivateTimeout={3000}
          ref={node => (this.scanner = node)}
          cameraType={this.state.back ? 'front' : 'back'}
          onRead={this.onSuccess}
          flashMode={
            this.state.flash
              ? RNCamera.Constants.FlashMode.torch
              : RNCamera.Constants.FlashMode.off
          }
          topContent={
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'flex-start',
                flex: 100,
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                onPress={this.flashController}
                style={{
                  flex: 40,
                  backgroundColor: '#44B038',
                  width: 300,
                  height: 30,
                  elevation: 3,
                  borderRadius: 10,
                  marginTop: 5,
                }}>
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontFamily: 'Roboto-BoldItalic',
                    textAlign: 'center',
                  }}>
                  {this.state.flash ? (
                    <Icon name="flashlight-off" size={25} color="#FFFFFF" />
                  ) : (
                    <Icon name="flashlight" size={25} color="#FFFFFF" />
                  )}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={this.changeCamera}
                style={{
                  flex: 40,
                  backgroundColor: '#348B2A',
                  width: 300,
                  height: 30,
                  elevation: 3,
                  borderRadius: 10,
                  marginTop: 5,
                  alignItems: 'center',
                }}>
                {this.state.back ? (
                  <Icon name="camera-front" size={25} color="#FFFFFF" />
                ) : (
                  <Icon name="camera-rear" size={25} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            </View>
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
