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
import moment from 'moment';

export default function Register({ navigation }) {
  const { signUp } = useContext(AuthContext);
  const [loading, setLoading] = useState(false)
  // const [cpf, setCPF] = useState({ value: '98501796000', error: '' }); //Outro
  // const [name, setName] = useState({ value: 'Nova da Pessoa', error: '' });//Outro
  const [cpf, setCPF] = useState({ value: '41999741803', error: '' }); //Meu
  const [name, setName] = useState({ value: 'Daniel Leme', error: '' });//Meu
  const [email, setEmail] = useState({ value: 'daniel@hotmail.com', error: '' });//Meu
  const [birthday, setBirthday] = useState({ value: '04121994', error: '' });
  const [password, setPassword] = useState({ value: '123456', error: '' });
  const [password1, setPassword1] = useState({ value: '123456', error: '' });

  const keyboardAvoidingViewBehaviour = (Platform.OS === 'ios') ? 'padding' : null;

  const namedRef = React.createRef();
  const emailRef = React.createRef();
  const birthdayRef = React.createRef();
  const passwordRef = React.createRef();
  const password1Ref = React.createRef();

  async function handleSubmit() {
    // console.log("handleSubmit",await validateCpfCnpj(cpf.value))
    setCPF({value: cpf.value, error: ""})
    setName({value: name.value, error: ""})
    setEmail({value: email.value, error: ""})
    setBirthday({value: birthday.value, error: ""})
    setPassword({value: password.value, error: ""})
    setPassword1({value: password1.value, error: ""})

    let valid = true
    if(!await validateCpfCnpj(cpf.value)){ 
      setCPF({value: cpf.value, error: "CPF Inválido"})
      valid = false
    }
    if(name.value.length < 6 ) {
      setName({value: name.value, error: "O nome deve conter no mínimo 6 caracteres"})
      valid = false
    }

    if(!moment(birthday.value, "DD/MM/YYYY").isValid() ) {
      setBirthday({value: birthday.value, error: "Data Inválida!"})
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
    let newUser ={
      cpf: cpf.value.replace(/\D/g,''),
      name: name.value,
      email: email.value,
      birthday: moment(birthday.value, "DD/MM/YYYY").format("YYYY-MM-DD").toString(),
      password: password.value,

    }
    let result = await signUp(newUser)
    setLoading(false)

    
    if(result){
      navigation.pop(2)
    }
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
                label="CPF"
                render={(props) => (
                  <TextInputMask
                    {...props}
                    type={'cpf'}
                  />
                )}
                placeholder="111.111.111-11"
                returnKeyType="next"
                value={cpf.value}
                onChangeText={(text) => setCPF({ value: text, error: '' })}
                onSubmitEditing = {(event) => {namedRef.current.focus() }}
                error={!!cpf.error}
                errorText={cpf.error}
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
                onSubmitEditing = {(event) => {birthdayRef.current.focus() }}
                error={!!email.error}
                errorText={email.error}
                autoCapitalize="none"
              />

              <TextInput
                ref={birthdayRef}
                label="Data de Nascimento"
                render={(props) => (
                  <TextInputMask
                    {...props}
                    options={{
                      format: 'DD/MM/YYYY'
                    }}
                    type={'datetime'}
                  />
                )}
                placeholder="DD/MM/YYYY"
                returnKeyType="next"
                value={birthday.value}
                onChangeText={(text) => setBirthday({ value: text, error: '' })}
                onSubmitEditing = {(event) => {passwordRef.current.focus() }}
                error={!!birthday.error}
                errorText={birthday.error}
                maxLength={10}
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
