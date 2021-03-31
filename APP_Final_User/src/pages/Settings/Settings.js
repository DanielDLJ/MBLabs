import React, {useEffect, useContext, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Image,
  FlatList,
  TouchableOpacity,
  Platform,
} from 'react-native';

import {registeredUser, unregisteredUser} from '../../constants';
import AuthContext from '../../context/auth';
import ImagePicker from 'react-native-image-crop-picker';
import BottomSheet from '../../components/BottomSheet';
import api from '../../services/api';

function Settings({navigation}) {
  const {user, logout, update} = useContext(AuthContext);
  const [uploadImage, setUploadImage] = useState(null);
  const sheetRef = React.useRef(null);
  const actionOnRow = async item => {
    if (item.id === 1) {
      //Perfil
      navigation.navigate('ProfileTabNavigator');
    }
    if (item.id === 2) {
      //Pagamentos
      // sheetRef.current.snapTo(1);
    }
    if (item.id === 3) {
      if (user) {
        //sair
        await logout();
      } else {
        //Logar
        navigation.navigate('Login');
      }
    }
  };

  const sendImage = async () => {
    try {
      let updateUser = new FormData();
      const upload_body = {
        uri: uploadImage['path'],
        type: uploadImage['mime'],
        name:
          Platform.OS === 'ios'
            ? uploadImage['filename']
            : `my_profile_${Date.now()}.${
                uploadImage['mime'] === 'image/jpeg' ? 'jpg' : 'png'
              }`,
      };
      updateUser.append('image', upload_body);
      await update(updateUser);
    } catch (error) {
      console.log('error sendImage', error);
    }
    setUploadImage(null);
  };

  const selectCameraTypeUpload = async item => {
    sheetRef.current.snapTo(0);
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      if (image && image.path) setUploadImage(image);
      console.log(image);
    });
  };
  useEffect(() => {
    console.log('uploadImage', uploadImage);
    if (uploadImage) sendImage();
  }, [uploadImage]);

  useEffect(() => {
    console.log(api.defaults.baseURL + '/' + user?.image.replace('\\', '/'));
  }, []);

  const selectGalleryTypeUpload = async item => {
    sheetRef.current.snapTo(0);
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      if (image && image.path) setUploadImage(image);
      console.log(image);
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerImagePerfil}>
        <TouchableOpacity
          disabled={user !== null ? false : true}
          onPress={() => sheetRef.current.snapTo(1)}>
          {uploadImage ? (
            <Image
              source={
                uploadImage?.path
                  ? {
                      uri: uploadImage?.path,
                    }
                  : require('../../../assets/img/avatar.jpg')
              }
              style={styles.image}
            />
          ) : (
            <Image
              source={
                user?.image
                  ? {
                      uri:
                        api.defaults.baseURL +
                        '/' +
                        user?.image.replace('\\', '/'),
                    }
                  : require('../../../assets/img/avatar.jpg')
              }
              style={styles.image}
            />
          )}
        </TouchableOpacity>
        <Text style={styles.titleName}> {user ? user.name : ''}</Text>
      </View>

      <FlatList
        style={styles.list}
        data={user ? registeredUser : unregisteredUser}
        numColumns={1}
        keyExtractor={item => {
          return item.id;
        }}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              onPress={() => actionOnRow(item)}
              style={styles.item}>
              <View style={styles.containerCard}>
                <View style={styles.containerImage}>{item.icon}</View>
                <View style={styles.containerRow}>
                  <Text style={styles.itemTitleText}>{item.title}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
      <BottomSheet
        ref={sheetRef}
        selectCameraTypeUpload={() => selectCameraTypeUpload()}
        selectGalleryTypeUpload={() => selectGalleryTypeUpload()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#b5b5b5',
  },
  containerImagePerfil: {
    // flex:1,
    height: 160,
    backgroundColor: '#999999',
    flexDirection: 'column',
    // backgroundColor:"red"
  },
  image: {
    width: 95,
    height: 95,
    borderRadius: 95 / 2,
    marginTop: 15,
    alignSelf: 'center',
    // backgroundColor:"red"
  },
  titleName: {
    marginTop: 10,
    fontSize: 22,
    alignSelf: 'center',
    fontWeight: 'bold',
    color: 'white',
    // backgroundColor:"red"
  },

  /******** List Container **************/
  list: {
    //paddingVertical: 5,
    backgroundColor: 'transparent',
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 10,
    // backgroundColor: 'red',
  },

  item: {
    padding: 5,
    // backgroundColor: 'red',
    flexDirection: 'column',
    //paddingLeft: 30,
  },

  containerCard: {
    flex: 1,
    flexDirection: 'row',
    padding: 8,
    //backgroundColor: 'white',
  },

  containerImage: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 10,
  },

  containerRow: {
    padding: 0,
    flexDirection: 'row',
    paddingRight: 30,
  },

  itemTitleText: {
    color: '#f0f0f0',
    marginLeft: 16,
    textAlignVertical: 'center',
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 16,
  },
});

export default Settings;
