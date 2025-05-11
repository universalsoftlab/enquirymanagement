
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useDispatch, useSelector } from 'react-redux';
import { addContact as addContactAction } from '../../Redux/actions/contactActions';
import { getInquiries, getDesignations, addContact } from '../../services/API';

const ContactMasterForm = () => {
  const dispatch = useDispatch();
  const contacts = useSelector((state) => state.contact.contacts);

  const [companies, setCompanies] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [companyId, setCompanyId] = useState(null);
  const [openCompanyDropdown, setOpenCompanyDropdown] = useState(false);

  const [designations, setDesignations] = useState([]);
  const [loadingDesignations, setLoadingDesignations] = useState(true);
  const [designationId, setDesignationId] = useState(null);
  const [openDesignationDropdown, setOpenDesignationDropdown] = useState(false);

  const [name, setName] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    getInquiries()
      .then((inquiries) => {
        const uniqueMap = new Map();
        inquiries.forEach((item) => {
          if (!uniqueMap.has(item.companyName)) {
            uniqueMap.set(item.companyName, item);
          }
        });
        const formatted = Array.from(uniqueMap.values()).map((item) => ({
          label: item.companyName,
          value: item.code,
        }));
        setCompanies(formatted);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoadingCompanies(false));
  }, []);

  useEffect(() => {
    getDesignations()
      .then((data) => {
        const formatted = data.map((item) => ({
          label: item.name,
          value: item.id,
        }));
        setDesignations(formatted);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoadingDesignations(false));
  }, []);

  const handleSubmit = async () => {
    if (!companyId || !name || !contactNo || !designationId) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    const payload = {
      EnquiryCode: companyId,
      Name: name,
      ContactNumber: contactNo,
      Email: email,
      Designation_Id: designationId,
    };

    try {
      const result = await addContact(payload);
      if (result.ok) {
        dispatch(addContactAction(payload));
        Alert.alert('Success', 'Contact added successfully!');
        setName('');
        setContactNo('');
        setEmail('');
        setCompanyId(null);
        setDesignationId(null);
      } else {
        Alert.alert('Error', result.data.message || 'Failed to add contact.');
      }
    } catch (error) {
      console.error('Submit error:', error);
      Alert.alert('Error', 'Could not submit the form. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Contact Master Form</Text>

        {/* Company Dropdown */}
        <Text style={styles.label}>Company Name:</Text>
        {loadingCompanies ? (
          <ActivityIndicator size="small" color="#007BFF" />
        ) : (
          <DropDownPicker
            open={openCompanyDropdown}
            value={companyId}
            items={companies}
            setOpen={setOpenCompanyDropdown}
            setValue={setCompanyId}
            setItems={setCompanies}
            placeholder="Select a company"
            searchable
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            zIndex={3000}
            zIndexInverse={1000}
          />
        )}

        {/* Name */}
        <Text style={styles.label}>Name:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
        />

        {/* Contact No */}
        <Text style={styles.label}>Contact No:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter contact number"
          keyboardType="phone-pad"
          value={contactNo}
          onChangeText={setContactNo}
        />

        {/* Email */}
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        {/* Designation Dropdown */}
        <Text style={styles.label}>Designation:</Text>
        {loadingDesignations ? (
          <ActivityIndicator size="small" color="#007BFF" />
        ) : (
          <DropDownPicker
            open={openDesignationDropdown}
            value={designationId}
            items={designations}
            setOpen={setOpenDesignationDropdown}
            setValue={setDesignationId}
            setItems={setDesignations}
            placeholder="Select a designation"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            zIndex={2000}
            zIndexInverse={2000}
          />
        )}

        {/* Submit */}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ContactMasterForm;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F4F4F4',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 15,
    color: '#555',
  },
  input: {
    height: 48,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginTop: 8,
    fontSize: 16,
  },
  dropdown: {
    marginTop: 8,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  dropdownContainer: {
    borderColor: '#ccc',
  },
  button: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
