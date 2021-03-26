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
  const {company, update} = useContext(AuthContext);
  const [loadingCompany, setLoadingCompany] = useState(true);
  const [loadingBtn, setLoadingBtn] = useState(false);

  const [refreshCompany, setRefreshCompany] = useState({
    errorCNPJ: '',
    errorName: '',
    errorEmail: '',
  });

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    try {
      const result = await api.get('/company/' + company.cnpj);
      console.log("fetchCompany",result.data.data)
      if (result.data)
        setRefreshCompany({
          errorCNPJ: '',
          errorName: '',
          errorEmail: '',
          ...result.data.data,
        //   email: 'new@new.com',
        });
    } catch (error) {
      console.log('[error fetchCompany]', error);
    }
    setLoadingCompany(false);
  };

  const keyboardAvoidingViewBehaviour =
    Platform.OS === 'ios' ? 'padding' : null;

  const namedRef = React.createRef();
  const emailRef = React.createRef();

  async function handleSubmit() {
    let errors = {
      errorCNPJ: '',
      errorName: '',
      errorEmail: '',
    };
    if (refreshCompany.name.length < 6)
      errors.errorName = 'O nome deve conter no mínimo 6 caracteres';
    errors.errorEmail = emailValidator(refreshCompany.email);

    setRefreshCompany(oldState => {
      const newUsuario = {...oldState, ...errors};
      return newUsuario;
    });

    if (
      errors.errorCNPJ ||
      errors.errorName ||
      errors.errorEmail
    )
      return;

    setLoadingBtn(true);
    let updateCompany = {
      name: refreshCompany.name,
      email: refreshCompany.email,
    };
    console.log("updateCompany",updateCompany)
    await update(updateCompany);
    setLoadingBtn(false);
  }

  return (
    <ScrollView style={styles.container}>
      <KeyboardAvoidingView
        // behavior={keyboardAvoidingViewBehaviour}
        style={styles.container}>
        <View style={styles.innerContainer}>
          {/* {loadingCompany || true ? (
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
              label="CNPJ"
              render={props => <TextInputMask {...props} type={'cnpj'} />}
              placeholder="11.111.111/1111-11"
              returnKeyType="next"
              value={refreshCompany.cnpj}
              error={!!refreshCompany.errorCNPJ}
              errorText={refreshCompany.errorCNPJ}
              maxLength={18}
              disabled={true}
              typeTheme={'light'}
            />

            <TextInput
              ref={namedRef}
              label="Nome"
              placeholder=""
              returnKeyType="next"
              value={refreshCompany.name}
              onChangeText={text =>
                setRefreshCompany(oldState => {
                  const newUsuario = {...oldState, name: text, errorName: ''};
                  return newUsuario;
                })
              }
              onSubmitEditing={event => {
                emailRef.current.focus();
              }}
              error={!!refreshCompany.errorName}
              errorText={refreshCompany.errorName}
              autoCapitalize="none"
              typeTheme={'light'}
            />

            <TextInput
              ref={emailRef}
              label="Email"
              placeholder=""
              returnKeyType="done"
              value={refreshCompany.email}
              onChangeText={text =>
                setRefreshCompany(oldState => {
                  const newUsuario = {...oldState, email: text, errorEmail: ''};
                  return newUsuario;
                })
              }
              error={!!refreshCompany.errorEmail}
              errorText={refreshCompany.errorEmail}
              autoCapitalize="none"
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
