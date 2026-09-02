"use client";

import Link from "next/link";
import { Box, Typography, Button, Grid, Paper, Container } from "@mui/material";

const features = [
  {
    title: "Wide Selection",
    desc: "A curated range of high-performance components from top brands.",
  },
  {
    title: "Smart PC Builder",
    desc: "Build with confidence using our intelligent compatibility engine.",
  },
  {
    title: "Compare Products",
    desc: "Make informed decisions with side-by-side technical specs.",
  },
];

const categories = [
  { name: "Graphics Cards", image: "/images/gpus.jpg" },
  { name: "Processors", image: "/images/cpu.jpg" },
  { name: "Memory", image: "/images/ram.jpg" },
  { name: "Storage", image: "/images/storage.jpg" },
  { name: "Motherboards", image: "/images/motherboard.jpg" },
];

export default function HomePage() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box
        sx={{
          px: { xs: 2, sm: 3, md: 6 },
          py: { xs: 4, md: 8 },
        }}
      >
        {/* Hero Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            gap: 4,
            mb: 10,
            textAlign: { xs: "center", md: "left" },
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: "bold",
                mb: 2,
                fontSize: { xs: "1.8rem", sm: "2.5rem", md: "3.5rem" },
              }}
            >
              Build Your Dream PC with Precision.
            </Typography>

            <Typography variant="body1" sx={{ color: "text.secondary", mb: 4 }}>
              The ultimate destination for premium components. Use our Smart PC
              Builder to create your perfect setup with real-time compatibility
              checks.
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: { xs: "center", md: "flex-start" },
                flexWrap: "wrap",
              }}
            >
              <Button
                component={Link}
                href="/products"
                variant="contained"
                size="large"
              >
                Shop Now
              </Button>

              <Button
                component={Link}
                href="/builder"
                variant="outlined"
                size="large"
                sx={{
                  borderColor: "primary.main",
                  color: "primary.main",
                }}
              >
                Try PC Builder
              </Button>
            </Box>
          </Box>

          {/* Hero Image */}
          <Box
            role="img"
            aria-label="Gaming PC setup showcase"
            sx={{
              flex: 1,
              height: { xs: 220, sm: 280, md: 350 },
              borderRadius: 2,
              backgroundImage: `linear-gradient(
              rgba(0, 0, 0, 0.4),
              rgba(0, 0, 0, 0.4)
            ), url('/images/hero-setup.jpg')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
            }}
          />
        </Box>

        {/* Features */}
        <Grid container spacing={3} sx={{ mb: 10 }}>
          {features.map((feature) => (
            <Grid key={feature.title} size={{ xs: 12, md: 4 }}>
              <Paper sx={{ p: 3, height: "100%" }}>
                <Typography variant="h6" sx={{ color: "primary.main", mb: 1 }}>
                  {feature.title}
                </Typography>

                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {feature.desc}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Featured Categories */}
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
    </Container>
  );
}
