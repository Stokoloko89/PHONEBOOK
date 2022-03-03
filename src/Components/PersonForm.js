function PersonForm(props) {
  return (
    <form onSubmit={props.onSubmit}>
      <div>
        Name: <input value={props.value} onChange={props.onNameChange} />
      </div>
      <div>
        Number: <input value={props.numValue} onChange={props.onNumChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
}

export default PersonForm;
