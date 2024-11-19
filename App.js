import './gesture-handler'; // Asegúrate de que este archivo existe y está configurado correctamente
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import HomeScreen from './pages/HomeScreen'; // Pantalla inicial
import RealTimeMapScreen from './pages/RealTimeMapScreen'; // Pantalla del mapa

// Crear el stack navigator
const Stack = createStackNavigator();

export default function App() {
  return (
    <>
      {/* Personaliza la barra de estado */}
      <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Home"
          screenOptions={{ headerShown: false }} // Desactivar encabezados
        >
          {/* Pantallas de navegación */}
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="RealTimeMap" component={RealTimeMapScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
