"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiRequest } from "../../lib/api";
import {
  Box,
  Grid,
  Typography,
  Paper,
  IconButton,
  CircularProgress,
  Alert,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";

function ComparePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idsParam = searchParams.get("ids") || "";
  const ids = idsParam ? idsParam.split(",") : [];

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function fetchCompare() {
      if (ids.length === 0) {
        setProducts([]);
        setErrorMsg("");
        setLoading(false);
        return;
      }

      setLoading(true);
      setErrorMsg("");

      try {
        const data = await apiRequest(`/compare?ids=${ids.join(",")}`);
        setProducts(data);
      } catch (err) {
        setErrorMsg(err.message || "Failed to load comparison data.");
      } finally {
        setLoading(false);
      }
    }

    fetchCompare();
  }, [idsParam]);

  function updateIds(newIds) {
    if (newIds.length === 0) {
      router.push("/compare");
      return;
    }

    router.push(`/compare?ids=${newIds.join(",")}`);
  }

  function removeProduct(productId) {
    updateIds(ids.filter((id) => id !== productId));
  }

  const specifications = products[0]?.category?.specifications || [];
  console.log("COMPARE DATA:", products);
  console.log("SPECIFICATIONS:", specifications);
  function getBestProductIds(specification) {
    if (specification.compare === "none") {
      return [];
    }

    const values = products
      .map((product) => ({
        id: product._id,
        value: product.specs?.[specification.name],
      }))
      .filter(({ value }) => typeof value === "number");

    if (values.length < 2) {
      return [];
    }

    const bestValue =
      specification.compare === "higher"
        ? Math.max(...values.map(({ value }) => value))
        : Math.min(...values.map(({ value }) => value));

    return values
      .filter(({ value }) => value === bestValue)
      .map(({ id }) => id);
  }

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 4, md: 6 },
        py: { xs: 3, md: 6 },
        maxWidth: 1400,
        mx: "auto",
      }}
    >
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold" }}>
        Compare Products
      </Typography>

      {errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 6,
          }}
        >
          <CircularProgress />
        </Box>
      ) : products.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography sx={{ color: "text.secondary", mb: 2 }}>
            No products selected for comparison.
          </Typography>

          <Button
            variant="contained"
            onClick={() => router.push(`/compare/add?ids=${ids.join(",")}`)}
          >
            Add Product
          </Button>
        </Paper>
      ) : (
        <>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {products.map((product) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={product._id}>
                <Paper sx={{ p: 2, height: "100%" }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() => removeProduct(product._id)}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  <Box
                    component="img"
                    src={product.images[0]}
                    alt={product.name}
                    sx={{
                      width: "100%",
                      height: 180,
                      objectFit: "contain",
                      mb: 2,
                    }}
                  />

                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      mb: 1,
                    }}
                  >
                    {product.brand}
                  </Typography>

                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: "bold",
                      mb: 1,
                    }}
                  >
                    {product.name}
                  </Typography>

                  <Typography variant="h6" sx={{ color: "primary.main" }}>
                    ${product.price.toFixed(2)}
                  </Typography>
                </Paper>
              </Grid>
            ))}

            {ids.length < 4 && (
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper
                  onClick={() =>
                    router.push(`/compare/add?ids=${ids.join(",")}`)
                  }
                  sx={{
                    height: "100%",
                    minHeight: 300,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    border: "1px dashed",
                    borderColor: "divider",
                  }}
                >
                  <Box sx={{ textAlign: "center" }}>
                    <AddIcon
                      sx={{
                        fontSize: 40,
                        color: "text.secondary",
                        mb: 1,
                      }}
                    />

                    <Typography sx={{ color: "text.secondary" }}>
                      Add Product
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            )}
          </Grid>

          {products.length >= 1 &&
            (specifications.length > 0 ? (
              <TableContainer component={Paper} sx={{ mt: 4 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold", width: "200px" }}>
                        Specification
                      </TableCell>

                      {products.map((product) => (
                        <TableCell
                          key={product._id}
                          sx={{ fontWeight: "bold", minWidth: "180px" }}
                        >
                          {product.name}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {specifications.map((specification) => (
                      <TableRow
                        key={specification.name}
                        sx={{
                          "&:nth-of-type(odd)": {
                            backgroundColor: "action.hover",
                          },
                        }}
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          sx={{ color: "text.secondary", fontWeight: 600 }}
                        >
                          {specification.name}
                        </TableCell>

                        {products.map((product) => {
                          const bestProductIds =
                            getBestProductIds(specification);
                          const isBest = bestProductIds.includes(product._id);

                          return (
                            <TableCell
                              key={product._id}
                              sx={{
                                fontWeight: isBest ? 700 : 400,
                                color: isBest ? "success.main" : "inherit",
                              }}
                            >
                              {product.specs?.[specification.name] != null
                                ? `${product.specs[specification.name]}${
                                    specification.unit
                                      ? ` ${specification.unit}`
                                      : ""
                                  }`
                                : "N/A"}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Alert severity="info" sx={{ mt: 4 }}>
                This category does not have comparison specifications.
              </Alert>
            ))}
        </>
      )}
    </Box>
  );
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <CircularProgress />
        </Box>
      }
    >
      <ComparePageContent />
    </Suspense>
  );
}
