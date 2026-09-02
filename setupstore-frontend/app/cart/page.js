"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { apiRequest } from "../../lib/api";
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  Paper,
  IconButton,
  Divider,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const debounceTimers = useRef({});

  useEffect(() => {
    fetchCart();
  }, []);

  async function fetchCart() {
    try {
      const data = await apiRequest("/cart");
      setCart(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleQuantityChange(productId, newQuantity) {
    if (newQuantity < 1) return;

    setCart((prevCart) => {
      if (!prevCart) return prevCart;

      const updatedItems = prevCart.items.map((item) =>
        item.product._id === productId
          ? { ...item, quantity: newQuantity }
          : item,
      );
      return { ...prevCart, items: updatedItems };
    });

    if (debounceTimers.current[productId]) {
      clearTimeout(debounceTimers.current[productId]);
    }

    debounceTimers.current[productId] = setTimeout(async () => {
      try {
        await apiRequest("/cart", {
          method: "PUT",
          body: JSON.stringify({
            productId,
            quantity: newQuantity,
          }),
        });
      } catch (err) {
        console.error(err);
        fetchCart();
      }
    }, 500);
  }
  async function removeItem(productId) {
    if (debounceTimers.current[productId]) {
      clearTimeout(debounceTimers.current[productId]);
    }

    try {
      await apiRequest("/cart", {
        method: "DELETE",
        body: JSON.stringify({ productId }),
      });

      fetchCart();
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 10 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Your cart is empty
        </Typography>

        <Button component={Link} href="/products" variant="contained">
          Continue Shopping
        </Button>
      </Box>
    );
  }

  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  return (
    <Box
      sx={{
        px: { xs: 2, md: 6 },
        py: { xs: 3, md: 6 },
      }}
    >
      <Typography variant="h4" sx={{ mb: 4 }}>
        Shopping Cart
      </Typography>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          {cart.items.map((item) => (
            <Paper
              key={item.product._id}
              sx={{
                p: 2,
                mb: 2,
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "flex-start", sm: "center" },
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: 1,
                  flexShrink: 0,
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>

              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1">{item.product.name}</Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {item.product.brand}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton
                  size="small"
                  onClick={() =>
                    handleQuantityChange(item.product._id, item.quantity - 1)
                  }
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>
                <Typography>{item.quantity}</Typography>
                <IconButton
                  size="small"
                  onClick={() =>
                    handleQuantityChange(item.product._id, item.quantity + 1)
                  }
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </Box>
              <Typography
                variant="subtitle1"
                sx={{
                  color: "primary.main",
                  width: 80,
                  textAlign: { xs: "left", sm: "right" },
                }}
              >
                ${(item.product.price * item.quantity).toFixed(2)}
              </Typography>

              <IconButton onClick={() => removeItem(item.product._id)}>
                <DeleteIcon />
              </IconButton>
            </Paper>
          ))}
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Order Summary
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Typography>Subtotal</Typography>
              <Typography>${subtotal.toFixed(2)}</Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Typography sx={{ color: "text.secondary" }}>Shipping</Typography>
              <Typography sx={{ color: "text.secondary" }}>
                Calculated at checkout
              </Typography>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 3,
              }}
            >
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6" sx={{ color: "primary.main" }}>
                ${subtotal.toFixed(2)}
              </Typography>
            </Box>
            <Button
              component={Link}
              href="/checkout"
              variant="contained"
              fullWidth
              size="large"
            >
              Proceed to Checkout
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
