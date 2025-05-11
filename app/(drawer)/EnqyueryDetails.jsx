// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   ActivityIndicator,
//   StyleSheet,
// } from 'react-native';
// import { Table, Row, Rows } from 'react-native-table-component';
// import { API_URL } from '../../config'; // Make sure API_URL is defined in the config file
// import { useRoute } from '@react-navigation/native';
// import {
//   fetchActionNamesAPI,
//   fetchPersonNamesAPI,
//   fetchUserNamesAPI,
//   fetchInquiryDataAPI,
// } from '../../services/API';

// const InquiryDetails = () => {

//     const route = useRoute();
//     const { inquiry } = route.params || {};
// //   const { inquiry, item } = route.params; // Get the inquiryId from route params

//   console.log('inquiry', inquiry);

//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [actionNames, setActionNames] = useState({});
//   const [personNames, setPersonNames] = useState({});
//   const [userNames, setUserNames] = useState({});

//   const tableHead = [
//     'Action',
//     'Date',
//     'CallTime',
//     'Speak To',
//     'Speak From',
//     'Remark',
//     'Follow Update',
//     'Follow Up Time',
//   ];

//   const columnWidths = [80, 100, 80, 120, 120, 200, 150, 150];

//   useEffect(() => {
//     if (API_URL) {
//       fetchActionNames();
//       fetchPersonNames();
//       fetchInquiryData();
//       fetchUserNames();
//     }
//   }, [API_URL]);

//   const fetchUserNames = async () => {
//     try {
//       const response = await fetch(`${API_URL}/getlogin`);
//       const result = await response.json();
//       if (response.ok && result.data && Array.isArray(result.data)) {
//         const map = {};
//         result.data.forEach(user => {
//           map[user.code] = user.name;
//         });
//         setUserNames(map);
//       }
//     } catch (error) {
//       console.error('❌ Error fetching user names:', error);
//     }
//   };

//   const fetchActionNames = async () => {
//     try {
//       const response = await fetch(`${API_URL}/getallremark`);
//       const result = await response.json();
//       if (response.ok && result.persons && Array.isArray(result.persons)) {
//         const actionMap = {};
//         result.persons.forEach(item => {
//           actionMap[item.id] = item.remark_name;
//         });
//         setActionNames(actionMap);
//       }
//     } catch (error) {
//       console.error('❌ Error fetching action names:', error);
//     }
//   };

//   const fetchPersonNames = async () => {
//     try {
//       const response = await fetch(`${API_URL}/getparson`);
//       const result = await response.json();
//       if (response.ok && result.persons && Array.isArray(result.persons)) {
//         const personMap = {};
//         result.persons.forEach(item => {
//           personMap[item.EnquiryCode] = item.Name || 'N/A';
//         });
//         setPersonNames(personMap);
//       }
//     } catch (error) {
//       console.error('❌ Error fetching person names:', error);
//     }
//   };

//   const fetchInquiryData = async () => {
//     try {
//       const response = await fetch(`${API_URL}/getinquiryAllDetials`);
//       const result = await response.json();
//       if (response.ok && Array.isArray(result)) {
//         setData(result);
//       } else {
//         console.error('❌ Invalid API response:', result);
//       }
//     } catch (error) {
//       console.error('❌ Error fetching inquiry data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Debugging: Log the raw data from API and the filtered data
//   console.log('Fetched Data: ', data);

//   // Filter data based on inquiry code
//   let filteredData = [];
//   if (inquiry) {
//     // Filter based on inquiry
//     filteredData = data.filter(
//       item => String(inquiry.customerId) === String(item.EnquiryPersonId)
//     );
//   } else if (item) {
//     // Filter based on item (assuming item has customerId or EnquiryPersonId)
//     filteredData = data.filter(
//       items => String(item.EnquiryCode) === String(items.EnquiryCode)
//     );
//   }

//   // Debugging: Log filtered data
//   console.log('Filtered Data: ', filteredData);

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.headerText}>Inquiry Details</Text>

//       {loading ? (
//         <ActivityIndicator size="large" color="#007bff" />
//       ) : (
//         <>
//           {/* Table view */}
//           <ScrollView horizontal>
//             <View style={styles.tableContainer}>
//               <Table borderStyle={{ borderWidth: 1, borderColor: '#c1c1c1' }}>
//                 {/* Table Header */}
//                 <Row
//                   data={tableHead}
//                   style={styles.head}
//                   textStyle={styles.headText}
//                   widthArr={columnWidths}
//                 />
//               </Table>

//               {/* Table Content - Filtered Data */}
//               <ScrollView style={{ maxHeight: 400 }}>
//                 <Table borderStyle={{ borderWidth: 1, borderColor: '#c1c1c1' }}>
//                   <Rows
//                     data={filteredData.map(item => {
//                       const formattedDate = item.EnquiryDate
//                         ? new Date(item.EnquiryDate).toLocaleDateString(
//                             'en-GB',
//                             { day: '2-digit', month: '2-digit', year: 'numeric' }
//                           )
//                         : 'N/A';
//                       const formattedTime = item.call_time
//                         ? item.EnquiryTime.slice(0, 5)
//                         : 'N/A';
//                       const followUpdate = item.FollowDate
//                         ? new Date(item.FollowDate).toLocaleDateString(
//                             'en-GB',
//                             { day: '2-digit', month: '2-digit', year: 'numeric' }
//                           )
//                         : 'N/A';
//                       const followUpTime = item.FollowTime
//                         ? item.FollowTime.slice(0, 5)
//                         : 'N/A';

//                       return [
//                         actionNames[item.action_id] || 'N/A',
//                         formattedDate,
//                         formattedTime,
//                         personNames[item.EnquiryPersonId] || 'N/A',
//                         userNames[item.user_id] || 'Unknown User',
//                         item.Narration || 'N/A',
//                         followUpdate,
//                         followUpTime,
//                       ];
//                     })}
//                     textStyle={styles.text}
//                     widthArr={columnWidths}
//                     style={index => [
//                       styles.row,
//                       index % 2 === 0 ? styles.rowEven : styles.rowOdd,
//                     ]}
//                   />
//                 </Table>
//               </ScrollView>
//             </View>
//           </ScrollView>
//         </>
//       )}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
//   headerText: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#007bff',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   tableContainer: {
//     backgroundColor: '#fff',
//     padding: 10,
//     borderRadius: 8,
//     shadowOpacity: 0.1,
//     elevation: 3,
//   },
//   head: { height: 50, backgroundColor: '#007bff' },
//   headText: {
//     fontWeight: 'bold',
//     textAlign: 'center',
//     color: '#fff',
//     padding: 10,
//   },
//   text: {
//     textAlign: 'center',
//     padding: 10,
//     fontSize: 14,
//     color: '#333',
//     flexWrap: 'wrap',
//     minHeight: 50,
//   },
//   row: { minHeight: 50, borderBottomWidth: 1, borderBottomColor: '#ddd' },
//   rowEven: { backgroundColor: '#f9f9f9' },
//   rowOdd: { backgroundColor: '#ffffff' },
// });

// export default InquiryDetails;
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';
import { API_URL } from '../../config';
import { useRoute } from '@react-navigation/native';
import {
  fetchActionNamesAPI,
  fetchPersonNamesAPI,
  fetchUserNamesAPI,
  fetchInquiryDataAPI,
} from '../../services/API';

const InquiryDetails = () => {
  const route = useRoute();
  const { inquiry } = route.params || {};

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionNames, setActionNames] = useState({});
  const [personNames, setPersonNames] = useState({});
  const [userNames, setUserNames] = useState({});

  const tableHead = [
    'Action',
    'Date',
    'CallTime',
    'Speak To',
    'Speak From',
    'Remark',
    'Follow Update',
    'Follow Up Time',
  ];

  const columnWidths = [80, 100, 80, 120, 120, 200, 150, 150];

  useEffect(() => {
    if (API_URL) {
      fetchInitialData();
    }
  }, [API_URL]);

  const fetchInitialData = async () => {
    try {
      const [actions, persons, users, inquiries] = await Promise.all([
        fetchActionNamesAPI(),
        fetchPersonNamesAPI(),
        fetchUserNamesAPI(),
        fetchInquiryDataAPI(),
      ]);

      setActionNames(actions);
      setPersonNames(persons);
      setUserNames(users);
      setData(inquiries);
    } catch (error) {
      console.error('❌ Error loading inquiry details:', error.message || error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Define filteredData based on inquiry
  let filteredData = [];
  if (inquiry) {
    filteredData = data.filter(
      item => String(inquiry.customerId) === String(item.EnquiryPersonId)
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>Inquiry Details</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <>
          <ScrollView horizontal>
            <View style={styles.tableContainer}>
              <Table borderStyle={{ borderWidth: 1, borderColor: '#c1c1c1' }}>
                <Row
                  data={tableHead}
                  style={styles.head}
                  textStyle={styles.headText}
                  widthArr={columnWidths}
                />
              </Table>

              <ScrollView style={{ maxHeight: 400 }}>
                <Table borderStyle={{ borderWidth: 1, borderColor: '#c1c1c1' }}>
                  <Rows
                    data={filteredData.map(item => {
                      const formattedDate = item.EnquiryDate
                        ? new Date(item.EnquiryDate).toLocaleDateString('en-GB')
                        : 'N/A';
                      const formattedTime = item.call_time
                        ? item.EnquiryTime?.slice(0, 5)
                        : 'N/A';
                      const followUpdate = item.FollowDate
                        ? new Date(item.FollowDate).toLocaleDateString('en-GB')
                        : 'N/A';
                      const followUpTime = item.FollowTime
                        ? item.FollowTime.slice(0, 5)
                        : 'N/A';

                      return [
                        actionNames[item.action_id] || 'N/A',
                        formattedDate,
                        formattedTime,
                        personNames[item.EnquiryPersonId] || 'N/A',
                        userNames[item.user_id] || 'Unknown User',
                        item.Narration || 'N/A',
                        followUpdate,
                        followUpTime,
                      ];
                    })}
                    textStyle={styles.text}
                    widthArr={columnWidths}
                    style={index => [
                      styles.row,
                      index % 2 === 0 ? styles.rowEven : styles.rowOdd,
                    ]}
                  />
                </Table>
              </ScrollView>
            </View>
          </ScrollView>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007bff',
    textAlign: 'center',
    marginBottom: 20,
  },
  tableContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    shadowOpacity: 0.1,
    elevation: 3,
  },
  head: { height: 50, backgroundColor: '#007bff' },
  headText: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    padding: 10,
  },
  text: {
    textAlign: 'center',
    padding: 10,
    fontSize: 14,
    color: '#333',
    flexWrap: 'wrap',
    minHeight: 50,
  },
  row: { minHeight: 50, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  rowEven: { backgroundColor: '#f9f9f9' },
  rowOdd: { backgroundColor: '#ffffff' },
});

export default InquiryDetails;
