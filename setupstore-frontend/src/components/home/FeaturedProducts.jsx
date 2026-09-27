"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  CircularProgress,
} from "@mui/material";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import { apiRequest } from "@/lib/api";
import { useAddToCart } from "@/lib/useAddToCart";

export default function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  const { addToCart } = useAddToCart();

  // Fetch featured products
  useEffect(() => {
    async function fetchFeatured() {
      try {
        const data = await apiRequest("/products?page=1&limit=8");
        setFeaturedProducts(data.products || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingFeatured(false);
      }
    }

    fetchFeatured();
  }, []);

  return (
    <Box sx={{ mb: 10 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Featured Products
        </Typography>

        <Button component={Link} href="/products" size="small">
          View All
        </Button>
      </Box>

      {loadingFeatured ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {featuredProducts.map((product) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={product._id}>
              <Card
                component={Link}
                href={`/products/${product.slug}`}
                sx={{
                  textDecoration: "none",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition:
                    "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: 6,
                    "& .product-img": {
                      transform: "scale(1.05)",
                    },
                  },
                }}
              >
                <Box
                  sx={{
                    overflow: "hidden",
                    backgroundColor: "background.paper",
                  }}
                >
                  <CardMedia
                    component="img"
                    image={product.images?.[0]}
                    alt={product.name}
                    className="product-img"
                    sx={{
                      height: 160,
                      objectFit: "contain",
                      transition: "transform 0.3s ease-in-out",
                    }}
                  />
                </Box>

                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    {product.brand}
                  </Typography>

                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    {product.name}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="h6" sx={{ color: "primary.main" }}>
                      ${product.price}
                    </Typography>

                    <IconButton
                      size="small"
                      sx={{ color: "primary.main" }}
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(product._id);
                      }}
                    >
                      <ShoppingCartIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
