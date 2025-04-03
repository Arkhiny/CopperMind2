import React from "react";
import { FaLightbulb } from "react-icons/fa";

function Header() {
  return (
    <header className="header">
      <h1 className="header-title">
        <FaLightbulb /> 
        CopperMind
      </h1>
    </header>
  );
}

export default Header;