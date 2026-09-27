"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiRequest } from "../../lib/api";
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function OrderConfirmationPageContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // to fetch the order details when the component mounts
  useEffect(() => {
    async function fetchOrder() {
      try {
        const data = await apiRequest(`/orders/${orderId}`);
        setOrder(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (orderId) fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!order) {
    return (
      <Box sx={{ textAlign: "center", py: 10 }}>
        <Typography variant="h5">Order not found</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        px: { xs: 2, md: 6 },
        py: { xs: 4, md: 8 },
      }}
    >
      <Box sx={{ maxWidth: 550, width: "100%", textAlign: "center" }}>
        <CheckCircleIcon
          sx={{
            fontSize: 70,
            color: "primary.main",
            mb: 2,
          }}
        />

        <Typography variant="h4" sx={{ mb: 1 }}>
          Order Confirmed!
        </Typography>

        <Typography sx={{ color: "text.secondary", mb: 4 }}>
          Thank you for your purchase. Your order has been placed successfully.
        </Typography>

        <Paper sx={{ p: 3, textAlign: "left" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              ORDER NUMBER
            </Typography>

            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              STATUS
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 3,
            }}
          >
            <Typography variant="subtitle1">
              #{order._id.slice(-6).toUpperCase()}
            </Typography>

            <Typography
              variant="subtitle1"
              sx={{ textTransform: "capitalize" }}
            >
              {order.status}
            </Typography>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {order.items.map((item, index) => (
            <Box
              key={item._id || index}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Typography variant="body2">Qty: {item.quantity}</Typography>

              <Typography variant="body2">
                ${(item.priceAtPurchase * item.quantity).toFixed(2)}
              </Typography>
            </Box>
          ))}

          <Divider sx={{ my: 2 }} />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6">Total Paid</Typography>

            <Typography variant="h6" sx={{ color: "primary.main" }}>
              ${order.totalPrice.toFixed(2)}
            </Typography>
          </Box>
        </Paper>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            mt: 4,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Button component={Link} href="/account/orders" variant="outlined">
            View Order Details
          </Button>

          <Button component={Link} href="/products" variant="contained">
            Continue Shopping
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <CircularProgress />
        </Box>
      }
    >
      <OrderConfirmationPageContent />
    </Suspense>
  );
}
