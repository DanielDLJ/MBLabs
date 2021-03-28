import React, { useEffect, useContext } from 'react'
import {
    Text,
    View,
    StyleSheet,
    Dimensions,
} from 'react-native'
import ItemMenu from '../../components/ItemMenu'
import AuthContext  from '../../context/auth';
import Ionicons from 'react-native-vector-icons/Ionicons';

function Home({ navigation }) {
    const {  } = useContext(AuthContext);

    return (
        <View
            style={styles.container}
        >
            <Text style={styles.title} >Home </Text>
            <View style={styles.containerMenu}>
                <ItemMenu
                    nameIcon={"settings"}
                    onPress={()=> navigation.navigate('Settings')}
                    name={"Configurações"}
                />
                <ItemMenu
                    nameIcon={"event"}
                    onPress={()=> navigation.navigate('ListEvents')}
                    name={"Eventos"}
                />
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#b5b5b5',
    },
    title: {
        marginTop: 10,
        fontSize: 22,
        alignSelf: 'center',
        fontWeight: 'bold',
        color: '#696969'
    },
    containerMenu: {
        marginTop:50,
        justifyContent:"space-between",
        flexDirection:"row"
    },
})

export default Home