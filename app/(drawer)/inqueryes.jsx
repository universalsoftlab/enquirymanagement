

// // import React, {useState, useEffect} from 'react';
// import { useRouter } from 'expo-router';
// import React, { useState, useEffect, useRef } from 'react'; // <-- useRef added

// import {
//   StyleSheet,
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   Linking,
// } from 'react-native';
// import {Picker} from '@react-native-picker/picker';
// import DatePicker from 'react-native-date-picker';
// import {useNavigation} from '@react-navigation/native';
// // import { getLoggedInUserId } from './Authoticatuser';
// import { API_URL } from '../../config';
// import { 
 
//   fetchCities,
//   fetchContacts,
//   fetchActions,
//   fetchProducts,
//   fetchReferences,
//   fetchInquiries
// } from '../../services/API'; 
// const Inquiries = () => {

//   const [baseUrl, setBaseUrl] = useState(null);
//   const [filter, setFilter] = useState('All');

//   const [dropdownFilter, setDropdownFilter] = useState('All');
//   const [selectedCity, setSelectedCity] = useState(null);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
//   const [inquiries, setInquiries] = useState([]);

//   const [cities, setCities] = useState([]);
//   const [actions, setActions] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [references, setReferences] = useState([]);


//   const [contactMap, setContactMap] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [userid, setuserid] = useState(null)
//   const [calltime, setcalltime] = useState(null)


//   const navigation = useNavigation();
//   const router = useRouter();



//   useEffect(() => {
//     if (API_URL) {
//       // Fetch required data
//       fetchCities(API_URL).then(setCities).catch(setError);
//       fetchContacts(API_URL).then(setContactMap).catch(setError);
//       fetchActions(API_URL).then(setActions).catch(setError);
//       fetchProducts(API_URL).then(setProducts).catch(setError);
//       fetchReferences(API_URL).then(setReferences).catch(setError);
//     }
//   }, [API_URL]);


//   useEffect(() => {
//     if (API_URL && cities.length > 0) {
//       // Fetch inquiries once cities are loaded
//       fetchInquiries(API_URL)
//         .then(({ inquiriesData, detailsData }) => {
//           const updatedInquiries = inquiriesData.inquiries.map(inquiry => {
//             const matchingDetails = detailsData.filter(
//               d => String(d.EnquiryCode) === String(inquiry.code) && d.action_id !== null
//             );

//             const detail = matchingDetails.sort((a, b) => b.id - a.id)[0] || null;
//             const city = cities.find(c => Number(c.newcode) === Number(inquiry.cityCode));
//             const action = actions.find(act => act.id === detail?.action_id);

//             return {
//               ...inquiry,
//               action_id: detail?.action_id || null,
//               cityName: city?.cityName || 'Unknown City',
//               type: action?.remark_name || 'Unknown Type',
//               followUpDate: detail?.FollowDate || null,
//               followUpTime: detail?.FollowTime || null,
//               actionName: action?.remark_name || null,
//               remark: detail?.remark || detail?.Narration || null,
//               DemoDate: detail?.DemoDate || null,
//               DemoStatus: detail?.DemoStatus || null,
//             };
//           });

//           setInquiries(updatedInquiries);
//         })
//         .catch(() => setError('Failed to load inquiries'))
//         .finally(() => setLoading(false));
//     }
//   }, [API_URL, cities, actions]);
 

//   const makeCall = async inquiryId => {
//     const phoneNumber = contactMap[inquiryId];
//     if (!phoneNumber) {
//       alert('Phone number not available');
//       return;
//     }
  
//     try {
//       const userId = await getLoggedInUserId();
//       const callTime = new Date().toISOString();
//       setuserid(userId)
//       setcalltime(callTime)
//       // 🟡 Log info instead of sending to backend
     

   
//     } catch (error) {
//       console.error('Error getting user info for call log:', error);
//     }
  
//     // ✅ Make the actual call
//     Linking.openURL(`tel:${phoneNumber}`).catch(err =>
//       console.error('Error making call:', err),
//     );
//   };

//   const openWhatsApp = inquiryId => {
//     const phoneNumber = contactMap[inquiryId];
//     if (!phoneNumber) {
//       alert('Phone number not available');
//       return;
//     }
//     Linking.openURL(`whatsapp://send?phone=${phoneNumber}`).catch(() => {
//       alert('WhatsApp is not installed');
//     });
//   };

//   const handleDropdownChange = value => {
//     setDropdownFilter(value);
//     if (value === 'Date') {
//       setIsDatePickerOpen(true);
//     } else if (value === 'City') {
//       setSelectedCity(null);
//     }
//   };

//   const handleDateConfirm = (date) => {
//     setIsDatePickerOpen(false);
//     setSelectedDate(date.toISOString().split('T')[0]);
//   };


//   // console.log("inquiry",inquiries)
//   const filteredInquiries = inquiries.filter(inquiry => {

 
//     if (filter === "Demoscheduale") {
    
//       const isValidDate = inquiry.DemoDate && inquiry.DemoDate !== null  && inquiry.DemoDate !== '0000-00-00';

//       return isValidDate && inquiry.DemoStatus === 'Inactive' && inquiry.DemoStatus !== null  ;
//     }

//     if (filter === "Democompleted") {
    

//       return inquiry.DemoStatus === 'Active' && inquiry.DemoStatus !== null  ;
//     }
  

    
//     if (filter !== 'All' && inquiry.type !== filter) return false;
//     if (
//       dropdownFilter === 'City' &&
//       selectedCity &&
//       inquiry.cityCode !== selectedCity
//     )
//       return false;

//     const inquiryDate = inquiry.enquiryDate?.split('T')[0];
//     if (
//       dropdownFilter === 'Date' &&
//       selectedDate &&
//       inquiryDate !== selectedDate
//     )
//       return false;

//     return true;
//   });
// // console.log("filteredalll ",filteredInquiries)
//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.titleText}>Universal Soft Lab</Text>

//       <View style={styles.pickerContainer}>
//         <Picker
//           selectedValue={dropdownFilter}
//           style={styles.picker}
//           onValueChange={handleDropdownChange}>
//           <Picker.Item label="All" value="All" />
//           <Picker.Item label="City" value="City" />
//           <Picker.Item label="Date" value="Date" />
//         </Picker>
//       </View>

//       {dropdownFilter === 'City' && (
//         <View style={styles.pickerContainer}>
//           <Picker
//             selectedValue={selectedCity}
//             style={styles.picker}
//             onValueChange={cityCode => setSelectedCity(cityCode)}>
//             <Picker.Item label="All Cities" value={null} />
//             {cities.map(city => (
//               <Picker.Item
//                 key={city.newcode}
//                 label={city.cityName}
//                 value={city.newcode}
//               />
//             ))}
//           </Picker>
//         </View>
//       )}

//       <DatePicker
//         modal
//         open={isDatePickerOpen}
//         date={new Date()}
//         mode="date"
//         onConfirm={handleDateConfirm}
//         onCancel={() => setIsDatePickerOpen(false)}
//       />

//       {selectedDate && (
//         <Text style={styles.selectedDateText}   >
//           Selected Date: {selectedDate}
//         </Text>
//       )}

//       <ScrollView
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         style={styles.filterButtonsContainer}>
//         {actions.length > 0 ? (
//           actions.map(action => (
//             <TouchableOpacity
//               key={action.id}
//               style={[
//                 styles.filterButton,
//                 filter === action.remark_name && styles.selectedButton,
//               ]}
//               onPress={() => setFilter(action.remark_name)}>
//               <Text
//                 style={[
//                   styles.filterButtonText,
//                   filter === action.remark_name && styles.selectedText,
//                 ]}>
//                 {action.remark_name}
//               </Text>
//             </TouchableOpacity>
//           ))
//         ) : (
//           <Text style={styles.noActionsText}>No actions available</Text>
//         )}
//         <View />
//       </ScrollView>

//       <View style={styles.inquiriesContainer}>
//         {!loading &&
//           !error &&
//           (filteredInquiries.length > 0 ? (
//             filteredInquiries.map(inquiry => (
//               <TouchableOpacity
//                 key={inquiry.id}
//                 style={styles.inquiryBox}
//                 onPress={() => {
//                   router.push({
//                     pathname: '/EnqueryEditform',
//                     params: {  // Use params here instead of query
//                       inquiry: JSON.stringify(inquiry),
//                       calltime: calltime,
//                       userid: userid,
                     
//                     },
//                   });
//                 }}
                
                
//                 >
//                 <Text
//                   style={styles.inquiryTitle}
//                   numberOfLines={1}
//                   ellipsizeMode="tail">
//                   🧑 {inquiry.customerName || `Inquiry #${inquiry.id}`}{' '}
//                   <Text style={styles.followUpText}>
//                     | 🗓️ Follow-up:{' '}
//                     {inquiry.followUpDate?.split('T')[0] || 'N/A'}
//                   </Text>
//                 </Text>

//                 <Text style={styles.inquiryDescription}
//                     numberOfLines={1}
//                     ellipsizeMode="tail">
//                   🏢 {inquiry.companyName || 'No Company Info'} | 📍{' '}
//                   {inquiry.cityName || 'Unknown City'}
//                 </Text>

//                 <Text style={styles.inquiryDescription}>
//                   📦{' '}
//                   {products.find(
//                     p => String(p.code) === String(inquiry.productCode),
//                   )?.product_name || 'Unknown Product'}{' '}
//                   | 🔁
//                   {references.find(
//                     ref => String(ref.Id) === String(inquiry.refid),
//                   )?.Refrance_name || 'No Reference Info'}
//                 </Text>

//                 <Text style={styles.inquiryDescription}>
//                   🗓️ Inquiry Date: {inquiry.enquiryDate?.split('T')[0] || 'N/A'}
//                 </Text>

//                 <Text style={styles.inquiryDescription}>
//                   📝 {inquiry.actionName || 'No Action'} | 🗒️{' '}
//                   {inquiry.remark || 'No Remark'}
//                 </Text>

//                 <View style={styles.buttonContainer}>
//                   <TouchableOpacity
//                     style={styles.whatsappButton}
//                     onPress={() => openWhatsApp(inquiry.code)}>
//                     <Text style={styles.buttonText}>WhatsApp</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={styles.callButton}
//                     onPress={() => makeCall(inquiry.code)}>
//                     <Text style={styles.buttonText}>Call</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity style={styles.detailsButton}>
//                     <Text
//                       style={styles.buttonText}
//                       onPress={() => navigation.navigate('EnqyueryDetails', {inquiry})}>
//                       See Details
//                     </Text>
//                   </TouchableOpacity>
//                 </View>
//               </TouchableOpacity>
//             ))
//           ) : (
//             <Text style={styles.noInquiriesText}>No inquiries found</Text>
//           ))}
//       </View>
//     </ScrollView>
//   );
// };

// export default Inquiries;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 15,
//     backgroundColor: '#f5f5f5',
//   },

//   fixedHeader: {padding: 15, backgroundColor: '#fff', elevation: 5},

//   titleText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 15,
//     color: '#333',
//   },
//   pickerContainer: {
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     marginBottom: 15,
//     overflow: 'hidden',
//   },
//   picker: {
//     height: 50,
//     width: '100%',
//   },
//   filterButtonsContainer: {
//     flexDirection: 'row',
//     marginVertical: 10,
//   },
//   filterButton: {
//     backgroundColor: '#ddd',
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     marginHorizontal: 5,
//     borderRadius: 8,
//   },
//   selectedButton: {
//     backgroundColor: '#007bff',
//   },
//   filterButtonText: {
//     fontSize: 16,
//   },
//   selectedText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   inquiriesContainer: {
//     marginTop: 10,
//   },
//   inquiryBox: {
//     backgroundColor: '#fff',
//     padding: 15,
//     marginBottom: 10,
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   inquiryTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   inquiryDescription: {
//     fontSize: 14,
//     color: '#666',
//     marginTop: 5,
//   },
//   inquiryType: {
//     fontSize: 14,
//     color: '#007bff',
//     fontWeight: 'bold',
//     marginTop: 5,
//   },
//   noInquiriesText: {
//     fontSize: 16,
//     textAlign: 'center',
//     color: '#666',
//     marginTop: 20,
//   },
//   errorText: {
//     fontSize: 16,
//     color: 'red',
//     textAlign: 'center',
//     marginTop: 20,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 10,
//   },

//   whatsappButton: {
//     backgroundColor: '#25D366',
//     padding: 10,
//     borderRadius: 8,
//     flex: 1,
//     marginRight: 5,
//   },

//   callButton: {
//     backgroundColor: '#007bff',
//     padding: 10,
//     borderRadius: 8,
//     flex: 1,
//     marginRight: 5,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   detailsButton: {
//     backgroundColor: '#FFA500',
//     padding: 10,
//     borderRadius: 8,
//     flex: 1,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
//   selectedDateText: {
//     fontSize: 16,
//     color: '#007bff',
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 10,
//   },
//   followUpText: {
//     fontWeight: 'normal',
//     color: '#555', 
//     fontSize: 14,
//   },
// });

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '../../config';
import {
  fetchCities,
  fetchContacts,
  fetchActions,
  fetchProducts,
  fetchReferences,
  fetchInquiries,
} from '../../services/API';

const Inquiries = () => {
  const [filter, setFilter] = useState('All');
  const [dropdownFilter, setDropdownFilter] = useState('All');
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [inquiries, setInquiries] = useState([]);
  const [cities, setCities] = useState([]);
  const [actions, setActions] = useState([]);
  const [products, setProducts] = useState([]);
  const [references, setReferences] = useState([]);
  const [contactMap, setContactMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userid, setuserid] = useState(null);
  const [calltime, setcalltime] = useState(null);

  const navigation = useNavigation();
  const router = useRouter();
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (API_URL) {
      fetchCities(API_URL).then(setCities).catch(setError);
      fetchContacts(API_URL).then(setContactMap).catch(setError);
      fetchActions(API_URL).then(setActions).catch(setError);
      fetchProducts(API_URL).then(setProducts).catch(setError);
      fetchReferences(API_URL).then(setReferences).catch(setError);
    }
  }, [API_URL]);

  useEffect(() => {
    if (API_URL && cities.length > 0) {
      fetchInquiries(API_URL)
        .then(({ inquiriesData, detailsData }) => {
          const updatedInquiries = inquiriesData.inquiries.map(inquiry => {
            const matchingDetails = detailsData.filter(
              d => String(d.EnquiryCode) === String(inquiry.code) && d.action_id !== null
            );

            const detail = matchingDetails.sort((a, b) => b.id - a.id)[0] || null;
            const city = cities.find(c => Number(c.newcode) === Number(inquiry.cityCode));
            const action = actions.find(act => act.id === detail?.action_id);

            return {
              ...inquiry,
              action_id: detail?.action_id || null,
              cityName: city?.cityName || 'Unknown City',
              type: action?.remark_name || 'Unknown Type',
              followUpDate: detail?.FollowDate || null,
              followUpTime: detail?.FollowTime || null,
              actionName: action?.remark_name || null,
              remark: detail?.remark || detail?.Narration || null,
              DemoDate: detail?.DemoDate || null,
              DemoStatus: detail?.DemoStatus || null,
            };
          });

          setInquiries(updatedInquiries);
        })
        .catch(() => setError('Failed to load inquiries'))
        .finally(() => setLoading(false));
    }
  }, [API_URL, cities, actions]);

  const makeCall = async inquiryId => {
    const phoneNumber = contactMap[inquiryId];
    if (!phoneNumber) {
      alert('Phone number not available');
      return;
    }

    try {
      const userId = 'loggedInUser'; // mock placeholder
      const callTime = new Date().toISOString();
      setuserid(userId);
      setcalltime(callTime);
    } catch (error) {
      console.error('Error getting user info for call log:', error);
    }

    Linking.openURL(`tel:${phoneNumber}`).catch(err =>
      console.error('Error making call:', err),
    );
  };

  const openWhatsApp = inquiryId => {
    const phoneNumber = contactMap[inquiryId];
    if (!phoneNumber) {
      alert('Phone number not available');
      return;
    }
    Linking.openURL(`whatsapp://send?phone=${phoneNumber}`).catch(() => {
      alert('WhatsApp is not installed');
    });
  };

  const handleDropdownChange = value => {
    setDropdownFilter(value);
    if (value === 'Date') {
      if (isMounted.current) setShowDatePicker(true);
    } else if (value === 'City') {
      setSelectedCity(null);
    }
  };

  const onDateChange = (event, date) => {
    if (!isMounted.current) return;

    setShowDatePicker(false);
    if (event.type === 'set' && date) {
      setSelectedDate(date.toISOString().split('T')[0]);
    }
  };

  const filteredInquiries = inquiries.filter(inquiry => {
    if (filter === 'Demoscheduale') {
      const isValidDate =
        inquiry.DemoDate &&
        inquiry.DemoDate !== null &&
        inquiry.DemoDate !== '0000-00-00';
      return isValidDate && inquiry.DemoStatus === 'Inactive';
    }

    if (filter === 'Democompleted') {
      return inquiry.DemoStatus === 'Active';
    }

    if (filter !== 'All' && inquiry.type !== filter) return false;
    if (
      dropdownFilter === 'City' &&
      selectedCity &&
      inquiry.cityCode !== selectedCity
    )
      return false;

    const inquiryDate = inquiry.enquiryDate?.split('T')[0];
    if (
      dropdownFilter === 'Date' &&
      selectedDate &&
      inquiryDate !== selectedDate
    )
      return false;

    return true;
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titleText}>Universal Soft Lab</Text>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={dropdownFilter}
          style={styles.picker}
          onValueChange={handleDropdownChange}>
          <Picker.Item label="All" value="All" />
          <Picker.Item label="City" value="City" />
          <Picker.Item label="Date" value="Date" />
        </Picker>
      </View>

      {dropdownFilter === 'City' && (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedCity}
            style={styles.picker}
            onValueChange={cityCode => setSelectedCity(cityCode)}>
            <Picker.Item label="All Cities" value={null} />
            {cities.map(city => (
              <Picker.Item
                key={city.newcode}
                label={city.cityName}
                value={city.newcode}
              />
            ))}
          </Picker>
        </View>
      )}

      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateChange}
        />
      )}

      {selectedDate && (
        <Text style={styles.selectedDateText}>
          Selected Date: {selectedDate}
        </Text>
      )}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterButtonsContainer}>
        {actions.length > 0 ? (
          actions.map(action => (
            <TouchableOpacity
              key={action.id}
              style={[
                styles.filterButton,
                filter === action.remark_name && styles.selectedButton,
              ]}
              onPress={() => setFilter(action.remark_name)}>
              <Text
                style={[
                  styles.filterButtonText,
                  filter === action.remark_name && styles.selectedText,
                ]}>
                {action.remark_name}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noActionsText}>No actions available</Text>
        )}
        <View />
      </ScrollView>

      <View style={styles.inquiriesContainer}>
        {!loading &&
          !error &&
          (filteredInquiries.length > 0 ? (
            filteredInquiries.map(inquiry => (
              <TouchableOpacity
                key={inquiry.id}
                style={styles.inquiryBox}
                onPress={() => {
                  router.push({
                    pathname: '/EnqueryEditform',
                    params: {
                      inquiry: JSON.stringify(inquiry),
                      calltime,
                      userid,
                    },
                  });
                }}>
                <Text style={styles.inquiryTitle} numberOfLines={1} ellipsizeMode="tail">
                  🧑 {inquiry.customerName || `Inquiry #${inquiry.id}`} <Text style={styles.followUpText}>| 🗓️ Follow-up: {inquiry.followUpDate?.split('T')[0] || 'N/A'}</Text>
                </Text>
                <Text style={styles.inquiryDescription} numberOfLines={1} ellipsizeMode="tail">
                  🏢 {inquiry.companyName || 'No Company Info'} | 📍 {inquiry.cityName || 'Unknown City'}
                </Text>
                <Text style={styles.inquiryDescription}>
                  📦 {products.find(p => String(p.code) === String(inquiry.productCode))?.product_name || 'Unknown Product'} | 🔁 {references.find(ref => String(ref.Id) === String(inquiry.refid))?.Refrance_name || 'No Reference Info'}
                </Text>
                <Text style={styles.inquiryDescription}>
                  🗓️ Inquiry Date: {inquiry.enquiryDate?.split('T')[0] || 'N/A'}
                </Text>
                <Text style={styles.inquiryDescription}>
                  📝 {inquiry.actionName || 'No Action'} | 📒 {inquiry.remark || 'No Remark'}
                </Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.whatsappButton} onPress={() => openWhatsApp(inquiry.code)}>
                    <Text style={styles.buttonText}>WhatsApp</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.callButton} onPress={() => makeCall(inquiry.code)}>
                    <Text style={styles.buttonText}>Call</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.detailsButton} onPress={() => navigation.navigate('EnqyueryDetails', { inquiry })}>
                    <Text style={styles.buttonText}>See Details</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noInquiriesText}>No inquiries found</Text>
          ))}
      </View>
    </ScrollView>
  );
};

export default Inquiries;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f5f5',
  },
  fixedHeader: { padding: 15, backgroundColor: '#fff', elevation: 5 },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  filterButtonsContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  filterButton: {
    backgroundColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 5,
    borderRadius: 8,
  },
  selectedButton: {
    backgroundColor: '#007bff',
  },
  filterButtonText: {
    fontSize: 16,
  },
  selectedText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  inquiriesContainer: {
    marginTop: 10,
  },
  inquiryBox: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inquiryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  inquiryDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  noInquiriesText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  whatsappButton: {
    backgroundColor: '#25D366',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
  },
  callButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsButton: {
    backgroundColor: '#FFA500',
    padding: 10,
    borderRadius: 8,
    flex: 1,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  selectedDateText: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  followUpText: {
    fontWeight: 'normal',
    color: '#555',
    fontSize: 14,
  },
});
