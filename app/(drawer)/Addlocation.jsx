import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Button, StyleSheet,
  ActivityIndicator, Alert, ScrollView
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as Location from 'expo-location';
import {
  fetchCompanies,
  fetchCities,
  submitLocationUpdate,
} from '../../services/API'; // ✅ import service functions

const Addlocationcomp = () => {
  const [companies, setCompanies] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [loadingCities, setLoadingCities] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const companyData = await fetchCompanies();
      const uniqueCompaniesMap = new Map();
      companyData.forEach(inquiry => {
        const name = inquiry.companyName?.trim();
        if (name && !uniqueCompaniesMap.has(name)) {
          uniqueCompaniesMap.set(name, inquiry);
        }
      });
      setCompanies(Array.from(uniqueCompaniesMap.values()));
      setLoadingCompanies(false);

      const cityData = await fetchCities();
      setCities(cityData);
      setLoadingCities(false);

      await getLocation();
    } catch (error) {
      Alert.alert('Error', 'Failed to load initial data');
      console.error(error);
    }
  };

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location permission is required');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLatitude(location.coords.latitude);
    setLongitude(location.coords.longitude);
  };

  const handleUpdate = async () => {
    if (!selectedCompany || !address || !selectedCity) {
      Alert.alert("Validation Error", "Please fill out all fields.");
      return;
    }

    if (latitude === null || longitude === null) {
      Alert.alert("Location Error", "Location is not available.");
      return;
    }

    const payload = {
      code: selectedCompany,
      address: address,
      cityCode: selectedCity,
      latitude,
      longitude,
    };

    const { ok, data } = await submitLocationUpdate(payload);

    if (ok) {
      Alert.alert('Success', 'Location updated successfully');
      setSelectedCompany('');
      setSelectedCity('');
      setAddress('');
    } else {
      Alert.alert('Error', data?.message || 'Failed to update location');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Update Location Form</Text>

      <Text style={styles.label}>Select Company</Text>
      {loadingCompanies ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <Picker
          selectedValue={selectedCompany}
          onValueChange={(itemValue) => {
            setSelectedCompany(itemValue);
            const selected = companies.find(c => c.code === itemValue);
            setAddress(selected?.address ?? '');
            setSelectedCity(selected?.cityCode || '');
          }}
          style={styles.picker}
        >
          <Picker.Item label="-- Select Company --" value="" />
          {companies.map((company) => (
            <Picker.Item key={company.code} label={company.companyName} value={company.code} />
          ))}
        </Picker>
      )}

      <Text style={styles.label}>Enter Address</Text>
      <TextInput
        value={address}
        onChangeText={setAddress}
        placeholder="Enter address"
        style={styles.input}
      />

      <Text style={styles.label}>Select City</Text>
      {loadingCities ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <Picker
          selectedValue={selectedCity}
          onValueChange={(itemValue) => setSelectedCity(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="-- Select City --" value="" />
          {cities.map((city) => (
            <Picker.Item key={city.newcode} label={city.cityName} value={city.newcode} />
          ))}
        </Picker>
      )}

      <View style={styles.buttonContainer}>
        <Button title="Update" onPress={handleUpdate} color="#007bff" />
      </View>
    </ScrollView>
  );
};

export default Addlocationcomp;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f4f4f4',
    flex: 1,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  label: {
    marginTop: 10,
    fontWeight: '600',
    fontSize: 16,
  },
  picker: {
    backgroundColor: '#fff',
    marginVertical: 5,
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    marginTop: 5,
    borderRadius: 5,
  },
  buttonContainer: {
    marginTop: 20,
  },
});
