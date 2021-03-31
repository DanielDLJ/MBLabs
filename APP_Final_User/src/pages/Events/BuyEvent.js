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
function BuyEvent(props) {
  const {company} = useContext(AuthContext);
  const {buyEvent} = useContext(EventContext);
  const [quantity, setQuantity] = useState({value: 0, error: ''});
  const [loading, setLoading] = useState(false);

  useEffect(() => {}, []);

  const handleSubmit = async () => {
    let error = false;
    setQuantity({value: quantity.value, error: ''});
    if (quantity.value === 0) {
      setQuantity({
        value: quantity.value,
        error: 'Precisa adicionar ingressos!',
      });
      error = true;
    }

    if (error) return;

    try {
      setLoading(true);
      let result = await buyEvent(quantity.value);
      setLoading(false);

      if (result === true) {
        props.navigation.pop();
      }
    } catch (error) {
      console.log('error handleSubmit', error);
    }
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
              <TextInput
                ref={null}
                label="Quantidade"
                placeholder="0"
                returnKeyType="done"
                keyboardType="number-pad"
                value={quantity.value}
                onChangeText={text =>
                  setQuantity({value: text.replace(/\D/g, ''), error: ''})
                }
                error={!!quantity.error}
                errorText={quantity.error}
                autoCapitalize="none"
                typeTheme={'light'}
              />

              <Button
                loading={loading}
                style={styles.btn}
                mode="contained"
                onPress={() => handleSubmit()}>
                Comprar
              </Button>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
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
  btn: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(70, 70, 70, 0.85)',
  },
});

export default BuyEvent;
