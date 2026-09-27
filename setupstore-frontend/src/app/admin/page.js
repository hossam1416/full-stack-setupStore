"use client";

import { useState, useEffect } from "react";
import { apiRequest } from "../../lib/api";
import {
  Box,
  Grid,
  Typography,
  Paper,
  CircularProgress,
  Chip,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
} from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const statusColors = {
  pending: "warning",
  shipped: "info",
  delivered: "success",
  cancelled: "error",
};

const statusIcons = {
  pending: <HourglassEmptyIcon fontSize="small" />,
  shipped: <LocalShippingIcon fontSize="small" />,
  delivered: <CheckCircleIcon fontSize="small" />,
  cancelled: <CancelIcon fontSize="small" />,
};

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsData, ordersData] = await Promise.all([
          apiRequest("/products?limit=1000"),
          apiRequest("/orders/admin/all"),
        ]);

        setProducts(productsData.products);
        setOrders(ordersData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
  const averageOrderValue =
    orders.length > 0 ? totalRevenue / orders.length : 0;
  const lowStock = products.filter((product) => product.stock < 10);

  const orderStatusCounts = {
    pending: orders.filter((order) => order.status === "pending").length,
    shipped: orders.filter((order) => order.status === "shipped").length,
    delivered: orders.filter((order) => order.status === "delivered").length,
    cancelled: orders.filter((order) => order.status === "cancelled").length,
  };

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold" }}>
        Dashboard
      </Typography>

      {/* Main Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <Paper
            sx={{
              p: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              transition: "transform 0.2s",
              "&:hover": { transform: "translateY(-4px)" },
            }}
          >
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 0.5 }}
              >
                Total Revenue
              </Typography>
              <Typography
                variant="h5"
                sx={{ color: "success.main", fontWeight: "bold" }}
              >
                ${totalRevenue.toFixed(2)}
              </Typography>
            </Box>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: "success.lighter",
                color: "success.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(46, 125, 50, 0.12)",
              }}
            >
              <AttachMoneyIcon />
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 6, md: 3 }}>
          <Paper
            sx={{
              p: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              transition: "transform 0.2s",
              "&:hover": { transform: "translateY(-4px)" },
            }}
          >
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 0.5 }}
              >
                Total Orders
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                {orders.length}
              </Typography>
            </Box>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(2, 136, 209, 0.12)",
                color: "info.main",
              }}
            >
              <ShoppingBagIcon />
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 6, md: 3 }}>
          <Paper
            sx={{
              p: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              transition: "transform 0.2s",
              "&:hover": { transform: "translateY(-4px)" },
            }}
          >
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 0.5 }}
              >
                Total Products
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                {products.length}
              </Typography>
            </Box>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(156, 39, 176, 0.12)",
                color: "secondary.main",
              }}
            >
              <Inventory2Icon />
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 6, md: 3 }}>
          <Paper
            sx={{
              p: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              transition: "transform 0.2s",
              "&:hover": { transform: "translateY(-4px)" },
            }}
          >
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 0.5 }}
              >
                Average Order
              </Typography>
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", color: "primary.main" }}
              >
                ${averageOrderValue.toFixed(2)}
              </Typography>
            </Box>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(237, 108, 2, 0.12)",
                color: "warning.main",
              }}
            >
              <TrendingUpIcon />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Order Status */}
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
        Order Status Overview
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {Object.entries(orderStatusCounts).map(([status, count]) => {
          const colorsMap = {
            pending: { border: "warning.main", bg: "rgba(237, 108, 2, 0.05)" },
            shipped: { border: "info.main", bg: "rgba(2, 136, 209, 0.05)" },
            delivered: {
              border: "success.main",
              bg: "rgba(46, 125, 50, 0.05)",
            },
            cancelled: { border: "error.main", bg: "rgba(211, 47, 47, 0.05)" },
          };

          return (
            <Grid key={status} size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                sx={{
                  p: 2.5,
                  borderLeft: "5px solid",
                  borderColor: colorsMap[status]?.border || "grey.500",
                  backgroundColor: colorsMap[status]?.bg || "background.paper",
                  transition: "transform 0.2s",
                  "&:hover": { transform: "translateY(-3px)" },
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      textTransform: "capitalize",
                      fontWeight: 600,
                      fontSize: "0.8rem",
                    }}
                  >
                    {status}
                  </Typography>
                  <Box
                    sx={{
                      color: `${statusColors[status]}.main`,
                      display: "flex",
                    }}
                  >
                    {statusIcons[status]}
                  </Box>
                </Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                    fontSize: { xs: "1.25rem", sm: "1.5rem" },
                  }}
                >
                  {count}
                </Typography>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* Recent Orders + Low Stock */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Recent Orders
            </Typography>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Order</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Customer</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {recentOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No orders yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentOrders.map((order) => (
                      <TableRow key={order._id} hover>
                        <TableCell sx={{ fontWeight: 500 }}>
                          #{order._id.slice(-6).toUpperCase()}
                        </TableCell>
                        <TableCell>{order.user?.username || "—"}</TableCell>
                        <TableCell
                          sx={{ fontWeight: "bold", color: "success.main" }}
                        >
                          ${order.totalPrice?.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={order.status}
                            color={statusColors[order.status] || "default"}
                            size="small"
                            sx={{
                              textTransform: "capitalize",
                              fontWeight: 500,
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Low Stock Products
            </Typography>

            {lowStock.length === 0 ? (
              <Typography color="text.secondary">
                All products have sufficient stock.
              </Typography>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                }}
              >
                {lowStock.slice(0, 8).map((product) => (
                  <Box
                    key={product._id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      py: 1,
                      borderBottom: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        mr: 2,
                      }}
                    >
                      {product.name}
                    </Typography>

                    <Chip
                      label={`${product.stock} left`}
                      size="small"
                      color={product.stock === 0 ? "error" : "warning"}
                      variant="outlined"
                      sx={{ fontWeight: "bold" }}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
