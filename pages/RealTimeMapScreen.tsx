import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text, ActivityIndicator, Image } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Modalize } from "react-native-modalize";
import axios from "axios";

import BicycleModal from '../components/modals/BiciModal'; // Importa el modal previamente creado



const bicipuertos = [
  { id: 1, latitude: 19.123472, longitude: -104.399556, title: "Bicipuerto Universidad de Colima" },
  { id: 2, latitude: 19.115611, longitude: -104.349750, title: "Bicipuerto CAPDAM" },
  { id: 3, latitude: 19.102306, longitude: -104.328056, title: "Bicipuerto Parada en Blvd. Miguel de la Madrid 1070" },
  { id: 4, latitude: 19.084583, longitude: -104.308750, title: "Bicipuerto Las Brisas" },
];

const bikeLocation = {
  id: 1,
  latitude: 19.118556,
  longitude: -104.386222,
  title: "Bicicleta en Uso 1",
};


export default function RealTimeMapScreen() {
  const [location, setLocation] = useState(null);
  const [selectedBicipuerto, setSelectedBicipuerto] = useState(null);
  const [bicisDisponibles, setBicisDisponibles] = useState(null);
  const [loading, setLoading] = useState(false);
  const modalizeRef = useRef(null);
  const [bikeModalVisible, setBikeModalVisible] = useState(false);
  const [bikePosition, setBikePosition] = useState(bikeLocation);
  const [previousPosition, setPreviousPosition] = useState(bikeLocation);
  const [timer, setTimer] = useState(null);
  const ip = '192.168.100.8';
  const baseURL = `http://${ip}:8069/api/bicis`;
  const baseURL2 = `http://${ip}:8069/api/bicipuertos`;


  //DETERMINAR SI UNA BICI FUE ROBADA POR EL TIEMPO ESTATICA
useEffect(() => {
  if (bikePosition.latitude === previousPosition.latitude &&
      bikePosition.longitude === previousPosition.longitude) {
    if (!timer) {
      const newTimer = setTimeout(async () => {
        try {
          const response = await axios.patch(`${baseURL}/1/robo`, null, {
            params: { robado: true }, // Parámetro para indicar el estado de robo
          });
          console.log('Bicicleta marcada como robada:', response.data);
        } catch (error) {
          console.error('Error al marcar bicicleta como robada:', error);
        } finally {
          setTimer(null); // Reinicia el temporizador
        }
      }, 30000); // 30 segundos
      setTimer(newTimer);
    }
  } else {
    // Reinicia el temporizador si las coordenadas cambian
    if (timer) {
      clearTimeout(timer);
      setTimer(null);
    }
    setPreviousPosition(bikePosition);
  }
}, [bikePosition]);

//ACTUALIZAR UBICACION DE LA BICI EN USO ID 1
useEffect(() => {
  const interval = setInterval(() => {
    // Simulación o lógica para actualizar bikePosition
    setBikePosition((prevPosition) => ({
      ...prevPosition,
      latitude: bikeLocation.latitude,
      longitude: bikeLocation.longitude,
    }));
  }, 5000); // Actualiza cada 5 segundos

  return () => clearInterval(interval);
}, []);



//OBTENER UBICACION DEL USUARIO
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 10 },
        (loc) => {
          setLocation({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }
      );
    })();
  }, []);


  //ACCIONES AL DAR CLICK EN ALGUN BICIPUERTO
  const handleMarkerPress = async (bicipuerto) => {
    setSelectedBicipuerto(bicipuerto);
    modalizeRef.current?.open();
    setLoading(true);

    try {
      const url = `${baseURL2}/${encodeURIComponent(bicipuerto.title)}/bicis-disponibles`;

      const response = await axios.get(url);
      setBicisDisponibles(response.data);
    } catch (error) {
      console.error("Error al consultar la API:", error);
      setBicisDisponibles("Error al obtener datos");
    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={styles.container}>
      {/* Mapa */}
      {location && (
        <MapView style={styles.map} region={location}>
          {/* Marcador del usuario */}
          <Marker
            coordinate={location}
            image={require("../assets/images/usuario.png")}
          />
  
          {/* Marcadores de bicipuertos */}
          {bicipuertos.map((bicipuerto) => (
            <Marker
              key={bicipuerto.id}
              coordinate={{
                latitude: bicipuerto.latitude,
                longitude: bicipuerto.longitude,
              }}
              title={bicipuerto.title}
              onPress={() => handleMarkerPress(bicipuerto)}
            >
              <Image
                source={require("../assets/images/biciPuerto.png")}
                style={{ width: 70, height: 70 }}
              />
            </Marker>
          ))}
  
          {/* Marcador de bicicleta en uso */}
          <Marker
            coordinate={{
              latitude: bikeLocation.latitude,
              longitude: bikeLocation.longitude,
            }}
            title={bikeLocation.title}
            onPress={() => setBikeModalVisible(true)}
          >
            <Image
              source={require("../assets/images/biciEnUso.png")}
              style={{ width: 50, height: 50 }}
            />
          </Marker>
        </MapView>
      )}
  
      {/* Modal de bicipuerto */}
      <Modalize
        ref={modalizeRef}
        modalStyle={styles.modal}
        handleStyle={styles.handle}
        adjustToContentHeight
      >
        {selectedBicipuerto && (
          <View style={styles.bottomSheetContent}>
            <Text style={styles.title}>{selectedBicipuerto.title}</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#35B2E6" />
            ) : (
              <Text style={styles.text}>
                Bicis disponibles: {bicisDisponibles}
              </Text>
            )}
          </View>
        )}
      </Modalize>
  
      {/* Modal de bicicleta */}
      <BicycleModal
        visible={bikeModalVisible}
        onClose={() => setBikeModalVisible(false)}
        bicycleId={bikeLocation.id} // Se usa el ID de la bicicleta en uso
      />
    </View>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  modal: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handle: {
    backgroundColor: "#35B2E6",
    width: 60,
    height: 6,
    borderRadius: 3,
    alignSelf: "center",
    marginTop: 10,
  },
  bottomSheetContent: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#35B2E6",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: "#000",
  },
});
