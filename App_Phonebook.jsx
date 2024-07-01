import { useState, useEffect } from 'react';
import axios from 'axios';
import Filter from './Filter';
import PersonForm from './PersonForm';
import Persons from './Persons';
import personService from './personService';
import Notification from './Notification'

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    axios
      .get('http://localhost:3001/api/persons')
      .then(response => {
        setPersons(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const addPerson = (event) => {
    event.preventDefault();
    const nameExists = persons.some(person => person.name === newName);
    if (nameExists) {
      alert(`${newName} is already added to phonebook`);
    } else {
      const newPerson = {name: newName, number: newNumber };
      personService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson));
          setNewName('');
          setNewNumber('');
          showNotification(`Added ${returnedPerson.name}`)
        })
        .catch(error => {
          console.error('Error adding person:', error);
        });
    }
  };

  const handleDelete = (id) => {
    const person = persons.find(p => p.id === id)
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
        })
        .catch(error => {
          console.error('Error deleting person:', error)
        })
    }
  }

  const showNotification = (message) => {
    setNotification(message)
    setTimeout(() => {
      setNotification(null)
    }, 5000) // Clear notification after 5 seconds
  }

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      {notification && <Notification message={notification} />}
      <Filter searchQuery={searchQuery} handleSearchChange={handleSearchChange} />
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={filteredPersons} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
