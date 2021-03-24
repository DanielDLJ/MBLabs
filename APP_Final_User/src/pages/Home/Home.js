import React, { useEffect, useContext } from 'react'
import {
    Text,
    View,
    StyleSheet,
    Dimensions,
} from 'react-native'

const {width, height} = Dimensions.get('window')
import AuthContext  from '../../context/auth';


function Home({ navigation }) {
    const {  } = useContext(AuthContext);


    return (
        <View
            style={styles.container}
        >
            <Text style={styles.title} >Home </Text>
            

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
    },
    title: {
        marginTop: 10,
        fontSize: 22,
        alignSelf: 'center',
        fontWeight: 'bold',
        color: '#696969'
    },
})

export default Home