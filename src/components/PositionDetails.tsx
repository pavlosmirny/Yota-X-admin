// src/components/positions/PositionDetails.tsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Paper,
  Typography,
  Box,
  Chip,
  Divider,
  Button,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Stack,
  IconButton,
} from "@mui/material";
import {
  BusinessCenter as DepartmentIcon,
  WorkOutline as TypeIcon,
  LocationOn as LocationIcon,
  Timer as ExperienceIcon,
  Check as RequirementIcon,
  Edit as EditIcon,
  ArrowBack as BackIcon,
} from "@mui/icons-material";
import { Position, positionsApi, transformPosition } from "../services/api";

export const PositionDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [position, setPosition] = React.useState<Position | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchPosition = async () => {
      try {
        const { data } = await positionsApi.getPosition(id!);
        setPosition(transformPosition(data));
        setError(null);
      } catch (err) {
        console.error("Error fetching position:", err);
        setError("Failed to load position");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPosition();
    }
  }, [id]);

  if (loading)
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading...</Typography>
      </Box>
    );

  if (error)
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );

  if (!position)
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Position not found</Alert>
      </Box>
    );

  return (
    <Paper sx={{ p: 3 }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <IconButton onClick={() => navigate("/positions")} sx={{ mr: 1 }}>
          <BackIcon />
        </IconButton>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          {position.title}
        </Typography>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/positions/${id}/edit`)}
        >
          Edit Position
        </Button>
      </Stack>

      {/* Status Tags */}
      <Stack direction="row" spacing={1} sx={{ mb: 4 }}>
        <Chip
          icon={<TypeIcon />}
          label={position.type}
          color="primary"
          variant="outlined"
        />
        <Chip
          icon={<LocationIcon />}
          label={position.location}
          color={position.location === "Remote" ? "success" : "default"}
          variant="outlined"
        />
      </Stack>

      <Divider sx={{ my: 3 }} />

      {/* Main Content */}
      <Grid container spacing={4}>
        {/* Left Side - Details */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom>
            Position Details
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <DepartmentIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Department"
                secondary={position.department}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <ExperienceIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Required Experience"
                secondary={position.experience}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <LocationIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Location" secondary={position.location} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <TypeIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Employment Type"
                secondary={position.type}
              />
            </ListItem>
          </List>
        </Grid>

        {/* Right Side - Description and Requirements */}
        <Grid item xs={12} md={8}>
          {/* Description */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography component="div" sx={{ whiteSpace: "pre-line" }}>
              {position.description}
            </Typography>
          </Box>

          {/* Requirements */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Requirements
            </Typography>
            <List>
              {position.requirements.map((requirement, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <RequirementIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={requirement} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Grid>
      </Grid>

      {/* Footer Actions */}
      <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="outlined"
          startIcon={<BackIcon />}
          onClick={() => navigate("/positions")}
        >
          Back to Positions
        </Button>
      </Box>
    </Paper>
  );
};

export default PositionDetails;
