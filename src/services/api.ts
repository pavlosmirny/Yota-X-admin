// src/services/api.ts
import axios, { AxiosResponse } from "axios";

// Types & Interfaces
export interface SeoMetadata {
  _id?: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
}

export interface ServerArticle {
  _id: string;
  title: string;
  slug: string;
  content: string;
  description: string;
  tags: string[];
  author: string;
  published: boolean;
  imageUrl?: string;
  seo: SeoMetadata & { _id: string };
  relatedTags: Record<string, number>;
  tagViews: Record<string, number>;
  __v: number;
}

export interface ArticlesResponse {
  articles: ServerArticle[];
  total: number;
  page: number;
  totalPages: number;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  description: string;
  tags: string[];
  author: string;
  published: boolean;
  imageUrl?: string;
  seo: SeoMetadata;
  relatedTags: Record<string, number>;
  tagViews: Record<string, number>;
}

export interface CreateArticleDto {
  title: string;
  slug: string;
  content: string;
  description: string;
  tags: string[];
  author: string;
  published?: boolean;
  imageUrl?: string;
  seo: SeoMetadata;
}

export type UpdateArticleDto = Partial<CreateArticleDto>;

export interface TagCount {
  tag: string;
  count: number;
}

export interface TagViews {
  tag: string;
  views: number;
}

// API Configuration
const API_URL = import.meta.env.VITE_API_URL;
console.log(API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Articles API Service
export const articlesApi = {
  // Get articles list with pagination and filters
  getArticles: (params: {
    page?: number;
    limit?: number;
    published?: boolean;
    tag?: string;
    author?: string;
    searchTerm?: string;
  }): Promise<AxiosResponse<ArticlesResponse>> => {
    return api.get("/articles", { params });
  },

  // Get single article by slug
  getArticle: (slug: string): Promise<AxiosResponse<ServerArticle>> => {
    return api.get(`/articles/${slug}`);
  },

  // Create new article
  createArticle: (
    data: CreateArticleDto
  ): Promise<AxiosResponse<ServerArticle>> => {
    return api.post("/articles", data);
  },

  // Update article
  updateArticle: (
    slug: string,
    data: UpdateArticleDto
  ): Promise<AxiosResponse<ServerArticle>> => {
    return api.patch(`/articles/${slug}`, data);
  },

  // Delete article
  deleteArticle: (slug: string): Promise<AxiosResponse<void>> => {
    return api.delete(`/articles/${slug}`);
  },

  // Get related articles
  getRelatedArticles: (
    slug: string,
    limit?: number
  ): Promise<AxiosResponse<ServerArticle[]>> => {
    return api.get(`/articles/${slug}/related`, { params: { limit } });
  },

  // Get tags with counts
  getTagsWithCount: (): Promise<AxiosResponse<TagCount[]>> => {
    return api.get("/articles/tags");
  },

  // Get popular tags
  getPopularTags: (limit?: number): Promise<AxiosResponse<TagViews[]>> => {
    return api.get("/articles/tags/popular", { params: { limit } });
  },
};

export interface Position {
  id: string;
  title: string;
  department: string;
  type: string;
  location: string;
  experience: string;
  description: string;
  requirements: string[];
}

export interface ServerPosition {
  _id: string;
  title: string;
  department: string;
  type: string;
  location: string;
  experience: string;
  description: string;
  requirements: string[];
  __v: number;
}

export interface CreatePositionDto {
  title: string;
  department: string;
  type: string;
  location: string;
  experience: string;
  description: string;
  requirements: string[];
}

export type UpdatePositionDto = Partial<CreatePositionDto>;

// Добавляем API для positions
export const positionsApi = {
  // Получить все вакансии с опциональной фильтрацией по департаменту
  getPositions: (params?: {
    department?: string;
  }): Promise<AxiosResponse<ServerPosition[]>> => {
    return api.get("/positions", { params });
  },

  // Получить одну вакансию по id
  getPosition: (id: string): Promise<AxiosResponse<ServerPosition>> => {
    return api.get(`/positions/${id}`);
  },

  // Создать новую вакансию
  createPosition: (
    data: CreatePositionDto
  ): Promise<AxiosResponse<ServerPosition>> => {
    return api.post("/positions", data);
  },

  // Обновить вакансию
  updatePosition: (
    id: string,
    data: UpdatePositionDto
  ): Promise<AxiosResponse<ServerPosition>> => {
    return api.patch(`/positions/${id}`, data);
  },

  // Удалить вакансию
  deletePosition: (id: string): Promise<AxiosResponse<void>> => {
    return api.delete(`/positions/${id}`);
  },

  // Поиск вакансий
  searchPositions: (
    query: string
  ): Promise<AxiosResponse<ServerPosition[]>> => {
    return api.get("/positions/search", { params: { q: query } });
  },
};

// Helper функции для преобразования данных
export const transformPosition = (position: ServerPosition): Position => ({
  id: position._id,
  title: position.title,
  department: position.department,
  type: position.type,
  location: position.location,
  experience: position.experience,
  description: position.description,
  requirements: position.requirements,
});

export const transformPositions = (positions: ServerPosition[]): Position[] =>
  positions.map(transformPosition);

// Interceptors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized access");
    }
    if (error.response?.status === 400) {
      const message = error.response.data.message || "Validation error";
      console.error("Validation error:", message);
    }
    return Promise.reject(error);
  }
);

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
