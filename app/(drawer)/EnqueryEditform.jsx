import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  fetchPersonsData,
  fetchProductByCode,
  fetchActions,
  insertEnquiry,

  fetchStates,
  getPersonsByEnquiryCode,
  saveEnquiry,
  getLocation,
  getLocationName,
} from "../../services/API";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import DatePicker from "react-native-date-picker";
import { Picker } from "@react-native-picker/picker";
import * as Location from "expo-location"; // ✅ Correct for Expo
import { useLocalSearchParams } from "expo-router";
import { API_URL } from "../../config";
import Icon from "react-native-vector-icons/FontAwesome";
import { Platform } from "react-native";
const InquiryForm = () => {
  const { inquiry, item, calltime, userid } = useLocalSearchParams();
  const parsedInquiry = inquiry ? JSON.parse(inquiry) : null;
  const parsedItem = item
    ? typeof item === "string"
      ? JSON.parse(item)
      : item
    : null;
  const navigation = useNavigation();
  const [location, setLocation] = useState("");

  const [Latitude, setLatitude] = useState(null);
  const [longitude, setlongitude] = useState(null);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [enquiryId, setEnquirId] = useState("");
  const [company, setcompany] = useState("");
  const [enquirDate, setEnquirDate] = useState("");

  // 📆 Date Picker States
  const [enquiryDate, setEnquiryDate] = useState(new Date());
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [persons, setPersons] = useState([]);

  const [baseUrl, setBaseUrl] = useState(null);

  const [productName, setProductName] = useState("");
  const [productId, setProductId] = useState();
  // 🔻 Enquiry Status Dropdown
  const [enquiryStatus, setEnquiryStatus] = useState("");

  // 🗓 Follow-up Date States
  const [followupDate, setFollowupDate] = useState(new Date());
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const [Demodate, setDemodate] = useState(new Date());

  // ⏰ Follow-up Time States
  const [followupTime, setFollowupTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [DemoTime, setDemoTime] = useState(new Date());
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
  // const [remark, setRemark] = useState(inquiry.remark || '');
  const [Remark, setRemark] = useState("");

  const [personName, setPersonName] = useState("");
  const [personId, setPersonId] = useState("");

  const [contactNo, setContactNo] = useState("");
  const [address, setAddress] = useState("");
  const [Action, setAction] = useState([]);

  const [selectedAction, setSelectedAction] = useState("");

  const [states, setStates] = useState([]); // 🏷 States List State
  const [selectedState, setSelectedState] = useState("");
  const [selectedStateid, setSelectedStateid] = useState();
  const [requests, setRequests] = useState([]);
  const [demoCompleted, setDemoCompleted] = useState("No"); // default is "No"
  const [demoStatus, setDemoStatus] = useState("Inactive");
  const [calltimevar, setcalltime] = useState("");
  const [userId, setuserId] = useState("");
  const [followupDateValue, setFollowupDateValue] = useState(new Date());
  const [followupTimeValue, setFollowupTimeValue] = useState(new Date());

  const [isFollowupDatePickerVisible, setIsFollowupDatePickerVisible] =
    useState(false);
  const [isFollowupTimePickerVisible, setIsFollowupTimePickerVisible] =
    useState(false);

  const [demoDateValue, setDemoDateValue] = useState(new Date());
  const [demoTimeValue, setDemoTimeValue] = useState(new Date());

  const [isDemoDatePickerVisible, setIsDemoDatePickerVisible] = useState(false);
  const [isDemoTimePickerVisible, setIsDemoTimePickerVisible] = useState(false);

  useEffect(() => {
    const inquiryData = parsedInquiry || parsedItem;

    if (inquiryData) {
      // Setting Enquiry ID
      if (inquiryData.code || inquiryData.EnquiryCode) {
        setEnquirId(
          inquiryData.code?.toString() || inquiryData.EnquiryCode?.toString()
        );
      }

      // Setting Company Name
      if (inquiryData.companyName) {
        setcompany(inquiryData.companyName);
      }

      // Setting Enquiry Date
      if (inquiryData.enquiryDate || inquiryData.EnquiryDate) {
        setEnquirDate(
          new Date(inquiryData.enquiryDate || inquiryData.EnquiryDate)
            .toISOString()
            .split("T")[0]
        );
      }

      // Setting Enquiry Status
      if (inquiryData.enquiryStatus) {
        setEnquiryStatus(inquiryData.enquiryStatus);
      }
    }
  }, [parsedInquiry, parsedItem]);

  // Handle calltime and userId in one useEffect
  useEffect(() => {
    if (calltime) setcalltime(calltime);
    if (userid) setuserId(userid);
  }, [calltime, userid]);

  // Load persons and remarks once
  useEffect(() => {
    loadPersons();
    loadRemarks();
  }, []); // Only runs once on mount

  // Get location on mount
  useEffect(() => {
    getLocation();
  }, []);

  const loadPersons = async () => {
    const persons = await fetchPersonsData();
    if (persons) setRequests(persons);
  };

  const loadRemarks = async () => {
    const remarks = await fetchActions();
    console.log("remarksssss", remarks);

    if (Array.isArray(remarks)) {
      setAction(remarks); // Only set it if it's an array
    } else {
      console.error("Fetched remarks is not an array.");
    }
  };

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        // Get coordinates
        const coords = await getLocation();
        setLatitude(coords.latitude);
        setlongitude(coords.longitude);

        // Get location name if coordinates are available
        if (coords.latitude && coords.longitude) {
          const locationName = await getLocationName(
            coords.latitude,
            coords.longitude
          );
          setLocation(locationName);
        } else {
          setLocation("Unknown Location");
        }
      } catch (error) {
        console.error("Error fetching location data:", error);
        alert("Error fetching location: " + error.message);
        setLocation("Unknown Location");
      }
    };

    fetchLocationData();
  }, []);

  const handleSave = async () => {
    try {
      const result = await saveEnquiry(
        enquiryId,
        enquiryDate,
        personId,
        contactNo,
        selectedAction,
        selectedStateid,
        followupDate,
        followupTime,
        Remark,
        Demodate,
        DemoTime,
        demoStatus,
        userId,
        calltime,
        Latitude,
        longitude,
        location
      );

      console.log("API Response:", result);

      alert("🎉 Inquiry saved successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("❌ Error inside handleSave:", error);
      alert(error.message || "An error occurred while saving the enquiry.");
    }
  };

  useEffect(() => {
    if (!parsedInquiry || !requests || requests.length === 0) return;

    const fetchData = async () => {
      try {
        const personsList = await getPersonsByEnquiryCode(
          parsedInquiry.code,
          requests
        );

        if (personsList.length === 0) {
          console.warn(
            "No matching requests found for company:",
            parsedInquiry.companyName
          );
        }

        setPersons(personsList);
      } catch (error) {
        console.error("Fetch error:", error);
        Alert.alert("Error", "Unable to fetch persons: " + error.message);
      }
    };

    fetchData();
  }, [parsedInquiry, requests]);

  useEffect(() => {
    if (!parsedItem || !requests || requests.length === 0) return;

    const filteredRequests = requests.filter(
      (request) => request.EnquiryCode === parsedItem.code
    );

    if (filteredRequests.length === 0) {
      console.warn("No matching requests for company:", inquiry?.companyName);
      return;
    }

    const getPersonsWithContactInfo = async () => {
      try {
        const personsData = await fetchPersonsData();

        const merged = filteredRequests.map((request) => {
          const matchingPerson =
            personsData.find(
              (person) =>
                Number(person.EnquiryCode) === Number(request.EnquiryCode)
            ) ||
            personsData.find(
              (person) =>
                Number(person.EnquiryCode) === Number(request.EnquiryCode)
            );

          return {
            id: request.id,
            name: request.Name,
            contact: matchingPerson?.ContactNumber || "No Contact",
            address: matchingPerson?.Address || "No Address",
          };
        });

        setPersons(merged);
      } catch (error) {
        console.error("❌ Fetch error:", error);
        Alert.alert("Error", "Unable to fetch persons: " + error.message);
      }
    };

    getPersonsWithContactInfo();
  }, [parsedItem, requests]);

  useEffect(() => {
    if (personId) {
      // Ensure personId is selected
      const selectedPerson = persons.find((person) => person.id === personId);
      if (selectedPerson) {
        setContactNo(selectedPerson.contact || "");
        setAddress(selectedPerson.address || "");
      }
    }
  }, [personId, persons]); // Runs when personId or persons list changes
  // Runs when personId or persons list changes

  useEffect(() => {
    const loadProduct = async () => {
      const productCode =
        (parsedInquiry && parsedInquiry.productCode) ||
        (parsedItem && parsedItem.productCode);

      if (!productCode) {
        console.error("No product code found in inquiry or item");
        return;
      }

      try {
        const product = await fetchProductByCode(productCode);
        setProductName(product.product_name);
        setProductId(product.code);
      } catch (error) {
        console.error("Fetch Product Error:", error.message);
        Alert.alert("Error", "Unable to fetch product: " + error.message);
        setProductName("Unknown Product");
      }
    };

    if (
      (parsedInquiry && parsedInquiry.productCode) ||
      (parsedItem && parsedItem.productCode)
    ) {
      loadProduct();
    }
  }, [parsedInquiry, parsedItem]);

  useEffect(() => {
    const loadStates = async () => {
      try {
        const data = await fetchStates();
        setStates(data);
      } catch (error) {
        console.error("Error fetching states:", error);
        Alert.alert("Error", "Unable to fetch states: " + error.message);
      }
    };

    loadStates();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <Text style={styles.headerText}>Edit Inquiry</Text>

      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateText}>
            {selectedDate.toLocaleDateString()}
          </Text>
          <Icon name="calendar" size={24} color="#007bff" />
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowDatePicker(false);
              if (date) {
                setSelectedDate(date);
              }
            }}
          />
        )}

        {/* 📌 Inquiry ID */}
        <TextInput
          style={styles.input}
          value={enquiryId}
          placeholder="Enquiry ID"
          editable={false}
        />

        {/* 📌 Company Name */}
        <TextInput
          style={styles.input}
          value={company}
          placeholder="Company Name"
          editable={false}
        />

        <TextInput
          style={styles.input}
          value={enquirDate}
          onChangeText={setEnquirDate}
          placeholder="Enquiry Date"
          editable={false}
        />

        {/* 🔻 Person Name Dropdown */}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={personName}
            onValueChange={(itemValue) => setPersonId(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Person" value="" />
            {persons.map((person, index) => (
              <Picker.Item key={index} label={person.name} value={person.id} />
            ))}
          </Picker>
        </View>
        <TextInput
          style={styles.input}
          value={productName}
          onChangeText={setProductName}
          placeholder="Product Name"
          editable={false}
        />

        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="Address"
          editable={false}
        />
        <TextInput
          style={styles.input}
          value={contactNo}
          onChangeText={setContactNo}
          placeholder="Contact No"
          keyboardType="phone-pad"
          editable={false}
        />

        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setIsFollowupDatePickerVisible(true)}
          >
            <Text style={styles.dateText}>
              {followupDateValue.toDateString()}
            </Text>
            <Icon name="calendar" size={24} color="#007bff" />
          </TouchableOpacity>

          {isFollowupDatePickerVisible && (
            <DateTimePicker
              value={followupDateValue}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selectedDate) => {
                setIsFollowupDatePickerVisible(false);
                if (selectedDate) setFollowupDateValue(selectedDate);
              }}
            />
          )}

          {/* ⏰ Follow-up Time Picker */}
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setIsFollowupTimePickerVisible(true)}
          >
            <Text style={styles.dateText}>
              {followupTimeValue.getHours().toString().padStart(2, "0")}:
              {followupTimeValue.getMinutes().toString().padStart(2, "0")}
            </Text>
            <Icon name="clock-o" size={24} color="#007bff" />
          </TouchableOpacity>

          {isFollowupTimePickerVisible && (
            <DateTimePicker
              value={followupTimeValue}
              mode="time"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selectedTime) => {
                setIsFollowupTimePickerVisible(false);
                if (selectedTime) setFollowupTimeValue(selectedTime);
              }}
            />
          )}
        </View>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedAction}
            onValueChange={(itemValue) => setSelectedAction(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Action" value="" />
            {Action.map((Action, index) => (
              <Picker.Item
                key={index}
                label={Action.remark_name}
                value={Action.id}
              />
            ))}
          </Picker>
        </View>

        {Action.find((action) => action.id === selectedAction)?.remark_name ===
          "Demo " && (
          <View style={styles.inputContainer}>
            {/* 📅 Demo Date Picker */}
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setIsDemoDatePickerVisible(true)}
            >
              <Text style={styles.dateText}>
                {demoDateValue.toDateString()}
              </Text>
              <Icon name="calendar" size={24} color="#007bff" />
            </TouchableOpacity>

            {isDemoDatePickerVisible && (
              <DateTimePicker
                value={demoDateValue}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, selectedDate) => {
                  setIsDemoDatePickerVisible(false);
                  if (selectedDate) setDemoDateValue(selectedDate);
                }}
              />
            )}

            {/* ⏰ Demo Time Picker */}
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setIsDemoTimePickerVisible(true)}
            >
              <Text style={styles.dateText}>
                {demoTimeValue.getHours().toString().padStart(2, "0")}:
                {demoTimeValue.getMinutes().toString().padStart(2, "0")}
              </Text>
              <Icon name="clock-o" size={24} color="#007bff" />
            </TouchableOpacity>

            {isDemoTimePickerVisible && (
              <DateTimePicker
                value={demoTimeValue}
                mode="time"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, selectedTime) => {
                  setIsDemoTimePickerVisible(false);
                  if (selectedTime) setDemoTimeValue(selectedTime);
                }}
              />
            )}
          </View>
        )}

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={demoCompleted}
            onValueChange={(itemValue) => {
              setDemoCompleted(itemValue);
              setDemoStatus(itemValue === "Yes" ? "Active" : "Inactive"); // 👈 update status here
            }}
            style={styles.picker}
          >
            <Picker.Item label="No" value="No" />
            <Picker.Item label="Yes" value="Yes" />
          </Picker>
        </View>

        <TextInput
          style={styles.input}
          value={Remark}
          onChangeText={setRemark}
          placeholder="remark"
        />

        {/* 🔻 Status Dropdown */}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedState}
            onValueChange={(itemValue) => setSelectedStateid(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Enquiry Status" value="" />
            {states.map((state) => (
              <Picker.Item
                key={state.id}
                label={state.status}
                value={state.id}
              />
            ))}
          </Picker>
        </View>
      </View>

      {/* Save & Cancel Buttons - N     ow Fixed */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.button, styles.saveButton]}
          onPress={handleSave}
        >
          <Text style={styles.buttonText}>✔ Save</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}> ✖ Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// 🎨 Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f8ff" },
  scrollContent: { padding: 20 },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007bff",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: { backgroundColor: "#fff", padding: 15, borderRadius: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    marginBottom: 10,
  },
  dateText: { fontSize: 16 },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  picker: { height: 50, width: "100%" },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  saveButton: { backgroundColor: "#28a745" },
  cancelButton: { backgroundColor: "#dc3545" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  viewButton: {
    backgroundColor: "#17a2b8",
  },
  detailButton: {
    backgroundColor: "#6610f2",
  },
});

export default InquiryForm;
