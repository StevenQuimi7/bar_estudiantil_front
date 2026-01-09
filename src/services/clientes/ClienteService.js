import {constants} from "../../config/constants";
import {getAuthHeaders} from "../../utils/tokenUtils";

export const ClienteService = {
    getClientes,
    storeCliente,
    updateCliente,
    deleteCliente,
    getComboTipoClientes,
    getComboClientes,
    cargaMasiva,
    exportar,
    exportarPlantilla
}

function getClientes(values){
    const query = new URLSearchParams(values).toString();
    const url = `${constants.API_URL}/clientes?${query}`;
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
function storeCliente(values){
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            'authorization': getAuthHeaders()
        },
        body: JSON.stringify(values),

    };
    return fetch(`${constants.API_URL}/clientes/guardar`, requestOptions)
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
function updateCliente(values){
    const requestOptions = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            'authorization': getAuthHeaders()
        },
        body: JSON.stringify(values),

    };
    return fetch(`${constants.API_URL}/clientes/actualizar/${values.id}`, requestOptions)
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
function deleteCliente(values){
    const requestOptions = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            'authorization': getAuthHeaders()
        },
        body: JSON.stringify(values),

    };
    return fetch(`${constants.API_URL}/clientes/eliminar`, requestOptions)
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

function getComboTipoClientes(values){
    const query = new URLSearchParams(values).toString();
    const url = `${constants.API_URL}/clientes/tiposClientes`;
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

function getComboClientes(values){
    const query = new URLSearchParams(values).toString();
    const url = `${constants.API_URL}/clientes/comboClientes?${query}`;
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

function cargaMasiva(values){
  const url = `${constants.API_URL}/clientes/cargaMasiva`;
  const requestOptions = {
      method: "POST",
      headers: {
          //"Content-Type": "application/json",
          "Accept": "application/json",
          'authorization': getAuthHeaders()
      },
      body: values,

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

function exportar(values) {
  const url = `${constants.API_URL}/clientes/exportar`;
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

function exportarPlantilla(values) {
  const query = new URLSearchParams(values).toString();
  const url = `${constants.API_URL}/clientes/descargarPlantilla?${query}`;
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      'authorization': getAuthHeaders()
    }
  };

  return fetch(url, requestOptions)
    .then(response => response.blob())
    .catch(error => error);
}