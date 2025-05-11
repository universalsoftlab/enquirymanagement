
import React, { useEffect, useState } from 'react';
import {
  Alert,
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {
  fetchReferences,
  addReference,
  updateReference,
  deleteReference,
} from '../../services/API'

const Ref = () => {
  const [references, setReferences] = useState([]);


  const [refrencename, setRefrencename] = useState('');
  const [editingReference, setEditingReference] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadReferences = async () => {
    setLoading(true);
    const data = await fetchReferences();

    setReferences(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadReferences();
  }, []);

  const handleSubmit = async () => {
    const formdata = { refrenceName: refrencename };

    try {
      if (editingReference) {
        await updateReference(editingReference.id, formdata);
        Alert.alert('Success', 'Reference updated successfully!');
      } else {
        await addReference(formdata);
        Alert.alert('Success', 'Reference added successfully!');
      }

      setRefrencename('');
      setEditingReference(null);
      loadReferences();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to add or update reference.');
    }
  };

  const handleCancel = () => {
    setRefrencename('');
    setEditingReference(null);
    Alert.alert('Cancelled', 'Reference input cleared.');
  };

  const handleEdit = (ref) => {
    setRefrencename(ref.Refrance_name);
    setEditingReference(ref);
  };

  const handleDeleteBtn = async (ref) => {
    try {
      await deleteReference(ref.code);
      Alert.alert('Success', 'Reference deleted successfully');
      load();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to delete reference');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter reference"
        value={refrencename}
        onChangeText={setRefrencename}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>{editingReference ? 'Update' : 'Submit'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.tableTitle}>Reference Table:</Text>

      <View style={styles.tableHeader}>
        <Text style={[styles.tableCell, { flex: 1 }]}>Code</Text>
        <Text style={[styles.tableCell, { flex: 3 }]}>Reference Name</Text>
        <Text style={[styles.tableCell, { flex: 2 }]}>Action</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#3498db" />
      ) : (
        <ScrollView style={styles.table}>
          {references.map((ref) => (
            <View key={ref.id} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 1 }]}>{ref.code}</Text>
              <Text style={[styles.tableCell, { flex: 3 }]}>{ref.Refrance_name}</Text>
              <View style={{ flexDirection: 'row', flex: 2 }}>
                <TouchableOpacity onPress={() => handleEdit(ref)}>
                  <Text style={{ color: 'blue', paddingHorizontal: 5 }}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteBtn(ref)}>
                  <Text style={{ color: 'red', paddingHorizontal: 5 }}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default Ref;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    fontSize: 16,
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  table: {
    flex: 1,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  tableCell: {
    fontSize: 16,
  },
});
