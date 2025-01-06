// // src/types/article.ts
// // Тип для OpenGraph
// export interface OpenGraph {
//   title: string;
//   description: string;
//   image: string;
//   url: string;
//   type: string;
// }

// // Тип для структурированных данных schema.org
// export interface ArticleStructuredData {
//   "@context": "https://schema.org";
//   "@type": "Article";
//   headline: string;
//   description: string;
//   author: string;
//   datePublished: string;
// }

// // Тип для StructuredData
// export interface StructuredData {
//   type: string;
//   data: ArticleStructuredData;
// }

// // Тип для SEO метаданных
// export interface SeoMetadata {
//   metaTitle: string;
//   metaDescription: string;
//   metaKeywords: string[];
//   indexing: boolean;
//   canonicalUrl?: string;
//   openGraph: OpenGraph;
//   structuredData: StructuredData;
// }

// // Тип для статьи (DTO)
// export interface CreateArticleDto {
//   title: string;
//   slug: string;
//   content: string;
//   description: string;
//   tags: string[];
//   author: string;
//   published?: boolean;
//   imageUrl?: string;
//   categories: string[];
//   seo: SeoMetadata;
// }

// // Тип для ответа от API (включает дополнительные поля)
// export interface Article extends CreateArticleDto {
//   id: string;
//   createdAt: string;
//   updatedAt: string;
// }
