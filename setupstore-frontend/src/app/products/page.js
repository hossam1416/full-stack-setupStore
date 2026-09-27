"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAddToCart } from "../../lib/useAddToCart";
import { apiRequest } from "../../lib/api";
import Link from "next/link";
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  TextField,
  FormGroup,
  FormControlLabel,
  Radio,
  RadioGroup,
  Snackbar,
  Alert,
  Pagination,
  Container,
  Button,
  Drawer,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";

function ProductsPageContent() {
  const searchParams = useSearchParams();

  // Page state and filter state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  const limit = 12;

  const { addToCart, showSuccess, setShowSuccess } = useAddToCart();

  // Sync selected category with URL
  const [categoryUrlSynced, setCategoryUrlSynced] = useState(false);

  if (!categoryUrlSynced && categories.length > 0) {
    const categoryFromUrl = searchParams.get("category");

    if (categoryFromUrl) {
      const category = categories.find((cat) => cat.name === categoryFromUrl);

      if (category) {
        setSelectedCategory(category._id);
      }
    }

    setCategoryUrlSynced(true);
  }

  // Reset pagination when filters change
  const [prevFilterKey, setPrevFilterKey] = useState(
    `${search}|${minPrice}|${maxPrice}|${selectedCategory}`,
  );

  const currentFilterKey = `${search}|${minPrice}|${maxPrice}|${selectedCategory}`;

  if (currentFilterKey !== prevFilterKey) {
    setPrevFilterKey(currentFilterKey);
    setPage(1);
  }

  // Fetch products using the current filters
  useEffect(() => {
    const timer = setTimeout(() => {
      async function fetchProducts() {
        setLoading(true);

        try {
          const params = new URLSearchParams();

          if (search) params.append("search", search);
          if (minPrice) params.append("minPrice", minPrice);
          if (maxPrice) params.append("maxPrice", maxPrice);
          if (selectedCategory) {
            params.append("category", selectedCategory);
          }

          params.append("page", page);
          params.append("limit", limit);

          const data = await apiRequest(`/products?${params.toString()}`);

          setProducts(data.products || []);
          setTotalPages(data.totalPages || 1);
          setTotalProducts(data.total || 0);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      }

      fetchProducts();
    }, 500);

    return () => clearTimeout(timer);
  }, [search, minPrice, maxPrice, selectedCategory, page]);

  // Fetch available categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await apiRequest("/categories");
        setCategories(data.categories || data || []);
      } catch (err) {
        console.error(err);
      }
    }

    fetchCategories();
  }, []);

  // Filter sidebar
  const filterContent = (
    <Box sx={{ width: 280, p: 3, boxSizing: "border-box" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Filters
        </Typography>

        <IconButton
          sx={{ display: { md: "none" } }}
          onClick={() => setMobileOpen(false)}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <TextField
        placeholder="Search products..."
        fullWidth
        size="small"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3 }}
      />

      <Typography
        variant="subtitle2"
        sx={{
          mb: 1,
          color: "text.secondary",
          textTransform: "uppercase",
          fontSize: "0.75rem",
          fontWeight: 600,
        }}
      >
        Category
      </Typography>

      <RadioGroup
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        sx={{
          mb: 3,
          maxHeight: 220,
          overflowY: "auto",
          px: 0.5,
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(255,255,255,0.2)",
            borderRadius: "4px",
          },
        }}
      >
        <FormControlLabel
          value=""
          control={<Radio size="small" />}
          label="All Categories"
        />

        {categories.map((cat) => (
          <FormControlLabel
            key={cat._id || cat}
            value={cat._id || cat}
            control={<Radio size="small" />}
            label={cat.name || cat}
          />
        ))}
      </RadioGroup>

      <Typography
        variant="subtitle2"
        sx={{
          mb: 1,
          color: "text.secondary",
          textTransform: "uppercase",
          fontSize: "0.75rem",
          fontWeight: 600,
        }}
      >
        Price Range
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <TextField
          placeholder="Min"
          type="number"
          size="small"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          slotProps={{
            htmlInput: {
              step: 10,
              sx: {
                "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                  display: "none",
                },
                MozAppearance: "textfield",
              },
            },
          }}
        />

        <Typography sx={{ color: "text.secondary" }}>-</Typography>

        <TextField
          placeholder="Max"
          type="number"
          size="small"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          slotProps={{
            htmlInput: {
              step: 10,
              sx: {
                "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                  display: "none",
                },
                MozAppearance: "textfield",
              },
            },
          }}
        />
      </Box>
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Mobile filter button */}
      <Box sx={{ display: { md: "none" }, mb: 3, px: 1 }}>
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          onClick={() => setMobileOpen(true)}
          fullWidth
        >
          Filters
        </Button>
      </Box>

      {/* Products layout */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          px: { xs: 1, md: 6 },
          py: 2,
          width: "100%",
          maxWidth: "100vw",
          overflowX: "hidden",
          boxSizing: "border-box",
        }}
      >
        {/* Desktop filters */}
        <Box
          sx={{
            display: { xs: "none", md: "block" },
            width: 280,
            flexShrink: 0,
            bgcolor: "background.paper",
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            height: "fit-content",
            position: "sticky",
            top: 24,
          }}
        >
          {filterContent}
        </Box>

        {/* Mobile filters */}
        <Drawer
          anchor="left"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          sx={{ display: { md: "none" } }}
        >
          {filterContent}
        </Drawer>

        {/* Products grid */}
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            {totalProducts} products found
          </Typography>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Grid container spacing={3}>
                {products.map((product) => (
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
                          image={product.images[0]}
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
                          <Typography
                            variant="h6"
                            sx={{ color: "primary.main" }}
                          >
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

              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(event, value) => setPage(value)}
                    color="primary"
                  />
                </Box>
              )}
            </>
          )}
        </Box>

        {/* Add to cart notification */}
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
    </Container>
  );
}

export default function ProductsPage() {
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
      <ProductsPageContent />
    </Suspense>
  );
}
