import axios from 'axios';

const baseUrl = 'http://localhost:3001/api/persons';

const getAll = () => {
  return axios.get(baseUrl).then(response => response.data);
};

const create = (newPerson) => {
  return axios.post(baseUrl, newPerson).then(response => response.data);
};

const deletePerson = (id) => {
  return axios.delete(`${baseUrl}/${id}`).then(response => response.data)  //`${baseUrl}/${id}`
}

export default { getAll, create, deletePerson };
