"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import {
  Box,
  Paper,
  Avatar,
  Typography,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import HistoryIcon from "@mui/icons-material/History";
import BuildIcon from "@mui/icons-material/Build";
import LogoutIcon from "@mui/icons-material/Logout";

export default function AccountSidebar({ activePage }) {
  const { user, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <Paper sx={{ p: 3, textAlign: "center" }}>
      <Avatar
        sx={{
          width: 70,
          height: 70,
          mx: "auto",
          mb: 2,
          bgcolor: "primary.main",
          color: "primary.contrastText",
        }}
      >
        <PersonIcon />
      </Avatar>

      <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
        {user?.username}
      </Typography>

      <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
        {user?.email}
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <List disablePadding>
        <ListItemButton
          component={Link}
          href="/account"
          selected={activePage === "profile"}
          sx={{ borderRadius: 1, mb: 1 }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <PersonIcon
              color={activePage === "profile" ? "primary" : "inherit"}
            />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItemButton>

        <ListItemButton
          component={Link}
          href="/account/orders"
          selected={activePage === "orders"}
          sx={{ borderRadius: 1, mb: 1 }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <HistoryIcon
              color={activePage === "orders" ? "primary" : "inherit"}
            />
          </ListItemIcon>
          <ListItemText primary="Order History" />
        </ListItemButton>

        <ListItemButton
          component={Link}
          href="/account/builds"
          selected={activePage === "builds"}
          sx={{ borderRadius: 1, mb: 1 }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <BuildIcon
              color={activePage === "builds" ? "primary" : "inherit"}
            />
          </ListItemIcon>
          <ListItemText primary="Saved Builds" />
        </ListItemButton>

        <ListItemButton onClick={handleLogout} sx={{ borderRadius: 1 }}>
          <ListItemIcon sx={{ minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Paper>
  );
}
