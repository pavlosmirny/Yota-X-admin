// src/components/positions/PositionForm.tsx

import React from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Paper,
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  MenuItem,
  Chip,
  Alert,
  Snackbar,
  FormHelperText,
  Stack,
} from "@mui/material";
import {
  CreatePositionDto,
  positionsApi,
  transformPosition,
} from "../../services/api";
import {
  DEPARTMENTS,
  EMPLOYMENT_TYPES,
  LOCATIONS,
  EXPERIENCE_LEVELS,
} from "../../constants/positions";

// Схема валидации
const validationSchema: yup.ObjectSchema<CreatePositionDto> = yup
  .object({
    title: yup.string().required("Title is required"),
    department: yup.string().required("Department is required"),
    type: yup.string().required("Employment type is required"),
    location: yup.string().required("Location is required"),
    experience: yup.string().required("Experience is required"),
    description: yup.string().required("Description is required"),
    requirements: yup
      .array()
      .of(yup.string().required("Each requirement is required"))
      .min(1, "At least one requirement is required")
      .required("Requirements are required"),
  })
  .required();

const PositionForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const isEdit = Boolean(id);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreatePositionDto>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      title: "",
      department: "",
      type: "",
      location: "",
      experience: "",
      description: "",
      requirements: [],
    },
  });

  // Загрузка данных для редактирования
  React.useEffect(() => {
    if (isEdit && id) {
      const fetchPosition = async () => {
        try {
          const { data } = await positionsApi.getPosition(id);
          const transformedData = transformPosition(data);

          // Заполняем форму
          Object.keys(transformedData).forEach((key) => {
            if (key !== "id" && key in validationSchema.fields) {
              setValue(
                key as keyof CreatePositionDto,
                transformedData[key as keyof typeof transformedData]
              );
            }
          });
        } catch (err) {
          console.error("Error fetching position:", err);
          setError("Failed to load position");
          setTimeout(() => navigate("/positions"), 2000);
        }
      };
      fetchPosition();
    }
  }, [id, isEdit, setValue, navigate]);

  // Управление требованиями (requirements)
  const [newRequirement, setNewRequirement] = React.useState("");
  const requirements = watch("requirements");

  const handleAddRequirement = () => {
    const trimmedRequirement = newRequirement.trim();
    if (trimmedRequirement && !requirements.includes(trimmedRequirement)) {
      setValue("requirements", [...requirements, trimmedRequirement]);
      setNewRequirement("");
    }
  };

  const handleRemoveRequirement = (index: number) => {
    setValue(
      "requirements",
      requirements.filter((_, i) => i !== index)
    );
  };

  // Отправка формы
  const onSubmit: SubmitHandler<CreatePositionDto> = async (data) => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (isEdit) {
        await positionsApi.updatePosition(id!, data);
      } else {
        await positionsApi.createPosition(data);
      }
      navigate("/positions");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Error details:", err.response?.data);
      setError(
        Array.isArray(err.response?.data?.message)
          ? err.response?.data?.message[0]
          : err.response?.data?.message || "Failed to save position"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          {/* Заголовок */}
          <Typography variant="h5">
            {isEdit ? "Edit Position" : "Create Position"}
          </Typography>

          {/* Основная информация */}
          <Grid container spacing={3}>
            {/* Название должности */}
            <Grid item xs={12}>
              <Controller
                name="title"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Position Title"
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>

            {/* Отдел */}
            <Grid item xs={12} md={4}>
              <Controller
                name="department"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    select
                    label="Department"
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  >
                    {DEPARTMENTS.map((dept) => (
                      <MenuItem key={dept} value={dept}>
                        {dept}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            {/* Тип занятости */}
            <Grid item xs={12} md={4}>
              <Controller
                name="type"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    select
                    label="Employment Type"
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  >
                    {EMPLOYMENT_TYPES.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            {/* Локация */}
            <Grid item xs={12} md={4}>
              <Controller
                name="location"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    select
                    label="Location"
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  >
                    {LOCATIONS.map((location) => (
                      <MenuItem key={location} value={location}>
                        {location}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            {/* Требуемый опыт */}
            <Grid item xs={12}>
              <Controller
                name="experience"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    select
                    label="Required Experience"
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  >
                    {EXPERIENCE_LEVELS.map((level) => (
                      <MenuItem key={level} value={level}>
                        {level}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            {/* Описание */}
            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Description"
                    fullWidth
                    multiline
                    rows={4}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>

            {/* Требования */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Requirements
              </Typography>
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Add Requirement"
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddRequirement();
                    }
                  }}
                  sx={{ mb: 1 }}
                />
                <Button
                  variant="outlined"
                  onClick={handleAddRequirement}
                  disabled={!newRequirement.trim()}
                >
                  Add Requirement
                </Button>
              </Box>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {requirements.map((req, index) => (
                  <Chip
                    key={index}
                    label={req}
                    onDelete={() => handleRemoveRequirement(index)}
                  />
                ))}
              </Box>
              {errors.requirements && (
                <FormHelperText error>
                  {errors.requirements.message}
                </FormHelperText>
              )}
            </Grid>
          </Grid>

          {/* Действия формы */}
          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button
              variant="outlined"
              onClick={() => navigate("/positions")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : isEdit
                ? "Update Position"
                : "Create Position"}
            </Button>
          </Box>
        </Stack>
      </Box>

      {/* Сообщение об ошибке */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default PositionForm;
