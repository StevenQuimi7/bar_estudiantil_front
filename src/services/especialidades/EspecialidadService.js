import {constants} from "../../config/constants";
import {getAuthHeaders} from "../../utils/tokenUtils";

export const EspecialidadService = {
    getEspecialidades,
    storeEspecialidad,
    updateEspecialidad,
    deleteEspecialidad,
    getComboEspecialidades
}

function getEspecialidades(values){
    const query = new URLSearchParams(values).toString();
    const url = `${constants.API_URL}/especialidades?${query}`;
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
function getComboEspecialidades(){
    const url = `${constants.API_URL}/especialidades/comboEspecialidades`;
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
function storeEspecialidad(values){
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            'authorization': getAuthHeaders()
        },
        body: JSON.stringify(values),

    };
    return fetch(`${constants.API_URL}/especialidades/guardar`, requestOptions)
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
function updateEspecialidad(values){
    const requestOptions = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            'authorization': getAuthHeaders()
        },
        body: JSON.stringify(values),

    };
    return fetch(`${constants.API_URL}/especialidades/actualizar/${values.id}`, requestOptions)
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
function deleteEspecialidad(values){
    const requestOptions = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            'authorization': getAuthHeaders()
        },
        body: JSON.stringify(values),

    };
    return fetch(`${constants.API_URL}/especialidades/eliminar`, requestOptions)
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