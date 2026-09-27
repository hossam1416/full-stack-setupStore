"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "../../lib/api";
import Link from "next/link";
import { TextField, Button, Typography, Alert } from "@mui/material";
import AuthLayout from "../../components/AuthLayout";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // function to handle form submission
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
      });

      router.push("/login");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join Setup Store to build your ultimate rig"
      imageSrc="/images/gaming pc setup rgb_4.jpg"
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Full Name"
          type="text"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          sx={{ mb: 3 }}
        />

        <TextField
          label="Email Address"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          sx={{ mb: 3 }}
        />

        <TextField
          label="Account Password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          sx={{ mb: 4 }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            py: 1.5,
            fontWeight: "bold",
          }}
        >
          Register
        </Button>
      </form>

      <Typography
        variant="body2"
        sx={{
          color: "text.secondary",
          textAlign: "center",
          mt: 4,
        }}
      >
        Already have an account?{" "}
        <Link
          href="/login"
          style={{
            color: "inherit",
            fontWeight: "bold",
            textDecoration: "none",
          }}
        >
          Sign in
        </Link>
      </Typography>
    </AuthLayout>
  );
}
