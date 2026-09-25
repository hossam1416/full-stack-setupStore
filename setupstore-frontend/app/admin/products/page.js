"use client";

import { useState, useEffect } from "react";
import { apiRequest } from "../../../lib/api";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Avatar,
  MenuItem,
  IconButton,
  Button,
  Pagination,
  InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import AdminCrudPage from "../../../components/admin/AdminCrudPage";

const initialForm = {
  _id: "",
  name: "",
  images: [""],
  description: "",
  specs: {},
  category: "",
  brand: "",
  price: 0,
  stock: 0,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const limit = 10;
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [productForm, setProductForm] = useState(initialForm);
  const [formError, setFormError] = useState("");

  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData(page, searchQuery);
    }, 400);

    return () => clearTimeout(timer);
  }, [page, searchQuery]);

  async function fetchData(currentPage, search = "") {
    setLoading(true);
    setErrorMsg("");

    try {
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : "";

      const [prodData, catData] = await Promise.all([
        apiRequest(
          `/products?page=${currentPage}&limit=${limit}${searchParam}`,
        ),
        apiRequest("/categories").catch(() => []),
      ]);

      setProducts(prodData.products || prodData);
      setTotalPages(prodData.totalPages || 1);
      setCategories(catData.categories || catData || []);
    } catch (err) {
      setErrorMsg(err.message || "Failed to load data.");
    } finally {
      setLoading(false);
    }
  }

  function handleFormChange(field, value) {
    setProductForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleOpenAdd() {
    setIsEditing(false);
    setProductForm({
      ...initialForm,
      category: categories[0]?.name || "",
    });
    setFormError("");
    setOpenModal(true);
  }

  function handleOpenEdit(product) {
    setIsEditing(true);

    setProductForm({
      _id: product._id,
      name: product.name || "",
      images: product.images,
      description: product.description || "",
      specs: product.specs || {},
      category: product.category?.name || product.category || "",
      brand: product.brand || "",
      price: product.price || 0,
      stock: product.stock || 0,
    });

    setFormError("");
    setOpenModal(true);
  }

  async function handleSave() {
    setFormError("");

    try {
      const payload = {
        name: productForm.name,
        images: productForm.images,
        description: productForm.description,
        specs: productForm.specs,
        category: productForm.category,
        brand: productForm.brand,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
      };

      if (isEditing) {
        await apiRequest(`/products/${productForm._id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await apiRequest("/products", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      setOpenModal(false);
      fetchData(page, searchQuery);
    } catch (err) {
      setFormError(err.message || "Failed to save product.");
    }
  }

  async function handleDelete(id) {
    try {
      await apiRequest(`/products/${id}`, {
        method: "DELETE",
      });

      fetchData(page, searchQuery);
    } catch (err) {
      setErrorMsg(err.message || "Failed to delete product.");
    }
  }

  const columns = [
    {
      label: "Image",
      render: (row) => (
        <Avatar
          src={row.images[0]}
          variant="rounded"
          sx={{
            width: 40,
            height: 40,
            bgcolor: "action.hover",
          }}
        />
      ),
    },
    {
      label: "Name",
      field: "name",
    },
    {
      label: "Brand",
      field: "brand",
    },
    {
      label: "Price",
      field: "price",
      render: (row) => `$${row.price}`,
    },
    {
      label: "Stock",
      field: "stock",
    },
  ];

  const formContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        mt: 1,
      }}
    >
      <TextField
        label="Product Name"
        fullWidth
        value={productForm.name}
        onChange={(e) => handleFormChange("name", e.target.value)}
      />
      <TextField
        label="Image URL"
        fullWidth
        value={productForm.images[0] || ""}
        onChange={(e) => handleFormChange("images", [e.target.value])}
      />

      <TextField
        label="Description"
        fullWidth
        multiline
        rows={3}
        value={productForm.description}
        onChange={(e) => handleFormChange("description", e.target.value)}
      />

      <Box
        sx={{
          border: "1px solid",
          borderColor: "divider",
          p: 2,
          borderRadius: 2,
        }}
      >
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: "bold" }}>
          Specifications
        </Typography>

        {Object.entries(productForm.specs || {}).map(([key, value], idx) => (
          <Box
            key={idx}
            sx={{
              display: "flex",
              gap: 2,
              mb: 1.5,
              alignItems: "center",
            }}
          >
            <TextField
              label="Key"
              size="small"
              value={key}
              onChange={(e) => {
                const newKey = e.target.value;
                const specs = {
                  ...productForm.specs,
                };

                const oldVal = specs[key];

                delete specs[key];
                specs[newKey] = oldVal;

                handleFormChange("specs", specs);
              }}
              fullWidth
            />

            <TextField
              label="Value"
              size="small"
              value={value}
              onChange={(e) => {
                handleFormChange("specs", {
                  ...productForm.specs,
                  [key]: e.target.value,
                });
              }}
              fullWidth
            />

            <IconButton
              color="error"
              onClick={() => {
                const specs = {
                  ...productForm.specs,
                };

                delete specs[key];

                handleFormChange("specs", specs);
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        ))}

        <Button
          variant="outlined"
          size="small"
          startIcon={<AddIcon />}
          onClick={() =>
            handleFormChange("specs", {
              ...productForm.specs,
              "": "",
            })
          }
        >
          Add Spec
        </Button>
      </Box>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            select
            label="Category"
            fullWidth
            value={productForm.category}
            onChange={(e) => handleFormChange("category", e.target.value)}
          >
            {categories.map((cat) => (
              <MenuItem key={cat._id || cat} value={cat.name || cat}>
                {cat.name || cat}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Brand"
            fullWidth
            value={productForm.brand}
            onChange={(e) => handleFormChange("brand", e.target.value)}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Price ($)"
            type="number"
            fullWidth
            value={productForm.price}
            onChange={(e) => handleFormChange("price", e.target.value)}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Stock"
            type="number"
            fullWidth
            value={productForm.stock}
            onChange={(e) => handleFormChange("stock", e.target.value)}
          />
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          mb: 3,
          px: { xs: 2, md: 3 },
          pt: 2,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            mb: 1.5,
          }}
        >
          Manage Products
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <TextField
            size="small"
            placeholder="Search by product name..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            sx={{
              bgcolor: "background.paper",
              borderRadius: 1,
              minWidth: {
                xs: "100%",
                sm: "300px",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>

      <AdminCrudPage
        itemName="Product"
        loading={authLoading || loading}
        errorMsg={errorMsg}
        items={products}
        columns={columns}
        onAddClick={handleOpenAdd}
        onEditClick={handleOpenEdit}
        onDeleteClick={handleDelete}
        dialogOpen={openModal}
        dialogTitle={isEditing ? "Edit Product" : "Add New Product"}
        onCloseDialog={() => setOpenModal(false)}
        onSubmitDialog={handleSave}
        dialogError={formError}
        formContent={formContent}
      />

      {!loading && totalPages > 1 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            my: 4,
          }}
        >
          <Pagination
            count={totalPages}
            page={page}
            onChange={(event, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
}
