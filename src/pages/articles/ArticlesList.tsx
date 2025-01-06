// src/pages/articles/ArticlesList.tsx
import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Paper,
  Button,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
  Alert,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridLoadingOverlay,
  GridRenderCellParams,
  GridToolbar,
} from "@mui/x-data-grid";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  VisibilityOff as HideIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  ServerArticle,
  articlesApi,
  ArticlesResponse,
} from "../../services/api";

// Кастомный компонент загрузки
const CustomLoadingOverlay = () => (
  <GridLoadingOverlay>
    <LinearProgress />
  </GridLoadingOverlay>
);

// Тип для строки таблицы
type GridArticle = ServerArticle & { id: string };

export const ArticlesList = () => {
  const [articles, setArticles] = useState<GridArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [totalRows, setTotalRows] = useState(0);
  const navigate = useNavigate();

  // Определение размера экрана
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // true для экранов < 600px

  // Функция для генерации цвета на основе строки

  //   const stringToColor = (str: string) => {
  //     let hash = 0;
  //     for (let i = 0; i < str.length; i++) {
  //       hash = str.charCodeAt(i) + ((hash << 5) - hash);
  //     }
  //     const hue = Math.abs(hash % 360);
  //     return `hsl(${hue}, 65%, 45%)`;
  //   };

  // Функция для загрузки статей
  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await articlesApi.getArticles({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
      });

      const data: ArticlesResponse = response.data;

      const transformedArticles: GridArticle[] = data.articles.map(
        (article) => ({
          ...article,
          id: article._id,
        })
      );

      setArticles(transformedArticles);
      setTotalRows(data.total);
    } catch (error) {
      console.error("Error fetching articles:", error);
      setError("Failed to load articles. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationModel.page, paginationModel.pageSize]);

  // Функция для переключения статуса публикации
  const handlePublishToggle = async (slug: string, currentStatus: boolean) => {
    try {
      await articlesApi.updateArticle(slug, { published: !currentStatus });
      await fetchArticles();
    } catch (error) {
      setError("Failed to update article status.");
      console.error("Error toggling publish status:", error);
    }
  };

  // Функция для удаления статьи
  const handleDelete = async (slug: string) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      try {
        await articlesApi.deleteArticle(slug);
        await fetchArticles();
      } catch (error) {
        setError("Failed to delete article.");
        console.error("Error deleting article:", error);
      }
    }
  };

  // Динамическое определение колонок на основе размера экрана
  const columns: GridColDef[] = useMemo(() => {
    // Базовые колонки, которые всегда отображаются
    const baseColumns: GridColDef[] = [
      {
        field: "title",
        headerName: "Title",
        flex: isMobile ? 2 : 2.5, // Уменьшаем flex на мобильных
        minWidth: 200,
        renderCell: (params: GridRenderCellParams<GridArticle>) => (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 500,
                  color: "primary.main",
                  cursor: "pointer",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                  fontSize: { xs: "0.875rem", sm: "1rem" }, // Уменьшаем размер текста на мобильных
                }}
                onClick={() => navigate(`/articles/edit/${params.row.slug}`)}
              >
                {params.row.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  mt: 0.5,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  fontSize: { xs: "0.75rem", sm: "0.875rem" }, // Уменьшаем размер текста на мобильных
                }}
              >
                {params.row.description}
              </Typography>
            </Box>
          </Box>
        ),
      },
    ];

    // Добавляем колонки "Теги", "Автор" и "Status" только если не на мобильном устройстве
    if (!isMobile) {
      baseColumns.push(
        {
          field: "tags",
          headerName: "Tags",
          flex: 1.5,
          minWidth: 200,
          renderCell: (params: GridRenderCellParams<GridArticle>) => (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 0.5,
                alignItems: "center",
                justifyContent: "flex-start",
                height: "100%",
              }}
            >
              {params.row.tags.slice(0, 3).map((tag: string) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  variant="outlined"
                  sx={{
                    borderRadius: 1,
                    bgcolor: "action.hover",
                    borderColor: "divider",
                    height: "24px",
                    "& .MuiChip-label": {
                      px: 0.5,
                      fontSize: "0.75rem", // Уменьшаем размер текста
                    },
                  }}
                />
              ))}
              {params.row.tags.length > 3 && (
                <Chip
                  label={`+${params.row.tags.length - 3}`}
                  size="small"
                  sx={{
                    borderRadius: 1,
                    bgcolor: "action.selected",
                    color: "text.primary",
                    fontWeight: 500,
                    height: "24px",
                    "& .MuiChip-label": {
                      px: 0.5,
                      fontSize: "0.75rem", // Уменьшаем размер текста
                    },
                  }}
                />
              )}
            </Box>
          ),
        },
        {
          field: "author",
          headerName: "Author",
          width: 150,
          renderCell: (params: GridRenderCellParams<GridArticle>) => (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                height: "100%",
              }}
            >
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 500,
                  fontSize: "0.75rem", // Уменьшаем размер текста
                }}
              >
                {params.row.author.charAt(0).toUpperCase()}
              </Box>
              <Typography
                variant="body2"
                sx={{
                  fontSize: { xs: "0.75rem", sm: "0.875rem" }, // Уменьшаем размер текста на мобильных
                }}
              >
                {params.row.author}
              </Typography>
            </Box>
          ),
        },
        {
          field: "published",
          headerName: "Status",
          width: 120,
          renderCell: (params: GridRenderCellParams<GridArticle>) => (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Chip
                label={params.row.published ? "Published" : "Draft"}
                color={params.row.published ? "success" : "default"}
                size="small"
                sx={{
                  borderRadius: 1,
                  fontWeight: 500,
                  minWidth: 85,
                  height: "24px",
                  "& .MuiChip-label": {
                    px: 1,
                    fontSize: { xs: "0.75rem", sm: "0.875rem" }, // Уменьшаем размер текста на мобильных
                  },
                }}
              />
            </Box>
          ),
        }
      );
    }

    // Добавляем колонку "Actions" всегда, но изменяем её ширину и размеры элементов на мобильных
    baseColumns.push({
      field: "actions",
      headerName: "Actions",
      width: isMobile ? 100 : 150, // Уменьшаем ширину на мобильных
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<GridArticle>) => (
        <Box
          sx={{
            display: "flex",
            gap: isMobile ? 0.3 : 0.5, // Уменьшаем gap на мобильных
            alignItems: "center",
            height: "100%",
          }}
        >
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={() => navigate(`/articles/edit/${params.row.slug}`)}
              color="primary"
              sx={{
                "&:hover": {
                  bgcolor: "primary.lighter",
                },
                padding: isMobile ? 0.3 : 0.5, // Уменьшаем padding на мобильных
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={params.row.published ? "Unpublish" : "Publish"}>
            <IconButton
              size="small"
              onClick={() =>
                handlePublishToggle(params.row.slug, params.row.published)
              }
              color="info"
              sx={{
                "&:hover": {
                  bgcolor: "info.lighter",
                },
                padding: isMobile ? 0.3 : 0.5, // Уменьшаем padding на мобильных
              }}
            >
              {params.row.published ? (
                <HideIcon fontSize="small" />
              ) : (
                <ViewIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={() => handleDelete(params.row.slug)}
              color="error"
              sx={{
                "&:hover": {
                  bgcolor: "error.lighter",
                },
                padding: isMobile ? 0.3 : 0.5, // Уменьшаем padding на мобильных
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    });

    return baseColumns;
  }, [isMobile, navigate]);

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100%",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Заголовок и кнопка создания статьи */}
        <Box
          sx={{
            mb: 2,
            p: 3,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            borderBottom: 1,
            borderColor: "divider",
            gap: { xs: 2, sm: 0 },
            bgcolor: (theme) =>
              theme.palette.mode === "dark" ? "grey.900" : "grey.50",
          }}
        >
          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontWeight: 600,
              color: "text.primary",
              fontSize: { xs: "1.25rem", sm: "1.5rem" }, // Уменьшаем размер текста на мобильных
            }}
          >
            Articles
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/articles/create")}
            sx={{
              width: { xs: "100%", sm: "auto" },
              px: { xs: 2, sm: 3 },
              py: { xs: 1, sm: 1 },
              fontSize: { xs: "0.875rem", sm: "1rem" }, // Уменьшаем размер текста на мобильных
            }}
          >
            Create Article
          </Button>
        </Box>

        {/* Отображение ошибок */}
        {error && (
          <Alert
            severity="error"
            sx={{
              m: 2,
              borderRadius: 1,
            }}
          >
            {error}
          </Alert>
        )}

        {/* Таблица статей */}
        <Box
          sx={{
            flexGrow: 1,
            width: "100%",
            height: "100%",
          }}
        >
          <DataGrid
            rows={articles}
            columns={columns}
            loading={loading}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10, 25, 50]}
            rowCount={totalRows}
            paginationMode="server"
            getRowId={(row) => row.id}
            slots={{
              toolbar: GridToolbar,
              loadingOverlay: CustomLoadingOverlay,
            }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: {
                  debounceMs: 500,
                },
              },
            }}
            disableRowSelectionOnClick
            rowHeight={isMobile ? 60 : 80} // Уменьшаем высоту строк на мобильных
            sx={{
              height: "100%",
              width: "100%",
              border: "none",
              "& .MuiDataGrid-main": {
                width: "100%",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid",
                borderColor: "divider",
                py: isMobile ? 1 : 2, // Уменьшаем вертикальные отступы на мобильных
                "&:focus": {
                  outline: "none",
                },
                "&:focus-within": {
                  outline: "none",
                },
              },
              "& .MuiDataGrid-row": {
                alignItems: "center",
                "&:hover": {
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark" ? "action.hover" : "grey.50",
                },
                "&.Mui-selected": {
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "action.selected"
                      : "primary.lighter",
                  "&:hover": {
                    bgcolor: (theme) =>
                      theme.palette.mode === "dark"
                        ? "action.selected"
                        : "primary.lighter",
                  },
                },
              },
              "& .MuiDataGrid-columnHeaders": {
                bgcolor: (theme) =>
                  theme.palette.mode === "dark" ? "grey.900" : "grey.50",
                borderBottom: "2px solid",
                borderColor: "divider",
                "& .MuiDataGrid-columnHeader": {
                  "&:focus": {
                    outline: "none",
                  },
                  "&:focus-within": {
                    outline: "none",
                  },
                  fontSize: { xs: "0.75rem", sm: "0.875rem" }, // Уменьшаем размер шрифта заголовков на мобильных
                },
              },
              "& .MuiDataGrid-toolbarContainer": {
                p: 2,
                gap: 2,
                borderBottom: "1px solid",
                borderColor: "divider",
                bgcolor: (theme) =>
                  theme.palette.mode === "dark" ? "grey.900" : "grey.50",
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "2px solid",
                borderColor: "divider",
                bgcolor: (theme) =>
                  theme.palette.mode === "dark" ? "grey.900" : "grey.50",
              },
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};
