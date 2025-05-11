import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { API_URL } from '../../../config';

const Home = () => {
  const router = useRouter();
  const [inquiryData, setInquiryData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchInquiries = async () => {
    try {
      const response = await fetch(`${API_URL}/getInquiry`);
      const data = await response.json();
      
      setInquiryData(data);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#FF5722" />
      ) : (
        <>
          <View style={styles.FirstContainer}>
            <TouchableOpacity
              style={[styles.FBox, { backgroundColor: '#FFEB3B' }]}
              onPress={() => router.push('/(drawer)/inqueryes')}
            >
              <Text style={styles.statNumber}>{inquiryData?.inquiries?.length || 0}</Text>
              <Text style={styles.boxText}>Inquiry Received</Text>
            </TouchableOpacity>
            <View style={[styles.FBox, { backgroundColor: '#FF9800' }]}>
              <Text style={styles.statNumber}>{inquiryData?.totalResponses || 0}</Text>
              <Text style={styles.boxText}>Enquiry Response</Text>
            </View>
          </View>

          <View style={styles.SecondsContainer}>
            <View style={[styles.FBox, { backgroundColor: '#8BC34A' }]}>
              <Text style={styles.statNumber}>{inquiryData?.averageResponseTime || 'N/A'}</Text>
              <Text style={styles.boxText}>Average Response</Text>
            </View>
            <View style={[styles.FBox, { backgroundColor: '#2196F3' }]}>
              <Text style={styles.statNumber}>{inquiryData?.profileScore || '0%'}</Text>
              <Text style={styles.boxText}>Profile Score</Text>
            </View>
          </View>

          <View style={styles.EnquiryContainer}>
            <TouchableOpacity
              style={styles.Box}
              onPress={() =>
                router.push({
                  pathname: '/(drawer)/Followup',
                  params: { data: JSON.stringify(inquiryData?.inquiries || []) },
                })
              }
            >
              <Text style={styles.iconText}>✉️</Text>
              <Text style={styles.enquiryText}>Followup</Text>
              <Text style={styles.statNumber}>{inquiryData?.todayInquiries || 0}</Text>
            </TouchableOpacity>

            <View style={styles.Box}>
              <Text style={styles.iconText}>📨</Text>
              <Text style={styles.enquiryText}>Yesterday Enquiry</Text>
              <Text style={styles.statNumber}>{inquiryData?.yesterdayInquiries || 0}</Text>
            </View>

            <View style={styles.Box}>
              <Text style={styles.iconText}>🔥</Text>
              <Text style={styles.enquiryText}>Hot Enquiry</Text>
              <Text style={styles.statNumber}>{inquiryData?.hotInquiries || 0}</Text>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  FirstContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  SecondsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  FBox: {
    padding: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  boxText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
    textAlign: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  EnquiryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  Box: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    marginHorizontal: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    borderRadius: 8,
    flex: 1,
  },
  iconText: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 8,
  },
  enquiryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
});

export default Home;
