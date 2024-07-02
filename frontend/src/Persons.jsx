const Persons = ({ persons, handleDelete }) => {
    return (
      <ul>
        {persons.map((person, index) => (
          <li key={index}>
            {person.name} {person.number}
            <button onClick={() => handleDelete(person.id)}>delete</button>
          </li>
        ))}
      </ul>
    );
  };
  
  export default Persons;
  