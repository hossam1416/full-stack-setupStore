"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "./api";
import { useAuth } from "../context/AuthContext";

// Custom hook to manage adding items to the cart
export function useAddToCart() {
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  // Add product to cart or redirect to login if unauthenticated
  async function addToCart(productId, quantity = 1) {
    if (!user) {
      router.push("/login");
      return;
    }

    try {
      await apiRequest("/cart", {
        method: "POST",
        body: JSON.stringify({ productId, quantity }),
      });
      setShowSuccess(true);
    } catch (err) {
      console.error(err);
    }
  }

  return { addToCart, showSuccess, setShowSuccess };
}
