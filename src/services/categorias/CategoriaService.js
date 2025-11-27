import {constants} from "../../config/constants";
import {getAuthHeaders} from "../../utils/tokenUtils";

export const CategoriaService = {
    getCategorias,
    storeCategoria,
    updateCategoria,
    deleteCategoria,
    comboCategorias
}

function getCategorias(values){
    const query = new URLSearchParams(values).toString();
    const url = `${constants.API_URL}/categorias?${query}`;
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
function storeCategoria(values){
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            'authorization': getAuthHeaders()
        },
        body: JSON.stringify(values),

    };
    return fetch(`${constants.API_URL}/categorias/guardar`, requestOptions)
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
function updateCategoria(values){
    const requestOptions = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            'authorization': getAuthHeaders()
        },
        body: JSON.stringify(values),

    };
    return fetch(`${constants.API_URL}/categorias/actualizar/${values.id}`, requestOptions)
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
function deleteCategoria(values){
    const requestOptions = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            'authorization': getAuthHeaders()
        },
        body: JSON.stringify(values),

    };
    return fetch(`${constants.API_URL}/categorias/eliminar`, requestOptions)
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
function comboCategorias(){
    const requestOptions = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            'authorization': getAuthHeaders()
        },
        // body: JSON.stringify(values),

    };
    return fetch(`${constants.API_URL}/comboCategorias`, requestOptions)
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