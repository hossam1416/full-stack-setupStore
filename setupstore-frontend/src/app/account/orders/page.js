"use client";

import { useState, useEffect } from "react";
import { apiRequest } from "../../../lib/api";
import AccountSidebar from "../../../components/AccountSidebar";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Divider,
  Chip,
  CircularProgress,
} from "@mui/material";
const statusColors = {
  pending: "warning",
  shipped: "info",
  delivered: "success",
  cancelled: "error",
};
export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await apiRequest("/orders");
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

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
          <AccountSidebar activePage="orders" />
        </Grid>

        <Grid size={{ xs: 12, md: 9 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
            Order History
          </Typography>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
              <CircularProgress />
            </Box>
          ) : orders.length === 0 ? (
            <Typography sx={{ color: "text.secondary" }}>
              You haven&apos;t placed any orders yet.
            </Typography>
          ) : (
            orders.map((order) => (
              <Paper key={order._id} sx={{ p: { xs: 2, sm: 3 }, mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", sm: "center" },
                    gap: 1,
                    mb: 2,
                  }}
                >
                  <Typography variant="subtitle1">
                    #{order._id.slice(-6).toUpperCase()}
                  </Typography>

                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </Typography>

                  <Chip
                    label={order.status}
                    color={statusColors[order.status] || "default"}
                    size="small"
                    sx={{ textTransform: "capitalize" }}
                  />
                </Box>

                <Divider sx={{ mb: 2 }} />

                {order.items.map((item, index) => {
                  const product = item.product;

                  return (
                    <Box
                      key={item._id || index}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 1.5,
                      }}
                    >
                      <Box
                        component="img"
                        src={product?.images?.[0]}
                        alt={product?.name || "Product"}
                        sx={{
                          width: 50,
                          height: 50,
                          objectFit: "contain",
                          flexShrink: 0,
                        }}
                      />

                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body2">
                          {product
                            ? product.name
                            : "Product no longer available"}
                        </Typography>

                        <Typography
                          variant="caption"
                          sx={{ color: "text.secondary" }}
                        >
                          Qty: {item.quantity}
                        </Typography>
                      </Box>

                      <Typography variant="body2">
                        ${(item.priceAtPurchase * item.quantity).toFixed(2)}
                      </Typography>
                    </Box>
                  );
                })}

                <Divider sx={{ mt: 1, mb: 2 }} />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Shipped to: {order.shippingAddress}
                  </Typography>

                  <Typography variant="h6" sx={{ color: "primary.main" }}>
                    ${order.totalPrice.toFixed(2)}
                  </Typography>
                </Box>
              </Paper>
            ))
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
