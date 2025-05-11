// services/contactService.js
import { API_URL } from "../config";
import * as Location from "expo-location";
export const getInquiries = async () => {
  const res = await fetch(`${API_URL}/getInquiry`);
  const data = await res.json();
  return data?.inquiries || [];
};

export const getDesignations = async () => {
  const res = await fetch(`${API_URL}/getDesignation`);
  const data = await res.json();
  return data;
};

export const addContact = async (formData) => {
  const res = await fetch(`${API_URL}/addcontectmaster`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  const data = await res.json();
  return { ok: res.ok, data };
};

//   reference

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
};

export const fetchReferences = async () => {
  try {
    const res = await fetch(`${API_URL}/getRefid`);
    return await handleResponse(res);
  } catch (error) {
    console.error("Error fetching references:", error.message);
    return []; // Return empty array on failure for safer UI rendering
  }
};

// Add new reference
export const addReference = async (referenceData) => {
  try {
    const res = await fetch(`${API_URL}/addrefrence`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(referenceData),
    });
    return await handleResponse(res);
  } catch (error) {
    console.error("Error adding reference:", error.message);
    return null;
  }
};

export const updateReference = async (id, referenceData) => {
  try {
    const res = await fetch(`${API_URL}/updateRefrence/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(referenceData),
    });
    return await handleResponse(res);
  } catch (error) {
    console.error("Error updating reference:", error.message);
    return null;
  }
};

// Delete reference
export const deleteReference = async (code) => {
  try {
    const res = await fetch(`${API_URL}/Deletedref/${code}`, {
      method: "DELETE",
    });
    return await handleResponse(res);
  } catch (error) {
    console.error("Error deleting reference:", error.message);
    return null;
  }
};

// product

export const fetchProducts = async () => {
  try {
    const res = await fetch(`${API_URL}/getProduct`);

    const data = await res.json();

    return data;
  } catch (err) {
    return [];
  }
};

export const saveProduct = async (
  productData,
  isEditing = false,
  productCode = ""
) => {
  try {
    const url = isEditing
      ? `${API_URL}/updateProduct/${productCode}`
      : `${API_URL}/addproduct`;

    const method = isEditing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });

    const result = await res.json();

    return { ok: res.ok, result };
  } catch (error) {
    console.error("❌ Error in saveProduct:", error);
    return { ok: false, result: { message: "Something went wrong." } };
  }
};

export const deleteProduct = async (productCode) => {
  try {
    const res = await fetch(`${API_URL}/DeleteProduct/${productCode}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.message || "Failed to delete product");
    }
    return data;
  } catch (err) {
    console.error("Error deleting product:", err);
    throw new Error("Failed to delete product.");
  }
};

//  citymaster apis

export const fetchState = async () => {
  const respons = await fetch(`${API_URL}/getState`);
  const data = await respons.json();
  if (data) {
    return data;
  }
};

export const fetchcitys = async () => {
  const response = await fetch(`${API_URL}/getcity`);
  const data = await response.json();
  return data;
};

export const seveandupdate = async (
  formdata,
  isEditing = false,
  newcode = ""
) => {
  try {
    const url = isEditing
      ? `${API_URL}/updatestate/${newcode}`
      : `${API_URL}/addcity`;

    const method = isEditing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formdata),
    });

    const response = await res.json();
    console.log("Server Response:", response);

    return { ok: res.ok, response: response };
  } catch (err) {
    console.log("❌ Error in seveandupdate:", err);
    return { ok: false, result: { message: "Failed to submit data" } };
  }
};

export const deleteCity = async (cityCode) => {
  try {
    const res = await fetch(`${API_URL}/Deletecity/${cityCode}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    return { ok: res.ok, response: data };
  } catch (error) {
    console.error("Error deleting city:", error);
    return { ok: false, response: { message: "Delete failed." } };
  }
};

// Statemaster

export const seveandupdatestate = async (
  formData,
  editestate = false,
  code = " "
) => {
  try {
    const url = editestate
      ? `${API_URL}/updatestate/${code}`
      : `${API_URL}/addState`;

    const method = editestate ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    return {
      ok: res.ok,
      data: data,
    };
  } catch (err) {
    console.error("Fetch error:", err);

    return [];
  }
};

export const DeleteState = async (statecode) => {
  try {
    const res = await fetch(`${API_URL}/DeleteState/${statecode}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
   
      return { ok: res.ok ,  data: data}

     
  } catch (err) {
 return []  }
};



//    Actionssss



// services/api.js


export const fetchActions = async () => {
  const res = await fetch(`${API_URL}/getallremark`);
  const data = await res.json();
  return res.ok ? data.persons : [];
};

export const saveOrUpdateAction = async (formData, isEdit, id) => {
  const url = isEdit
    ? `${API_URL}/updateActions/${id}`
    : `${API_URL}/addAction`;

  const method = isEdit ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const response = await res.json();
    return { ok: res.ok, response };
  } catch (error) {
    console.error('Save/Update Error:', error);
    return { ok: false, response: null };
  }
};

export const deleteAction = async (id) => {
  try {
    const res = await fetch(`${API_URL}/deleteAction/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await res.json();
    return { ok: res.ok, response };
  } catch (error) {
    console.error('Delete Error:', error);
    return { ok: false, response: null };
  }
};



/// apies of add- location






export const fetchCompanies = async () => {
  const response = await fetch(`${API_URL}/getInquiry`);
  const data = await response.json();
  return data.inquiries;
};

export const fetchCities = async () => {
  const response = await fetch(`${API_URL}/getcity`);
  return await response.json();
};

export const submitLocationUpdate = async (payload) => {
  const response = await fetch(`${API_URL}/postupdatelocation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  return { ok: response.ok, data };
};



// enquiryService



export const addEnquiry = async (formData) => {
  try {
    const res = await fetch(`${API_URL}/addEnquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    return { ok: res.ok, data };
  } catch (error) {
    console.error("Error adding enquiry:", error.message);
    return { ok: false, data: { message: "Failed to add enquiry." } };
  }
};




/// inquieryess 


// api.js
// export const fetchCities = async (API_URL) => {
//   try {
//     const response = await fetch(`${API_URL}/getcity`);
//     const data = await response.json();
//     if (response.ok && Array.isArray(data)) {
//       return data;
//     } else {
//       throw new Error('Failed to load city data');
//     }
//   } catch (error) {
//     throw new Error('Error fetching cities');
//   }
// };

// export const fetchProducts = async (API_URL) => {
//   try {
//     const response = await fetch(`${API_URL}/getProduct`);
//     const data = await response.json();
//     if (response.ok && Array.isArray(data)) {
//       return data;
//     } else {
//       throw new Error('Failed to load product data');
//     }
//   } catch (error) {
//     throw new Error('Error fetching products');
//   }
// };

// export const fetchReferences = async (API_URL) => {
//   try {
//     const response = await fetch(`${API_URL}/getRefid`);
//     const data = await response.json();
//     if (response.ok && Array.isArray(data)) {
//       return data;
//     } else {
//       throw new Error('Failed to load reference data');
//     }
//   } catch (error) {
//     throw new Error('Error fetching reference info');
//   }
// };

// export const fetchActions = async (API_URL) => {
//   try {
//     const response = await fetch(`${API_URL}/getallremark`);
//     const data = await response.json();
//     if (response.ok && data.persons && Array.isArray(data.persons)) {
//       return data.persons;
//     } else {
//       throw new Error('Failed to load actions');
//     }
//   } catch (error) {
//     throw new Error('Error fetching actions');
//   }
// };

export const fetchInquiries = async (API_URL) => {
  try {
    const [inquiriesRes, detailsRes] = await Promise.all([
      fetch(`${API_URL}/getInquiry`),
      fetch(`${API_URL}/getinquiryAllDetials`),
    ]);

    const inquiriesData = await inquiriesRes.json();
    const detailsData = await detailsRes.json();

    if (inquiriesRes.ok && inquiriesData?.inquiries && detailsRes.ok && Array.isArray(detailsData)) {
      return { inquiriesData, detailsData };
    } else {
      throw new Error('Failed to load inquiries');
    }
  } catch (error) {
    throw new Error('Error fetching inquiries');
  }
};

export const fetchContacts = async (API_URL) => {
  try {
    const response = await fetch(`${API_URL}/getparson`);
    const data = await response.json();
    if (response.ok && data?.persons) {
      const contactMapping = {};
      data.persons.forEach(person => {
        contactMapping[person.Code] = person.ContactNumber;
      });
      return contactMapping;
    } else {
      throw new Error('Failed to load contacts');
    }
  } catch (error) {
    throw new Error('Error fetching contact numbers');
  }
};


// EnquieryTransections





export const fetchPersons = async () => {
  const response = await fetch(`${API_URL}/getparson`);
  if (!response.ok) throw new Error('Failed to fetch inquiries');
  return response.json();
};

export const insertInquiry = async (inquiryData) => {
  const response = await fetch(`${API_URL}/insertEnquirymaster`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inquiryData),
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result?.error || 'Failed to save inquiry');
  return result;
};



export const fetchRemarks = async () => {
  const response = await fetch(`${API_URL}/getallremark`);
  if (!response.ok) throw new Error('Failed to fetch remarks');
  return response.json();
};






/// Folloup apies



// services/apiService.js

export const getInquiryTransactions = async (API_URL) => {
  try {
    const response = await fetch(`${API_URL}/getEnqiryTransections`);
    if (!response.ok) {
      throw new Error('Failed to fetch inquiry transactions');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching inquiry transactions:', error);
    throw error;
  }
};

// export const getInquiries = async (API_URL) => {
//   try {
//     const response = await fetch(`${API_URL}/getInquiry`);
//     if (!response.ok) {
//       throw new Error('Failed to fetch inquiries');
//     }
//     return response.json();
//   } catch (error) {
//     console.error('Error fetching inquiries:', error);
//     throw error;
//   }
// };

export const getRemarks = async (API_URL) => {
  try {
    const response = await fetch(`${API_URL}/getallremark`);
    if (!response.ok) {
      throw new Error('Failed to fetch remarks');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching remarks:', error);
    throw error;
  }
};

export const getContacts = async (API_URL) => {
  try {
    const response = await fetch(`${API_URL}/getparson`);
    if (!response.ok) {
      throw new Error('Failed to fetch contacts');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw error;
  }
};



/// EnquieryEditTransection




// Fetch persons (getparson endpoint)
export const fetchPersonsData = async () => {
  const response = await fetch(`${API_URL}/getparson`);
  if (!response.ok) throw new Error("Failed to fetch persons");
  const data = await response.json();
  return data.persons;
};

// Fetch product by code
export const fetchProductByCode = async (code) => {
  const response = await fetch(`${API_URL}/getProduct`);
  if (!response.ok) throw new Error("Failed to fetch products");
  const products = await response.json();
  return products.find((product) => product.code === code);
};

// Fetch remarks (getallremark endpoint)
// export const fetchRemarks = async () => {
//   const response = await fetch(`${API_URL}/getallremark`);
//   const data = await response.json();
//   if (!response.ok || !Array.isArray(data.persons)) throw new Error("Failed to fetch remarks");
//   return data.persons;
// };

// Insert Enquiry
export const insertEnquiry = async (formattedData) => {
  const response = await fetch(`${API_URL}/insertEnquirymaster`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formattedData),
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result?.error || "Insert failed");
  return result;
};





// services/api.js
export const fetchStates = async () => {
  const response = await fetch(`${API_URL}/getallStatus`);
  const data = await response.json();

  if (!response.ok || !Array.isArray(data)) {
    throw new Error("Failed to load states");
  }

  return data;
};





export const getPersonsByEnquiryCode = async (enquiryCode, requests) => {
  const response = await fetch(`${API_URL}/getparson`);
  const data = await response.json();

  if (!response.ok || !Array.isArray(data.persons)) {
    throw new Error("Failed to load persons");
  }

  const filteredRequests = requests.filter(
    (request) => Number(request.EnquiryCode) === Number(enquiryCode)
  );

  const personsList = filteredRequests.map((request) => {
    const matchingPerson = data.persons.find(
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

  return personsList;
};








// Validate if a date is valid
const isValidDate = (date) => {
  return date instanceof Date && !isNaN(date);
};

// Format a date into "HH:MM" format (for time)
const formatTime = (date) => {
  if (!isValidDate(date)) return "";
  return `${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
};

// Format a date into ISO date format "YYYY-MM-DD"
const formatDate = (date) => {
  if (!isValidDate(date)) return "";
  return date.toISOString().split("T")[0];
};

// Save Inquiry Function
export const saveEnquiry = async (
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
) => {
  try {
    console.log("function called");

    // Check if location data exists
    if (Latitude === null || longitude === null) {
      throw new Error("Location data is missing. Please check your location permissions.");
    }

    // Log each date to check which one is invalid
    console.log("followupTime:", followupTime);
    console.log("DemoTime:", DemoTime);
    console.log("calltime:", calltime);
    console.log("followupDate:", followupDate);
    console.log("Demodate:", Demodate);

    // Validate dates
    if (
      !isValidDate(followupTime) ||
      !isValidDate(DemoTime) ||
      !isValidDate(followupDate) ||
      !isValidDate(Demodate)
    ) {
      throw new Error("One or more dates are invalid");
    }

    // Format times and dates
    let formattedCallTime = "";
    if (calltime !== undefined && calltime !== null) {
      formattedCallTime = formatTime(new Date(calltime));
    }

    const formattedFollowupTime = formatTime(followupTime);
    const formattedDemoTime = formatTime(DemoTime);

    const formattedData = {
      enquiry_id: enquiryId,
      enquiry_date: formatDate(enquiryDate),
      person_id: personId,
      contact_number: contactNo,
      action_id: selectedAction,
      enquiry_status_id: selectedStateid,
      followup_date: formatDate(followupDate),
      followup_time: formattedFollowupTime,
      remark_id: Remark,
      document_uploaded: "",
      Demodate: formatDate(Demodate),
      DemoTime: formattedDemoTime,
      demoStatus: demoStatus,
      userId: userId,
      calltime: formattedCallTime,
      latitude: Latitude,
      longitude: longitude,
      location: location,
    };

    console.log("Sending Data to Backend:", formattedData);

    const response = await fetch(`${API_URL}/insertEnquirymaster`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formattedData),
    });

    const result = await response.json();

    if (response.ok) {
      return result; // Return the result if successful
    } else {
      throw new Error(result?.error || "Unknown error");
    }
  } catch (error) {
    throw new Error(error.message || "Network Error! Please check your connection and try again.");
  }
};





export const getLocation = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    console.log("Location permission status:", status);

    if (status !== "granted") {
      throw new Error("Permission to access location was denied");
    }

    console.log("Fetching location...");

    const loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    console.log("Fetched Location:", loc);

    return loc.coords; // Return coordinates for use in the component
  } catch (error) {
    console.error("Error getting location:", error.message);
    throw error; // Re-throw the error so it can be handled in the component
  }
};

// Function to get the location name using reverse geocoding
export const getLocationName = async (lat, lon) => {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "YourAppName/1.0 (your-email@example.com)", // required
        Accept: "application/json", // optional but good practice
      },
    });

    const data = await response.json();
    console.log("Data", data);

    if (data?.display_name) {
      return data.display_name; // Return location name
    } else {
      throw new Error("No location name found");
    }
  } catch (error) {
    console.error("Error fetching location name:", error);
    throw new Error("Unknown Location");
  }
};









// folloup  from





export const getInquiryTransaction = async () => {
  const response = await fetch(`${API_URL}/getEnqiryTransections`);
  return await response.json();
};

export const getInquirie = async () => {
  const response = await fetch(`${API_URL}/getInquiry`);
  return await response.json();
};

export const getRemark = async () => {
  const response = await fetch(`${API_URL}/getallremark`);
  return await response.json();
};



export const getContact = async () => {
  try {
    const response = await fetch(`${API_URL}/getparson`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data?.persons || [];
  } catch (error) {
    console.error('Error fetching contact numbers:', error.message || error);
    throw error;
  }
};



/// detailesoneperson



export const fetchActionNamesAPI = async () => {
  const response = await fetch(`${API_URL}/getallremark`);
  const result = await response.json();
  if (response.ok && result.persons && Array.isArray(result.persons)) {
    const actionMap = {};
    result.persons.forEach(item => {
      actionMap[item.id] = item.remark_name;
    });
    return actionMap;
  }
  throw new Error('Failed to fetch action names');
};

export const fetchPersonNamesAPI = async () => {
  const response = await fetch(`${API_URL}/getparson`);
  const result = await response.json();
  if (response.ok && result.persons && Array.isArray(result.persons)) {
    const personMap = {};
    result.persons.forEach(item => {
      personMap[item.EnquiryCode] = item.Name || 'N/A';
    });
    return personMap;
  }
  throw new Error('Failed to fetch person names');
};

export const fetchUserNamesAPI = async () => {
  const response = await fetch(`${API_URL}/getlogin`);
  const result = await response.json();
  if (response.ok && result.data && Array.isArray(result.data)) {
    const map = {};
    result.data.forEach(user => {
      map[user.code] = user.name;
    });
    return map;
  }
  throw new Error('Failed to fetch user names');
};

export const fetchInquiryDataAPI = async () => {
  const response = await fetch(`${API_URL}/getinquiryAllDetials`);
  const result = await response.json();
  if (response.ok && Array.isArray(result)) {
    return result;
  }
  throw new Error('Failed to fetch inquiry data');
};
