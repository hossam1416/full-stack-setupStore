"use client";

import { Box, Grid, Typography } from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import LoopIcon from "@mui/icons-material/Loop";
import LockIcon from "@mui/icons-material/Lock";

const trustBadges = [
  {
    icon: LocalShippingIcon,
    title: "Free Shipping",
    desc: "On all orders over $99",
  },
  {
    icon: VerifiedUserIcon,
    title: "2-Year Warranty",
    desc: "On every component we sell",
  },
  {
    icon: LoopIcon,
    title: "Easy Returns",
    desc: "30-day hassle-free returns",
  },
  {
    icon: LockIcon,
    title: "Secure Payment",
    desc: "Your data is always protected",
  },
];

export default function TrustBadges() {
  return (
    <Grid container spacing={3} sx={{ mb: 10 }}>
      {trustBadges.map((badge) => {
        const BadgeIcon = badge.icon;
        return (
          <Grid key={badge.title} size={{ xs: 6, md: 3 }}>
            <Box sx={{ textAlign: "center", px: 1 }}>
              <BadgeIcon sx={{ color: "primary.main", fontSize: 36, mb: 1 }} />

              <Typography
                variant="subtitle2"
                sx={{ fontWeight: "bold", mb: 0.5 }}
              >
                {badge.title}
              </Typography>

              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {badge.desc}
              </Typography>
            </Box>
          </Grid>
        );
      })}
    </Grid>
  );
}
