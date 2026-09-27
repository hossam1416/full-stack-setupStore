"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "../../lib/api";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";

export default function CheckoutPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shippingAddress, setShippingAddress] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  // to fetch the cart data when the component mounts
  useEffect(() => {
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

    fetchCart();
  }, []);
  // to handle the order placement when the user clicks the "Place Order" button
  async function handlePlaceOrder() {
    if (!shippingAddress.trim()) {
      setError("Please enter a shipping address");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const order = await apiRequest("/orders", {
        method: "POST",
        body: JSON.stringify({ shippingAddress }),
      });

      router.push(`/order-confirmation?orderId=${order._id}`);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 10 }}>
        <Typography variant="h5">Your cart is empty</Typography>
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
        px: { xs: 2, sm: 4, md: 6 },
        py: { xs: 3, md: 6 },
        maxWidth: 1200,
        mx: "auto",
      }}
    >
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 4 } }}>
        Checkout
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
        }}
      >
        <Box sx={{ flex: 1, width: "100%" }}>
          <Paper sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Shipping Address
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              label="Full shipping address"
              placeholder="Street, City, Country"
              fullWidth
              multiline
              rows={3}
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
            />
          </Paper>
        </Box>

        <Box sx={{ flex: 1, width: "100%" }}>
          <Paper sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Order Summary
            </Typography>

            {cart.items.map((item) => (
              <Box
                key={item.product._id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1.5,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ pr: 2, color: "text.secondary" }}
                >
                  {item.product.name} x{item.quantity}
                </Typography>

                <Typography variant="body2" sx={{ flexShrink: 0 }}>
                  ${(item.product.price * item.quantity).toFixed(2)}
                </Typography>
              </Box>
            ))}

            <Divider sx={{ my: 2 }} />

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
              variant="contained"
              fullWidth
              size="large"
              disabled={submitting}
              onClick={handlePlaceOrder}
            >
              {submitting ? "Placing Order..." : "Place Order"}
            </Button>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
