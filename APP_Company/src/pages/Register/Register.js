import React, { useState, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  ScrollView,
} from 'react-native';
import { Button } from 'react-native-paper';
import TextInput from '../../components/TextInput';
import { TextInputMask } from 'react-native-masked-text';
import { validateCpfCnpj, emailValidator } from '../../utilities'
import AuthContext from '../../context/auth';

export default function Register({ navigation }) {
  const { signUp } = useContext(AuthContext);
  const [loading, setLoading] = useState(false)
  const [cnpj, setCNPJ] = useState({ value: '31023681000137', error: '' }); //Outro
  // const [cnpj, setCNPJ] = useState({ value: '12100515000142', error: '' }); //Rio
  const [name, setName] = useState({ value: 'Nova Empresa', error: '' });
  const [email, setEmail] = useState({ value: 'new@new.com', error: '' });
  const [password, setPassword] = useState({ value: '123456', error: '' });
  const [password1, setPassword1] = useState({ value: '123456', error: '' });

  const keyboardAvoidingViewBehaviour = (Platform.OS === 'ios') ? 'padding' : null;

  const namedRef = React.createRef();
  const emailRef = React.createRef();
  const passwordRef = React.createRef();
  const password1Ref = React.createRef();

  async function handleSubmit() {
    // console.log("handleSubmit",await validateCpfCnpj(cnpj.value))
    setCNPJ({value: cnpj.value, error: ""})
    setName({value: name.value, error: ""})
    setEmail({value: email.value, error: ""})
    setPassword({value: password.value, error: ""})
    setPassword1({value: password1.value, error: ""})

    let valid = true
    if(!await validateCpfCnpj(cnpj.value)){ 
      setCNPJ({value: cnpj.value, error: "CNPJ Inválido"})
      valid = false
    }
    if(password.value.length < 6 ) {
      setName({value: name.value, error: "O nome deve conter no mínimo 6 caracteres"})
      valid = false
    }
    if(password.value.length < 6 ){ 
      setPassword({value: password.value, error: "Sua senha deve conter no mínimo 6 caracteres"})
      valid = false
    }
    if(password.value.length >= 6 && password.value !== password1.value){
      setPassword1({value: password1.value, error: "As senha precisam ter valores iguais."})
      valid = false
    }

    let emailError = emailValidator(email.value)
    setEmail({value: email.value, error: emailError})
    if(emailError) valid = false

    if(!valid) return

    setLoading(true)
    let newCompany ={
      cnpj: cnpj.value.replace(/\D/g,''),
      name: name.value,
      email: email.value,
      password: password.value,

    }
    await signUp(newCompany)
    setLoading(false)

  }

  return (
    <ImageBackground 
      style={styles.containerBackground} 
      blurRadius={3} 
      source={require('../../../assets/img/TelaDeCarregamento.jpg')}> 
      <ScrollView style={{flex:1}}>
        <KeyboardAvoidingView 
          // behavior={keyboardAvoidingViewBehaviour}
          style={styles.container}
        >

          <View style={styles.innerContainer}>

            <Text style={styles.title}>Cadastrar</Text>

            <View style={{ flex: 1, width: '100%', alignItems: 'center', marginBottom:5}}>
              <TextInput
                ref={null}
                label="CNPJ"
                render={(props) => (
                  <TextInputMask
                    {...props}
                    type={'cnpj'}
                  />
                )}
                placeholder="11.111.111/1111-11"
                returnKeyType="next"
                value={cnpj.value}
                onChangeText={(text) => setCNPJ({ value: text, error: '' })}
                onSubmitEditing = {(event) => {namedRef.current.focus() }}
                error={!!cnpj.error}
                errorText={cnpj.error}
                maxLength={18}
              />

              <TextInput
                ref={namedRef}
                label="Nome"
                placeholder=""
                returnKeyType="next"
                value={name.value}
                onChangeText={(text) => setName({ value: text, error: '' })}
                onSubmitEditing = {(event) => {emailRef.current.focus() }}
                error={!!name.error}
                errorText={name.error}
                autoCapitalize="none"
              />

              <TextInput
                ref={emailRef}
                label="Email"
                placeholder=""
                returnKeyType="next"
                value={email.value}
                onChangeText={(text) => setEmail({ value: text, error: '' })}
                onSubmitEditing = {(event) => {passwordRef.current.focus() }}
                error={!!email.error}
                errorText={email.error}
                autoCapitalize="none"
              />

              <TextInput
                ref={passwordRef}
                label="Senha"
                placeholder=""
                returnKeyType="next"
                value={password.value}
                onChangeText={(text) => setPassword({ value: text, error: '' })}
                onSubmitEditing = {(event) => {password1Ref.current.focus() }}
                error={!!password.error}
                errorText={password.error}
                secureTextEntry
                autoCapitalize="none"
              />

              <TextInput
                ref={password1Ref}
                label="Repetir Senha"
                placeholder=""
                returnKeyType="done"
                value={password1.value}
                onChangeText={(text) => setPassword1({ value: text, error: '' })}
                onSubmitEditing = {(event) => handleSubmit()}
                error={!!password1.error}
                errorText={password1.error}
                secureTextEntry
                autoCapitalize="none"
              />

              <Button 
                loading={loading} 
                style={styles.btn}
                mode="contained" 
                onPress={()=>handleSubmit()}
              >
                Registrar
              </Button>
            </View>
          </View>

        </KeyboardAvoidingView>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({

  containerBackground: {
    flex:1,
    width: '100%',
    height: '100%',
    alignSelf: 'center',
    justifyContent:"center",
  },
  container: {
    flex:1,
    backgroundColor: 'rgba(0,0,0, 0.60)'
  },
  innerContainer: {
    flex:1,
    alignSelf: 'center',
    alignItems:"center",
    justifyContent: 'center',
    width: '80%',
    paddingTop:50
  },

  title: {
    fontSize: 30,
    marginBottom:15,
    color: 'white',
    fontWeight: "bold",
  },

  btn: {
    marginTop:20,
    marginBottom:20,
    backgroundColor:"rgba(70, 70, 70, 0.85)"
  },
});
