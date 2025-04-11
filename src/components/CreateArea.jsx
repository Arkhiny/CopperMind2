// CreateArea.jsx
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";

function CreateArea(props) {
  const [isExpanded, setExpanded] = useState(false);

  const [note, setNote] = useState({
    title: "",
    content: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setNote((prevNote) => ({
      ...prevNote,
      [name]: value,
    }));
  }

  // When the note is submitted, call the onAdd function and then clear the note state
  function submitNote(event) {
    event.preventDefault(); // Prevent page reload
    props.onAdd(note);
    setNote({
      title: "",
      content: "",
    });
  }

  function expand() {
    setExpanded(true);
  }

  return (
    <div className="note-creator">
      <form className="create-note">
        {isExpanded && (
          <input
            name="title"
            onChange={handleChange}
            value={note.title}
            placeholder="Title"
          />
        )}

        <textarea
          name="content"
          onClick={expand}
          onChange={handleChange}
          value={note.content}
          placeholder="Take a note..."
          rows={isExpanded ? 3 : 1}
        />
        {isExpanded && (
          <button onClick={submitNote} className="add-button">
            <FaPlus />
          </button>
        )}
      </form>
    </div>
  );
}

export default CreateArea;