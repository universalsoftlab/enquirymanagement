import React, { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import {
    fetchProducts,
    fetchReferences,
    fetchState,
    fetchcitys,
    addEnquiry,
  } from '../../../services/API';
  
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DatePicker from "react-native-date-picker";
import { API_URL } from "../../../config";
import * as Location from "expo-location"; // Import Expo's Location API

const AddEnquiryForm = () => {
  // State variables for form inputs
  const [product, setProduct] = useState("");
  const [refName, setRefName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [contactType, setContactType] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [addressType, setAddressType] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [narration, setNarration] = useState("");
  const [products, setProducts] = useState([]);
  const [references, setReferences] = useState([]);
  const [states, setStates] = useState([]);
  const [citys, setCitys] = useState([]);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [isValid, setIsValid] = useState(true);
  const [date, setDate] = useState(new Date());
  const [followUpDate, setFollowUpDate] = useState(new Date());
  const [followUpTime, setFollowUpTime] = useState("12:00"); // Default time
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [openFollowUpDatePicker, setOpenFollowUpDatePicker] = useState(false);
  const [openFollowUpTimePicker, setOpenFollowUpTimePicker] = useState(false);

  const formatDate = (date) => {
    if (!(date instanceof Date) || isNaN(date)) {
      return "";
    }
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    fetchProducts().then(setProducts).catch(console.error);
    fetchReferences().then(setReferences).catch(console.error);
    fetchState().then(setStates).catch(console.error);
    fetchcitys().then(setCitys).catch(console.error);
  }, []);
  
  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      alert("Permission Denied", "Cannot access location.");
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
      alert(
        `Location fetched successfully!\nLatitude: ${location.coords.latitude}\nLongitude: ${location.coords.longitude}`
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = () => {
    if (latitude === null || longitude === null) {
      alert("Please fetch your location before submitting the form.");
      return;
    }

    const formData = {
      productCode: product,
      customerName,
      CompanyName: companyName,
      stateCode: state,
      cityCode: city,
      codeStatus: "Active",
      enquiryDate: formatDate(date),
      refId: refName,
      contactType,
      contactNumber,
      addressType,
      address,
      followUpDate: formatDate(followUpDate),
      followUpTime,
      narration,
      latitude,
      longitude,
    };

    fetch(`${API_URL}/addEnquiry`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Enquiry added successfully") {
          alert("Form Submitted Successfully");
          setProduct("");
          setRefName("");
          setCompanyName("");
          setCustomerName("");
          setContactType("");
          setContactNumber("");
          setAddressType("");
          setAddress("");
          setState("");
          setCity("");
          setNarration("");
          setDate(new Date());
          setFollowUpDate(new Date());
          setFollowUpTime("12:00");
        } else {
          alert("Failed to add enquiry");
        }
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
        alert("There was an error submitting the form.");
      });
  };

  const handleBlur = () => {
    if (contactNumber.length !== 10 || !/^\d{10}$/.test(contactNumber)) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Add Enquiry Form</Text>
      </View>

      {/* Date Picker */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Date:</Text>
        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => setOpenDatePicker(true)}
        >
          <Text style={styles.dateText}>{formatDate(date)}</Text>
          <Icon name="calendar" size={20} color="gray" style={styles.icon} />
        </TouchableOpacity>
      </View>
      <DatePicker
        modal
        open={openDatePicker}
        date={date}
        mode="date"
        onConfirm={(selectedDate) => {
          setOpenDatePicker(false);
          setDate(selectedDate);
        }}
        onCancel={() => setOpenDatePicker(false)}
      />

      {/* Customer Name */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Customer Name</Text>
        <TextInput
          style={styles.input}
          value={customerName}
          placeholder="Enter Customer Name"
          onChangeText={setCustomerName}
        />
      </View>

      {/* Product Dropdown */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Product</Text>
        <Picker
          selectedValue={product}
          style={styles.picker}
          onValueChange={setProduct}
        >
          <Picker.Item label="Select Product" value="" />
          {products.map((productItem) => (
            <Picker.Item
              key={productItem.id}
              label={productItem.product_name}
              value={productItem.code}
            />
          ))}
        </Picker>
      </View>

      {/* Reference Name Dropdown */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Reference Name</Text>
        <Picker
          selectedValue={refName}
          style={styles.picker}
          onValueChange={setRefName}
        >
          <Picker.Item label="Select Reference" value="" />
          {references.map((reference) => (
            <Picker.Item
              key={reference.id}
              label={reference.Refrance_name}
              value={reference.id}
            />
          ))}
        </Picker>
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Company Name</Text>
        <TextInput
          style={styles.input}
          value={companyName}
          placeholder="Enter Company Name"
          onChangeText={setCompanyName}
        />
      </View>

      {/* Contact Type Dropdown */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Contact Type</Text>
        <Picker
          selectedValue={contactType}
          style={styles.picker}
          onValueChange={(itemValue) => setContactType(itemValue)}
        >
          <Picker.Item label="Select Contact Type" value="" />
          <Picker.Item label="Landline" value="Landline" />
          <Picker.Item label="Phone" value="phone" />
        </Picker>
      </View>

      {/* Contact Number */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Contact Number</Text>
        <TextInput
          style={[styles.input, !isValid && styles.invalidInput]}
          value={contactNumber}
          placeholder="Enter Contact Number"
          keyboardType="phone-pad"
          maxLength={10}
          onChangeText={setContactNumber}
          onBlur={handleBlur}
        />
        {!isValid && (
          <Text style={styles.errorText}>
            Please enter a valid 10-digit contact number
          </Text>
        )}
      </View>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Address Type</Text>
        <Picker
          selectedValue={addressType}
          style={styles.picker}
          onValueChange={(itemValue) => setAddressType(itemValue)}
        >
          <Picker.Item label="Select Address Type" value="" />
          <Picker.Item label="Work" value="work" />
          <Picker.Item label="Residence" value="residence" />
          <Picker.Item label="Factory" value="factory" />
        </Picker>
      </View>
      {/* Address */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          value={address}
          placeholder="Enter Address"
          onChangeText={setAddress}
        />
      </View>

      {/* State Dropdown */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>State</Text>
        <Picker
          selectedValue={state}
          style={styles.picker}
          onValueChange={(itemValue) => setState(itemValue)}
        >
          <Picker.Item label="Select State" value="" />
          {states.map((stateItem) => (
            <Picker.Item
              key={stateItem.id}
              label={stateItem.state_name}
              value={stateItem.code}
            />
          ))}
        </Picker>
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Cityes</Text>
        <Picker
          selectedValue={city}
          style={styles.picker}
          onValueChange={(itemValue) => setCity(itemValue)}
        >
          <Picker.Item label="Select State" value="" />
          {citys.map((cityItem) => (
            <Picker.Item
              key={cityItem.id}
              label={cityItem.cityName}
              value={cityItem.newcode}
            />
          ))}
        </Picker>
      </View>

      {/* Follow-up Date Picker */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Follow-up Date:</Text>
        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => setOpenFollowUpDatePicker(true)}
        >
          <Text style={styles.dateText}>{formatDate(followUpDate)}</Text>
          <Icon name="calendar" size={20} color="gray" style={styles.icon} />
        </TouchableOpacity>
      </View>
      <DatePicker
        modal
        open={openFollowUpDatePicker}
        date={followUpDate instanceof Date ? followUpDate : new Date()} // Ensure it's a Date object
        mode="date"
        onConfirm={(selectedDate) => {
          setOpenFollowUpDatePicker(false);
          setFollowUpDate(selectedDate); // Store as Date object
        }}
        onCancel={() => setOpenFollowUpDatePicker(false)}
      />

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Follow-up Time:</Text>
        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => setOpenFollowUpTimePicker(true)}
        >
          <Text>{followUpTime}</Text>
        </TouchableOpacity>
        <DatePicker
          modal
          open={openFollowUpTimePicker}
          date={new Date()}
          mode="time"
          is24hourSource="locale"
          onConfirm={(date) => {
            const formattedTime = date.toTimeString().slice(0, 5); // Format HH:mm
            setFollowUpTime(formattedTime);
            setOpenFollowUpTimePicker(false);
          }}
          onCancel={() => setOpenFollowUpTimePicker(false)}
        />
      </View>

      {/* Narration */}
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Narration</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          value={narration}
          placeholder="Enter Narration"
          multiline
          onChangeText={setNarration}
        />
      </View>
      {/* Submit Button */}
      <View style={styles.buttonWrapper}>
        <Button title="Get Location" onPress={getLocation} />
      </View>

      <View style={styles.buttonWrapper}>
        <Button title="Submit" onPress={handleSubmit} />
      </View>

      {/* Cancel Button */}
      <View style={styles.buttonWrapper}>
        <Button
          title="Cancel"
          color="red"
          onPress={() => alert("Form Cancelled")}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: "#f8f8f8" },
  header: { alignItems: "center", marginBottom: 20 },
  headerText: { fontSize: 24, fontWeight: "bold", color: "#333" },
  inputWrapper: { marginBottom: 15 },
  label: { fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 10 },
  input: {
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  picker: {
    height: 55,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  buttonWrapper: { marginTop: 20 },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
    height: 45,
  },
  icon: { marginLeft: 191 },
  errorText: { color: "red", fontSize: 12 },
  invalidInput: { borderColor: "red" },
});

export default AddEnquiryForm;
``;
