import React, { useEffect, useState } from "react";
import List from "./List";

const App = () => {
  const [lists, setLists] = useState(() => {
    const storedLists = localStorage.getItem("lists");
    return storedLists ? JSON.parse(storedLists) : [];
  });
  const [inputText, setInputText] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const handleChange = (e) => setInputText(e.target.value);
  const handleChangeEdit = (e) => setEditText(e.target.value);
  const handleSubmit = (e) => {
    if (inputText !== "") {
      setLists([...lists, inputText]);
      setAlertMessage("Item Added To The List");
      setInputText("");
    }
    e.preventDefault();
  };
  const handleSubmitEdit = (e) => {
    setLists((prev) => {
      prev.splice(editIndex, 1);
      return [...prev, editText];
    });
    setAlertMessage("Successfully Updated");
    setIsEdit(false);
    setEditText("");
    e.preventDefault();
  };
  const handleClearAll = () => {
    setLists([]);
    setAlertMessage("Emptied List");
  };
  const deleteFunc = (deleteIndex) => {
    setLists((prev) => prev.filter((e, i) => i !== deleteIndex));
    setAlertMessage("Successfully Removed");
  };
  const editFunc = (editIndex) => {
    setEditIndex(editIndex);
    setEditText(lists[editIndex]);
    setIsEdit(true);
  };

  useEffect(() => {
    localStorage.setItem("lists", JSON.stringify(lists));
  }, [lists]);

  useEffect(() => {
    const id = setInterval(() => {
      setAlertMessage("");
    }, 2000);
    return () => {
      clearInterval(id);
    };
  }, [alertMessage]);

  return (
    <div className="outer-container">
      {!isEdit ? (
        <div className="inner-container">
          {alertMessage !== "" && (
            <p className="alert-message">{alertMessage}</p>
          )}
          <h1 className="title">ToDo</h1>
          <form onSubmit={handleSubmit}>
            <input
              type={"text"}
              autoComplete={"off"}
              onChange={handleChange}
              value={inputText}
              placeholder={"e.g. buy milk"}
            />
            <input
              type={"submit"}
              disabled={inputText === "" ? true : false}
              style={{ pointerEvents: inputText === "" && "none" }}
            />
          </form>
          {lists.map((e, i) => (
            <List
              key={i}
              text={e}
              deleteFunc={deleteFunc}
              editFunc={editFunc}
              currentIndex={i}
            />
          ))}
          {lists.length !== 0 && (
            <div className="clear-wrap">
              <button onClick={handleClearAll}>Clear All</button>
            </div>
          )}
        </div>
      ) : (
        <div className="inner-container">
          <form onSubmit={handleSubmitEdit}>
            <input
              type={"text"}
              autoComplete={"off"}
              onChange={handleChangeEdit}
              value={editText}
            />
            <input
              type={"submit"}
              value={"Edit"}
              disabled={editText === "" ? true : false}
            />
          </form>
        </div>
      )}
    </div>
  );
};

export default App;
