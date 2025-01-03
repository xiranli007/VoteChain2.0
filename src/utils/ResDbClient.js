import axios from 'axios';

export const sendRequest = async (query) => {
    const headers = {
        'Content-Type': 'application/json'
    };
    const data = {
      query: query
    }
    // TODO: Adding the path to env
    const response = await axios.post('http://localhost:8000/graphql', data, { headers })
    return response.data;
};
