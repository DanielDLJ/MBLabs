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
  const [loading, setLoading] = useState(false);

  const [password, setPassword] = useState({value: '123456', error: ''});
  const [password1, setPassword1] = useState({value: '123456', error: ''});

  const keyboardAvoidingViewBehaviour =
    Platform.OS === 'ios' ? 'padding' : null;

  const password1Ref = React.createRef();

  async function handleSubmit() {
    setPassword({value: password.value, error: ''});
    setPassword1({value: password1.value, error: ''});

    let valid = true;
    if (password.value.length < 6) {
      setPassword({
        value: password.value,
        error: 'Sua senha deve conter no mínimo 6 caracteres',
      });
      valid = false;
    }
    if (password.value.length >= 6 && password.value !== password1.value) {
      setPassword1({
        value: password1.value,
        error: 'As senha precisam ter valores iguais.',
      });
      valid = false;
    }

    if (!valid) return;

    setLoading(true);
    let updateUser = {
      password: password.value,
    };
    console.log('updateUser', updateUser);
    await update(updateUser);
    setLoading(false);
  }

  return (
    <ScrollView style={styles.container}>
      <KeyboardAvoidingView
        // behavior={keyboardAvoidingViewBehaviour}
        style={styles.container}>
        <View style={styles.innerContainer}>
          <View
            style={{
              flex: 1,
              width: '100%',
              alignItems: 'center',
              marginBottom: 5,
            }}>
            <TextInput
              ref={null}
              label="Nova Senha"
              placeholder=""
              returnKeyType="next"
              value={password.value}
              onChangeText={text => setPassword({value: text, error: ''})}
              onSubmitEditing={event => {
                password1Ref.current.focus();
              }}
              error={!!password.error}
              errorText={password.error}
              secureTextEntry
              autoCapitalize="none"
              typeTheme={'light'}
            />

            <TextInput
              ref={password1Ref}
              label="Repetir Nova Senha"
              placeholder=""
              returnKeyType="done"
              value={password1.value}
              onChangeText={text => setPassword1({value: text, error: ''})}
              onSubmitEditing={event => handleSubmit()}
              error={!!password1.error}
              errorText={password1.error}
              secureTextEntry
              autoCapitalize="none"
              typeTheme={'light'}
            />

            <Button
              loading={loading}
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
