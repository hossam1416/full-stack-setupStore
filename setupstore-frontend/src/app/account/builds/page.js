"use client";

import { useState, useEffect } from "react";
import { apiRequest } from "../../../lib/api";
import AccountSidebar from "../../../components/AccountSidebar";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Divider,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
const componentLabels = {
  cpu: "Processor (CPU)",
  motherboard: "Motherboard",
  ram: "Memory (RAM)",
  gpu: "Graphics Card (GPU)",
  psu: "Power Supply (PSU)",
  storage: "Storage",
  case: "Case",
};
export default function SavedBuildsPage() {
  const [builds, setBuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    async function fetchBuilds() {
      try {
        const data = await apiRequest("/builder");
        setBuilds(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchBuilds();
  }, []);

  async function confirmDelete() {
    if (!deleteId) return;

    try {
      await apiRequest(`/builder/${deleteId}`, {
        method: "DELETE",
      });
      // to update the builds state after deletion
      setBuilds((prev) => prev.filter((build) => build._id !== deleteId));
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteId(null);
    }
  }

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 4, md: 6 },
        py: { xs: 3, md: 6 },
        maxWidth: 1200,
        mx: "auto",
      }}
    >
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 3 }}>
          <AccountSidebar activePage="builds" />
        </Grid>

        <Grid size={{ xs: 12, md: 9 }}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Saved Builds
          </Typography>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
              <CircularProgress />
            </Box>
          ) : builds.length === 0 ? (
            <Typography sx={{ color: "text.secondary" }}>
              You have not saved any builds yet.
            </Typography>
          ) : (
            builds.map((build) => (
              <Paper key={build._id} sx={{ p: { xs: 2, sm: 3 }, mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", sm: "center" },
                    gap: 1,
                    mb: 2,
                  }}
                >
                  <Typography variant="subtitle1">{build.name}</Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Typography variant="h6" sx={{ color: "primary.main" }}>
                      ${build.totalPrice}
                    </Typography>

                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => setDeleteId(build._id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                <Divider sx={{ mb: 2 }} />
                {/* Component Details */}
                {Object.entries(componentLabels).map(([key, label]) => {
                  const component = build.components[key];
                  //  if the component is not present in the build, we skip rendering it
                  if (!component) return null;

                  return (
                    <Box
                      key={key}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        {label}
                      </Typography>

                      <Typography variant="body2">{component.name}</Typography>
                    </Box>
                  );
                })}
              </Paper>
            ))
          )}
        </Grid>
      </Grid>

      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)}>
        <DialogTitle>Delete Build</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this saved build? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>

          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
