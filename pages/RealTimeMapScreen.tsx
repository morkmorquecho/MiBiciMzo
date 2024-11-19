import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

export default function RealTimeMapScreen() {
  const [location, setLocation] = useState(null);

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

  return (
    <View style={styles.container}>
      {location ? (
        <MapView style={styles.map} region={location}>
          <Marker
            coordinate={location}
            image={require('../assets/images/usuario.png')}
/>

        </MapView>
      ) : null}
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
  marker: {
    height: 40,
    width: 40,
    backgroundColor: "blue",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  personIcon: {
    height: 20,
    width: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
});

