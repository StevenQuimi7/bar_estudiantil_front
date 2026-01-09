import {constants} from "../../config/constants";
import {getAuthHeaders} from "../../utils/tokenUtils";

export const ProductoService = {
    getProductos,
    storeProducto,
    updateProducto,
    deleteProducto,
    comboProductos,
    cargaMasiva,
    exportar,
    exportarPlantilla
}

function getProductos(values){
    const query = new URLSearchParams(values).toString();
    const url = `${constants.API_URL}/productos?${query}`;
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
function storeProducto(values){
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            'authorization': getAuthHeaders()
        },
        body: JSON.stringify(values),

    };
    return fetch(`${constants.API_URL}/productos/guardar`, requestOptions)
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
function updateProducto(values){
    const requestOptions = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            'authorization': getAuthHeaders()
        },
        body: JSON.stringify(values),

    };
    return fetch(`${constants.API_URL}/productos/actualizar/${values.id}`, requestOptions)
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
function deleteProducto(values){
    const requestOptions = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            'authorization': getAuthHeaders()
        },
        body: JSON.stringify(values),

    };
    return fetch(`${constants.API_URL}/productos/eliminar`, requestOptions)
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
function comboProductos(){
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            'authorization': getAuthHeaders()
        },
        // body: JSON.stringify(values),

    };
    return fetch(`${constants.API_URL}/comboProductos`, requestOptions)
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
  const url = `${constants.API_URL}/productos/cargaMasiva`;
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
  const url = `${constants.API_URL}/productos/exportar`;
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
function exportarPlantilla() {
  const url = `${constants.API_URL}/productos/descargarPlantilla`;
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