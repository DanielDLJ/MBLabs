import React, { useState, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  TouchableOpacity
} from 'react-native';
import { Button } from 'react-native-paper';
import TextInput from '../../components/TextInput';
import { TextInputMask } from 'react-native-masked-text';
import AuthContext from '../../context/auth';
import { validateCpfCnpj } from '../../utilities'

export default function Login({ navigation }) {
  const { signIn } = useContext(AuthContext);
  const [loading, setLoading] = useState(false)
  const [cnpj, setCNPJ] = useState({ value: '12100515000142 ', error: '' });
  const [password, setPassword] = useState({ value: '123456', error: '' });
  const keyboardAvoidingViewBehaviour = (Platform.OS === 'ios') ? 'padding' : null;

  const passwordRef = React.createRef();
  async function handleSubmit() {
    console.log("handleSubmit",await validateCpfCnpj(cnpj.value))
    setCNPJ({value: cnpj.value, error: ""})
    setPassword({value: password.value, error: ""})

    if(!await validateCpfCnpj(cnpj.value)){
      setCNPJ({value: cnpj.value, error: "CNPJ Inválido"})
      return
    }
    
    if(password.value.length < 6 ){
      setPassword({value: password.value, error: "Sua senha deve conter no mínimo 6 caracteres"})
      return
    }

    setLoading(true)
    await signIn(cnpj.value.replace(/\D/g,''), password.value)
    setLoading(false)

  }

  return (
    <ImageBackground 
      style={styles.containerBackground} 
      blurRadius={3} 
      source={require('../../../assets/img/TelaDeCarregamento.jpg')}> 

      <KeyboardAvoidingView 
        behavior={keyboardAvoidingViewBehaviour}
        style={styles.container}
      >
        <View style={styles.innerContainer}>

          <Text style={styles.title}>Login</Text>

          {/* container TextInput and Button */}
          <View style={{ flex: 1, width: '100%', alignItems: 'center', marginBottom:5}}>
            <TextInput
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
              onSubmitEditing = {(event) => {passwordRef.current.focus() }}
              error={!!cnpj.error}
              errorText={cnpj.error}
              maxLength={18}
            />

            <TextInput
              ref={passwordRef}
              label="Senha"
              placeholder=""
              returnKeyType="done"
              value={password.value}
              onChangeText={(text) => setPassword({ value: text, error: '' })}
              onSubmitEditing = {(event) => handleSubmit()}
              error={!!password.error}
              errorText={password.error}
              secureTextEntry
              autoCapitalize="none"
            />
            <TouchableOpacity 
              style={{alignSelf:"flex-end"}}
              onPress={()=> navigation.navigate('Register')}
            >
              <Text style={styles.register}>Nao tem Conta?</Text>
            </TouchableOpacity>

            <Button 
              loading={loading} 
              style={{backgroundColor:"rgba(70, 70, 70, 0.85)"}} 
              mode="contained" 
              onPress={()=>handleSubmit()}
            >
              Login
            </Button>
          </View>
        </View>

      </KeyboardAvoidingView>
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
    marginTop:80,
    marginBottom:15,
    color: 'white',
    fontWeight: "bold",
  },
  register: {
    fontSize: 15,
    marginTop:8,
    marginBottom:20,
    color: 'white',
  },
});