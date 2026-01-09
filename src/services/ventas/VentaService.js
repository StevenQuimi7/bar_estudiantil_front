import {constants} from "../../config/constants";
import {getAuthHeaders} from "../../utils/tokenUtils";

export const VentaService = {
    getVentas,
    storeVenta,
    updateEstadoGestion,
    exportar
}

function getVentas(values){
  const query = new URLSearchParams(values).toString();
  const url = `${constants.API_URL}/ventas?${query}`;
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
function storeVenta(values){
  const requestOptions = {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          'authorization': getAuthHeaders()
      },
      body: JSON.stringify(values),

  };
  return fetch(`${constants.API_URL}/ventas/guardar`, requestOptions)
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
function updateEstadoGestion(values){
  const requestOptions = {
      method: "PUT",
      headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          'authorization': getAuthHeaders()
      },
      body: JSON.stringify(values),

  };
  return fetch(`${constants.API_URL}/ventas/updateEstadoGestion/${values.id}`, requestOptions)
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

function exportar(values) {
  const url = `${constants.API_URL}/ventas/exportar`;
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      'authorization': getAuthHeaders()
    },
    body: JSON.stringify(values),
  };

  return fetch(url, requestOptions)
    .then(response => response.blob())
    .catch(error => error);
}
