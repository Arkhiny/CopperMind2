import React from "react";
import { FaLightbulb } from "react-icons/fa";
import supabase from "../helper/supabaseClient";

function Header({ userName }) {
  // Handle logout: sign out and then redirect to home page ("/")
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/"; // Redirect to the home page
  };

  return (
    <header className="header">
      <h1 className="header-title">
        <FaLightbulb />
        CopperMind
      </h1>
      {/* User's name and logout button */}
      <div className="user-section">
        {userName && <p className="user-name">{userName}</p>}
        <button onClick={handleLogout} className="logout-btn">
          Sair
        </button>
      </div>
    </header>
  );
}

export default Header;