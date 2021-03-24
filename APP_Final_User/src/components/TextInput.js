import React, { memo } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput as Input, HelperText } from 'react-native-paper';

const TextInput = React.forwardRef((props, ref) => {
  const {errorText, ...others} = props;
  return(<View style={styles.container}>
    <Input
      style={styles.input}
      underlineColor="transparent"
      mode="outlined"
      ref={ref}
      theme={{
        colors: {
          placeholder: '#9b9bc2',  //No selected (placeholder and label)
          text: '#9b9bc2',  //text of textinput
          primary: '#cacaed', //Selected (edge and label )
          underlineColor: 'transparent', 
          colorAccent: 'transparent', 
          background:'rgba(81, 81, 92, 0.8)',
          error:"#ff0000"
        }
     }}
      {...others}
    />
    {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
  </View>
)});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 12,
    borderRadius: 100,
  },
  input: {
    borderRadius: 100,
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
  },
  error: {
    fontSize: 14,
    color: "red",
    paddingHorizontal: 4,
    paddingTop: 4,
  },
});

export default TextInput;
