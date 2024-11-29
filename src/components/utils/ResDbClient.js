
import axios from 'axios';

export const sendRequest = async (query) => {
  const headers = {
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
    'Content-Type': 'application/json'
  };

  const data = {
    query: query
  };

  const config = {
    headers: headers,
    timeout: 30000, // Timeout set to 30 seconds (adjust as needed)
  };

  try {
    // TODO: Adding the path to env
    const response = await axios.post('http://127.0.0.1:8000/graphql', data, config);
    return response.data;
  } catch (error) {
    console.error("Error in sendRequest:", error.message);
    throw error;
  }
};
