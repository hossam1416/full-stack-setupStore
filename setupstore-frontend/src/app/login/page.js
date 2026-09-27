"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";
import { TextField, Button, Typography, Alert, Box } from "@mui/material";
import AuthLayout from "../../components/AuthLayout";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();
  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      login(data, data.token);
      router.push("/products");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Welcome back to Setup Store"
      imageSrc="/images/gaming pc setup rgb_.jpg"
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
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
          label="Account password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          sx={{ mb: 1 }}
        />

        <Box sx={{ textAlign: "right", mb: 3 }}>
          <Link
            href="/forgot-password"
            style={{
              color: "inherit",
              fontSize: "0.85rem",
              textDecoration: "none",
            }}
          >
            Forgot password?
          </Link>
        </Box>

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
          Sign In
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
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          style={{
            color: "inherit",
            fontWeight: "bold",
            textDecoration: "none",
          }}
        >
          Register now!
        </Link>
      </Typography>
    </AuthLayout>
  );
}
