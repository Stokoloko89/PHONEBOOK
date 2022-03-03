function Filter(props) {
  return (
    <div>
      <label>Search Contacts</label>
      <input type="text" onChange={props.onChange} />
    </div>
  );
}

export default Filter;
