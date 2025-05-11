import React, { useEffect, useState } from "react";

import { fetchcitys, fetchState, seveandupdate ,deleteCity} from "../../services/API";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { API_URL } from "../../config";
const CityMaster = () => {
  const [city, setCity] = useState("");
  const [Cityes, setCityes] = useState([]);

  const [selectedState, setSelectedState] = useState([]);

  const [State, setState] = useState([]);

  const [statecode, setstatecode] = useState(null);

  const [citycode, setcitycode] = useState(null);
  const [editingcity, seteditingcity] = useState(null);

  //   useEffect(() => {
  //     fetchcitys();
  //     fetchState();
  //   }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      const states = await fetchState();
      const cities = await fetchcitys();
      setState(states);
      setCityes(cities);
    };
  
    loadInitialData();
  }, [Cityes]); // Only run once on mount
  
  //   const handalsubmit = async () => {

  //     const formdata = {
  //       city,
  //       statecode,
  //       citycode,
  //     };

  //     try {
  //       const url = editingcity
  //         ? `${API_URL}/updatestate/${editingcity.newcode}`
  //         : `${API_URL}/addcity`;

  //       const method = editingcity ? "PUT" : "POST";

  //       const res = await fetch(url, {
  //         method,
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(formdata),
  //       });

  //       if (!res.ok) {
  //         const errorText = await res.text();
  //         console.log("Server Error:", errorText);
  //         return;
  //       }

  //       const response = await res.json();
  //       console.log("Server Response:", response);

  //       if (response.massage) {
  //         // backend sends "massage" key
  // Alert.alert("Success", response.massage);
  // setCity("");
  // setcitycode("");
  // seteditingcity(null);
  // fetchcitys();
  //       } else {
  //         Alert.alert("Error", "Something went wrong");
  //       }
  //     } catch (err) {
  //       console.log(err);
  //       Alert.alert("Error", "Failed to submit data");
  //     }
  //   };

  const handalsubmit = async () => {
    // if (!city || !statecode || !citycode) {
    //   Alert.alert("Validation Error", "Please fill all the inputs.");
    //   return;
    // }

    const formdata = {
      city,
      statecode,
      citycode,
    };

    console.log("Submitting:", formdata);

    const { ok, response } = await seveandupdate(
      formdata,
      !!editingcity,
      editingcity?.newcode
    );

    
    if (ok && response) {
      Alert.alert("Success", response.massage);
      setCity("");
      setcitycode("");
      seteditingcity(null);
      cityload();
  // Refresh city list
    } else {
      Alert.alert("Error", response?.message || "Failed to save city.");
    }
  };

  const handleEdit = (prod) => {
    setCity(prod.cityName);
    setcitycode(prod.newcode);
    seteditingcity(prod);
  };

  const handleDelete = async (prod) => {
    const { ok, response } = await deleteCity(prod.newcode);
  
    if (ok && response.massage) {
      Alert.alert('Success', response.massage);
      cityload();

    } else {
      Alert.alert('Error', response?.message || 'Failed to delete city');
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>City Master Form</Text>

      <TextInput
        placeho
        lder="Enter city"
        style={styles.input}
        value={city}
        onChangeText={setCity}
        placeholderTextColor="#999"
      />
      <Text style={styles.label}>Select State</Text>
      <Picker
        selectedValue={selectedState}
        onValueChange={(value) => setstatecode(value)}
        style={styles.picker}
      >
        <Picker.Item label="Select a state" value="" />
        {State.map((state) => (
          <Picker.Item
            key={state.code}
            label={state.state_name}
            value={state.code}
          />
        ))}
      </Picker>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => handalsubmit()}>
          <Text style={styles.buttonText}>
            {editingcity ? "Update" : "Submit"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.cancelButton]}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.tableTitle}>City List</Text>

      <View style={styles.tableHeader}>
        <Text style={[styles.tableCell, { flex: 1 }]}>Code</Text>
        <Text style={[styles.tableCell, { flex: 2 }]}>Name</Text>
        <Text style={[styles.tableCell, { flex: 1 }]}>Actions</Text>
      </View>

      <View style={{ height: 200 }}>
        <ScrollView>
          {Cityes.map((prod) => (
            <View key={prod.id} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 1 }]}>
                {prod.newcode}
              </Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>
                {prod.cityName}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  flex: 2,
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity onPress={() => handleEdit(prod)}>
                  <Text style={{ color: "blue", paddingHorizontal: 5 }}>
                    Edit
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(prod)}>
                  <Text style={{ color: "red", paddingHorizontal: 5 }}>
                    Delete
                  </Text>
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
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 8,
    elevation: 2,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 20,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
  tableTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
    color: "#333",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",
    alignItems: "center",
  },
  tableCell: {
    fontSize: 16,
    color: "#333",
  },
  table: {
    marginBottom: 30,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginBottom: 20,
    paddingHorizontal: 10,
    height: 50,
    backgroundColor: "#f9f9f9",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  button: {
    flex: 1,
    backgroundColor: "#3498db",
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#e74c3c",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CityMaster;
