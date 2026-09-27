"use client";

import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import StatsBar from "@/components/home/StatsBar";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import BrandsMarquee from "@/components/home/BrandsMarquee";
import TrustBadges from "@/components/home/TrustBadges";
import Testimonials from "@/components/home/Testimonials";

import { Box, Container } from "@mui/material";

export default function HomePage() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ px: { xs: 2, sm: 3, md: 6 }, py: { xs: 4, md: 8 } }}>
        <Hero />
        <Features />
        <StatsBar />
        <FeaturedCategories />
        <FeaturedProducts />
        <BrandsMarquee />
        <TrustBadges />
        <Testimonials />
      </Box>
    </Container>
  );
}
