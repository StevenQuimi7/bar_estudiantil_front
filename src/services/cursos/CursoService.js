import {constants} from "../../config/constants";
import {getAuthHeaders} from "../../utils/tokenUtils";

export const CursoService = {
    getCursos,
    storeCurso,
    updateCurso,
    deleteCurso,
    getComboCursos
}

function getCursos(values){
    const query = new URLSearchParams(values).toString();
    const url = `${constants.API_URL}/cursos?${query}`;
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
function storeCurso(values){
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            'authorization': getAuthHeaders()
        },
        body: JSON.stringify(values),

    };
    return fetch(`${constants.API_URL}/cursos/guardar`, requestOptions)
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
function updateCurso(values){
    const requestOptions = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            'authorization': getAuthHeaders()
        },
        body: JSON.stringify(values),

    };
    return fetch(`${constants.API_URL}/cursos/actualizar/${values.id}`, requestOptions)
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
function deleteCurso(values){
    const requestOptions = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            'authorization': getAuthHeaders()
        },
        body: JSON.stringify(values),

    };
    return fetch(`${constants.API_URL}/cursos/eliminar`, requestOptions)
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


function getComboCursos(){
    const url = `${constants.API_URL}/cursos/comboCursos`;
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