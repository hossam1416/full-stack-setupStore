import Link from "next/link";
import { Box, Container, Grid, Typography } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";

// Social icon button style
const socialIconStyle = {
  color: "text.secondary",
  border: "1px solid",
  borderColor: "divider",
  borderRadius: "50%",
  width: 36,
  height: 36,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.2s ease",
  "&:hover": {
    color: "text.primary",
    borderColor: "primary.main",
    backgroundColor: "rgba(245, 222, 179, 0.08)",
  },
};

const socialLinks = [
  { href: "https://facebook.com", label: "Facebook", Icon: FacebookIcon },
  { href: "https://instagram.com", label: "Instagram", Icon: InstagramIcon },
];

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "background.paper",
        color: "text.secondary",
        borderTop: "1px solid",
        borderColor: "divider",
        py: 6,
        mt: "auto",
        width: "100%",
        overflowX: "hidden",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand Info & Socials */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography
              variant="h6"
              sx={{ color: "#f5deb3", fontWeight: "bold", mb: 2 }}
            >
              Setup Store
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.7, mb: 2 }}>
              Your ultimate destination to build, compare, and create your dream
              gaming PC setup with top-tier hardware.
            </Typography>

            <Box sx={{ display: "flex", gap: 1.5 }}>
              {socialLinks.map(({ href, label, Icon }) => (
                <Box
                  key={label}
                  component="a"
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  sx={socialIconStyle}
                >
                  <Icon sx={{ fontSize: 18 }} />
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Customer Service Links */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography
              variant="subtitle1"
              sx={{ color: "text.primary", fontWeight: "bold", mb: 2 }}
            >
              Customer Service
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Link
                href="/warranty"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                Warranty & Returns
              </Link>
              <Link
                href="/track-order"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                Track Your Order
              </Link>
              <Link
                href="/terms"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                Terms & Conditions
              </Link>
            </Box>
          </Grid>

          {/* Support Info */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography
              variant="subtitle1"
              sx={{ color: "text.primary", fontWeight: "bold", mb: 2 }}
            >
              Support
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography variant="body2">
                Email: support@setupstore.com
              </Typography>
              <Typography variant="body2">
                Working Hours: 9 AM - 10 PM
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box
          sx={{
            borderTop: "1px solid",
            borderColor: "divider",
            mt: 4,
            pt: 3,
            textAlign: "center",
          }}
        >
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            © {new Date().getFullYear()} Setup Store. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
