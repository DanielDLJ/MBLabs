import React, {useState, useContext, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  ScrollView,
  Image,
} from 'react-native';
import {Button} from 'react-native-paper';
import TextInput from '../../components/TextInput';
import {TextInputMask} from 'react-native-masked-text';
import {validateCpfCnpj, emailValidator} from '../../utilities';
import AuthContext from '../../context/auth';
import api from '../../services/api';
import moment from 'moment';

export default function Register({navigation}) {
  const {user, update} = useContext(AuthContext);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingBtn, setLoadingBtn] = useState(false);

  const [refreshUser, setRefreshUser] = useState({
    errorCPF: '',
    errorName: '',
    errorEmail: '',
    errorBirthday: '',
  });

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const result = await api.get('/users/' + user.cpf);
      console.log("fetchUser",result.data.data)
      if (result.data)
        setRefreshUser({
          errorCPF: '',
          errorName: '',
          errorEmail: '',
          errorBirthday: '',
          ...result.data.data,
          birthday: moment(result.data.data.birthday, 'YYYY-MM-DD')
            .format('DD/MM/YYYY')
            .toString(),
        //   email: 'new@new.com',
        });
    } catch (error) {
      console.log('[error fetchUser]', error);
    }
    setLoadingUser(false);
  };

  const keyboardAvoidingViewBehaviour =
    Platform.OS === 'ios' ? 'padding' : null;

  const namedRef = React.createRef();
  const emailRef = React.createRef();
  const birthdayRef = React.createRef();

  async function handleSubmit() {
    let errors = {
      errorCPF: '',
      errorName: '',
      errorEmail: '',
      errorBirthday: '',
    };
    if (refreshUser.name.length < 6)
      errors.errorName = 'O nome deve conter no mínimo 6 caracteres';
    if (!moment(refreshUser.birthday, 'DD/MM/YYYY').isValid())
      errors.errorBirthday = 'Data Inválida!';
    errors.errorEmail = emailValidator(refreshUser.email);

    setRefreshUser(oldState => {
      const newUsuario = {...oldState, ...errors};
      return newUsuario;
    });

    if (
      errors.errorCPF ||
      errors.errorName ||
      errors.errorEmail ||
      errors.errorBirthday
    )
      return;

    setLoadingBtn(true);
    let updateUser = {
      name: refreshUser.name,
      email: refreshUser.email,
      birthday: moment(refreshUser.birthday, 'DD/MM/YYYY')
        .format('YYYY-MM-DD')
        .toString(),
    };
    console.log("updateUser",updateUser)
    await update(updateUser);
    setLoadingBtn(false);
  }

  return (
    <ScrollView style={{flex: 1}}>
      <KeyboardAvoidingView
        // behavior={keyboardAvoidingViewBehaviour}
        style={styles.container}>
        <View style={styles.innerContainer}>
          {/* {loadingUser || true ? (
              <Image
                style={styles.gif}
                source={require('../../../assets/img/loading.gif')}
              />
            ) : null} */}
          <View
            style={{
              flex: 1,
              width: '100%',
              alignItems: 'center',
              marginBottom: 5,
            }}>
            <TextInput
              ref={null}
              label="CPF"
              render={props => <TextInputMask {...props} type={'cpf'} />}
              placeholder="111.111.111-11"
              returnKeyType="next"
              value={refreshUser.cpf}
              error={!!refreshUser.errorCPF}
              errorText={refreshUser.errorCPF}
              maxLength={18}
              disabled={true}
              typeTheme={'light'}
            />

            <TextInput
              ref={namedRef}
              label="Nome"
              placeholder=""
              returnKeyType="next"
              value={refreshUser.name}
              onChangeText={text =>
                setRefreshUser(oldState => {
                  const newUsuario = {...oldState, name: text, errorName: ''};
                  return newUsuario;
                })
              }
              onSubmitEditing={event => {
                emailRef.current.focus();
              }}
              error={!!refreshUser.errorName}
              errorText={refreshUser.errorName}
              autoCapitalize="none"
              typeTheme={'light'}
            />

            <TextInput
              ref={emailRef}
              label="Email"
              placeholder=""
              returnKeyType="next"
              value={refreshUser.email}
              onChangeText={text =>
                setRefreshUser(oldState => {
                  const newUsuario = {...oldState, email: text, errorEmail: ''};
                  return newUsuario;
                })
              }
              onSubmitEditing={event => {
                birthdayRef.current.focus();
              }}
              error={!!refreshUser.errorEmail}
              errorText={refreshUser.errorEmail}
              autoCapitalize="none"
              typeTheme={'light'}
            />

            <TextInput
              ref={birthdayRef}
              label="Data de Nascimento"
              render={props => (
                <TextInputMask
                  {...props}
                  options={{
                    format: 'DD/MM/YYYY',
                  }}
                  type={'datetime'}
                />
              )}
              placeholder="DD/MM/YYYY"
              returnKeyType="done"
              value={refreshUser.birthday}
              onChangeText={text =>
                setRefreshUser(oldState => {
                  const newUsuario = {
                    ...oldState,
                    birthday: text,
                    errorBirthday: '',
                  };
                  return newUsuario;
                })
              }
              error={!!refreshUser.errorBirthday}
              errorText={refreshUser.errorBirthday}
              maxLength={10}
              typeTheme={'light'}
            />

            <Button
              loading={loadingBtn}
              style={styles.btn}
              mode="contained"
              onPress={() => handleSubmit()}>
              Salvar
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
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
  btn: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(70, 70, 70, 0.85)',
  },
});
