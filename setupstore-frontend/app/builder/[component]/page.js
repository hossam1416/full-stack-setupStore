"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Grid,
  Typography,
  Paper,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import { apiRequest } from "../../../lib/api";

const componentTypes = {
  cpu: {
    label: "Processor (CPU)",
    category: "processors",
  },
  motherboard: {
    label: "Motherboard",
    category: "motherboards",
  },
  ram: {
    label: "Memory (RAM)",
    category: "memory",
  },
  gpu: {
    label: "Graphics Card (GPU)",
    category: "graphics-cards",
  },
  psu: {
    label: "Power Supply (PSU)",
    category: "power-supplies",
  },
  storage: {
    label: "Storage",
    category: "storage",
  },
  case: {
    label: "Case",
    category: "cases",
  },
};

export default function ComponentProductsPage() {
  const params = useParams();
  const router = useRouter();

  const component = params.component;
  const componentInfo = componentTypes[component];

  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  // useEffect to fetch products based on component type and search term
  useEffect(() => {
    if (!componentInfo) {
      router.push("/builder");
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);

      try {
        const search = searchTerm.trim();

        const query = new URLSearchParams({
          category: componentInfo.category,
          limit: "100",
        });

        if (search) {
          query.set("search", search);
        }

        const data = await apiRequest(`/products?${query.toString()}`);
        setProducts(data.products || []);
      } catch (err) {
        console.error(err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [component, componentInfo, searchTerm, router]);
  // Function to handle product selection and navigate to the builder page with the selected product
  function selectProduct(product) {
    router.push(
      `/builder?component=${component}&product=${encodeURIComponent(
        product.slug,
      )}`,
    );
  }

  if (!componentInfo) {
    return null;
  }

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 4, md: 6 },
        py: { xs: 3, md: 6 },
        maxWidth: 1400,
        mx: "auto",
      }}
    >
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => router.push("/builder")}
        sx={{ mb: 3 }}
      >
        Back to Builder
      </Button>

      <Typography variant="h4" sx={{ mb: 1 }}>
        Choose {componentInfo.label}
      </Typography>

      <Typography sx={{ color: "text.secondary", mb: 3 }}>
        Select a {componentInfo.label.toLowerCase()} for your build.
      </Typography>

      <TextField
        fullWidth
        placeholder={`Search ${componentInfo.label}...`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 4 }}
      />

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 8,
          }}
        >
          <CircularProgress />
        </Box>
      ) : products.length === 0 ? (
        <Typography sx={{ color: "text.secondary" }}>
          No {componentInfo.label.toLowerCase()} found.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid key={product._id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Paper
                sx={{
                  p: 2,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    height: 180,
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    component="img"
                    src={product.images[0]}
                    alt={product.name}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </Box>

                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: "bold",
                    mb: 1,
                  }}
                >
                  {product.name}
                </Typography>

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
                  variant="h6"
                  sx={{
                    color: "primary.main",
                    mb: 2,
                  }}
                >
                  ${product.price}
                </Typography>

                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<AddIcon />}
                  onClick={() => selectProduct(product)}
                  sx={{ mt: "auto" }}
                >
                  Choose
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
