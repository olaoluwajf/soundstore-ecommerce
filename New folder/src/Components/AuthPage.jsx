import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { auth } from "../firebase/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { admins } from "../roles"; 
import "./AuthPage.css";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(true);
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
      if (isSignUp) {
      
        await createUserWithEmailAndPassword(auth, email, password);
        setSuccessMsg("Account created successfully. Redirecting...");
        setTimeout(() => navigate("/"), 1200);
      } else {
        
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        if (admins.includes(user.email)) {
        
          setSuccessMsg("Welcome Admin! Redirecting...");
          setTimeout(() => navigate("/admin"), 1200); 
        } else {
          
          setSuccessMsg("Welcome back! Redirecting...");
          setTimeout(() => navigate("/"), 1200);
        }
      }
    } catch (err) {
      setAuthError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isSignUp ? "Create an Account" : "Welcome Back"}</h2>

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
            {loading ? "Please wait..." : isSignUp ? "Sign Up" : "Login"}
          </button>
        </form>

        <p className="toggle-text" onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp
            ? "Already have an account? Login"
            : "Don't have an account? Sign Up"}
        </p>
      </div>
    </div>
  );
}
