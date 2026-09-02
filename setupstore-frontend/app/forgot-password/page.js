"use client";

import { useState } from "react";
import { apiRequest } from "../../lib/api";
import Link from "next/link";
import { TextField, Button, Alert, Box } from "@mui/material";
import AuthLayout from "../../components/AuthLayout";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const data = await apiRequest("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      setMessage(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Enter your email address and we'll send you a link to reset your password."
      imageSrc="/images/gaming pc setup rgb_.jpg"
    >
      {message && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {message}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Email Address"
          type="email"
          fullWidth
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          sx={{
            py: 1.5,
            fontWeight: "bold",
          }}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>

      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Link
          href="/login"
          style={{
            color: "inherit",
            fontWeight: "bold",
            textDecoration: "none",
          }}
        >
          Back to Login
        </Link>
      </Box>
    </AuthLayout>
  );
}
