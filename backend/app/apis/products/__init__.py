from fastapi import APIRouter, HTTPException, status, Query
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum
import math

# Product models
class ProductCategory(str, Enum):
    ELECTRONICS = "electronics"
    CLOTHING = "clothing"
    BOOKS = "books"
    HOME = "home"
    SPORTS = "sports"
    AUTOMOTIVE = "automotive"

class ProductStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    OUT_OF_STOCK = "out_of_stock"
    DISCONTINUED = "discontinued"

class Product(BaseModel):
    id: int
    name: str
    description: str
    price: float = Field(..., ge=0, description="Price in USD")
    category: ProductCategory
    status: ProductStatus = ProductStatus.ACTIVE
    stock_quantity: int = Field(..., ge=0)
    sku: str
    created_at: str
    updated_at: str

class ProductSummary(BaseModel):
    """Simplified product model for list views"""
    id: int
    name: str
    price: float
    category: ProductCategory
    status: ProductStatus
    stock_quantity: int

class ProductListResponse(BaseModel):
    products: List[ProductSummary]
    total_count: int
    page: int
    page_size: int
    total_pages: int
    has_next: bool
    has_previous: bool

class ProductDetailResponse(BaseModel):
    product: Product
    related_products: List[ProductSummary] = []

# Enhanced models for v1.1
class ProductV11(Product):
    """Enhanced product model for v1.1 with additional fields"""
    tags: List[str] = []
    rating: Optional[float] = Field(None, ge=0, le=5)
    review_count: int = 0
    image_urls: List[str] = []

class ProductSearchResponse(BaseModel):
    """Search response model for v1.1"""
    products: List[ProductV11]
    search_query: str
    total_count: int
    page: int
    page_size: int
    filters_applied: Dict[str, Any] = {}

# API versioning routers
router_v1 = APIRouter(prefix="/api/v1")
router_v1_1 = APIRouter(prefix="/api/v1.1")
router_v2 = APIRouter(prefix="/api/v2")

class ProductService:
    """Service for managing products across different API versions."""
    
    def __init__(self):
        self.mock_products = self._generate_mock_products()
    
    def _generate_mock_products(self) -> List[Product]:
        """Generate mock product data for demonstration."""
        base_time = datetime.utcnow().isoformat() + "Z"
        
        products = [
            Product(
                id=1,
                name="Wireless Bluetooth Headphones",
                description="High-quality wireless headphones with noise cancellation and 30-hour battery life.",
                price=199.99,
                category=ProductCategory.ELECTRONICS,
                status=ProductStatus.ACTIVE,
                stock_quantity=150,
                sku="WBH-001",
                created_at=base_time,
                updated_at=base_time
            ),
            Product(
                id=2,
                name="Organic Cotton T-Shirt",
                description="Comfortable and sustainable organic cotton t-shirt available in multiple colors.",
                price=29.99,
                category=ProductCategory.CLOTHING,
                status=ProductStatus.ACTIVE,
                stock_quantity=500,
                sku="OCT-002",
                created_at=base_time,
                updated_at=base_time
            ),
            Product(
                id=3,
                name="Programming Fundamentals Book",
                description="Comprehensive guide to programming fundamentals for beginners and intermediate developers.",
                price=49.99,
                category=ProductCategory.BOOKS,
                status=ProductStatus.ACTIVE,
                stock_quantity=75,
                sku="PFB-003",
                created_at=base_time,
                updated_at=base_time
            ),
            Product(
                id=4,
                name="Smart Home Hub",
                description="Central control hub for all your smart home devices with voice control support.",
                price=129.99,
                category=ProductCategory.HOME,
                status=ProductStatus.ACTIVE,
                stock_quantity=200,
                sku="SHH-004",
                created_at=base_time,
                updated_at=base_time
            ),
            Product(
                id=5,
                name="Running Shoes",
                description="Lightweight running shoes with advanced cushioning technology.",
                price=119.99,
                category=ProductCategory.SPORTS,
                status=ProductStatus.ACTIVE,
                stock_quantity=300,
                sku="RS-005",
                created_at=base_time,
                updated_at=base_time
            ),
            Product(
                id=6,
                name="Car Phone Mount",
                description="Universal smartphone mount for car dashboard with 360-degree rotation.",
                price=24.99,
                category=ProductCategory.AUTOMOTIVE,
                status=ProductStatus.ACTIVE,
                stock_quantity=450,
                sku="CPM-006",
                created_at=base_time,
                updated_at=base_time
            ),
            Product(
                id=7,
                name="Vintage Leather Jacket",
                description="Classic vintage-style leather jacket made from genuine leather.",
                price=299.99,
                category=ProductCategory.CLOTHING,
                status=ProductStatus.OUT_OF_STOCK,
                stock_quantity=0,
                sku="VLJ-007",
                created_at=base_time,
                updated_at=base_time
            ),
            Product(
                id=8,
                name="4K Webcam",
                description="Professional 4K webcam with auto-focus and built-in microphone.",
                price=89.99,
                category=ProductCategory.ELECTRONICS,
                status=ProductStatus.ACTIVE,
                stock_quantity=125,
                sku="4KW-008",
                created_at=base_time,
                updated_at=base_time
            ),
            Product(
                id=9,
                name="Cookbook: Healthy Meals",
                description="Collection of 200+ healthy and delicious recipes for everyday cooking.",
                price=34.99,
                category=ProductCategory.BOOKS,
                status=ProductStatus.ACTIVE,
                stock_quantity=90,
                sku="CHM-009",
                created_at=base_time,
                updated_at=base_time
            ),
            Product(
                id=10,
                name="Yoga Mat",
                description="Non-slip yoga mat with extra cushioning for comfortable practice.",
                price=39.99,
                category=ProductCategory.SPORTS,
                status=ProductStatus.ACTIVE,
                stock_quantity=275,
                sku="YM-010",
                created_at=base_time,
                updated_at=base_time
            )
        ]
        
        return products
    
    def get_products(
        self, 
        page: int = 1, 
        page_size: int = 10,
        category: Optional[ProductCategory] = None,
        status: Optional[ProductStatus] = None
    ) -> ProductListResponse:
        """Get paginated list of products with optional filtering."""
        # Apply filters
        filtered_products = self.mock_products
        
        if category:
            filtered_products = [p for p in filtered_products if p.category == category]
        
        if status:
            filtered_products = [p for p in filtered_products if p.status == status]
        
        # Calculate pagination
        total_count = len(filtered_products)
        total_pages = math.ceil(total_count / page_size)
        start_idx = (page - 1) * page_size
        end_idx = start_idx + page_size
        
        paginated_products = filtered_products[start_idx:end_idx]
        
        # Convert to summary format
        product_summaries = [
            ProductSummary(
                id=p.id,
                name=p.name,
                price=p.price,
                category=p.category,
                status=p.status,
                stock_quantity=p.stock_quantity
            ) for p in paginated_products
        ]
        
        return ProductListResponse(
            products=product_summaries,
            total_count=total_count,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
            has_next=page < total_pages,
            has_previous=page > 1
        )
    
    def get_product_by_id(self, product_id: int) -> Optional[Product]:
        """Get a single product by ID."""
        return next((p for p in self.mock_products if p.id == product_id), None)
    
    def search_products(
        self, 
        query: str, 
        page: int = 1, 
        page_size: int = 10,
        category: Optional[ProductCategory] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None
    ) -> ProductSearchResponse:
        """Search products by name or description (v1.1+ feature)."""
        # Filter by search query
        filtered_products = [
            p for p in self.mock_products 
            if query.lower() in p.name.lower() or query.lower() in p.description.lower()
        ]
        
        # Apply additional filters
        if category:
            filtered_products = [p for p in filtered_products if p.category == category]
        
        if min_price is not None:
            filtered_products = [p for p in filtered_products if p.price >= min_price]
        
        if max_price is not None:
            filtered_products = [p for p in filtered_products if p.price <= max_price]
        
        # Calculate pagination
        total_count = len(filtered_products)
        start_idx = (page - 1) * page_size
        end_idx = start_idx + page_size
        paginated_products = filtered_products[start_idx:end_idx]
        
        # Convert to enhanced v1.1 format
        enhanced_products = [
            ProductV11(
                **p.dict(),
                tags=[p.category.value, "popular"] if p.stock_quantity > 200 else [p.category.value],
                rating=4.5 if p.price > 100 else 4.0,
                review_count=int(p.stock_quantity / 10),
                image_urls=[f"https://example.com/images/{p.sku.lower()}.jpg"]
            ) for p in paginated_products
        ]
        
        return ProductSearchResponse(
            products=enhanced_products,
            search_query=query,
            total_count=total_count,
            page=page,
            page_size=page_size,
            filters_applied={
                "category": category.value if category else None,
                "min_price": min_price,
                "max_price": max_price
            }
        )

# Initialize product service
product_service = ProductService()

# V1.0 Product Endpoints
@router_v1.get("/products", response_model=ProductListResponse)
async def list_products_v1(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Items per page"),
    category: Optional[ProductCategory] = Query(None, description="Filter by category"),
    status: Optional[ProductStatus] = Query(None, description="Filter by status")
) -> ProductListResponse:
    """
    Get a paginated list of products (v1.0).
    
    Features:
    - Pagination support
    - Category filtering
    - Status filtering
    - Basic product information
    
    Args:
        page: Page number (starts from 1)
        page_size: Number of items per page (1-100)
        category: Optional category filter
        status: Optional status filter
    
    Returns:
        ProductListResponse: Paginated list of products
    """
    try:
        return product_service.get_products(
            page=page,
            page_size=page_size,
            category=category,
            status=status
        )
    except Exception as e:
        print(f"Error in list_products_v1: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve products"
        ) from e

@router_v1.get("/products/{product_id}", response_model=ProductDetailResponse)
async def get_product_v1(product_id: int) -> ProductDetailResponse:
    """
    Get detailed information about a specific product (v1.0).
    
    Args:
        product_id: Unique product identifier
    
    Returns:
        ProductDetailResponse: Detailed product information
    
    Raises:
        HTTPException: 404 if product not found
    """
    product = product_service.get_product_by_id(product_id)
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found"
        )
    
    # Get related products (same category, different products)
    related = [
        ProductSummary(
            id=p.id,
            name=p.name,
            price=p.price,
            category=p.category,
            status=p.status,
            stock_quantity=p.stock_quantity
        )
        for p in product_service.mock_products
        if p.category == product.category and p.id != product.id
    ][:3]  # Limit to 3 related products
    
    return ProductDetailResponse(
        product=product,
        related_products=related
    )

# V1.1 Product Endpoints (Enhanced with search)
@router_v1_1.get("/products/search", response_model=ProductSearchResponse)
async def search_products_v1_1(
    q: str = Query(..., min_length=1, description="Search query"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Items per page"),
    category: Optional[ProductCategory] = Query(None, description="Filter by category"),
    min_price: Optional[float] = Query(None, ge=0, description="Minimum price filter"),
    max_price: Optional[float] = Query(None, ge=0, description="Maximum price filter")
) -> ProductSearchResponse:
    """
    Search products by name or description with advanced filtering (v1.1).
    
    New features in v1.1:
    - Full-text search capability
    - Price range filtering
    - Enhanced product information with tags and ratings
    - Image URLs included
    
    Args:
        q: Search query string
        page: Page number (starts from 1)
        page_size: Number of items per page (1-100)
        category: Optional category filter
        min_price: Optional minimum price filter
        max_price: Optional maximum price filter
    
    Returns:
        ProductSearchResponse: Search results with enhanced product data
    """
    try:
        if min_price is not None and max_price is not None and min_price > max_price:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="min_price cannot be greater than max_price"
            )
        
        return product_service.search_products(
            query=q,
            page=page,
            page_size=page_size,
            category=category,
            min_price=min_price,
            max_price=max_price
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in search_products_v1_1: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Search service temporarily unavailable"
        ) from e

@router_v1_1.get("/products", response_model=ProductListResponse)
async def list_products_v1_1(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Items per page"),
    category: Optional[ProductCategory] = Query(None, description="Filter by category"),
    status: Optional[ProductStatus] = Query(None, description="Filter by status")
) -> ProductListResponse:
    """
    Get a paginated list of products (v1.1) - same as v1.0 for compatibility.
    """
    return await list_products_v1(page, page_size, category, status)

# Main router that includes all versioned routers
router = APIRouter()

# Include all version routers
router.include_router(router_v1, tags=["products-v1"])
router.include_router(router_v1_1, tags=["products-v1.1"])
router.include_router(router_v2, tags=["products-v2"])