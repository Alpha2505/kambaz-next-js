"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FormControl } from "react-bootstrap";
import * as client from "../client";

export default function Signup() {
  const router = useRouter();
  const [user, setUser] = useState<any>({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "STUDENT"
  });
  const [error, setError] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");

  const handleSignup = async () => {
    // Validation
    if (!user.username || !user.password) {
      setError("Username and password are required");
      return;
    }

    if (user.password !== verifyPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await client.signup(user);
      router.push("/Account/Signin");
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed. Username may already exist.");
      console.error("Signup error:", err);
    }
  };

  return (
    <div id="wd-signup-screen" className="w-50">
      <h1>Sign up</h1>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <FormControl 
        id="wd-username"
        placeholder="username"
        className="mb-2"
        value={user.username}
        onChange={(e) => setUser({ ...user, username: e.target.value })}
      />

      <FormControl 
        id="wd-password"
        placeholder="password" 
        type="password"
        className="mb-2"
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
      />

      <FormControl 
        id="wd-verify-password"
        placeholder="verify password"
        type="password" 
        className="mb-2"
        value={verifyPassword}
        onChange={(e) => setVerifyPassword(e.target.value)}
      />

      <button 
        id="wd-signup-btn"
        onClick={handleSignup}
        className="btn btn-primary w-100 mb-2"
      >
        Sign up
      </button>

      <Link id="wd-signin-link" href="/Account/Signin">
        Sign in
      </Link>
    </div>
  );
}