// src/components/articles/ArticleForm.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import DOMPurify from "dompurify";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Divider,
  Alert,
  Autocomplete,
  Chip,
  Stack,
  FormControlLabel,
  Switch,
  CircularProgress,
  InputAdornment,
  alpha,
  MenuItem,
  styled,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useForm, Controller } from "react-hook-form";
import { PREDEFINED_CATEGORIES } from "../../constants/categories";
import { articlesApi, CreateArticleDto } from "../../services/api";
import { PREDEFINED_TAGS } from "../../constants/tags";

// Стилизованный компонент для ReactQuill
const StyledQuillWrapper = styled(Box)(({ theme }) => ({
  "& .ql-container": {
    borderBottomLeftRadius: theme.shape.borderRadius,
    borderBottomRightRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
  },
  "& .ql-toolbar": {
    borderTopLeftRadius: theme.shape.borderRadius,
    borderTopRightRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.default,
  },
  "& .ql-editor": {
    minHeight: "400px",
    fontSize: "1rem",
    lineHeight: 1.75,
    padding: theme.spacing(2),
    "&.ql-blank::before": {
      color: theme.palette.text.secondary,
      fontStyle: "normal",
    },
  },
}));

// Генерация цвета на основе строки
const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 65%, 45%)`;
};

const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["link", "image", "video"],
    ["blockquote", "code-block"],
    ["clean"],
  ],
};

const QUILL_FORMATS = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "list",
  "bullet",
  "align",
  "link",
  "image",
  "video",
  "blockquote",
  "code-block",
];

type ArticleFormData = CreateArticleDto & {
  category: (typeof PREDEFINED_CATEGORIES)[number];
  seo: {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string[];
  };
};

const defaultValues: ArticleFormData = {
  title: "",
  slug: "",
  content: "",
  description: "",
  tags: [],
  category: PREDEFINED_CATEGORIES[0],
  author: "",
  published: false,
  imageUrl: "",
  seo: {
    metaTitle: "",
    metaDescription: "",
    metaKeywords: [],
  },
};

export const ArticleForm = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const [uploadingImage, setUploadingImage] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ArticleFormData>({
    defaultValues,
  });

  // Автогенерация slug из заголовка
  const title = watch("title");
  useEffect(() => {
    if (title && !slug) {
      setValue(
        "slug",
        title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "")
      );
    }
  }, [title, setValue, slug]);

  // Загрузка статьи для редактирования
  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        const response = await articlesApi.getArticle(slug);
        const article = response.data;

        reset({
          title: article.title,
          slug: article.slug,
          content: article.content,
          description: article.description,
          tags: article.tags,
          category: article.category,
          author: article.author,
          published: article.published,
          imageUrl: article.imageUrl || "",
          seo: {
            metaTitle: article.seo.metaTitle,
            metaDescription: article.seo.metaDescription,
            metaKeywords: article.seo.metaKeywords,
          },
        });
      } catch (error) {
        setError("Failed to load article");
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug, reset]);

  const onSubmit = async (data: ArticleFormData) => {
    try {
      setError(null);
      const sanitizedContent = DOMPurify.sanitize(data.content);

      if (slug) {
        await articlesApi.updateArticle(slug, {
          ...data,
          content: sanitizedContent,
        });
      } else {
        await articlesApi.createArticle({
          ...data,
          content: sanitizedContent,
        });
      }
      navigate("/articles");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to save article");
      console.error("Error saving article:", error);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 4, width: "100%", borderRadius: 2 }}>
      <Typography variant="h5" component="h1" sx={{ fontWeight: 600, mb: 3 }}>
        {slug ? "Edit Article" : "Create New Article"}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 1 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4}>
          {/* Basic Information */}
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>
              Basic Information
            </Typography>
            <Stack spacing={3}>
              <Controller
                name="title"
                control={control}
                rules={{ required: "Title is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Title"
                    error={!!errors.title}
                    helperText={errors.title?.message}
                    fullWidth
                  />
                )}
              />

              <Controller
                name="category"
                control={control}
                rules={{ required: "Category is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Category"
                    error={!!errors.category}
                    helperText={errors.category?.message}
                    fullWidth
                  >
                    {PREDEFINED_CATEGORIES.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />

              <Controller
                name="slug"
                control={control}
                rules={{ required: "Slug is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Slug"
                    error={!!errors.slug}
                    helperText={errors.slug?.message}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          /articles/
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              <Controller
                name="description"
                control={control}
                rules={{ required: "Description is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Description"
                    multiline
                    rows={3}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    fullWidth
                  />
                )}
              />

              <Controller
                name="content"
                control={control}
                rules={{ required: "Content is required" }}
                render={({ field }) => (
                  <StyledQuillWrapper>
                    <ReactQuill
                      {...field}
                      theme="snow"
                      modules={QUILL_MODULES}
                      formats={QUILL_FORMATS}
                      placeholder="Write your article content here..."
                    />
                    {errors.content && (
                      <Typography
                        color="error"
                        variant="caption"
                        sx={{ mt: 1 }}
                      >
                        {errors.content.message}
                      </Typography>
                    )}
                  </StyledQuillWrapper>
                )}
              />
            </Stack>
          </Box>

          <Divider />

          {/* Meta Information */}
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>
              Meta Information
            </Typography>
            <Stack spacing={3}>
              <Controller
                name="author"
                control={control}
                rules={{ required: "Author is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Author"
                    error={!!errors.author}
                    helperText={errors.author?.message}
                    fullWidth
                  />
                )}
              />

              <Controller
                name="imageUrl"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Image URL"
                    error={!!errors.imageUrl}
                    helperText={errors.imageUrl?.message}
                    fullWidth
                  />
                )}
              />

              <Controller
                name="tags"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    multiple
                    options={PREDEFINED_TAGS}
                    value={value}
                    onChange={(_, newValue) => onChange(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Tags"
                        placeholder="Select tags"
                      />
                    )}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => {
                        const color = stringToColor(option);
                        return (
                          <Chip
                            label={option}
                            {...getTagProps({ index })}
                            key={option}
                            size="small"
                            sx={{
                              bgcolor: alpha(color, 0.1),
                              color: color,
                              borderColor: alpha(color, 0.3),
                              "&:hover": {
                                bgcolor: alpha(color, 0.2),
                              },
                            }}
                          />
                        );
                      })
                    }
                  />
                )}
              />
            </Stack>
          </Box>

          <Divider />

          {/* SEO Section */}
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>
              SEO
            </Typography>
            <Stack spacing={3}>
              <Controller
                name="seo.metaTitle"
                control={control}
                rules={{ required: "Meta title is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Meta Title"
                    error={!!errors.seo?.metaTitle}
                    helperText={errors.seo?.metaTitle?.message}
                    fullWidth
                  />
                )}
              />

              <Controller
                name="seo.metaDescription"
                control={control}
                rules={{ required: "Meta description is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Meta Description"
                    multiline
                    rows={3}
                    error={!!errors.seo?.metaDescription}
                    helperText={errors.seo?.metaDescription?.message}
                    fullWidth
                  />
                )}
              />

              <Controller
                name="seo.metaKeywords"
                control={control}
                rules={{ required: "Meta keywords are required" }}
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    multiple
                    options={PREDEFINED_TAGS}
                    value={value}
                    onChange={(_, newValue) => onChange(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Meta Keywords"
                        placeholder="Add keywords"
                        error={!!errors.seo?.metaKeywords}
                        helperText={errors.seo?.metaKeywords?.message}
                      />
                    )}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => {
                        const color = stringToColor(option);
                        return (
                          <Chip
                            label={option}
                            {...getTagProps({ index })}
                            key={option}
                            size="small"
                            sx={{
                              bgcolor: alpha(color, 0.1),
                              color: color,
                              borderColor: alpha(color, 0.3),
                              "&:hover": {
                                bgcolor: alpha(color, 0.2),
                              },
                            }}
                          />
                        );
                      })
                    }
                  />
                )}
              />
            </Stack>
          </Box>

          <Divider />

          {/* Publishing Options */}
          <Box>
            <Controller
              name="published"
              control={control}
              render={({ field: { value, onChange } }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={value}
                      onChange={(e) => onChange(e.target.checked)}
                      color="primary"
                    />
                  }
                  label={
                    <Typography sx={{ fontWeight: 500 }}>
                      Publish article
                    </Typography>
                  }
                />
              )}
            />
          </Box>

          {/* Form Actions */}
          <Box
            sx={{ display: "flex", gap: 2, justifyContent: "flex-end", pt: 2 }}
          >
            <Button
              variant="outlined"
              onClick={() => navigate("/articles")}
              sx={{ px: 4, py: 1 }}
            >
              Cancel
            </Button>
            <LoadingButton
              variant="contained"
              type="submit"
              loading={isSubmitting}
              sx={{ px: 4, py: 1 }}
            >
              {slug ? "Update" : "Create"} Article
            </LoadingButton>
          </Box>
        </Stack>
      </form>
    </Paper>
  );
};
