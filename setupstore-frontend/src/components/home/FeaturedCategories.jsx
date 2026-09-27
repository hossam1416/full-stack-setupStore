"use client";

import Link from "next/link";
import { Box, Grid, Paper, Typography } from "@mui/material";

const categories = [
  {
    name: "Graphics Cards",
    image: "/images/gpus.jpg",
  },
  {
    name: "Processors",
    image: "/images/cpu.jpg",
  },
  {
    name: "Memory",
    image: "/images/ram.jpg",
  },
  {
    name: "Storage",
    image: "/images/storage.jpg",
  },
  {
    name: "Motherboards",
    image: "/images/motherboard.jpg",
  },
];

export default function FeaturedCategories() {
  return (
    <Box sx={{ mb: 10 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
        Featured Categories
      </Typography>

      <Grid container spacing={2}>
        {categories.map((category) => (
          <Grid key={category.name} size={{ xs: 6, sm: 4, md: 2.4 }}>
            <Paper
              component={Link}
              href={`/products?category=${encodeURIComponent(category.name)}`}
              role="img"
              aria-label={category.name}
              sx={{
                display: "block",
                textDecoration: "none",
                p: 4,
                textAlign: "center",
                cursor: "pointer",
                borderRadius: 2,
                overflow: "hidden",
                position: "relative",
                backgroundImage: `url(${category.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                border: "1px solid",
                borderColor: "divider",
                transition: "transform 0.3s ease, border-color 0.3s ease",

                "&::before": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  transition: "background-color 0.3s ease",
                  zIndex: 1,
                },

                "&:hover": {
                  borderColor: "primary.main",
                  transform: "translateY(-4px)",

                  "&::before": {
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                  },
                },
              }}
            >
              <Typography
                sx={{
                  color: "primary.main",
                  fontWeight: "bold",
                  position: "relative",
                  zIndex: 2,
                }}
              >
                {category.name}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
