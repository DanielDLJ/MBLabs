import React, {useEffect, useContext, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  Image,
} from 'react-native';
import ItemMenu from '../../components/ItemMenu';
import AuthContext from '../../context/auth';
import Eventontext from '../../context/event';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Card from '../../components/Card';
function Home({navigation}) {
  const {user} = useContext(AuthContext);
  const {getHomeList, selectedEvent, setSelectedEvent} = useContext(
    Eventontext,
  );
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   setLoading(false);
  // }, []);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [selectedEvent]);

  const fetchEvents = async () => {
    // console.log('events', await getHomeList());
    setEvents(await getHomeList());
    setLoading(false);
  };

  const renderItem = ({item}) => (
    <Card
      onPress={() => {
        setSelectedEvent(item);
        navigation.navigate('ViewEvent');
      }}
      image={item.image}
      name={item.name}
    />
  );

  const listEmptyComponent = () => {
    if (loading) {
      return (
        <Image
          style={styles.gif}
          source={require('../../../assets/img/loading.gif')}
        />
      );
    }
    return (
      <View style={styles.containerEmpty}>
        <Text style={styles.emptyText}>Não existe Eventos</Text>
      </View>
    );
  };

  return (
    <View behavior="padding" style={styles.container}>
      <FlatList
        style={{marginTop: 10}}
        contentContainerStyle={{flexGrow: 1}}
        data={events}
        renderItem={({item}) => (
          <View>
            <Text style={styles.titleText}>{item.category}</Text>
            <FlatList
              horizontal
              data={item.events}
              renderItem={item =>
                renderItem({...item, category: item.category})
              }
              keyExtractor={(item2, index) => index}
            />
          </View>
        )}
        ListEmptyComponent={listEmptyComponent}
        keyExtractor={(item, index) => index}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#b5b5b5',
  },
  //List
  titleText: {
    marginLeft: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  // Empty container
  containerEmpty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    alignSelf: 'center',
    textAlignVertical: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  gif: {
    flex: 1,
    zIndex: 0,
    alignSelf: 'center',
    resizeMode: 'contain',
    height: 50,
    width: 50,
  },
});

export default Home;
