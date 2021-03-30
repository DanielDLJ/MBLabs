import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import AuthContext from '../../context/auth';
import EventContext from '../../context/event';
import Card from '../../components/Card';
import NeedLogged from '../NeedLogged/NeedLogged';

function ListEvents({navigation}) {
  const {user} = useContext(AuthContext);
  const {getEventList, setSelectedEvent, selectedEvent} = useContext(EventContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  if(user === null){
    return <NeedLogged navigation={navigation}/>
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [selectedEvent]);

  const fetchEvents = async () => {
    console.log('events', await getEventList());
    setEvents(await getEventList());
    setLoading(false);
  };

  const renderItem = ({item}) => (
    <Card
      onPress={() => {
        setSelectedEvent(item);
        navigation.navigate('EventTabNavigator');
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
        data={events}
        contentContainerStyle={{flexGrow: 1, alignItems: 'center'}}
        renderItem={renderItem}
        ListEmptyComponent={listEmptyComponent}
        keyExtractor={item => item._id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#b5b5b5',
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

export default ListEvents;
