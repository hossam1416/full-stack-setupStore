"use client";

import { useState, useEffect } from "react";
import { apiRequest } from "../../../lib/api";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Divider,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

const statusColors = {
  pending: "warning",
  shipped: "info",
  delivered: "success",
  cancelled: "error",
};

const statusOptions = ["pending", "shipped", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  const fetchOrders = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const data = await apiRequest("/orders/admin/all");
      setOrders(data);
    } catch (err) {
      setErrorMsg(err.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  async function handleStatusChange(orderId, newStatus) {
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o)),
    );

    try {
      await apiRequest(`/orders/${orderId}/status`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      setErrorMsg(err.message);
      fetchOrders();
    }
  }

  function handleOpenDetails(order) {
    setSelectedOrder(order);
    setOpenDetailsModal(true);
  }

  const filteredOrders = orders.filter((order) => {
    if (filterStatus === "all") return true;
    return order.status === filterStatus;
  });

  if (authLoading || loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }
}
return (
  <Box sx={{ px: { xs: 2, md: 6 }, py: { xs: 3, md: 6 } }}>
    <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
      Manage Orders
    </Typography>

    {errorMsg && (
      <Alert severity="error" sx={{ mb: 3 }}>
        {errorMsg}
      </Alert>
    )}

    <Paper sx={{ mb: 3 }}>
      <Tabs
        value={filterStatus}
        onChange={(e, val) => setFilterStatus(val)}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="All Orders" value="all" />
        <Tab label="Pending" value="pending" />
        <Tab label="Shipped" value="shipped" />
        <Tab label="Delivered" value="delivered" />
        <Tab label="Cancelled" value="cancelled" />
      </Tabs>
    </Paper>

    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {filteredOrders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                No orders found.
              </TableCell>
            </TableRow>
          ) : (
            filteredOrders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>#{order._id.slice(-6).toUpperCase()}</TableCell>

                <TableCell>{order.user?.username || "—"}</TableCell>

                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>

                <TableCell>${order.totalPrice?.toFixed(2)}</TableCell>

                <TableCell>
                  <Select
                    size="small"
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    renderValue={(value) => (
                      <Chip
                        label={value}
                        color={statusColors[value] || "default"}
                        size="small"
                        sx={{ textTransform: "capitalize" }}
                      />
                    )}
                  >
                    {statusOptions.map((status) => (
                      <MenuItem
                        key={status}
                        value={status}
                        sx={{ textTransform: "capitalize" }}
                      >
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>

                <TableCell align="right">
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<VisibilityIcon />}
                    onClick={() => handleOpenDetails(order)}
                  >
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>

    <Dialog
      open={openDetailsModal}
      onClose={() => setOpenDetailsModal(false)}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle sx={{ fontWeight: "bold" }}>
        Order Details #{selectedOrder?._id.slice(-6).toUpperCase()}
      </DialogTitle>

      <DialogContent dividers>
        {selectedOrder && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Customer Info
              </Typography>
              <Typography variant="body1">
                {selectedOrder.user?.username || "N/A"} (
                {selectedOrder.user?.email || "No email"})
              </Typography>
            </Box>

            <Divider />

            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                Shipping Address
              </Typography>

              <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                {selectedOrder.shippingAddress || "No address provided"}
              </Typography>
            </Box>

            <Divider />

            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                Ordered Items
              </Typography>

              {selectedOrder.items?.map((item, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                    p: 1,
                    bgcolor: "action.hover",
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body2">
                    {item.product?.name || "Product"} (x{item.quantity})
                  </Typography>

                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    ${(item.priceAtPurchase * item.quantity).toFixed(2)}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Divider />

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                Total Price:
              </Typography>

              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", color: "primary.main" }}
              >
                ${selectedOrder.totalPrice?.toFixed(2)}
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={() => setOpenDetailsModal(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  </Box>
);
