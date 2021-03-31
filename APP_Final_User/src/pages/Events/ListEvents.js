import React, {useState, useEffect, useContext} from 'react';
import {View, Text, StyleSheet, FlatList, Image} from 'react-native';
import AuthContext from '../../context/auth';
import EventContext from '../../context/event';
import Card from '../../components/Card';
import NeedLogged from '../NeedLogged/NeedLogged';

function ListEvents({navigation}) {
  const {user} = useContext(AuthContext);
  const {getEventUsersList, setSelectedEvent, selectedEvent} = useContext(
    EventContext,
  );
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  if (user === null) {
    return <NeedLogged navigation={navigation} />;
  }

  useEffect(() => {
    // setLoading(false);
    fetchEvents();
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [selectedEvent]);

  const fetchEvents = async () => {
    console.log('events', await getEventUsersList());
    setEvents(await getEventUsersList());
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
      {loading === false && events.length > 0 ? (
        <Text style={styles.headerText}>Meus Eventos</Text>
      ) : null}
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
  headerText: {
    marginTop: 20,
    marginBottom: 20,
    fontSize: 18,
    alignSelf: 'center',
    fontWeight: 'bold',
    color: 'white',
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

export default ListEvents;
