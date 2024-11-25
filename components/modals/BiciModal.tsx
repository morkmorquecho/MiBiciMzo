import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  Image,
  StyleSheet,
  Pressable,
  Switch,
  ActivityIndicator,
  Alert,
} from 'react-native';
import axios from 'axios';

// Definir las props que acepta el componente
type BicycleModalProps = {
  visible: boolean;
  onClose: () => void;
  bicycleId: number; // ID de la bicicleta para consultar el estado
};

const BicycleModal: React.FC<BicycleModalProps> = ({ visible, onClose, bicycleId }) => {
  const [isDamaged, setIsDamaged] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      fetchBicycleStatus();
    }
  }, [visible]);

  const fetchBicycleStatus = async () => {
    setLoading(true);
    try {
      const ip = '192.168.100.6';
      const baseURL = `http://${ip}:8069/api/bicis`;
      const url = `${baseURL}/${encodeURIComponent(bicycleId)}/averiado`; // Ruta correcta para el GET
      const response = await axios.get(url);
      setIsDamaged(response.data);
    } catch (error) {
      Alert.alert('Error', 'No se pudo obtener el estado de la bicicleta.');
    } finally {
      setLoading(false);
    }
  };
  
  const updateBicycleStatus = async () => {
    setLoading(true);
    try {
      const ip = '192.168.100.6';
      const baseURL = `http://${ip}:8069/api/bicis`;
      const url = `${baseURL}/${encodeURIComponent(bicycleId)}/averiado`; // Ruta correcta para el PATCH
      await axios.patch(url, null, {
        params: { averiada: isDamaged },
      });
      Alert.alert('Éxito', 'El estado de la bicicleta se actualizó correctamente.');
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el estado de la bicicleta.');
    } finally {
      setLoading(false);
      onClose();
    }
  };
  

  const handleClose = () => {
    updateBicycleStatus();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="blue" />
          ) : (
            <>
              <Image
                source={
                  isDamaged
                    ? require('../../assets/images/biciDescompuesta.png')
                    : require('../../assets/images/biciEnUso.png')
                }
                style={styles.image}
              />
              <Text style={styles.text}>¿Bicicleta averiada?</Text>
              <View style={styles.toggleContainer}>
                <Text style={styles.toggleText}>No</Text>
                <Switch
                  value={isDamaged}
                  onValueChange={(value) => setIsDamaged(value)}
                  trackColor={{ false: 'gray', true: 'red' }}
                  thumbColor={isDamaged ? 'white' : 'white'}
                />
                <Text style={styles.toggleText}>Sí</Text>
              </View>
              <Pressable style={styles.closeButton} onPress={handleClose}>
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  toggleText: {
    fontSize: 16,
    marginHorizontal: 10,
  },
  closeButton: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default BicycleModal;
