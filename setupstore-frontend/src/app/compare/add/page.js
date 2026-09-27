"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import { apiRequest } from "../../../lib/api";

function CompareAddContent() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category");

  const idsParam = searchParams.get("ids") || "";
  const compareIds = idsParam ? idsParam.split(",") : [];

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [productsLoading, setProductsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [currentCategory, setCurrentCategory] = useState(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await apiRequest("/categories");
        setCategories(data);
      } catch (err) {
        setErrorMsg(err.message || "Failed to load categories.");
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!categorySlug) return;

    async function fetchProducts() {
      setProductsLoading(true);

      try {
        const data = await apiRequest(
          `/products?category=${categorySlug}&limit=100`,
        );

        setProducts(data.products || []);
      } catch (err) {
        setErrorMsg(err.message || "Failed to load products.");
      } finally {
        setProductsLoading(false);
      }
    }

    fetchProducts();
  }, [categorySlug]);

  useEffect(() => {
    if (compareIds.length === 0) {
      setCurrentCategory(null);
      return;
    }

    async function fetchCurrentCategory() {
      try {
        const data = await apiRequest(`/compare?ids=${compareIds.join(",")}`);

        if (data.length > 0) {
          setCurrentCategory(data[0].category);
        }
      } catch (err) {
        setErrorMsg(err.message || "Failed to load comparison data.");
      }
    }

    fetchCurrentCategory();
  }, [idsParam]);

  function handleAddProduct(productId) {
    if (compareIds.includes(productId) || compareIds.length >= 4) {
      return;
    }

    const newIds = [...compareIds, productId];

    router.push(`/compare?ids=${newIds.join(",")}`);
  }

  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Add Product to Compare
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Choose a category to find products to compare.
      </Typography>

      {errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <Paper sx={{ p: 4 }}>
        <TextField
          select
          fullWidth
          label="Category"
          value={selectedCategory}
          onChange={(e) => {
            const category = e.target.value;

            setSelectedCategory(category);
            router.push(
              `/compare/add?category=${category}&ids=${compareIds.join(",")}`,
            );
          }}
        >
          {categories.map((category) => {
            const isDisabled =
              currentCategory && category.slug !== currentCategory.slug;

            return (
              <MenuItem
                key={category._id}
                value={category.slug}
                disabled={isDisabled}
              >
                {category.name}
              </MenuItem>
            );
          })}
        </TextField>
      </Paper>
      {categorySlug && (
        <Paper sx={{ p: 4, mt: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
            Products
          </Typography>

          <TextField
            fullWidth
            label="Search products"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 3 }}
          />

          {productsLoading ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            products
              .filter((product) =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()),
              )
              .map((product) => (
                <Box
                  key={product._id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    py: 2,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Box
                    component="img"
                    src={product.images?.[0] || "/placeholder-product.png"}
                    alt={product.name}
                    sx={{
                      width: 70,
                      height: 70,
                      objectFit: "contain",
                      borderRadius: 1,
                      bgcolor: "background.default",
                    }}
                  />

                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 600 }}>
                      {product.name}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      {product.brand || "Unknown brand"}
                    </Typography>

                    <Typography sx={{ mt: 0.5, fontWeight: 600 }}>
                      ${product.price.toFixed(2)}
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    disabled={
                      compareIds.includes(product._id) || compareIds.length >= 4
                    }
                    onClick={() => handleAddProduct(product._id)}
                  >
                    {compareIds.includes(product._id) ? "Added" : "Add"}
                  </Button>
                </Box>
              ))
          )}
        </Paper>
      )}
    </Container>
  );
}

export default function CompareAddPage() {
  return (
    <Suspense
      fallback={
        <Container sx={{ py: 8, textAlign: "center" }}>
          <CircularProgress />
        </Container>
      }
    >
      <CompareAddContent />
    </Suspense>
  );
}
