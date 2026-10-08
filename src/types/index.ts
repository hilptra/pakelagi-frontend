export type ConditionType = 'like_new' | 'good' | 'fair';
export type ProductStatus = 'available' | 'sold' | 'hidden';

export interface Category {
  name: string;
  slug: string;
  measurement_fields?: string[];
}

export interface ProductImage {
  url: string;
  thumbnail_url: string | null;
  is_primary: boolean;
  sort_order: number;
}

export interface ProductListItem {
  slug: string;
  name: string;
  price: number;
  size_label: string;
  condition: ConditionType;
  status: ProductStatus;
  sold_at: string | null;
  category: {
    name: string;
    slug: string;
  };
  primary_image: ProductImage | null;
}

export interface ProductDetail {
  slug: string;
  name: string;
  description: string | null;
  price: number;
  brand: string | null;
  size_label: string;
  condition: ConditionType;
  condition_notes: string | null;
  measurements: Record<string, string | number> | null;
  status: ProductStatus;
  sold_at: string | null;
  created_at: string;
  category: Category;
  images: ProductImage[];
}

export interface ProductFilterParams {
  category?: string;
  size?: string;
  min_price?: number;
  max_price?: number;
  q?: string;
  sort?: 'newest' | 'price_asc' | 'price_desc';
  slugs?: string;
  per_page?: number;
  page?: number;
}

export interface ApiPaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface ApiMetaLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

export interface ApiMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  links: ApiMetaLink[];
  path: string;
  per_page: number;
  to: number | null;
  total: number;
}

export interface PaginatedApiResponse<T> {
  data: T[];
  links: ApiPaginationLinks;
  meta: ApiMeta;
}

export interface SingleApiResponse<T> {
  data: T;
}
