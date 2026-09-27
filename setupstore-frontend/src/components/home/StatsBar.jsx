import { Box, Grid, Paper, Typography } from "@mui/material";

import PeopleIcon from "@mui/icons-material/People";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

const stats = [
  {
    value: "500+",
    label: "Products",
    icon: <InventoryIcon />,
  },
  {
    value: "30+",
    label: "Brands",
    icon: <PeopleIcon />,
  },
  {
    value: "10K+",
    label: "Happy Customers",
    icon: <ShoppingCartIcon />,
  },
  {
    value: "24/7",
    label: "Support",
    icon: <SupportAgentIcon />,
  },
];

export default function StatsBar() {
  return (
    <Box sx={{ py: 5 }}>
      <Grid container spacing={2}>
        {stats.map((stat) => (
          <Grid size={{ xs: 6, md: 3 }} key={stat.label}>
            <Paper
              sx={{
                p: 3,
                textAlign: "center",
              }}
            >
              <Box sx={{ mb: 1 }}>{stat.icon}</Box>

              <Typography variant="h4" sx={{ fontWeight: 900 }}>
                {stat.value}
              </Typography>

              <Typography color="text.secondary">{stat.label}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
