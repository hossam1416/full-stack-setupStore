"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  IconButton,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function AdminCrudPage({
  title,
  itemName = "Item",
  loading,
  errorMsg,
  items,
  columns,
  onAddClick,
  onEditClick,
  onDeleteClick,
  dialogOpen,
  dialogTitle,
  onCloseDialog,
  onSubmitDialog,
  dialogError,
  formContent,
}) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  function handleDeleteClickOpen(item) {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  }

  function handleDeleteClose() {
    setItemToDelete(null);
    setDeleteDialogOpen(false);
  }

  function handleConfirmDelete() {
    if (itemToDelete) {
      onDeleteClick(itemToDelete._id);
    }

    handleDeleteClose();
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 10,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        px: { xs: 2, md: 6 },
        py: { xs: 3, md: 6 },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          {title}
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddClick}
        >
          Add New {itemName}
        </Button>
      </Box>

      {/* Global Error */}
      {errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      {/* Main Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell key={index} align={column.align || "left"}>
                  {column.label}
                </TableCell>
              ))}

              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {items.map((item) => (
              <TableRow key={item._id}>
                {columns.map((column, index) => (
                  <TableCell key={index} align={column.align || "left"}>
                    {column.render ? column.render(item) : item[column.field]}
                  </TableCell>
                ))}

                <TableCell align="right">
                  <IconButton size="small" onClick={() => onEditClick(item)}>
                    <EditIcon fontSize="small" />
                  </IconButton>

                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteClickOpen(item)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onClose={onCloseDialog} fullWidth maxWidth="md">
        <DialogTitle>{dialogTitle}</DialogTitle>

        <DialogContent dividers>
          {dialogError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {dialogError}
            </Alert>
          )}

          {formContent}
        </DialogContent>

        <DialogActions>
          <Button onClick={onCloseDialog}>Cancel</Button>

          <Button variant="contained" onClick={onSubmitDialog}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteClose}>
        <DialogTitle>Confirm Delete</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this {itemName}? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleDeleteClose}>Cancel</Button>

          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
