import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import supabase from "../helper/supabaseClient";
import '../css/styles.css';

const Homepage = () => {
  useParams(); // Used for routing if needed
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the authenticated user when the component mounts
  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    }
    fetchUser();
  }, []);

  // Navigation helpers
  const navigateToLogin = () => {
    window.location.href = '/login';
  };

  const navigateToRegister = () => {
    window.location.href = '/register';
  };

  const navigateToNotes = () => {
    window.location.href = '/note';
  };

  // Show a loading message until the auth check is complete
  if (loading) {
    return (
      <div className="homepage-container">
        <h1 className="Titulo">Bem vindo ao CopperMind</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="homepage-container">
      <h1 className="Titulo">Bem vindo ao CopperMind</h1>
      <div className="button-container">
        {user ? (
          // If a user is logged in, show the "Continuar" button
          <button className="button" onClick={navigateToNotes}>
            Continuar
          </button>
        ) : (
          // If no user is logged in, show the "Entrar" and "Criar conta" buttons
          <>
            <button className="button" onClick={navigateToLogin}>
              Entrar
            </button>
            <button className="button" onClick={navigateToRegister}>
              Criar conta
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Homepage;