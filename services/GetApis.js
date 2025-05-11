 import { API_URL } from "../config";
 
 
 export const fetchReferences = async () => {
    try {
      const response = await fetch(`${API_URL}/getRefid`);
      const data = await response.json();
      console.log('Fetched reference data', data);
    return(data)
    } catch (error) {
      console.error('Error fetching references:', error);
    }
  };