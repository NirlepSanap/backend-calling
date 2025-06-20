/**
 * ContactIdentifyRequest
 * Request model for the /identify endpoint.
 */
export interface ContactIdentifyRequest {
  /** Email */
  email?: string | null;
  /** Phone Number */
  phone_number?: string | null;
}

/**
 * ContactIdentifyResponse
 * Response model for the /identify endpoint.
 * @example {"emails":["abc@x.com","xyz@x.com"],"phone_numbers":["9999999999"],"primary_contact_id":1,"secondary_contact_ids":[2,3]}
 */
export interface ContactIdentifyResponse {
  /**
   * Primary Contact Id
   * ID of the primary contact
   */
  primary_contact_id: number;
  /**
   * Emails
   * List of all emails linked to this contact
   */
  emails?: string[];
  /**
   * Phone Numbers
   * List of all phone numbers linked to this contact
   */
  phone_numbers?: string[];
  /**
   * Secondary Contact Ids
   * List of secondary contact IDs
   */
  secondary_contact_ids?: number[];
}

/** DatabaseHealth */
export interface DatabaseHealth {
  /** Status */
  status: string;
  /** Latency Ms */
  latency_ms?: number | null;
  /** Connection Pool Size */
  connection_pool_size?: number | null;
  /** Error */
  error?: string | null;
}

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[];
}

/** Product */
export interface Product {
  /** Id */
  id: number;
  /** Name */
  name: string;
  /** Description */
  description: string;
  /**
   * Price
   * Price in USD
   * @min 0
   */
  price: number;
  category: ProductCategory;
  /** @default "active" */
  status?: ProductStatus;
  /**
   * Stock Quantity
   * @min 0
   */
  stock_quantity: number;
  /** Sku */
  sku: string;
  /** Created At */
  created_at: string;
  /** Updated At */
  updated_at: string;
}

/** ProductCategory */
export enum ProductCategory {
  Electronics = "electronics",
  Clothing = "clothing",
  Books = "books",
  Home = "home",
  Sports = "sports",
  Automotive = "automotive",
}

/** ProductDetailResponse */
export interface ProductDetailResponse {
  product: Product;
  /**
   * Related Products
   * @default []
   */
  related_products?: ProductSummary[];
}

/** ProductListResponse */
export interface ProductListResponse {
  /** Products */
  products: ProductSummary[];
  /** Total Count */
  total_count: number;
  /** Page */
  page: number;
  /** Page Size */
  page_size: number;
  /** Total Pages */
  total_pages: number;
  /** Has Next */
  has_next: boolean;
  /** Has Previous */
  has_previous: boolean;
}

/**
 * ProductSearchResponse
 * Search response model for v1.1
 */
export interface ProductSearchResponse {
  /** Products */
  products: ProductV11[];
  /** Search Query */
  search_query: string;
  /** Total Count */
  total_count: number;
  /** Page */
  page: number;
  /** Page Size */
  page_size: number;
  /**
   * Filters Applied
   * @default {}
   */
  filters_applied?: Record<string, any>;
}

/** ProductStatus */
export enum ProductStatus {
  Active = "active",
  Inactive = "inactive",
  OutOfStock = "out_of_stock",
  Discontinued = "discontinued",
}

/**
 * ProductSummary
 * Simplified product model for list views
 */
export interface ProductSummary {
  /** Id */
  id: number;
  /** Name */
  name: string;
  /** Price */
  price: number;
  category: ProductCategory;
  status: ProductStatus;
  /** Stock Quantity */
  stock_quantity: number;
}

/**
 * ProductV11
 * Enhanced product model for v1.1 with additional fields
 */
export interface ProductV11 {
  /** Id */
  id: number;
  /** Name */
  name: string;
  /** Description */
  description: string;
  /**
   * Price
   * Price in USD
   * @min 0
   */
  price: number;
  category: ProductCategory;
  /** @default "active" */
  status?: ProductStatus;
  /**
   * Stock Quantity
   * @min 0
   */
  stock_quantity: number;
  /** Sku */
  sku: string;
  /** Created At */
  created_at: string;
  /** Updated At */
  updated_at: string;
  /**
   * Tags
   * @default []
   */
  tags?: string[];
  /** Rating */
  rating?: number | null;
  /**
   * Review Count
   * @default 0
   */
  review_count?: number;
  /**
   * Image Urls
   * @default []
   */
  image_urls?: string[];
}

/** SystemMetrics */
export interface SystemMetrics {
  /** Cpu Percent */
  cpu_percent: number;
  /** Memory Percent */
  memory_percent: number;
  /** Memory Used Mb */
  memory_used_mb: number;
  /** Memory Total Mb */
  memory_total_mb: number;
  /** Uptime Seconds */
  uptime_seconds: number;
}

/** ValidationError */
export interface ValidationError {
  /** Location */
  loc: (string | number)[];
  /** Message */
  msg: string;
  /** Error Type */
  type: string;
}

/** HealthResponse */
export interface AppApisHealthHealthResponse {
  /** Status */
  status: string;
  /** Timestamp */
  timestamp: string;
  /** Version */
  version: string;
  /** Service */
  service: string;
  database: DatabaseHealth;
  system_metrics: SystemMetrics;
  /** Checks */
  checks: Record<string, string>;
}

/** HealthResponse */
export interface DatabuttonAppMainHealthResponse {
  /** Status */
  status: string;
}

export type CheckHealthData = DatabuttonAppMainHealthResponse;

export type IdentifyContactData = ContactIdentifyResponse;

export type IdentifyContactError = HTTPValidationError;

export type HealthCheckData = any;

export type HealthCheckV1Data = AppApisHealthHealthResponse;

export type LivenessProbeV1Data = any;

export type ReadinessProbeV1Data = any;

export type HealthCheckV11Data = AppApisHealthHealthResponse;

export type HealthCheckV2Data = AppApisHealthHealthResponse;

export type LegacyHealthCheckData = any;

export interface ListProductsV1Params {
  /**
   * Page
   * Page number
   * @min 1
   * @default 1
   */
  page?: number;
  /**
   * Page Size
   * Items per page
   * @min 1
   * @max 100
   * @default 10
   */
  page_size?: number;
  /**
   * Category
   * Filter by category
   */
  category?: ProductCategory | null;
  /**
   * Status
   * Filter by status
   */
  status?: ProductStatus | null;
}

export type ListProductsV1Data = ProductListResponse;

export type ListProductsV1Error = HTTPValidationError;

export interface GetProductV1Params {
  /** Product Id */
  productId: number;
}

export type GetProductV1Data = ProductDetailResponse;

export type GetProductV1Error = HTTPValidationError;

export interface SearchProductsV11Params {
  /**
   * Q
   * Search query
   * @minLength 1
   */
  q: string;
  /**
   * Page
   * Page number
   * @min 1
   * @default 1
   */
  page?: number;
  /**
   * Page Size
   * Items per page
   * @min 1
   * @max 100
   * @default 10
   */
  page_size?: number;
  /**
   * Category
   * Filter by category
   */
  category?: ProductCategory | null;
  /**
   * Min Price
   * Minimum price filter
   */
  min_price?: number | null;
  /**
   * Max Price
   * Maximum price filter
   */
  max_price?: number | null;
}

export type SearchProductsV11Data = ProductSearchResponse;

export type SearchProductsV11Error = HTTPValidationError;

export interface ListProductsV11Params {
  /**
   * Page
   * Page number
   * @min 1
   * @default 1
   */
  page?: number;
  /**
   * Page Size
   * Items per page
   * @min 1
   * @max 100
   * @default 10
   */
  page_size?: number;
  /**
   * Category
   * Filter by category
   */
  category?: ProductCategory | null;
  /**
   * Status
   * Filter by status
   */
  status?: ProductStatus | null;
}

export type ListProductsV11Data = ProductListResponse;

export type ListProductsV11Error = HTTPValidationError;
