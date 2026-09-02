"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { apiRequest } from "../../../lib/api";
import { useAddToCart } from "../../../lib/useAddToCart";
import {
  Box,
  CircularProgress,
  Typography,
  Grid,
  Button,
  IconButton,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, showSuccess, setShowSuccess } = useAddToCart();
  // fetch product data when the component mounts or when the slug changes
  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = await apiRequest(`/products/${slug}`);
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return (
      <Box sx={{ px: { xs: 2, md: 6 }, py: 6 }}>
        <Typography variant="h5">Product not found</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        px: { xs: 2, md: 6 },
        py: { xs: 3, md: 6 },
        width: "100%",
        maxWidth: "100vw",
        overflowX: "hidden",
        boxSizing: "border-box",
      }}
    >
      <Grid container spacing={5}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              height: { xs: 280, sm: 400 },
              backgroundColor: "background.paper",
              borderRadius: 2,
              width: "100%",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {product.images[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            ) : (
              <Typography sx={{ color: "text.secondary" }}>
                No Image Available
              </Typography>
            )}
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {product.brand}
          </Typography>

          <Typography
            variant="h4"
            sx={{ mb: 1, fontSize: { xs: "1.75rem", md: "2.125rem" } }}
          >
            {product.name}
          </Typography>

          <Typography variant="h5" sx={{ color: "primary.main", mb: 2 }}>
            ${product.price}
          </Typography>

          <Typography variant="body1" sx={{ color: "text.secondary", mb: 3 }}>
            {product.description}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <IconButton
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              sx={{ border: "1px solid", borderColor: "divider" }}
            >
              <RemoveIcon />
            </IconButton>

            <Typography>{quantity}</Typography>

            <IconButton
              onClick={() => setQuantity((q) => q + 1)}
              sx={{ border: "1px solid", borderColor: "divider" }}
            >
              <AddIcon />
            </IconButton>
          </Box>

          <Button
            variant="contained"
            size="large"
            startIcon={<ShoppingCartIcon />}
            onClick={() => addToCart(product._id, quantity)}
            sx={{ mb: 4, width: { xs: "100%", sm: "auto" } }}
          >
            Add to Cart
          </Button>

          <Divider sx={{ mb: 3 }} />

          <Typography variant="h6" sx={{ mb: 2 }}>
            Specifications
          </Typography>

          {product.specs &&
            Object.entries(product.specs).map(([key, value]) => (
              <Box
                key={key}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  py: 1,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography
                  sx={{
                    color: "text.secondary",
                    textTransform: "capitalize",
                  }}
                >
                  {key}
                </Typography>

                <Typography>{value}</Typography>
              </Box>
            ))}
        </Grid>
      </Grid>

      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
      >
        <Alert severity="success" onClose={() => setShowSuccess(false)}>
          Added to cart!
        </Alert>
      </Snackbar>
    </Box>
  );
}
