"use client";

import { Avatar, Box, Grid, Paper, Rating, Typography } from "@mui/material";

const testimonials = [
  {
    name: "Karim H.",
    initials: "KH",
    rating: 5,
    quote:
      "The compatibility checker saved me from buying the wrong motherboard. Build went together perfectly on the first try.",
  },
  {
    name: "Lina M.",
    initials: "LM",
    rating: 5,
    quote:
      "Fast shipping and the prices beat every other store I checked. My go-to for every upgrade now.",
  },
  {
    name: "Omar S.",
    initials: "OS",
    rating: 4,
    quote:
      "Great selection of GPUs and the side-by-side comparison made picking one so much easier.",
  },
];

export default function Testimonials() {
  return (
    <Box sx={{ mb: 10 }}>
      <Typography
        variant="h5"
        sx={{ mb: 3, fontWeight: "bold", textAlign: "center" }}
      >
        What Builders Are Saying
      </Typography>

      <Grid container spacing={3}>
        {testimonials.map((testimonial) => (
          <Grid key={testimonial.name} size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 3, height: "100%" }}>
              <Rating
                value={testimonial.rating}
                readOnly
                size="small"
                sx={{ mb: 1.5 }}
              />

              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mb: 2 }}
              >
                &ldquo;{testimonial.quote}&rdquo;
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Avatar sx={{ bgcolor: "primary.main", fontSize: "0.875rem" }}>
                  {testimonial.initials}
                </Avatar>

                <Typography variant="subtitle2">{testimonial.name}</Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
