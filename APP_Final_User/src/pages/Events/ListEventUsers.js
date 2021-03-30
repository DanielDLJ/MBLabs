import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import {FAB} from 'react-native-paper';
import api from '../../services/api';
import AuthContext from '../../context/auth';
import EventContext from '../../context/event';
import Card from '../../components/Card';

function ListEventUsers({navigation}) {
  const {company} = useContext(AuthContext);
  const {getEventList, getEventUsersList} = useContext(EventContext);
  const [eventUsers, setEventUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEventUser();
  }, []);

  const fetchEventUser = async () => {
    console.log('events', await getEventUsersList());
    setEventUsers(await getEventUsersList());
    setLoading(false);
  };

  const renderItem = ({item}) => (
    <View >
      <Text style={styles.textListName}>{item?.user?.name} </Text>
      <Text style={styles.textListQuantity}>Quantidade: {item.quantity} </Text>
    </View>
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
        <Text style={styles.emptyText}>Ninguém comprou esse evento!</Text>
      </View>
    );
  };

  const itemSeparatorComponent = () => {
    return (
      <View
        style={{
          height: 1,
          backgroundColor: 'black',
        }}
      />
    );
  };

  return (
    <View behavior="padding" style={styles.container}>
      <FlatList
        data={eventUsers}
        contentContainerStyle={{flexGrow: 1}}
        renderItem={renderItem}
        ItemSeparatorComponent={itemSeparatorComponent}
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
  //List Item
  textListName: {
    marginTop: 2,
    marginStart: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  textListQuantity: {
    marginStart: 8,
    marginBottom: 8,
    fontSize: 15,
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

export default ListEventUsers;
