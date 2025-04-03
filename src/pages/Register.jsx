import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import '../css/styles.css'; // Import the CSS file for styling
import supabase from "../helper/supabaseClient";


export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [loading, setLoading] = useState(false); // State for form submission
  const navigate = useNavigate(); // React Router hook for navigation

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[\W_]/.test(password)) strength++;
    if (password.length >= 12) strength++;
    return strength;
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(calculatePasswordStrength(newPassword));
  };

  const getProgressBarColor = () => {
    switch (passwordStrength) {
      case 1:
        return "red";
      case 2:
        return "orange";
      case 3:
        return "green";
      case 4:
      case 5:
        return "#00C853"; // Vibrant green
      default:
        return "transparent";
    }
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev); // Toggle password visibility
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    setLoading(true); // Start loading state

    const { data, error } = await supabase.auth.signUp({
      name: name,
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

  return (
    <div className="container">
      <div className="formContainer">
        <h1>Criar conta</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="input"
          />
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
              type={showPassword ? "text" : "password"} // Toggle type
              placeholder="Senha"
              value={password}
              onChange={handlePasswordChange}
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
          <div className="progressBar">
            <div
              className="progress"
              style={{
                width: `${passwordStrength * 20}%`,
                backgroundColor: getProgressBarColor(),
              }}
            ></div>
          </div>
          <button type="submit" className="button" disabled={loading}>
            {loading ? "Processing..." : "Criar"}
          </button>
        </form>
        <Link to="/">Voltar ao início</Link>
      </div>
    </div>
  );
}