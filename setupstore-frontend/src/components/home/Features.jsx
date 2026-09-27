import { Box, Grid, Paper, Typography } from "@mui/material";

import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SecurityIcon from "@mui/icons-material/Security";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

const features = [
  {
    icon: <LocalShippingIcon />,
    title: "Fast Delivery",
    description: "Fast and reliable delivery for all your orders.",
  },
  {
    icon: <SecurityIcon />,
    title: "Secure Shopping",
    description: "Your data and payments are protected.",
  },
  {
    icon: <SupportAgentIcon />,
    title: "Expert Support",
    description: "Get help from our team whenever you need it.",
  },
];

export default function Features() {
  return (
    <Box sx={{ py: 8 }}>
      <Grid container spacing={3}>
        {features.map((feature) => (
          <Grid size={{ xs: 12, md: 4 }} key={feature.title}>
            <Paper
              sx={{
                p: 4,
                height: "100%",
                textAlign: "center",
              }}
            >
              <Box sx={{ mb: 2 }}>{feature.icon}</Box>

              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                {feature.title}
              </Typography>

              <Typography color="text.secondary">
                {feature.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
