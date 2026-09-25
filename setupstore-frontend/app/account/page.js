"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import AccountSidebar from "../../components/AccountSidebar";
import {
  Box,
  Grid,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
} from "@mui/material";

export default function AccountPage() {
  const { user, updateUser } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [error, setError] = useState("");

  async function handleUpdateProfile() {
    setError("");
    setProfileMessage("");

    try {
      apiRequest("/users/profile", {
        method: "PUT",
        body: JSON.stringify({ username, email }),
      });

      updateUser(updated);
      setProfileMessage("Profile updated successfully");
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleUpdatePassword() {
    setError("");
    setPasswordMessage("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    try {
      await apiRequest("/auth/password", {
        method: "PUT",
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      setPasswordMessage("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 4, md: 6 },
        py: { xs: 3, md: 6 },
        maxWidth: 1200,
        mx: "auto",
      }}
    >
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 3 }}>
          <AccountSidebar activePage="profile" />
        </Grid>

        <Grid size={{ xs: 12, md: 9 }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Basic Information
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {profileMessage && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {profileMessage}
              </Alert>
            )}

            <TextField
              label="Username"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              label="Email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Button variant="contained" onClick={handleUpdateProfile}>
              Save Changes
            </Button>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Change Password
            </Typography>

            {passwordMessage && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {passwordMessage}
              </Alert>
            )}

            <TextField
              label="Current Password"
              type="password"
              fullWidth
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="New Password"
                  type="password"
                  fullWidth
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Confirm New Password"
                  type="password"
                  fullWidth
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Grid>
            </Grid>

            <Button variant="contained" onClick={handleUpdatePassword}>
              Update Password
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
