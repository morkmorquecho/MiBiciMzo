import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useFonts, Poppins_400Regular, Poppins_700Bold } from "@expo-google-fonts/poppins";

export default function HomeScreen({ navigation }) {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#35B2E6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/bici.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <View style={styles.overlay}>
        <Text style={styles.title}>Encuentra tu próxima bici</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("RealTimeMap")}
        >
          <Text style={styles.buttonText}>Buscar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: '#2A323E', // Fondo negro
    justifyContent: 'flex-start', // Posicionar elementos desde la parte superior
    alignItems: 'center',
  },
  image: {
    width: '100%', // Ajusta el tamaño de la imagen
    height: '100%', // Cambia la altura según tus necesidades
    marginTop: -80, // Usa un valor negativo para moverla hacia arriba

  },
  overlay: {
    position: 'absolute',
    bottom: 30, // Ajusta la posición del texto y el botón
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 35,
    color: '#FFFFFF',
    marginBottom: 15,
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular',
  },
  button: {
    backgroundColor: '#35B2E6',
    paddingVertical: 12,
    paddingHorizontal: 110,
    borderRadius: 15,
    marginBottom: 15
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'Poppins_700SemiBold',
  },
});
