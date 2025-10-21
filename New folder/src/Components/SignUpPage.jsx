
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { auth } from "../firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import "./AuthPage.css";

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const { email, password } = data;
    setLoading(true);
    setAuthError("");
    setSuccessMsg("");

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccessMsg("Account created successfully. Redirecting...");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setAuthError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create an Account</h2>

        {authError && <p className="auth-error">{authError}</p>}
        {successMsg && <p className="auth-success">{successMsg}</p>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="email"
            placeholder="Email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}₦/,
                message: "Invalid email format",
              },
            })}
          />
          {errors.email && <span className="error">{errors.email.message}</span>}

          <input
            type="password"
            placeholder="Password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          {errors.password && (
            <span className="error">{errors.password.message}</span>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Please wait..." : "Sign Up"}
          </button>
        </form>

        <p className="toggle-text" onClick={() => navigate("/login")}>
          Already have an account? Login
        </p>
      </div>
    </div>
  );
}
