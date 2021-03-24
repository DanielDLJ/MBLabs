import React ,{ useEffect, useContext }from 'react';
import  {
    KeyboardAvoidingView,
    View,
    StyleSheet,
    Image,
    Text,
    ImageBackground 
} from 'react-native'
import AuthContext  from '../../context/auth';

function TelaCarregamento(){
    const { isLoadingAuth, setLoadingSplash } = useContext(AuthContext);

    useEffect(() =>{
        setTimeout(() => {
            setLoadingSplash(false)
        }, 3000);
    },[])

    return(
        <ImageBackground style={styles.container} blurRadius={4} source={require('../../../assets/img/TelaDeCarregamento.jpg')}> 
            <View style={styles.innerContainer}>
                <Text style={styles.text}>Event Day</Text>
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        width: '100%',
        height: '100%',
        alignSelf: 'center',
    },
    innerContainer: {
        flex:1,
        backgroundColor: 'rgba(0,0,0, 0.60)'
      },
    text:{
        flex:1,
        alignSelf:"center",
        textAlignVertical:"center",
        fontSize:50,
        fontStyle:'italic',
        fontWeight:'bold',
        color:'white',
    }
})

export default TelaCarregamento
