"use client";

import Link from "next/link";
import { Box, Button, Container, Typography } from "@mui/material";

export default function Hero() {
  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        overflow: "hidden",
        mb: { xs: 6, md: 10 },
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
            py: { xs: 4, md: 10 },
          }}
        >
          <Box
            sx={{
              textAlign: { xs: "center", md: "left" },
              display: "flex",
              flexDirection: "column",
              alignItems: { xs: "center", md: "flex-start" },
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontWeight: 900,

                fontSize: { xs: "2.1rem", sm: "3rem", md: "4.5rem" },
                lineHeight: 1.15,
                mb: 2.5,
              }}
            >
              Build Your Dream PC with Precision.
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                maxWidth: 650,

                fontSize: { xs: "1rem", sm: "1.125rem" },
                mb: 3.5,
                lineHeight: 1.6,
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
                justifyContent: { xs: "center", md: "flex-start" },
                width: { xs: "100%", sm: "auto" },
              }}
            >
              <Button
                component={Link}
                href="/products"
                variant="contained"
                size="large"
                sx={{
                  flex: { xs: 1, sm: "initial" },
                  minWidth: "140px",
                }}
              >
                Shop Now
              </Button>

              <Button
                component={Link}
                href="/builder"
                variant="outlined"
                size="large"
                sx={{
                  flex: { xs: 1, sm: "initial" },
                  minWidth: "140px",
                }}
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
              height: { xs: 240, sm: 320, md: 450 },
              objectFit: "cover",
              borderRadius: 3,
            }}
          />
        </Box>
      </Container>
    </Box>
  );
}
