import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import {Button, Chip} from 'react-native-paper';
import api from '../../services/api';
import AuthContext from '../../context/auth';
import EventContext from '../../context/event';
import axios from 'axios';
import TextInput from '../../components/TextInput';
import {TextInputMask} from 'react-native-masked-text';
import BottomSheet from '../../components/BottomSheet';
import ImagePicker from 'react-native-image-crop-picker';
function AddEvent(props) {
  const {company} = useContext(AuthContext);
  const {createEvent} = useContext(EventContext);
  const [event, setEvent] = useState({
    errorName: '',
    errorDescription: '',
    errorCategory: '',
    name: 'Nome Legal',
    description: 'uma description legal',
    category: -1,
  });
  const [uploadImage, setUploadImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const sheetRef = React.useRef(null);
  const namedRef = React.createRef();
  const descriptionRef = React.createRef();

  useEffect(() => {}, []);

  const selectCameraTypeUpload = async item => {
    sheetRef.current.snapTo(0);
    ImagePicker.openCamera({
      width: 170,
      height: 120,
      cropping: true,
    }).then(image => {
      if (image && image.path) setUploadImage(image);
      console.log(image);
    });
  };

  const selectGalleryTypeUpload = async item => {
    sheetRef.current.snapTo(0);
    ImagePicker.openPicker({
      width: 170,
      height: 120,
      cropping: true,
    }).then(image => {
      if (image && image.path) setUploadImage(image);
      console.log(image);
    });
  };

  const handleSubmit = async () => {
    let errors = {
      errorName: '',
      errorDescription: '',
      errorCategory: '',
    };
    if (event.name.length < 6)
      errors.errorName = 'O nome deve conter no mínimo 6 caracteres';
    if (event.name.length < 6)
      errors.errorDescription =
        'A descrição deve conter no mínimo 6 caracteres';
    if (event.category === -1)
      errors.errorCategory = 'Precisa selecionar uma categoria';

    setEvent(oldState => {
      const newUsuario = {...oldState, ...errors};
      return newUsuario;
    });

    if (errors.errorName || errors.errorDescription || errors.errorCategory)
      return;

    try {
      setLoading(true);

      let createData = new FormData();
      if (uploadImage) {
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
        createData.append('image', upload_body);
      }
      createData.append('name', event.name);
      createData.append('description', event.description);
      createData.append('category_id', event.category);

      let result = await createEvent(createData);
      
    } catch (error) {
      console.log('error handleSubmit', error);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container}>
        <KeyboardAvoidingView style={styles.container}>
          <View style={styles.innerContainer}>
            <View
              style={{
                flex: 1,
                width: '100%',
                alignItems: 'center',
                marginBottom: 5,
              }}>
              <TouchableOpacity onPress={() => sheetRef.current.snapTo(1)}>
                <Image
                  source={
                    uploadImage?.path
                      ? {
                          uri: uploadImage?.path,
                        }
                      : require('../../../assets/img/NoImage.png')
                  }
                  style={
                    uploadImage?.path ? styles.imagePath : styles.imageNoImage
                  }
                />
              </TouchableOpacity>

              <TextInput
                ref={namedRef}
                label="Nome"
                placeholder=""
                returnKeyType="next"
                value={event.name}
                onChangeText={text =>
                  setEvent(oldState => {
                    const newUsuario = {...oldState, name: text, errorName: ''};
                    return newUsuario;
                  })
                }
                onSubmitEditing={event => {
                  descriptionRef.current.focus();
                }}
                error={!!event.errorName}
                errorText={event.errorName}
                autoCapitalize="none"
                typeTheme={'light'}
              />

              <TextInput
                ref={descriptionRef}
                label="description"
                placeholder=""
                returnKeyType="done"
                value={event.description}
                onChangeText={text =>
                  setEvent(oldState => {
                    const newUsuario = {
                      ...oldState,
                      description: text,
                      errorDescription: '',
                    };
                    return newUsuario;
                  })
                }
                error={!!event.errorDescription}
                errorText={event.errorDescription}
                autoCapitalize="none"
                typeTheme={'light'}
              />

              <Text style={styles.text}>Categoria</Text>
              <View style={styles.categoryContainer}>
                <Chip
                  style={styles.cilp}
                  icon="spotlight"
                  selected={event.category === 1 ? true : false}
                  onPress={() =>
                    setEvent(oldState => {
                      const newUsuario = {
                        ...oldState,
                        category: 1,
                        errorCategory: '',
                      };
                      return newUsuario;
                    })
                  }>
                  Festival
                </Chip>
                <Chip
                  style={styles.cilp}
                  icon="party-popper"
                  selected={event.category === 2 ? true : false}
                  onPress={() =>
                    setEvent(oldState => {
                      const newUsuario = {
                        ...oldState,
                        category: 2,
                        errorCategory: '',
                      };
                      return newUsuario;
                    })
                  }>
                  Festa
                </Chip>
                <Chip
                  style={styles.cilp}
                  icon="hamburger"
                  selected={event.category === 3 ? true : false}
                  onPress={() =>
                    setEvent(oldState => {
                      const newUsuario = {
                        ...oldState,
                        category: 3,
                        errorCategory: '',
                      };
                      return newUsuario;
                    })
                  }>
                  Food Truck
                </Chip>
                <Chip
                  style={styles.cilp}
                  icon="weather-night-partly-cloudy"
                  selected={event.category === 4 ? true : false}
                  onPress={() =>
                    setEvent(oldState => {
                      const newUsuario = {
                        ...oldState,
                        category: 4,
                        errorCategory: '',
                      };
                      return newUsuario;
                    })
                  }>
                  Balada
                </Chip>
              </View>
              {event.errorCategory ? (
                <Text style={styles.textError}>{event.errorCategory}</Text>
              ) : null}
              <Button
                loading={loading}
                style={event.btn}
                mode="contained"
                onPress={() => handleSubmit()}>
                Salvar
              </Button>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
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
  innerContainer: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    paddingTop: 50,
  },
  imagePath: {
    width: 170,
    height: 120,
    marginTop: 15,
    alignSelf: 'center',
    // backgroundColor:"red"
  },
  imageNoImage: {
    // height:'100%',
    // width:'100%',
    width: 170,
    height: 120,
    resizeMode: 'stretch',
    alignSelf: 'center',
    // backgroundColor:"red"
  },
  gif: {
    flex: 1,
    position: 'absolute',
    height: 50,
    width: 50,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
  },
  text: {
    marginTop: 20,
    marginBottom: 0,
    fontSize: 20,
    alignSelf: 'flex-start',
    color: 'white',
  },
  textError: {
    marginTop: 0,
    marginBottom: 20,
    fontSize: 17,
    alignSelf: 'flex-start',
    color: 'red',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  cilp: {
    marginTop: 8,
  },
  btn: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(70, 70, 70, 0.85)',
  },
});

export default AddEvent;
