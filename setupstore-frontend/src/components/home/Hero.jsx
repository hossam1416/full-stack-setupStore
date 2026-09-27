"use client";

import Link from "next/link";
import { Box, Button, Container, Typography } from "@mui/material";

export default function Hero() {
  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        mb: 10,
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            alignItems: "center",
            gap: { xs: 4, md: 8 },
            px: { xs: 2, sm: 3, md: 6 },
            py: { xs: 6, md: 10 },
          }}
        >
          <Box>
            <Typography
              variant="h1"
              sx={{
                fontWeight: 900,
                fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem" },
                lineHeight: 1.05,
                mb: 3,
              }}
            >
              Build Your Dream PC with Precision.
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: "text.secondary",
                maxWidth: 650,
                mb: 4,
                lineHeight: 1.7,
              }}
            >
              The ultimate destination for premium components. Use our Smart PC
              Builder to create your perfect setup with real-time compatibility
              checks.
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 2,
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
              >
                Try PC Builder
              </Button>
            </Box>
          </Box>

          <Box
            component="img"
            src="/images/hero-setup.jpg"
            alt="PC setup"
            sx={{
              width: "100%",
              height: { xs: 280, md: 450 },
              objectFit: "cover",
              borderRadius: 3,
            }}
          />
        </Box>
      </Container>
    </Box>
  );
}
