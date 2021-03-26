import React, {memo} from 'react';
import {View, StyleSheet, Text, TouchableHighlight} from 'react-native';
import Animated from 'react-native-reanimated';
import Sheet from 'reanimated-bottom-sheet';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const BottomSheet = React.forwardRef((props, ref) => {
  const renderContent = () => (
    <View style={styles.container}>
      <View style={styles.pushLine} />
      <TouchableHighlight style={styles.containerBtn} onPress={() => props.selectCameraTypeUpload()}>
        <View style={styles.btn}>
          <EvilIcons
            style={styles.icon}
            name="camera"
            size={25}
            color={'white'}
          />
          <Text style={styles.text}>Câmera</Text>
        </View>
      </TouchableHighlight>
      <TouchableHighlight style={styles.containerBtn} onPress={() => props.selectGalleryTypeUpload()}>
        <View style={styles.btn}>
          <MaterialCommunityIcons
            style={styles.icon}
            name="folder-image"
            size={20}
            color={'white'}
          />
          <Text style={styles.text}>Galeria</Text>
        </View>
      </TouchableHighlight>
      <TouchableHighlight style={styles.containerBtn} onPress={() => ref.current.snapTo(0)}>
        <View style={styles.btn}>
          <EvilIcons
            style={styles.icon}
            name="close"
            size={25}
            color={'white'}
          />
          <Text style={styles.text}>Cancelar</Text>
        </View>
      </TouchableHighlight>
    </View>
  );

  return (
    <Sheet
      ref={ref}
      snapPoints={[0, 220, 0]}
      borderRadius={25}
      initialSnap={0}
      enabledInnerScrolling={false}
      renderContent={renderContent}
    />
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 16,
    height: 350,
  },
  pushLine: {
    backgroundColor: 'gray',
    width: 45,
    height: 8,
    borderRadius: 10,
    alignSelf: 'center',
  },
  containerBtn: {
    marginTop: 15,
  },
  btn: {
    flexDirection: 'row',
    backgroundColor: '#999999',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    padding: 9,
    backgroundColor: 'transparent',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default BottomSheet;
