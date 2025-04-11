import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Note from '../components/Note';
import CreateArea from '../components/CreateArea';
import supabase from "../helper/supabaseClient";

function NotePage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Fetch authenticated user and then the user's notes
  useEffect(() => {
    async function fetchData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.error('User not logged in.');
        // Optionally, you might redirect to the login page if no user is found.
        setLoading(false);
        return;
      }

      setUser(user);

      const { data, error } = await supabase
        .from('Notes')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching notes:', error);
      } else {
        setNotes(data);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  // Optimistic add note (as defined previously)
  async function addNote(newNote) {
    // Create an optimistic note with a temporary ID.
    const optimisticId = `temp-${Date.now()}`;
    const optimisticNote = {
      id: optimisticId,
      title: newNote.title,
      content: newNote.content,
    };

    // Update local state immediately
    setNotes((prevNotes) => [...prevNotes, optimisticNote]);

    // Retrieve the authenticated user.
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not logged in.");
      setNotes((prevNotes) =>
        prevNotes.filter((note) => note.id !== optimisticId)
      );
      return;
    }

    // Insert the note into the database.
    const { data, error } = await supabase
      .from("Notes")
      .insert(
        [
          {
            user_id: user.id,
            title: newNote.title,
            content: newNote.content,
          },
        ],
        { returning: "representation" }
      );

    if (error) {
      console.error("Error adding note:", error);
      // Roll back the optimistic note on error.
      setNotes((prevNotes) =>
        prevNotes.filter((note) => note.id !== optimisticId)
      );
      return;
    }

    if (data && data.length > 0) {
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === optimisticId ? data[0] : note
        )
      );
    } else {
      console.error("Insert succeeded but no note was returned. Retrying fetch.");
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

  // Optimistic delete note (as defined previously)
  async function deleteNote(id) {
    const backupNote = notes.find((note) => note.id === id);
    setNotes((prevNotes) =>
      prevNotes.filter((note) => note.id !== id)
    );

    const { error } = await supabase
      .from("Notes")
      .delete({ returning: "representation" })
      .eq("id", id);

    if (error) {
      console.error("Error deleting note:", error);
      setNotes((prevNotes) => [...prevNotes, backupNote]);
    }
  }

  // Show a loading indicator until authentication and note fetching are complete.
  if (loading) {
    return (
      <div>
        <Header />
        <p>Loading notes...</p>
        <Footer />
      </div>
    );
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

    </div>
  );
}

export default NotePage;