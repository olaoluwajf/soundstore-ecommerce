import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { auth } from "../firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { admins } from "../roles";
import "./AuthPage.css";

export default function LoginPage() {
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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (admins.includes(user.email)) {
        toast.success("Welcome Admin! Redirecting...");
        setTimeout(() => navigate("/admin"), 1200);
      } else {
        toast.success("Welcome back! Redirecting...");
        setTimeout(() => navigate("/"), 1200);
      }
    } catch (err) {
      toast.error("Invalid Credentials");
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>

        {authError && <p className="auth-error">{authError}</p>}
        {successMsg && <p className="auth-success">{successMsg}</p>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="email"
            placeholder="Email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
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
            {loading ? "Please wait..." : "Login"}
          </button>
        </form>

        <p className="toggle-text" onClick={() => navigate("/signup")}>
          Don't have an account? Sign Up
        </p>
      </div>
    </div>
  );
}
