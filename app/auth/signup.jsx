import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { signupUser } from '../../services/AuthServicess'; // adjust path

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authority, setAuthority] = useState('');
  const [isActive, setIsActive] = useState('');

 


  const handleSignup = async () => {
    if (!name || !mobile || !email || !password || !authority || !isActive) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
  
    try {
      const result = await signupUser({ name, mobile, email, password, authority, isActive });
  
      await AsyncStorage.setItem('user', JSON.stringify(result.user));
      Alert.alert('Success', 'User registered successfully');
      router.replace('/auth/login');
    } catch (error) {
      console.error('Signup Error:', error);
      Alert.alert('Error', error.message || 'Signup failed');
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
        placeholderTextColor="#A8A8A8"
      />
      <TextInput
        style={styles.input}
        placeholder="Mobile No"
        value={mobile}
        onChangeText={setMobile}
        keyboardType="numeric"
        placeholderTextColor="#A8A8A8"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholderTextColor="#A8A8A8"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#A8A8A8"
      />

      <Picker
        selectedValue={authority}
        onValueChange={(itemValue) => setAuthority(itemValue)}
        style={styles.input}
      >
        <Picker.Item label="Select Authority" value="" />
        <Picker.Item label="Admin" value="1" />
        <Picker.Item label="User" value="2" />
        <Picker.Item label="Other" value="3" />
      </Picker>

      <Picker
        selectedValue={isActive}
        onValueChange={(value) => setIsActive(value)}
        style={styles.input}
      >
        <Picker.Item label="Is Active?" value="" />
        <Picker.Item label="Yes" value="true" />
        <Picker.Item label="No" value="false" />
      </Picker>

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace('/auth/login')}>
        <Text style={styles.loginText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F8F8F8',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingLeft: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    height: 50,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginText: {
    textAlign: 'center',
    color: '#3b82f6',
    fontSize: 16,
    marginTop: 10,
  },
});
