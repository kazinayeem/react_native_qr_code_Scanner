/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  Alert,
  TextInput,
  Button,
  Image,
  ToastAndroid,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import React, {useState} from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import {TouchableOpacity} from 'react-native';
import RNQRGenerator from 'rn-qr-generator';
import RNFS from 'react-native-fs';

function HomeScreen() {
  const [data, setdata] = useState('');
  const [imageurl, setimageurl] = useState('');
  const [imgpath, setimgpath] = useState('');
  const makeqrcode = () => {
    RNQRGenerator.generate({
      value: data,
      height: 100,
      base64: true,
      width: 100,
    }).then(res => {
      setimageurl(res.base64);
      setimgpath(res.uri);
    });
  };
  const upload = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: false,
    })
      .then(image => {
        //Alert.alert(image);
        RNQRGenerator.detect({
          uri: image.path,
        })
          .then(res => {
            if (res.values.length === 0) {
              ToastAndroid.show('no code found', ToastAndroid.SHORT);
            } else {
              Alert.alert('Result --', res.values.toString(), [
                {
                  text: 'COPY',
                  onPress: () => {
                    Clipboard.setString(res.values.toString());
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
            }
          })
          .catch(e => {
            console.log(e);
          });
      })
      .catch(e => {
        console.log(e);
      });
  };
  const saveimg = () => {
    try {
      const newPath = RNFS.DownloadDirectoryPath + Date.now() + 'qr.jpg';
      RNFS.moveFile(imgpath, newPath)
        .then(r => {
          console.log('move done');
          ToastAndroid.show('SAVED', ToastAndroid.CENTER, ToastAndroid.SHORT);
        })
        .catch(e => {
          console.log(e);
        });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <TouchableOpacity
        onPress={upload}
        style={{
          backgroundColor: '#18AC96',
          width: 300,
          top: 10,
          height: 30,
          justifyContent: 'center',
          alignItems: 'center',
          elevation: 5,
        }}>
        <Text style={{color: 'black'}}>Uplaod From Gallery</Text>
      </TouchableOpacity>

      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          top: 40,
        }}>
        <TextInput
          onChangeText={text => setdata(text)}
          textAlign="center"
          style={{
            color: '#000000',
            width: 300,
            alignContent: 'center',
            height: 40,
            bottom: 10,
            borderColor: '#00000055',
            borderWidth: 1,
          }}
        />

        <Button color={'#0FAB89'} onPress={makeqrcode} title="Make QR CODE" />
      </View>
      {!imageurl ? (
        <Text
          style={{
            textAlign: 'center',
            justifyContent: 'center',

            fontSize: 25,
            fontFamily: 'Roboto-BoldItalic',
          }}>
          no text found!!
        </Text>
      ) : (
        <Image
          style={{
            width: 200,
            height: 200,
            bottom: 40,
            alignContent: 'center',
          
          }}
          source={{uri: `data:image/gif;base64,${imageurl}`}}
        />
      )}

      <Button onPress={saveimg} title="save image" />
    </View>
  );
}

export default HomeScreen;
