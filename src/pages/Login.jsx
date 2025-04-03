import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import '../css/styles.css'; // Import the CSS file for styling
import supabase from "../helper/supabaseClient";




export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const [loading, setLoading] = useState(false); // State for form submission
  const navigate = useNavigate(); // React Router hook for navigation

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    setLoading(true); // Start loading state

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    setLoading(false); // End loading state
    if (error) {
      console.error("Error signing up:", error.message);
    } else {
      console.log("Sign-up successful:", data);
      navigate("/note"); // Redirect to home page
    }
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev); // Toggle password visibility
  };

  return (
    <div className="container">
      <div className="formContainer">
        <h1>Entrar</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input"
          />
          <div className="passwordField">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input"
            />
            <span
              className="eyeIcon"
              onClick={handleTogglePassword}
              role="button"
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
          </div>
          <button type="submit" className="button" disabled={loading}>
            {loading ? "Processing..." : "Entrar"}
          </button>
        </form>
        <Link to="/">Voltar ao início</Link>
      </div>
    </div>
  );
}
