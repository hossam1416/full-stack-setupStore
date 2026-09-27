"use client";

import { Box, Grid, Typography } from "@mui/material";

export default function AuthLayout({
  title,
  subtitle,
  children,
  imageSrc,
  imageAlt = "Setup Store Showcase",
}) {
  return (
    <Box
      sx={{
        minHeight: "90vh",
        display: "flex",
        backgroundColor: "background.default",
      }}
    >
      <Grid container sx={{ flex: 1 }}>
        {/* Left Side: Form Section */}
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            p: { xs: 3, sm: 6 },
            backgroundColor: "background.default",
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 420 }}>
            <Typography
              variant="h4"
              sx={{
                color: "text.primary",
                mb: 1,
                fontWeight: "bold",
              }}
            >
              {title}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                mb: 4,
              }}
            >
              {subtitle}
            </Typography>

            {children}
          </Box>
        </Grid>

        {/* Right Side: Promo Banner & Image Section */}
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "background.paper",
            borderLeft: "1px solid",
            borderColor: "divider",
            p: 4,
          }}
        >
          <Box
            sx={{
              maxWidth: 580,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Typography
              variant="h3"
              sx={{
                color: "primary.main",
                fontWeight: "bold",
                mb: 2,
                fontSize: { md: "2.2rem" },
              }}
            >
              Build your dream PC setup around you
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                mb: 3,
              }}
            >
              Compare hardware, track compatibility, and create the ultimate
              gaming rig with Setup Store.
            </Typography>

            <Box
              component="img"
              src={imageSrc}
              alt={imageAlt}
              sx={{
                width: "100%",
                maxWidth: 540,
                height: "auto",
                borderRadius: 3,
                boxShadow: 4,
                border: "1px solid",
                borderColor: "divider",
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
