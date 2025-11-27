import {constants} from "../../config/constants";
import { getAuthHeaders } from "../../utils/tokenUtils";

export const AuthService = {
    login,
    logout
}

function login(values){
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify(values),

    };
    return fetch(`${constants.API_URL}/login`, requestOptions)
    .then(async (response) => {
      const data = await response.json();
      if (!data.ok) {
        throw { status: response.status, ...data };
      }

      return data;
    })
    .catch((error) => {
      throw error;
    });
}
function logout(values){
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            'authorization': getAuthHeaders()
        },
        body: JSON.stringify(values),

    };
    return fetch(`${constants.API_URL}/logout`, requestOptions)
    .then(async (response) => {
      const data = await response.json();
      if (!data.ok) {
        throw { status: response.status, ...data };
      }

      return data;
    })
    .catch((error) => {
      throw error;
    });
}

/**
 import { useSelector } from 'react-redux';

function SomeComponent() {
  const token = useSelector((state) => state.auth.token);

  const fetchData = async () => {
    const res = await fetch('http://localhost:8000/api/protected', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    console.log(data);
  };
 * 
 * 
 */