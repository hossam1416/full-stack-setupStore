"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiRequest } from "../../lib/api";

import {
  Box,
  Grid,
  Typography,
  Paper,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  CircularProgress,
  Alert,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";

export default function ComparePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const idsParam = searchParams.get("ids") || "";
  const ids = idsParam ? idsParam.split(",") : [];

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    async function fetchCompare() {
      if (ids.length === 0) {
        setProducts([]);
        setErrorMsg("");
        setLoading(false);
        return;
      }

      setLoading(true);
      setErrorMsg("");

      try {
        const data = await apiRequest(`/compare?ids=${ids.join(",")}`);
        setProducts(data);
      } catch (err) {
        setErrorMsg(err.message || "Failed to load comparison data.");
      } finally {
        setLoading(false);
      }
    }

    fetchCompare();
  }, [idsParam]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!searchTerm.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        const data = await apiRequest(
          `/products?search=${encodeURIComponent(searchTerm)}`,
        );

        setSearchResults(data.products || []);
      } catch (err) {
        console.error(err);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  function updateIds(newIds) {
    if (newIds.length === 0) {
      router.push("/compare");
      return;
    }

    router.push(`/compare?ids=${newIds.join(",")}`);
  }

  function removeProduct(productId) {
    updateIds(ids.filter((id) => id !== productId));
  }

  function addProduct(productId) {
    if (ids.includes(productId) || ids.length >= 4) {
      return;
    }

    updateIds([...ids, productId]);

    setDialogOpen(false);
    setSearchTerm("");
    setSearchResults([]);
  }

  const specKeys = [
    ...new Set(products.flatMap((product) => Object.keys(product.specs || {}))),
  ];

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 4, md: 6 },
        py: { xs: 3, md: 6 },
        maxWidth: 1400,
        mx: "auto",
      }}
    >
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold" }}>
        Compare Products
      </Typography>

      {errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 6,
          }}
        >
          <CircularProgress />
        </Box>
      ) : products.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography sx={{ color: "text.secondary", mb: 2 }}>
            No products selected for comparison.
          </Typography>

          <Button variant="contained" onClick={() => setDialogOpen(true)}>
            Add Product
          </Button>
        </Paper>
      ) : (
        <>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {products.map((product) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={product._id}>
                <Paper sx={{ p: 2, height: "100%" }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() => removeProduct(product._id)}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  <Box
                    component="img"
                    src={product.images[0]}
                    alt={product.name}
                    sx={{
                      width: "100%",
                      height: 180,
                      objectFit: "contain",
                      mb: 2,
                    }}
                  />

                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      mb: 1,
                    }}
                  >
                    {product.brand}
                  </Typography>

                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: "bold",
                      mb: 1,
                    }}
                  >
                    {product.name}
                  </Typography>

                  <Typography variant="h6" sx={{ color: "primary.main" }}>
                    ${product.price.toFixed(2)}
                  </Typography>
                </Paper>
              </Grid>
            ))}

            {ids.length < 4 && (
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper
                  onClick={() => setDialogOpen(true)}
                  sx={{
                    height: "100%",
                    minHeight: 300,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    border: "1px dashed",
                    borderColor: "divider",
                  }}
                >
                  <Box sx={{ textAlign: "center" }}>
                    <AddIcon
                      sx={{
                        fontSize: 40,
                        color: "text.secondary",
                        mb: 1,
                      }}
                    />

                    <Typography sx={{ color: "text.secondary" }}>
                      Add Product
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            )}
          </Grid>

          {products.length >= 1 && (
            <TableContainer component={Paper} sx={{ mt: 4 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", width: "200px" }}>
                      Specification
                    </TableCell>
                    {products.map((product) => (
                      <TableCell
                        key={product._id}
                        sx={{ fontWeight: "bold", minWidth: "180px" }}
                      >
                        {product.name}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {specKeys.map((key) => (
                    <TableRow key={key}>
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{ color: "text.secondary", fontWeight: 600 }}
                      >
                        {key}
                      </TableCell>
                      {products.map((product) => (
                        <TableCell key={product._id}>
                          {product.specs?.[key] ?? "N/A"}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add Product</DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            autoFocus
            label="Search products"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mt: 1, mb: 2 }}
          />

          <List>
            {searchResults.map((product) => (
              <ListItemButton
                key={product._id}
                onClick={() => addProduct(product._id)}
              >
                <ListItemAvatar>
                  <Avatar
                    src={product.images[0]}
                    alt={product.name}
                    variant="rounded"
                  />
                </ListItemAvatar>

                <ListItemText
                  primary={product.name}
                  secondary={`${product.brand || ""} • $${product.price.toFixed(2)}`}
                />
              </ListItemButton>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
