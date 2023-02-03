/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  View,
  LogBox,
} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';

LogBox.ignoreLogs([
  'ViewPropTypes will be removed from React Native, along with all other PropTypes. We recommend that you migrate away from PropTypes and switch to a type system like TypeScript. If you need to continue using ViewPropTypes',
]);
export default class ScanScreen extends Component {
  state = {
    back: false,
    flash: true,
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
    Alert.alert(e.data);
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
          flashMode={RNCamera.Constants.FlashMode.on}
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
                  backgroundColor: '#4BBB3F',
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
                  ON/OFF
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={this.changeCamera}
                style={{
                  flex: 40,
                  backgroundColor: '#4BBB3F',
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
                  FONT/BACK
                </Text>
              </TouchableOpacity>
            </View>
          }
          bottomContent={
            <TouchableOpacity style={styles.buttonTouchable}>
              <Text style={styles.buttonText}>OK. Got it!</Text>
            </TouchableOpacity>
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
