"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import StorefrontIcon from "@mui/icons-material/Storefront";
import BuildIcon from "@mui/icons-material/Build";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";

const navItems = [
  {
    label: "Home",
    href: "/",
    icon: HomeIcon,
  },
  {
    label: "Shop",
    href: "/products",
    icon: StorefrontIcon,
  },
  {
    label: "PC Builder",
    href: "/builder",
    icon: BuildIcon,
  },
  {
    label: "Compare",
    href: "/compare",
    icon: CompareArrowsIcon,
  },
];

const navButtonStyles = (isActive) => ({
  position: "relative",
  borderRadius: "10px",
  px: 1.8,
  color: isActive ? "primary.main" : "text.primary",
  backgroundColor: "transparent",
  gap: 0.8,
  transition: "color 0.3s ease",
  "&:hover": {
    backgroundColor: "action.hover",
    color: "primary.main",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 2,
    left: "50%",
    transform: isActive
      ? "translateX(-50%) scaleX(1)"
      : "translateX(-50%) scaleX(0)",
    transformOrigin: "center",
    width: "80%",
    height: "2px",
    backgroundColor: "primary.main",
    borderRadius: "2px",
    transition: "transform 0.3s ease",
  },
});

function CartButton({ pathname }) {
  const isActive = pathname === "/cart";

  return (
    <IconButton
      component={Link}
      href="/cart"
      aria-label="Shopping cart"
      sx={{
        width: 42,
        height: 42,
        borderRadius: "10px",
        color: isActive ? "primary.main" : "text.primary",
        "&:hover": {
          color: "primary.main",
          backgroundColor: "action.hover",
        },
      }}
    >
      <ShoppingCartIcon />
    </IconButton>
  );
}

export default function Header() {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading) return null;

  const isAdmin = user?.role === "admin";

  const toggleDrawer = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "background.paper",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar
        sx={{
          minHeight: { xs: 64, md: 72 },
          px: { xs: 2, sm: 3, lg: 4 },
        }}
      >
        {/* Logo */}
        <Box
          component={Link}
          href="/"
          sx={{
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <Image
            src="/images/logo.png"
            alt="Setup Store"
            width={200}
            height={80}
            priority
            style={{
              objectFit: "contain",
            }}
          />
        </Box>

        {/* Desktop Navigation */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            justifyContent: "center",
            alignItems: "center",
            gap: 0.5,
            flex: 1,
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Button
                key={item.href}
                component={Link}
                href={item.href}
                disableRipple
                startIcon={<Icon />}
                sx={navButtonStyles(isActive)}
              >
                {item.label}
              </Button>
            );
          })}

          {isAdmin && (
            <Button
              component={Link}
              href="/admin"
              disableRipple
              startIcon={<AdminPanelSettingsIcon />}
              sx={navButtonStyles(pathname.startsWith("/admin"))}
            >
              Admin
            </Button>
          )}
        </Box>

        {/* Desktop Actions */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: 0.5,
            flexShrink: 0,
          }}
        >
          <CartButton pathname={pathname} />

          {user ? (
            <>
              <Button
                component={Link}
                href="/account"
                disableRipple
                startIcon={<AccountCircleIcon />}
                sx={navButtonStyles(pathname === "/account")}
              >
                Account
              </Button>

              <Button
                onClick={logout}
                disableRipple
                startIcon={<LogoutIcon />}
                sx={navButtonStyles(false)}
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
                startIcon={<LoginIcon />}
                sx={navButtonStyles(pathname === "/login")}
              >
                Login
              </Button>

              <Button
                component={Link}
                href="/register"
                variant="contained"
                startIcon={<PersonAddIcon />}
                sx={{
                  borderRadius: "10px",
                  px: 2,
                }}
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
            gap: 0.5,
            ml: "auto",
          }}
        >
          <CartButton pathname={pathname} />

          <IconButton
            onClick={toggleDrawer}
            aria-label="Open navigation menu"
            sx={{
              color: "primary.main",
              borderRadius: "10px",
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
        onClose={toggleDrawer}
        sx={{
          display: { xs: "block", md: "none" },
        }}
        slotProps={{
          paper: {
            sx: {
              width: 270,
              backgroundColor: "background.paper",
            },
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <Image
              src="/logo.png"
              alt="Setup Store"
              width={140}
              height={40}
              style={{
                width: "auto",
                height: "40px",
                objectFit: "contain",
              }}
            />
          </Box>

          <Divider sx={{ mb: 1.5 }} />

          <List disablePadding>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <ListItem key={item.href} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    component={Link}
                    href={item.href}
                    onClick={toggleDrawer}
                    selected={isActive}
                    sx={{
                      borderRadius: "10px",
                      "&.Mui-selected": {
                        color: "primary.main",
                        backgroundColor: "action.selected",
                      },
                      "&.Mui-selected:hover": {
                        backgroundColor: "action.selected",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 40,
                        color: isActive ? "primary.main" : "text.secondary",
                      }}
                    >
                      <Icon />
                    </ListItemIcon>

                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
              );
            })}

            {isAdmin && (
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={Link}
                  href="/admin"
                  onClick={toggleDrawer}
                  selected={pathname.startsWith("/admin")}
                  sx={{
                    borderRadius: "10px",
                    "&.Mui-selected": {
                      color: "primary.main",
                      backgroundColor: "action.selected",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: "primary.main",
                    }}
                  >
                    <AdminPanelSettingsIcon />
                  </ListItemIcon>

                  <ListItemText primary="Admin" />
                </ListItemButton>
              </ListItem>
            )}
          </List>

          <Divider sx={{ my: 2 }} />

          <List disablePadding>
            {user ? (
              <>
                <ListItem disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    component={Link}
                    href="/account"
                    onClick={toggleDrawer}
                    selected={pathname === "/account"}
                    sx={{
                      borderRadius: "10px",
                      "&.Mui-selected": {
                        color: "primary.main",
                        backgroundColor: "action.selected",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 40,
                        color: "text.secondary",
                      }}
                    >
                      <AccountCircleIcon />
                    </ListItemIcon>

                    <ListItemText primary="Account" />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      toggleDrawer();
                      logout();
                    }}
                    sx={{
                      borderRadius: "10px",
                      color: "error.main",
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 40,
                        color: "error.main",
                      }}
                    >
                      <LogoutIcon />
                    </ListItemIcon>

                    <ListItemText primary="Logout" />
                  </ListItemButton>
                </ListItem>
              </>
            ) : (
              <>
                <ListItem disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    component={Link}
                    href="/login"
                    onClick={toggleDrawer}
                    selected={pathname === "/login"}
                    sx={{
                      borderRadius: "10px",
                      "&.Mui-selected": {
                        color: "primary.main",
                        backgroundColor: "action.selected",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 40,
                        color: "text.secondary",
                      }}
                    >
                      <LoginIcon />
                    </ListItemIcon>

                    <ListItemText primary="Login" />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton
                    component={Link}
                    href="/register"
                    onClick={toggleDrawer}
                    selected={pathname === "/register"}
                    sx={{
                      borderRadius: "10px",
                      "&.Mui-selected": {
                        color: "primary.main",
                        backgroundColor: "action.selected",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 40,
                        color: "text.secondary",
                      }}
                    >
                      <PersonAddIcon />
                    </ListItemIcon>

                    <ListItemText primary="Sign Up" />
                  </ListItemButton>
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}
