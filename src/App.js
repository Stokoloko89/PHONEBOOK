import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import Filter from "./Components/Filter";
import PersonForm from "./Components/PersonForm";
import Persons from "./Components/Persons";
import personService from "./src/services/Phonebook";
import Notification from "./Components/Notification";
import ErrorNotification from "./Components/ErrorNotification";

const App = () => {
  const [newName, setNewName] = useState("");
  const [newNum, setNewNum] = useState("");
  const [query, setQuery] = useState("");
  const [persons, setPersons] = useState([]);
  const [confirmation, setConfirmation] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    personService.getAll().then((currContactList) => {
      setPersons(currContactList);
    });
  }, []);

  const addPersonHandler = (e) => {
    e.preventDefault();

    if (
      persons.some((person) => person.name === newName && newNum.length === 0)
    ) {
      alert(`${newName} is already added to the Phonebook`);
      return;
    }
    if (
      persons.some((person) => person.name === newName && newNum.length !== 0)
    ) {
      if (
        window.confirm(
          `${newName} is already added to the Phonebook, replace the old number with a new one?`
        )
      ) {
        const person = persons.find((person) => person.name === newName);
        const changedPerson = { ...person, number: newNum };

        personService
          .update(person.id, changedPerson)
          .then((updatedPersonsList) => {
            setPersons(
              persons.map((person) =>
                person.id !== changedPerson.id ? person : updatedPersonsList
              )
            );
          });
        setConfirmation(`Updated ${changedPerson.name} number`);
        setTimeout(() => {
          setConfirmation(null);
        }, 1000);
        setNewName("");
        setNewNum("");
      }
    } else {
      const newPerson = {
        name: newName,
        number: newNum,
        id: nanoid(),
      };

      personService.create(newPerson).then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setConfirmation(`Added ${newPerson.name}`);
        setTimeout(() => {
          setConfirmation(null);
        }, 1000);
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

      const updatePersons = persons.filter(
        (person) => person.id !== toBeRemoved[0].id
      );

      setPersons(updatePersons);
      setNewName("");
      setNewNum("");
      personService
        .remove(toBeRemoved[0].id)
        .then((success) => {
          console.log(success);
        })
        .catch((error) => {
          setErrorMessage(
            `${toBeRemoved[0].name} has already been removed from server`
          );
          setTimeout(() => {
            setErrorMessage(null);
          }, 2000);
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
      <ErrorNotification error={errorMessage}></ErrorNotification>
      <Notification message={confirmation}></Notification>
      <h2>Add a new Contact</h2>
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
