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
import React, {useEffect, useState} from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import {TouchableOpacity, Platform, PermissionsAndroid} from 'react-native';
import RNQRGenerator from 'rn-qr-generator';
import RNFS from 'react-native-fs';
import {Linking} from 'react-native';

Alert.alert(
  'Permission Required',
  'You have denied storage permission. Please enable it in your app settings.',
  [
    { text: 'Cancel', style: 'cancel' },
    {
      text: 'Open Settings',
      onPress: () => Linking.openSettings(),
    },
  ]
);

function HomeScreen() {
  useEffect(() => {
    requestStoragePermission();
  }, []);
  async function requestStoragePermission() {
    try {
      if (Platform.OS === 'android') {
        const alreadyGranted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );

        if (alreadyGranted) {
          console.log('Permission already granted');
          return;
        }
  
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'This app needs access to your storage to save files.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
  
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Storage permission granted');
        } else {
          console.log('Storage permission denied');
        }
      }
    } catch (err) {
      console.warn(err);
    }
  }
  

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
  const saveimg = async () => {
    try {
      const newPath = `${RNFS.DownloadDirectoryPath}/qr_${Date.now()}.jpg`;
      await RNFS.moveFile(imgpath, newPath);
      console.log('Image saved to', newPath);
      ToastAndroid.show('Image saved successfully', ToastAndroid.SHORT);
    } catch (error) {
      console.error('Failed to save image:', error);
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
