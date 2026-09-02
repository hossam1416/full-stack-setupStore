"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const getNavButtonStyles = (isActive) => ({
  borderRadius: "20px",
  px: 2,
  color: isActive ? "primary.contrastText" : "text.primary",
  backgroundColor: isActive ? "primary.main" : "transparent",
  transition: "background-color 0.25s ease, color 0.25s ease",
  "&:hover": {
    backgroundColor: isActive ? "primary.main" : "action.hover",
    color: isActive ? "primary.contrastText" : "primary.main",
  },
});

const getCartButtonStyles = (isActive) => ({
  color: isActive ? "primary.main" : "text.primary",
  transition: "transform 0.2s ease, color 0.3s ease",
  "&:hover": {
    color: "primary.main",
    transform: "scale(1.1)",
  },
});

const getSignUpStyles = (isActive) => ({
  backgroundColor: isActive ? "primary.dark" : "primary.main",
  color: "primary.contrastText",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "primary.dark",
    transform: "translateY(-1px)",
    boxShadow: 4,
  },
});

// Main fixed navigation items
const mainNavItems = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products" },
  { label: "PC Builder", href: "/builder" },
  { label: "Compare", href: "/compare" },
];

// Reusable Cart Button for both Desktop & Mobile
function CartButton({ pathname }) {
  return (
    <IconButton
      component={Link}
      href="/cart"
      color="inherit"
      sx={getCartButtonStyles(pathname === "/cart")}
    >
      <ShoppingCartIcon />
    </IconButton>
  );
}

export default function Header() {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Prevent header flickering on initial auth load
  if (loading) return null;

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  // Dynamic mobile drawer items based on auth state
  const mobileNavItems = [
    ...mainNavItems,
    ...(user
      ? [{ label: "Account", href: "/account" }]
      : [{ label: "Login", href: "/login" }]),
  ];

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "background.paper",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid",
        borderColor: "divider",
        width: "100%",
        animation: "fadeInDown 0.5s ease-out",
        "@keyframes fadeInDown": {
          "0%": {
            opacity: 0,
            transform: "translateY(-20px)",
          },
          "100%": {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          px: { xs: 2, sm: 3 },
        }}
      >
        {/* Logo */}
        <Typography
          component={Link}
          href="/"
          variant="h6"
          sx={{
            color: "primary.main",
            textDecoration: "none",
            fontWeight: "bold",
            transition: "opacity 0.2s ease",
            "&:hover": {
              opacity: 0.85,
            },
          }}
        >
          Setup Store
        </Typography>

        {/* Desktop Main Navigation */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            gap: 3,
          }}
        >
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Button
                key={item.label}
                component={Link}
                href={item.href}
                disableRipple
                sx={getNavButtonStyles(isActive)}
              >
                {item.label}
              </Button>
            );
          })}
        </Box>

        {/* Desktop Auth Actions */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            gap: 2,
            alignItems: "center",
          }}
        >
          {user ? (
            <>
              <CartButton pathname={pathname} />

              <Button
                component={Link}
                href="/account"
                disableRipple
                sx={getNavButtonStyles(pathname === "/account")}
              >
                Account
              </Button>

              <Button
                onClick={logout}
                disableRipple
                sx={getNavButtonStyles(false)}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                component={Link}
                href="/login"
                disableRipple
                sx={getNavButtonStyles(pathname === "/login")}
              >
                Login
              </Button>

              <Button
                component={Link}
                href="/register"
                variant="contained"
                sx={getSignUpStyles(pathname === "/register")}
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>

        {/* Mobile Actions */}
        <Box
          sx={{
            display: { xs: "flex", md: "none" },
            alignItems: "center",
            gap: 1,
          }}
        >
          {user && <CartButton pathname={pathname} />}

          <IconButton
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerToggle}
            sx={{
              color: "primary.main",
              transition: "transform 0.2s ease",
              "&:active": {
                transform: "scale(0.95)",
              },
            }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: "block", md: "none" },
        }}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: "background.paper",
              color: "text.primary",
              width: 220,
            },
          },
        }}
      >
        <Box
          onClick={handleDrawerToggle}
          sx={{
            textAlign: "center",
            py: 3,
          }}
        >
          <List>
            {mobileNavItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <ListItem key={item.label} disablePadding>
                  <ListItemButton
                    component={Link}
                    href={item.href}
                    sx={{
                      justifyContent: "center",
                      backgroundColor: isActive
                        ? "action.selected"
                        : "transparent",
                      borderRight: isActive ? "4px solid" : "none",
                      borderColor: "primary.main",
                      transition: "background-color 0.2s ease",
                    }}
                  >
                    <ListItemText
                      primary={item.label}
                      sx={{
                        color: isActive ? "primary.main" : "text.primary",
                        textAlign: "center",
                        fontWeight: isActive ? "bold" : "normal",
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}

            {/* Mobile Auth Actions */}
            {user ? (
              <ListItem disablePadding>
                <ListItemButton
                  onClick={logout}
                  sx={{
                    justifyContent: "center",
                  }}
                >
                  <ListItemText
                    primary="Logout"
                    sx={{
                      color: "error.main",
                      textAlign: "center",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ) : (
              <ListItem
                disablePadding
                sx={{
                  px: 2,
                  mt: 2,
                }}
              >
                <Button
                  component={Link}
                  href="/register"
                  variant="contained"
                  fullWidth
                  sx={getSignUpStyles(pathname === "/register")}
                >
                  Sign Up
                </Button>
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}
