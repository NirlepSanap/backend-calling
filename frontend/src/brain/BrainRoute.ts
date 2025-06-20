import {
  CheckHealthData,
  ContactIdentifyRequest,
  GetProductV1Data,
  HealthCheckData,
  HealthCheckV11Data,
  HealthCheckV1Data,
  HealthCheckV2Data,
  IdentifyContactData,
  LegacyHealthCheckData,
  ListProductsV11Data,
  ListProductsV1Data,
  LivenessProbeV1Data,
  ProductCategory,
  ProductStatus,
  ReadinessProbeV1Data,
  SearchProductsV11Data,
} from "./data-contracts";

export namespace Brain {
  /**
   * @description Check health of application. Returns 200 when OK, 500 when not.
   * @name check_health
   * @summary Check Health
   * @request GET:/_healthz
   */
  export namespace check_health {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CheckHealthData;
  }

  /**
   * @description Identify and reconcile contact information. This endpoint handles contact identity reconciliation by: - Creating new contacts when no matches exist - Linking contacts with matching email or phone numbers - Maintaining a primary-secondary relationship hierarchy - Ensuring data consistency across all operations Args: request: ContactIdentifyRequest containing email and/or phone number Returns: ContactIdentifyResponse with consolidated contact information Raises: HTTPException: For validation errors or internal server errors
   * @tags dbtn/module:identify, dbtn/hasAuth
   * @name identify_contact
   * @summary Identify Contact
   * @request POST:/routes/api/v1/identify
   */
  export namespace identify_contact {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ContactIdentifyRequest;
    export type RequestHeaders = {};
    export type ResponseBody = IdentifyContactData;
  }

  /**
   * @description Health check endpoint for the identify service. Returns: dict: Service status and database connectivity
   * @tags dbtn/module:identify, dbtn/hasAuth
   * @name health_check
   * @summary Health Check
   * @request GET:/routes/api/v1/identify/health
   */
  export namespace health_check {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = HealthCheckData;
  }

  /**
   * @description Comprehensive health check endpoint for v1.0. Returns detailed system health including: - Database connectivity and performance - System resource usage (CPU, memory) - Service uptime - Component-specific health checks Returns: HealthResponse: Detailed health status
   * @tags health-v1, dbtn/module:health, dbtn/hasAuth
   * @name health_check_v1
   * @summary Health Check V1
   * @request GET:/routes/api/v1/health
   */
  export namespace health_check_v1 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = HealthCheckV1Data;
  }

  /**
   * @description Simple liveness probe for Kubernetes/Docker health checks. Returns 200 if the service is running.
   * @tags health-v1, dbtn/module:health, dbtn/hasAuth
   * @name liveness_probe_v1
   * @summary Liveness Probe V1
   * @request GET:/routes/api/v1/health/live
   */
  export namespace liveness_probe_v1 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = LivenessProbeV1Data;
  }

  /**
   * @description Readiness probe for Kubernetes/Docker deployment. Returns 200 if the service is ready to accept traffic.
   * @tags health-v1, dbtn/module:health, dbtn/hasAuth
   * @name readiness_probe_v1
   * @summary Readiness Probe V1
   * @request GET:/routes/api/v1/health/ready
   */
  export namespace readiness_probe_v1 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ReadinessProbeV1Data;
  }

  /**
   * @description Enhanced health check endpoint for v1.1 with additional metrics.
   * @tags health-v1.1, dbtn/module:health, dbtn/hasAuth
   * @name health_check_v1_1
   * @summary Health Check V1 1
   * @request GET:/routes/api/v1.1/health
   */
  export namespace health_check_v1_1 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = HealthCheckV11Data;
  }

  /**
   * @description Next generation health check endpoint for v2.0.
   * @tags health-v2, dbtn/module:health, dbtn/hasAuth
   * @name health_check_v2
   * @summary Health Check V2
   * @request GET:/routes/api/v2/health
   */
  export namespace health_check_v2 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = HealthCheckV2Data;
  }

  /**
   * @description Legacy health check endpoint (unversioned). Redirects to v1.0 for compatibility.
   * @tags dbtn/module:health, dbtn/hasAuth
   * @name legacy_health_check
   * @summary Legacy Health Check
   * @request GET:/routes/health
   */
  export namespace legacy_health_check {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = LegacyHealthCheckData;
  }

  /**
   * @description Get a paginated list of products (v1.0). Features: - Pagination support - Category filtering - Status filtering - Basic product information Args: page: Page number (starts from 1) page_size: Number of items per page (1-100) category: Optional category filter status: Optional status filter Returns: ProductListResponse: Paginated list of products
   * @tags products-v1, dbtn/module:products, dbtn/hasAuth
   * @name list_products_v1
   * @summary List Products V1
   * @request GET:/routes/api/v1/products
   */
  export namespace list_products_v1 {
    export type RequestParams = {};
    export type RequestQuery = {
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
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ListProductsV1Data;
  }

  /**
   * @description Get detailed information about a specific product (v1.0). Args: product_id: Unique product identifier Returns: ProductDetailResponse: Detailed product information Raises: HTTPException: 404 if product not found
   * @tags products-v1, dbtn/module:products, dbtn/hasAuth
   * @name get_product_v1
   * @summary Get Product V1
   * @request GET:/routes/api/v1/products/{product_id}
   */
  export namespace get_product_v1 {
    export type RequestParams = {
      /** Product Id */
      productId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetProductV1Data;
  }

  /**
   * @description Search products by name or description with advanced filtering (v1.1). New features in v1.1: - Full-text search capability - Price range filtering - Enhanced product information with tags and ratings - Image URLs included Args: q: Search query string page: Page number (starts from 1) page_size: Number of items per page (1-100) category: Optional category filter min_price: Optional minimum price filter max_price: Optional maximum price filter Returns: ProductSearchResponse: Search results with enhanced product data
   * @tags products-v1.1, dbtn/module:products, dbtn/hasAuth
   * @name search_products_v1_1
   * @summary Search Products V1 1
   * @request GET:/routes/api/v1.1/products/search
   */
  export namespace search_products_v1_1 {
    export type RequestParams = {};
    export type RequestQuery = {
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
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = SearchProductsV11Data;
  }

  /**
   * @description Get a paginated list of products (v1.1) - same as v1.0 for compatibility.
   * @tags products-v1.1, dbtn/module:products, dbtn/hasAuth
   * @name list_products_v1_1
   * @summary List Products V1 1
   * @request GET:/routes/api/v1.1/products
   */
  export namespace list_products_v1_1 {
    export type RequestParams = {};
    export type RequestQuery = {
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
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ListProductsV11Data;
  }
}
