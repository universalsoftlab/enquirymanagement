
  import React, { useState, useEffect } from 'react';
  import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback, Linking } from 'react-native';
  import DateTimePicker from '@react-native-community/datetimepicker';  // Import the Expo-compatible DateTimePicker
  import { useNavigation } from '@react-navigation/native';
  import { API_URL } from '../../config';
  import { useRouter } from 'expo-router';

  import { getInquiryTransaction, getInquirie, getRemark ,getContact} from '../../services/API';
  const FollowupScreen = () => {
    const [baseUrl, setBaseUrl] = useState(null);
    const [filteredInquiries, setFilteredInquiries] = useState([]);
    const [remarks, setRemarks] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedRemark, setSelectedRemark] = useState(null);
    const [showPicker, setShowPicker] = useState(false);
    const [inquiryTransactions, setInquiryTransactions] = useState([]); 

    const [inquiries, setInquiries] = useState([]); 
    const [contactMap, setContactMap] = useState({});
    const navigation = useNavigation();
    const router = useRouter();


   
    // useEffect(() => {
    //   if (!API_URL) return;

    //   Promise.all([
    //     fetch(`${API_URL}/getEnqiryTransections`).then(response => response.json()),
    //     fetch(`${API_URL}/getInquiry`).then(response => response.json()),
    //     fetch(`${API_URL}/getallremark`).then(response => response.json())
    //   ])
    //   .then(([inquiryTransactionsData, inquiriesData, remarksData]) => {
    //     setInquiryTransactions(inquiryTransactionsData);
    //     setInquiries(inquiriesData.inquiries || []);
    //     setRemarks([
    //       { id: null, remark_name: 'AllEnquiries' },
    //       ...(remarksData.persons || []),
    //     ]);
    //   })
    //   .catch(error => {
    //     console.error('Error fetching data:', error);
    //   });
    // }, [API_URL]);


    useEffect(() => {
      Promise.all([
        getInquiryTransaction(),
        getInquirie(),
        getRemark()
      ])
        .then(([inquiryTransactionsData, inquiriesData, remarksData]) => {
          setInquiryTransactions(inquiryTransactionsData);
          setInquiries(inquiriesData.inquiries || []);
          setRemarks([
            { id: null, remark_name: 'AllEnquiries' },
            ...(remarksData.persons || []),
          ]);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }, []);

    // useEffect(() => {
    //   if (!API_URL) return;

    //   const fetchContacts = async () => {
    //     try {
    //       const response = await fetch(`${API_URL}/getparson`);
    //       const data = await response.json();
    //       if (response.ok && data?.persons) {
    //         const contactMapping = {};  
    //         data.persons.forEach(person => {
    //           contactMapping[person.Code] = person.ContactNumber;
    //         });
    //         setContactMap(contactMapping);
    //       } else {
    //         console.error('Failed to load contacts');
    //       }
    //     } catch (error) {
    //       console.error('Error fetching contact numbers', error);
    //     }
    //   };

    //   fetchContacts();
    // }, [API_URL]);

    useEffect(() => {
      const fetchContacts = async () => {
        try {
          const persons = await getContact();
    
          const contactMapping = persons.reduce((map, person) => {
            if (person.Code && person.ContactNumber) {
              map[person.Code] = person.ContactNumber;
            }
            return map;
          }, {});
    
          setContactMap(contactMapping);
        } catch (error) {
          console.error('Failed to load contacts from API');
        }
      };
    
      fetchContacts();
    }, []);

    const filterInquiriesByDateAndRemark = (date, remarkId) => {
      let formattedDate = date.toISOString().split('T')[0];

    
      const mergedData = inquiryTransactions.map(transaction => {
        const matchingInquiry = inquiries.find(inquiry => {
          return String(inquiry.code) === String(transaction.EnquiryCode);
        });

        if (!matchingInquiry) {
          console.log('No matching inquiry found for transaction with code:', transaction.code);
          return {}; // Skip this transaction if no match found
        }
        const transactionRemarkId = transaction.remarkId || transaction.action_id;
        return {
          ...transaction,
          customerName: matchingInquiry?.customerName || 'N/A',
          companyName: matchingInquiry?.companyName || 'N/A',
          remarkId:transactionRemarkId,
          productCode : matchingInquiry.productCode || 'N/A' ,
        };
      });

      console.log("Merged Data:", mergedData);

      const filtered = mergedData.filter(i => {
        const followDate = i.FollowDate?.split('T')[0];
        const matchesDate = followDate === formattedDate;
        const matchesRemark = remarkId === null || i.remarkId === remarkId;

        return matchesDate && matchesRemark;
      });

      console.log('Filtered Inquiries:', filtered);

      if (filtered.length === 0) {
        console.log('No inquiries found for the selected date and remark:', formattedDate, remarkId);
      }

      setFilteredInquiries(filtered);
    };

    const makeCall = (inquiryId) => {
      const phoneNumber = contactMap[inquiryId];
      if (!phoneNumber) {
        alert('Phone number not available');
        return;
      }
      Linking.openURL(`tel:${phoneNumber}`).catch(err =>
        console.error('Error making call:', err)
      );
    };

    const openWhatsApp = (inquiryId) => {
      const phoneNumber = contactMap[inquiryId];
      if (!phoneNumber) {
        alert('Phone number not available');
        return;
      }
      Linking.openURL(`whatsapp://send?phone=${phoneNumber}`).catch(() => {
        alert('WhatsApp is not installed');
      });
    };

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Follow-up Inquiries</Text>

        <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.dateButton}>
          <Text style={styles.dateText}>📅 {selectedDate.toDateString()}</Text>
        </TouchableOpacity>

        <Modal visible={showPicker} transparent animationType="fade">
          <TouchableWithoutFeedback onPress={() => setShowPicker(false)}>
            <View style={styles.modalContainer}>
              <TouchableWithoutFeedback>
                <View style={styles.pickerContainer}>
                  <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    onChange={(event, date) => {
                      setSelectedDate(date);
                      filterInquiriesByDateAndRemark(date, selectedRemark);
                    }}
                  />
                  <TouchableOpacity onPress={() => setShowPicker(false)} style={styles.closeButton}>
                    <Text style={styles.closeText}>Done</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <View style={styles.remarksContainer}>
          {remarks.map(item => (
            <TouchableOpacity
              key={item.id?.toString() || 'all'}
              onPress={() => {
                setSelectedRemark(item.id);
                filterInquiriesByDateAndRemark(selectedDate, item.id); // Apply filter with both date and remark
              }}
            >
              <Text style={[styles.remarkText, selectedRemark === item.id && styles.selectedRemarkText]}>
                {item.remark_name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={filteredInquiries}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.inquiryItem}
              onPress={() => {
                router.push({
                  pathname: '/EnqueryEditform',
                  params: {  // Use params here instead of query
                    item: JSON.stringify(item),
                
                  
                  },
                });
              }}
            >
              <Text style={styles.inquiryText}>🆔 {item.id} - {item.customerName}</Text>
              <Text style={styles.inquiryText}>📅 {item.EnquiryDate?.split('T')[0] || 'N/A'}</Text>
              <Text style={styles.inquiryText}>Company: {item.companyName}</Text>
              <Text style={styles.inquiryText}>⏰ {item.FollowTime}</Text>

              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => openWhatsApp(item.EnquiryCode)} style={styles.button}>
                  <Text style={styles.buttonText}>💬 WhatsApp</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => makeCall(item.EnquiryCode)} style={styles.button}>
                  <Text style={styles.buttonText}>📞 Call</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() =>    router.push('Details', { item })} style={styles.button}>
                  <Text style={styles.buttonText}>See Details</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyCompon ent={<Text style={styles.noDataText}>No inquiries found.</Text>}
        />
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#f4f4f4',
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      color: '#2c3e50',
    },
    dateButton: {
      padding: 12,
      backgroundColor: '#3498db',
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 15,
    },
    dateText: {
      color: '#fff',
      fontSize: 16,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    pickerContainer: {
      width: '80%',
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 8,
      alignItems: 'center',
    },
    closeButton: {
      marginTop: 20,
      padding: 10,
      backgroundColor: '#3498db',
      borderRadius: 8,
      alignItems: 'center',
    },
    closeText: {
      color: '#fff',
    },
    remarksContainer: {
      flexDirection: 'row',
      marginBottom: 20,
    },
    remarkText: {
      marginHorizontal: 10,
      fontSize: 14,
    },
    selectedRemarkText: {
      color: '#3498db',
      fontWeight: 'bold',
    },
    inquiryItem: {
      padding: 15,
      backgroundColor: '#fff',
      marginBottom: 15,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#ddd',
    },
    inquiryText: {
      fontSize: 16,
      marginBottom: 5,
    },
    buttonContainer: {
      flexDirection: 'row',
      marginTop: 10,
      justifyContent: 'space-around',
    },
    button: {
      backgroundColor: '#3498db',
      paddingVertical: 8,
      paddingHorizontal: 15,
      borderRadius: 8,
      margin: 2,
    },
    buttonText: {
      color: '#fff',
      fontSize: 14,
    },
    noDataText: {
      textAlign: 'center',          
      color: '#999',
    },
  });

  export default FollowupScreen;
