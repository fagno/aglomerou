
import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Dimensions, Text } from 'react-native';
import { FontAwesome5 as Fa } from '@expo/vector-icons';
import { Marker } from 'react-native-maps';
import MapView from 'react-native-map-clustering'

import LocalizacaoDispositivo from './LocalizacaoDispositivo'

import { getLocalizacaoDispositivo, getLocalizacoesRecentes } from '../utils/LocalizacaoDispositivo'

export default function App() {
  const [localizacoes, setLocalizacoes] = useState([])
  const [latitudeInicial, setLatitudeInicial] = useState()
  const [longitudeInicial, setLongitudeInicial] = useState()
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const getLocalizaoInicial = async () => {          
      try {
          const {latitude, longitude} = await getLocalizacaoDispositivo()
          setLatitudeInicial(latitude);
          setLongitudeInicial(longitude);
          setLoading(false);
          
          setLocalizacoes(await getLocalizacoesRecentes())
      } catch (error) {
          console.error(`Erro ao obter localização inicial: ${error}`)
          // Define a localização inicial como Praça dos Girassóis.
          setLatitudeInicial(-10.184510);
          setLongitudeInicial(-48.334660);
          setLoading(false)
      }        
    }

    getLocalizaoInicial()    
  }, [])

  return (
    <View style={styles.container}>
      {loading ? <Text>Carregando Mapa...</Text> : (
        <MapView 
        style={styles.mapStyle} 
        initialRegion={{
          latitude: latitudeInicial,
          longitude: longitudeInicial,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05
        }}>
          
        <Marker
          coordinate={{
            latitude: latitudeInicial,
            longitude: longitudeInicial,
          }}
        >
          <Fa name="map-marker-alt" size={32} color="#e02041" />         
        </Marker>

        {localizacoes.map((item, index) => (
           <Marker key={index}
            coordinate={{
              latitude: parseFloat(item.latitude),
              longitude: parseFloat(item.longitude),
            }}
           /> 
          ))}
      </MapView>
      )}
    <LocalizacaoDispositivo/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },  
});