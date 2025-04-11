// NotePage.jsx
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Note from "../components/Note";
import CreateArea from "../components/CreateArea";
import supabase from "../helper/supabaseClient";

function NotePage() {
  const [notes, setNotes] = useState([]);

  // Fetch notes for the authenticated user upon component mount.
  useEffect(() => {
    async function fetchNotes() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        console.error("User not logged in.");
        return;
      }
      const { data, error } = await supabase
        .from("Notes")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching notes:", error);
      } else {
        setNotes(data);
      }
    }
    fetchNotes();
  }, []);

  // Optimistic add note
  async function addNote(newNote) {
    // Create an optimistic note with a temporary ID
    const optimisticId = `temp-${Date.now()}`;
    const optimisticNote = {
      id: optimisticId,
      title: newNote.title,
      content: newNote.content,
    };

    // Update local state immediately
    setNotes((prevNotes) => [...prevNotes, optimisticNote]);

    // Retrieve the authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not logged in.");
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== optimisticId));
      return;
    }

    // Insert into the DB with the option to return the inserted row
    const { data, error } = await supabase
      .from("Notes")
      .insert(
        [
          {
            user_id: user.id, // Must comply with your RLS policy
            title: newNote.title,
            content: newNote.content,
          },
        ],
        { returning: "representation" }
      );

    if (error) {
      console.error("Error adding note:", error);
      // Roll back the optimistic note in case of error
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== optimisticId));
      return;
    }

    if (data && data.length > 0) {
      // Replace the optimistic note with the note from Supabase
      setNotes((prevNotes) =>
        prevNotes.map((note) => (note.id === optimisticId ? data[0] : note))
      );
    } else {
      console.error("Insert succeeded but no note was returned. Retrying fetch.");
      // As a fallback, re-fetch all notes for the user so the UI updates correctly.
      const { data: notesData, error: fetchError } = await supabase
        .from("Notes")
        .select("*")
        .eq("user_id", user.id);
      if (fetchError) {
        console.error("Error re-fetching notes:", fetchError);
      } else {
        setNotes(notesData);
      }
    }
  }

  // Optimistic delete note
  async function deleteNote(id) {
    // Save a backup for rollback if needed
    const backupNote = notes.find((note) => note.id === id);
    // Remove the note immediately for a fluid feel
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));

    // Try to delete from the database
    const { error } = await supabase
      .from("Notes")
      .delete({ returning: "representation" })
      .eq("id", id);

    if (error) {
      console.error("Error deleting note:", error);
      // Roll back if deletion fails
      setNotes((prevNotes) => [...prevNotes, backupNote]);
    }
  }

  return (
    <div>
      <Header />
      <CreateArea onAdd={addNote} />
      {notes.map((note) => (
        <Note
          key={note.id}
          id={note.id}
          title={note.title}
          content={note.content}
          onDelete={deleteNote}
        />
      ))}
      <Footer />
    </div>
  );
}

export default NotePage;