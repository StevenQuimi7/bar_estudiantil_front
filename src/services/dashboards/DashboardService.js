import {constants} from "../../config/constants";
import {getAuthHeaders} from "../../utils/tokenUtils";

export const DashboardService = {
    consultaTopFive,
    consultaVentasMeses,
    consultaComparativaAnios
}

function consultaTopFive(values){
    const query = new URLSearchParams(values).toString();
    const url = `${constants.API_URL}/dashboard/top-five?${query}`;
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            'authorization': getAuthHeaders()
        },
        // body: JSON.stringify(values),

    };
    return fetch(url, requestOptions)
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

function consultaVentasMeses(values){
    const query = new URLSearchParams(values).toString();
    const url = `${constants.API_URL}/dashboard/ventas-meses?${query}`;
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            'authorization': getAuthHeaders()
        },
        // body: JSON.stringify(values),

    };
    return fetch(url, requestOptions)
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

function consultaComparativaAnios(values){
    const query = new URLSearchParams(values).toString();
    const url = `${constants.API_URL}/dashboard/comparativa-anios?${query}`;
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            'authorization': getAuthHeaders()
        },
        // body: JSON.stringify(values),

    };
    return fetch(url, requestOptions)
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