"use client";

import { useState, useEffect } from "react";
import { apiRequest } from "../../../lib/api";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import { TextField } from "@mui/material";
import AdminCrudPage from "../../../components/admin/AdminCrudPage";

const emptyForm = {
  name: "",
  description: "",
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);

    try {
      const data = await apiRequest("/categories");

      setCategories(data.categories || data || []);
    } catch (err) {
      setErrorMsg(err.message || "Failed to load categories.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    try {
      await apiRequest(`/categories/${id}`, {
        method: "DELETE",
      });

      setCategories((prev) => prev.filter((category) => category._id !== id));
    } catch (err) {
      setErrorMsg(err.message || "Failed to delete category.");
    }
  }

  function handleFormChange(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleOpenAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setDialogOpen(true);
  }

  function handleOpenEdit(category) {
    setEditingId(category._id);

    setForm({
      name: category.name || "",
      description: category.description || "",
    });

    setFormError("");
    setDialogOpen(true);
  }

  async function handleSubmit() {
    setFormError("");

    try {
      if (editingId) {
        await apiRequest(`/categories/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
      } else {
        await apiRequest("/categories", {
          method: "POST",
          body: JSON.stringify(form),
        });
      }

      setDialogOpen(false);
      fetchCategories();
    } catch (err) {
      setFormError(err.message || "Failed to save category.");
    }
  }

  const columns = [
    {
      label: "Name",
      field: "name",
    },
    {
      label: "Slug",
      field: "slug",
    },
    {
      label: "Description",
      field: "description",
      render: (category) => category.description || "—",
    },
  ];

  const formContent = (
    <>
      <TextField
        label="Name"
        fullWidth
        value={form.name}
        onChange={(e) => handleFormChange("name", e.target.value)}
        sx={{ mb: 2, mt: 1 }}
      />

      <TextField
        label="Description"
        fullWidth
        multiline
        rows={3}
        value={form.description}
        onChange={(e) => handleFormChange("description", e.target.value)}
      />
    </>
  );

  return (
    <AdminCrudPage
      title="Manage Categories"
      itemName="Category"
      loading={authLoading || loading}
      errorMsg={errorMsg}
      items={categories}
      columns={columns}
      onAddClick={handleOpenAdd}
      onEditClick={handleOpenEdit}
      onDeleteClick={handleDelete}
      dialogOpen={dialogOpen}
      dialogTitle={editingId ? "Edit Category" : "Add New Category"}
      onCloseDialog={() => setDialogOpen(false)}
      onSubmitDialog={handleSubmit}
      dialogError={formError}
      formContent={formContent}
    />
  );
}
