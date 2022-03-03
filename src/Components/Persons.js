function Persons(props) {
  const filteredPersons = props.persons;
  return (
    <div>
      {filteredPersons.map((person) => (
        <p key={person.name}>
          {person.name} {person.number}
          <button
            value={person.name}
            type="button"
            onClick={props.deleteContact}
          >
            delete
          </button>
        </p>
      ))}
    </div>
  );
}

export default Persons;
