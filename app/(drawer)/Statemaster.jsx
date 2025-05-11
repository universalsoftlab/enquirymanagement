import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { API_URL } from "../../config";

import { fetchState, seveandupdatestate } from "../../services/API";
const Statmaster = () => {
  const [State, SetState] = useState([]);
  const [statecode, setStatecode] = useState(null);
  const [addsetate, setaddsetate] = useState("");
  const [editestate, setediteState] = useState(null);

  useEffect(() => {
    const stateload = async () => {
      const States = await fetchState();
      SetState(States);
    };
    stateload();
  }, [State]);

  const handalsubmit = async () => {
 

    const formData = {
      state_name: addsetate,
      stateCode: statecode,
    };

    const { ok, data } = await seveandupdatestate(
      formData,
      !!editestate,
      editestate?.code
    );

    if (ok && data) {
      Alert.alert("Data Added Successfully");
      setaddsetate("");
      fetchState();
    } else {
      console.log("Server error:", data);
      fetchState();
    }

    
  };

  const handalEdit = (states) => {
    console.log(states);
    setaddsetate(states.state_name);
    setStatecode(states.code);
    setediteState(states);
  };

  const handlecancel = () => {
    setaddsetate("");
    setStatecode("");
    setediteState(null);
  };

  const handalDelete = async (states) => {
    console.log("deleted clicked");
    const code = states.code;
    try {
      const res = await fetch(`${API_URL}/DeleteState/${code}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      console.log("deleted", data);

      if (res) {
        Alert.alert("State Deleted");
        fetchState();
        editestate(null);
        setaddsetate("");
      } else {
        Alert.alert("Error");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>State Master Form</Text>

      <TextInput
        placeholder="Enter State"
        style={styles.input}
        value={addsetate}
        onChangeText={setaddsetate}
        placeholderTextColor="#999"
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => handalsubmit()}>
          <Text style={styles.buttonText}>
            {editestate ? "Update" : "Submit"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => handlecancel()}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.tableTitle}>State List</Text>

      <View style={styles.tableHeader}>
        <Text style={[styles.tableCell, { flex: 1 }]}>Code</Text>
        <Text style={[styles.tableCell, { flex: 2 }]}>Name</Text>
        <Text style={[styles.tableCell, { flex: 1 }]}>Actions</Text>
      </View>

      <View style={{ height: 200 }}>
        <ScrollView>
          {State.map((states) => (
            <View key={states.id} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 1 }]}>{states.code}</Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>
                {states.state_name}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  flex: 2,
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity onPress={() => handalEdit(states)}>
                  <Text style={{ color: "blue", paddingHorizontal: 5 }}>
                    Edit
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handalDelete(states)}>
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
export default Statmaster;
