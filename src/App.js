import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import Filter from "./Components/Filter";
import PersonForm from "./Components/PersonForm";
import Persons from "./Components/Persons";
import personService from "./src/services/Phonebook";

const App = () => {
  const [newName, setNewName] = useState("");
  const [newNum, setNewNum] = useState("");
  const [query, setQuery] = useState("");
  const [persons, setPersons] = useState([]);

  useEffect(() => {
    personService.getAll().then((currContactList) => {
      setPersons(currContactList);
    });
  }, []);

  const addPersonHandler = (e) => {
    e.preventDefault();

    if (persons.some((person) => person.name === newName)) {
      alert(`${newName} is already added to the Phonebook`);
      return;
    } else {
      const newPerson = {
        name: newName,
        number: newNum,
        id: nanoid(),
      };

      personService.create(newPerson).then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setNewName("");
        setNewNum("");
      });
    }
  };

  const deletePersonHandler = (e) => {
    if (window.confirm(`Are you sure you want to delete ${e.target.value}`)) {
      const toBeRemoved = persons.filter(
        (person) => person.name === e.target.value
      );

      const updatedPersons = persons.filter(
        (person) => person.id !== toBeRemoved[0].id
      );

      setPersons(updatedPersons);
      setNewName("");
      setNewNum("");
      personService.remove(toBeRemoved[0].id).then((success) => {
        console.log(success);
      });
    }
  };

  const onChangeNameHandler = (e) => {
    setNewName(e.target.value);
  };

  const onChangeNumHandler = (e) => {
    setNewNum(e.target.value);
  };

  const getFilteredPersons = (query, persons) =>
    !query
      ? persons
      : persons.filter((person) =>
          person.name.toLowerCase().includes(query.toLowerCase())
        );

  const filteredPersons = getFilteredPersons(query, persons);

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter onChange={(e) => setQuery(e.target.value)}></Filter>
      <PersonForm
        onSubmit={addPersonHandler}
        value={newName}
        onNameChange={onChangeNameHandler}
        input
        numValue={newNum}
        onNumChange={onChangeNumHandler}
      ></PersonForm>
      <h2>Numbers</h2>
      <Persons persons={filteredPersons} deleteContact={deletePersonHandler}>
        {" "}
      </Persons>
    </div>
  );
};

export default App;
