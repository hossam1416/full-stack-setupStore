"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";
import { apiRequest } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Button,
  TextField,
  Alert,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";

const componentTypes = [
  { key: "cpu", label: "Processor (CPU)" },
  { key: "motherboard", label: "Motherboard" },
  { key: "ram", label: "Memory (RAM)" },
  { key: "gpu", label: "Graphics Card (GPU)" },
  { key: "psu", label: "Power Supply (PSU)" },
  { key: "storage", label: "Storage" },
  { key: "case", label: "Case" },
];

export default function BuilderPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Load selected components from sessionStorage synchronously (no effect needed)
  const [selected, setSelected] = useState(() => {
    if (typeof window === "undefined") return {};

    try {
      const savedSelected = sessionStorage.getItem("builderSelected");
      return savedSelected ? JSON.parse(savedSelected) : {};
    } catch (err) {
      console.error("Failed to load builder selection:", err);
      return {};
    }
  });

  const [compatibility, setCompatibility] = useState(null);
  const [buildName, setBuildName] = useState("");
  const [saveMessage, setSaveMessage] = useState({
    type: "",
    text: "",
  });

  // Save selected components to sessionStorage
  useEffect(() => {
    sessionStorage.setItem("builderSelected", JSON.stringify(selected));
  }, [selected]);

  // Protect builder page
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  // Load selected product after returning from component page
  useEffect(() => {
    async function loadSelectedProduct() {
      const component = searchParams.get("component");
      const slug = searchParams.get("product");

      if (!component || !slug) return;

      const componentExists = componentTypes.some(
        (item) => item.key === component,
      );

      if (!componentExists) return;

      try {
        const product = await apiRequest(`/products/${slug}`);

        setSelected((prev) => ({
          ...prev,
          [component]: product,
        }));

        router.replace("/builder");
      } catch (err) {
        console.error("Failed to load selected product:", err);
      }
    }

    loadSelectedProduct();
  }, [searchParams, router]);

  // Check component compatibility
  useEffect(() => {
    async function checkCompatibility() {
      const relevantComponents = ["cpu", "motherboard", "ram", "psu"].filter(
        (key) => selected[key],
      );

      if (relevantComponents.length < 2) {
        setCompatibility(null);
        return;
      }

      try {
        const data = await apiRequest("/builder/check-compatibility", {
          method: "POST",
          body: JSON.stringify({
            cpuId: selected.cpu?._id,
            motherboardId: selected.motherboard?._id,
            ramId: selected.ram?._id,
            psuId: selected.psu?._id,
          }),
        });

        setCompatibility(data);
      } catch (err) {
        console.error("Compatibility check failed:", err);
      }
    }

    checkCompatibility();
  }, [selected]);

  if (authLoading || !user) {
    return null;
  }

  function chooseComponent(key) {
    router.push(`/builder/${key}`);
  }

  function removeProduct(key) {
    setSelected((prev) => {
      const updated = { ...prev };

      delete updated[key];

      return updated;
    });
  }

  async function handleSaveBuild() {
    if (!buildName.trim()) {
      setSaveMessage({
        type: "error",
        text: "Please enter a build name",
      });

      return;
    }

    const components = {};

    componentTypes.forEach(({ key }) => {
      if (selected[key]) {
        components[key] = selected[key]._id;
      }
    });

    try {
      await apiRequest("/builder", {
        method: "POST",
        body: JSON.stringify({
          name: buildName,
          components,
        }),
      });

      setSaveMessage({
        type: "success",
        text: "Build saved successfully!",
      });
    } catch (err) {
      setSaveMessage({
        type: "error",
        text: err.message,
      });
    }
  }

  const totalPrice = Object.values(selected).reduce(
    (sum, product) => sum + product.price,
    0,
  );

  const selectedComponentCount = Object.keys(selected).length;

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 4, md: 6 },
        py: { xs: 3, md: 6 },
      }}
    >
      <Typography variant="h4" sx={{ mb: 1 }}>
        PC Builder
      </Typography>

      <Typography
        sx={{
          color: "text.secondary",
          mb: 4,
        }}
      >
        Pick your components and we&apos;ll check compatibility as you go.
      </Typography>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 7 }}>
          {componentTypes.map(({ key, label }) => {
            const product = selected[key];

            const check = compatibility?.checks?.find((item) =>
              item.pair.toLowerCase().includes(key),
            );

            return (
              <Paper
                key={key}
                sx={{
                  p: 2,
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: {
                      xs: "column",
                      sm: "row",
                    },
                    alignItems: {
                      xs: "flex-start",
                      sm: "center",
                    },
                    justifyContent: "space-between",
                    gap: 1,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: "text.secondary",
                      minWidth: 180,
                    }}
                  >
                    {label}
                  </Typography>

                  {product ? (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        flexGrow: 1,
                      }}
                    >
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          backgroundColor: "background.paper",
                          borderRadius: 1,
                          flexShrink: 0,
                          overflow: "hidden",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Box
                          component="img"
                          src={product.images[0]}
                          alt={product.name}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                          }}
                        />
                      </Box>

                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body2">{product.name}</Typography>

                        <Typography
                          variant="caption"
                          sx={{
                            color: "primary.main",
                          }}
                        >
                          ${product.price}
                        </Typography>
                      </Box>

                      <Button size="small" onClick={() => chooseComponent(key)}>
                        Change
                      </Button>

                      <Button
                        size="small"
                        color="error"
                        onClick={() => removeProduct(key)}
                      >
                        Remove
                      </Button>
                    </Box>
                  ) : (
                    <Button
                      variant="outlined"
                      sx={{
                        borderStyle: "dashed",
                      }}
                      onClick={() => chooseComponent(key)}
                    >
                      + Choose {label}
                    </Button>
                  )}
                </Box>

                {check && (
                  <Alert
                    icon={
                      check.compatible ? (
                        <CheckCircleIcon fontSize="small" />
                      ) : (
                        <WarningIcon fontSize="small" />
                      )
                    }
                    severity={check.compatible ? "success" : "error"}
                    sx={{
                      mt: 1,
                      py: 0,
                    }}
                  >
                    {check.reason}
                  </Alert>
                )}
              </Paper>
            );
          })}
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Paper
            sx={{
              p: 3,
              position: { md: "sticky" },
              top: { md: 20 },
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Build Summary
            </Typography>

            <Typography
              variant="h4"
              sx={{
                color: "primary.main",
                mb: 3,
              }}
            >
              ${totalPrice.toFixed(2)}
            </Typography>

            {compatibility && !compatibility.overallCompatible && (
              <Alert severity="error" sx={{ mb: 3 }}>
                Some components are not compatible. Please review your
                selections.
              </Alert>
            )}

            <TextField
              label="Build Name"
              placeholder="My Awesome Build"
              fullWidth
              value={buildName}
              onChange={(e) => setBuildName(e.target.value)}
              sx={{ mb: 2 }}
            />

            {saveMessage.text && (
              <Alert severity={saveMessage.type} sx={{ mb: 2 }}>
                {saveMessage.text}
              </Alert>
            )}

            <Button
              variant="contained"
              fullWidth
              size="large"
              disabled={selectedComponentCount === 0}
              onClick={handleSaveBuild}
            >
              Save Build
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
