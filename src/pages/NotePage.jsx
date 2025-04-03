import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Note from "../components/Note";
import CreateArea from "../components/CreateArea";

import supabase from "../helper/supabaseClient";

function NotePage() {
  const [notes, setNotes] = useState([]);

  function addNote(newNote) {
    setNotes(prevNotes => {
      return [...prevNotes, newNote];
    });
  }

  function deleteNote(id) {
    setNotes(prevNotes => {
      return prevNotes.filter((noteItem, index) => {
        return index !== id;
      });
    });
  }

  function testUserId() {
    const user = supabase.auth.getSession();  // Get the current logged-in user
    console.log("Session data:", session);

    if (user) {
      console.log("User ID:", user.id);  // Log the user ID to the console
    } else {
      console.log("No user is logged in.");
    }
  }


  return (
    <div>
      <Header />
      <CreateArea onAdd={addNote} />
      {notes.map((noteItem, index) => {
        return (
          <React.Fragment key={index}>
            <Note
              id={index}
              title={noteItem.title}
              content={noteItem.content}
              onDelete={deleteNote}
            />
            <button onClick={testUserId}>Test User ID</button>
          </React.Fragment>
        );
      })}

    </div>
  );
}

export default NotePage;