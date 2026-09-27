"use client";

import { Box, Typography } from "@mui/material";
import { keyframes } from "@mui/material/styles";

const brands = [
  "NVIDIA",
  "AMD",
  "Intel",
  "Corsair",
  "ASUS",
  "MSI",
  "Gigabyte",
  "ASRock",
  "Logitech",
  "Razer",
  "Samsung",
  "Western Digital",
  "Seagate",
  "Kingston",
  "G.Skill",
  "Noctua",
  "be quiet!",
  "NZXT",
  "Fractal Design",
  "Cooler Master",
  "Lian Li",
  "Secretlab",
  "LG",
  "Dell",
  "Elgato",
  "HyperX",
  "SteelSeries",
  "Anker",
  "EVGA",
  "Seasonic",
];

// Seamless infinite scroll: the track is duplicated, so translating exactly
// -50% loops back to an identical starting point with no visible jump.
const scroll = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
`;

export default function BrandsMarquee() {
  return (
    <Box sx={{ mb: 10 }}>
      <Typography
        variant="overline"
        sx={{
          display: "block",
          textAlign: "center",
          color: "text.secondary",
          letterSpacing: 2,
          mb: 2,
        }}
      >
        Trusted by builders who buy from
      </Typography>

      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          py: 1,
          "&::before, &::after": {
            content: '""',
            position: "absolute",
            top: 0,
            bottom: 0,
            width: { xs: 40, md: 100 },
            zIndex: 2,
            pointerEvents: "none",
          },
          "&::before": {
            left: 0,
            background: (theme) =>
              `linear-gradient(to right, ${theme.palette.background.default}, transparent)`,
          },
          "&::after": {
            right: 0,
            background: (theme) =>
              `linear-gradient(to left, ${theme.palette.background.default}, transparent)`,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "max-content",
            animation: `${scroll} 40s linear infinite`,
            "&:hover": {
              animationPlayState: "paused",
            },
          }}
        >
          {[...brands, ...brands].map((brand, index) => (
            <Typography
              key={`${brand}-${index}`}
              sx={{
                mx: { xs: 3, md: 5 },
                fontSize: { xs: "1rem", md: "1.35rem" },
                fontWeight: 700,
                whiteSpace: "nowrap",
                color: "text.secondary",
                opacity: 0.55,
                transition: "opacity 0.25s ease, color 0.25s ease",
                "&:hover": {
                  opacity: 1,
                  color: "primary.main",
                },
              }}
            >
              {brand}
            </Typography>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
