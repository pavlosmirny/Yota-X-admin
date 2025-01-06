// src/components/positions/PositionsList.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Typography,
  Box,
  Chip,
  TablePagination,
  Alert,
  TextField,
  MenuItem,
  Stack,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import { Position, positionsApi, transformPositions } from "../../services/api";

import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { DEPARTMENTS } from "../../constants/positions";

export const PositionsList: React.FC = () => {
  const navigate = useNavigate();
  const [positions, setPositions] = React.useState<Position[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [positionToDelete, setPositionToDelete] =
    React.useState<Position | null>(null);
  const [selectedDepartment, setSelectedDepartment] =
    React.useState<string>("");
  const [searchQuery, setSearchQuery] = React.useState("");

  const fetchPositions = async () => {
    try {
      const params = selectedDepartment
        ? { department: selectedDepartment }
        : undefined;
      const { data } = await positionsApi.getPositions(params);
      setPositions(transformPositions(data));
      setError(null);
    } catch (err) {
      console.error("Error fetching positions:", err);
      setError("Failed to load positions");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchPositions();
      return;
    }

    try {
      const { data } = await positionsApi.searchPositions(searchQuery);
      setPositions(transformPositions(data));
      setError(null);
    } catch (err) {
      console.error("Error searching positions:", err);
      setError("Failed to search positions");
    }
  };

  React.useEffect(() => {
    fetchPositions();
  }, [selectedDepartment]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = async (position: Position) => {
    setPositionToDelete(position);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (positionToDelete) {
      try {
        await positionsApi.deletePosition(positionToDelete.id);
        setPositions(positions.filter((p) => p.id !== positionToDelete.id));
        setDeleteDialogOpen(false);
        setError(null);
      } catch (err) {
        console.error("Error deleting position:", err);
        setError("Failed to delete position");
      }
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Typography variant="h5">Positions</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/positions/new")}
        >
          Add Position
        </Button>
      </Box>

      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <TextField
          select
          label="Department"
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">All Departments</MenuItem>
          {DEPARTMENTS.map((dept) => (
            <MenuItem key={dept} value={dept}>
              {dept}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          sx={{ minWidth: 300 }}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          disabled={!searchQuery.trim()}
        >
          Search
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Experience</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {positions
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((position) => (
                <TableRow key={position.id}>
                  <TableCell>{position.title}</TableCell>
                  <TableCell>{position.department}</TableCell>
                  <TableCell>
                    <Chip
                      label={position.type}
                      size="small"
                      color={
                        position.type === "Full-time" ? "primary" : "default"
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={position.location}
                      size="small"
                      color={
                        position.location === "Remote" ? "success" : "default"
                      }
                    />
                  </TableCell>
                  <TableCell>{position.experience}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/positions/${position.id}`)}
                        title="View"
                      >
                        <ViewIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() =>
                          navigate(`/positions/${position.id}/edit`)
                        }
                        title="Edit"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(position)}
                        title="Delete"
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            {positions.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No positions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={positions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Position"
        content={`Are you sure you want to delete the position "${positionToDelete?.title}"?`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </>
  );
};

export default PositionsList;
