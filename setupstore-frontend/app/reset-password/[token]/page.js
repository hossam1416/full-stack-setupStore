"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiRequest } from "../../../lib/api";
import Link from "next/link";
import { TextField, Button, Alert, Box } from "@mui/material";
import AuthLayout from "../../../components/AuthLayout";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const data = await apiRequest(`/auth/reset-password/${token}`, {
        method: "POST",
        body: JSON.stringify({ password }),
      });

      setMessage(data.message);

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter your new password below."
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
          label="New Password"
          type="password"
          fullWidth
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 3 }}
        />

        <TextField
          label="Confirm New Password"
          type="password"
          fullWidth
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
          {loading ? "Resetting..." : "Reset Password"}
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
