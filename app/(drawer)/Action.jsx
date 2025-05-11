


import { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, ScrollView, Alert
} from 'react-native';
import { API_URL } from '../../config';
import {
    fetchActions,
    saveOrUpdateAction,
    deleteAction
  } from '../../services/API';
const Actionmastercomponent = () => {
  const [Action, setAction] = useState([]);
  const [actioncode, setActioncode] = useState(null);
  const [addaction, setAddaction] = useState('');


  
  const [editaction, setEditaction] = useState(null);

//   useEffect(() => { fetchAction() }, []);

//   const fetchAction = async () => {
//     const res = await fetch(`${API_URL}/getallremark`);
//     const data = await res.json();

//     console.log(data)
//     if (res.ok) setAction(data.persons);
//   };


useEffect(() => {
    loadActions();
  }, []);

  const loadActions = async () => {
    const actions = await fetchActions();
    setAction(actions);
  };







//   const handleSubmit = async () => {
//     console.log('Submit clicked');

//     const formData = {
//       action_name: addaction,
//       actionCode: actioncode,
//     };

//     try {
//       const url = editaction
//         ? `${API_URL}/updateActions/${editaction.id}`
//         : `${API_URL}/addAction`;
//       const method = editaction ? 'PUT' : 'POST';

//       const res = await fetch(url, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });

//       const data = await res.json();
//       if (res.ok) {
//         Alert.alert('Data Added Successfully');
//         setAddaction('');
//         fetchAction();
//       } else {
//         console.log('Server error:', data);
//       }
//     } catch (err) {
//       console.error('Fetch error:', err);
//     }
//   };



const handleSubmit = async () => {
    const formData = {
      action_name: addaction,
      actionCode: actioncode,
    };

    const { ok, response } = await saveOrUpdateAction(
      formData,
      !!editaction,
      editaction?.id
    );

    if (ok) {
      Alert.alert('Success', 'Data added successfully');
      handleCancel(); // Clear form
      loadActions();  // Refresh list
    } else {
      Alert.alert('Error', 'Failed to save action');
    }
  };
  const handleEdit = (action) => {

    console.log(action)
    setAddaction(action.remark_name);
    setActioncode(action.id);
    setEditaction(action);
  };

  const handleCancel = () => {
    setAddaction('');
    setActioncode('');
    setEditaction(null);
  };

  const handleDelete = async (action) => {
    const { ok, response } = await deleteAction(action.id);

    if (ok) {
      Alert.alert('Success', 'Action deleted');
      loadActions();
    } else {
      Alert.alert('Error', 'Failed to delete action');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Action Master Form</Text>

      <TextInput
        placeholder="Enter Action"
        style={styles.input}
        value={addaction}
        onChangeText={setAddaction}
        placeholderTextColor="#999"
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>{editaction ? 'Update' : 'Submit'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.tableTitle}>Action List</Text>

      <View style={styles.tableHeader}>
        <Text style={[styles.tableCell, { flex: 1 }]}>Code</Text>
        <Text style={[styles.tableCell, { flex: 2 }]}>Name</Text>
        <Text style={[styles.tableCell, { flex: 1 }]}>Actions</Text>
      </View>

      <View style={{ height: 200 }}>
        <ScrollView>
          {Action.map((action) => (
            <View key={action.id} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 1 }]}>{action.id}</Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>{action.remark_name}</Text>
              <View style={{ flexDirection: 'row', flex: 2, justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={() => handleEdit(action)}>
                  <Text style={{ color: 'blue', paddingHorizontal: 5 }}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(action)}>
                  <Text style={{ color: 'red', paddingHorizontal: 5 }}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: '#fff',
      margin: 16,
      borderRadius: 8,
      elevation: 2,
    },
    heading: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 16,
      color: '#333',
      textAlign: 'center',
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 6,
      marginBottom: 20,
      fontSize: 16,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    buttonWrapper: {
      flex: 1,
      marginHorizontal: 5,
    },
    tableTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      marginVertical: 10,
      textAlign: 'center',
      color: '#333',
    },
    tableHeader: {
      flexDirection: 'row',
      backgroundColor: '#f2f2f2',
      paddingVertical: 10,
      paddingHorizontal: 5,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    tableRow: {
      flexDirection: 'row',
      paddingVertical: 12,
      paddingHorizontal: 5,
      borderBottomWidth: 1,
      borderColor: '#e0e0e0',
      alignItems: 'center',
    },
    tableCell: {
      fontSize: 16,
      color: '#333',
    },
    table: {
      marginBottom: 30,
    },
    picker: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 6,
      marginBottom: 20,
      paddingHorizontal: 10,
      height: 50,
      backgroundColor: '#f9f9f9',
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
  });
  

export default Actionmastercomponent;
