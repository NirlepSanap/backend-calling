import {
  CheckHealthData,
  ContactIdentifyRequest,
  GetProductV1Data,
  GetProductV1Error,
  GetProductV1Params,
  HealthCheckData,
  HealthCheckV11Data,
  HealthCheckV1Data,
  HealthCheckV2Data,
  IdentifyContactData,
  IdentifyContactError,
  LegacyHealthCheckData,
  ListProductsV11Data,
  ListProductsV11Error,
  ListProductsV11Params,
  ListProductsV1Data,
  ListProductsV1Error,
  ListProductsV1Params,
  LivenessProbeV1Data,
  ReadinessProbeV1Data,
  SearchProductsV11Data,
  SearchProductsV11Error,
  SearchProductsV11Params,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Brain<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description Check health of application. Returns 200 when OK, 500 when not.
   *
   * @name check_health
   * @summary Check Health
   * @request GET:/_healthz
   */
  check_health = (params: RequestParams = {}) =>
    this.request<CheckHealthData, any>({
      path: `/_healthz`,
      method: "GET",
      ...params,
    });

  /**
   * @description Identify and reconcile contact information. This endpoint handles contact identity reconciliation by: - Creating new contacts when no matches exist - Linking contacts with matching email or phone numbers - Maintaining a primary-secondary relationship hierarchy - Ensuring data consistency across all operations Args: request: ContactIdentifyRequest containing email and/or phone number Returns: ContactIdentifyResponse with consolidated contact information Raises: HTTPException: For validation errors or internal server errors
   *
   * @tags dbtn/module:identify, dbtn/hasAuth
   * @name identify_contact
   * @summary Identify Contact
   * @request POST:/routes/api/v1/identify
   */
  identify_contact = (data: ContactIdentifyRequest, params: RequestParams = {}) =>
    this.request<IdentifyContactData, IdentifyContactError>({
      path: `/routes/api/v1/identify`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Health check endpoint for the identify service. Returns: dict: Service status and database connectivity
   *
   * @tags dbtn/module:identify, dbtn/hasAuth
   * @name health_check
   * @summary Health Check
   * @request GET:/routes/api/v1/identify/health
   */
  health_check = (params: RequestParams = {}) =>
    this.request<HealthCheckData, any>({
      path: `/routes/api/v1/identify/health`,
      method: "GET",
      ...params,
    });

  /**
   * @description Comprehensive health check endpoint for v1.0. Returns detailed system health including: - Database connectivity and performance - System resource usage (CPU, memory) - Service uptime - Component-specific health checks Returns: HealthResponse: Detailed health status
   *
   * @tags health-v1, dbtn/module:health, dbtn/hasAuth
   * @name health_check_v1
   * @summary Health Check V1
   * @request GET:/routes/api/v1/health
   */
  health_check_v1 = (params: RequestParams = {}) =>
    this.request<HealthCheckV1Data, any>({
      path: `/routes/api/v1/health`,
      method: "GET",
      ...params,
    });

  /**
   * @description Simple liveness probe for Kubernetes/Docker health checks. Returns 200 if the service is running.
   *
   * @tags health-v1, dbtn/module:health, dbtn/hasAuth
   * @name liveness_probe_v1
   * @summary Liveness Probe V1
   * @request GET:/routes/api/v1/health/live
   */
  liveness_probe_v1 = (params: RequestParams = {}) =>
    this.request<LivenessProbeV1Data, any>({
      path: `/routes/api/v1/health/live`,
      method: "GET",
      ...params,
    });

  /**
   * @description Readiness probe for Kubernetes/Docker deployment. Returns 200 if the service is ready to accept traffic.
   *
   * @tags health-v1, dbtn/module:health, dbtn/hasAuth
   * @name readiness_probe_v1
   * @summary Readiness Probe V1
   * @request GET:/routes/api/v1/health/ready
   */
  readiness_probe_v1 = (params: RequestParams = {}) =>
    this.request<ReadinessProbeV1Data, any>({
      path: `/routes/api/v1/health/ready`,
      method: "GET",
      ...params,
    });

  /**
   * @description Enhanced health check endpoint for v1.1 with additional metrics.
   *
   * @tags health-v1.1, dbtn/module:health, dbtn/hasAuth
   * @name health_check_v1_1
   * @summary Health Check V1 1
   * @request GET:/routes/api/v1.1/health
   */
  health_check_v1_1 = (params: RequestParams = {}) =>
    this.request<HealthCheckV11Data, any>({
      path: `/routes/api/v1.1/health`,
      method: "GET",
      ...params,
    });

  /**
   * @description Next generation health check endpoint for v2.0.
   *
   * @tags health-v2, dbtn/module:health, dbtn/hasAuth
   * @name health_check_v2
   * @summary Health Check V2
   * @request GET:/routes/api/v2/health
   */
  health_check_v2 = (params: RequestParams = {}) =>
    this.request<HealthCheckV2Data, any>({
      path: `/routes/api/v2/health`,
      method: "GET",
      ...params,
    });

  /**
   * @description Legacy health check endpoint (unversioned). Redirects to v1.0 for compatibility.
   *
   * @tags dbtn/module:health, dbtn/hasAuth
   * @name legacy_health_check
   * @summary Legacy Health Check
   * @request GET:/routes/health
   */
  legacy_health_check = (params: RequestParams = {}) =>
    this.request<LegacyHealthCheckData, any>({
      path: `/routes/health`,
      method: "GET",
      ...params,
    });

  /**
   * @description Get a paginated list of products (v1.0). Features: - Pagination support - Category filtering - Status filtering - Basic product information Args: page: Page number (starts from 1) page_size: Number of items per page (1-100) category: Optional category filter status: Optional status filter Returns: ProductListResponse: Paginated list of products
   *
   * @tags products-v1, dbtn/module:products, dbtn/hasAuth
   * @name list_products_v1
   * @summary List Products V1
   * @request GET:/routes/api/v1/products
   */
  list_products_v1 = (query: ListProductsV1Params, params: RequestParams = {}) =>
    this.request<ListProductsV1Data, ListProductsV1Error>({
      path: `/routes/api/v1/products`,
      method: "GET",
      query: query,
      ...params,
    });

  /**
   * @description Get detailed information about a specific product (v1.0). Args: product_id: Unique product identifier Returns: ProductDetailResponse: Detailed product information Raises: HTTPException: 404 if product not found
   *
   * @tags products-v1, dbtn/module:products, dbtn/hasAuth
   * @name get_product_v1
   * @summary Get Product V1
   * @request GET:/routes/api/v1/products/{product_id}
   */
  get_product_v1 = ({ productId, ...query }: GetProductV1Params, params: RequestParams = {}) =>
    this.request<GetProductV1Data, GetProductV1Error>({
      path: `/routes/api/v1/products/${productId}`,
      method: "GET",
      ...params,
    });

  /**
   * @description Search products by name or description with advanced filtering (v1.1). New features in v1.1: - Full-text search capability - Price range filtering - Enhanced product information with tags and ratings - Image URLs included Args: q: Search query string page: Page number (starts from 1) page_size: Number of items per page (1-100) category: Optional category filter min_price: Optional minimum price filter max_price: Optional maximum price filter Returns: ProductSearchResponse: Search results with enhanced product data
   *
   * @tags products-v1.1, dbtn/module:products, dbtn/hasAuth
   * @name search_products_v1_1
   * @summary Search Products V1 1
   * @request GET:/routes/api/v1.1/products/search
   */
  search_products_v1_1 = (query: SearchProductsV11Params, params: RequestParams = {}) =>
    this.request<SearchProductsV11Data, SearchProductsV11Error>({
      path: `/routes/api/v1.1/products/search`,
      method: "GET",
      query: query,
      ...params,
    });

  /**
   * @description Get a paginated list of products (v1.1) - same as v1.0 for compatibility.
   *
   * @tags products-v1.1, dbtn/module:products, dbtn/hasAuth
   * @name list_products_v1_1
   * @summary List Products V1 1
   * @request GET:/routes/api/v1.1/products
   */
  list_products_v1_1 = (query: ListProductsV11Params, params: RequestParams = {}) =>
    this.request<ListProductsV11Data, ListProductsV11Error>({
      path: `/routes/api/v1.1/products`,
      method: "GET",
      query: query,
      ...params,
    });
}
