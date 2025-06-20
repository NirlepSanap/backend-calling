from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import Dict, Any, Optional
from app.libs.database import db_manager
import time
import psutil
import asyncio
from datetime import datetime

# Health check models
class DatabaseHealth(BaseModel):
    status: str
    latency_ms: Optional[float] = None
    connection_pool_size: Optional[int] = None
    error: Optional[str] = None

class SystemMetrics(BaseModel):
    cpu_percent: float
    memory_percent: float
    memory_used_mb: float
    memory_total_mb: float
    uptime_seconds: float

class HealthResponse(BaseModel):
    status: str
    timestamp: str
    version: str
    service: str
    database: DatabaseHealth
    system_metrics: SystemMetrics
    checks: Dict[str, str]

# API versioning routers
router_v1 = APIRouter(prefix="/api/v1")
router_v1_1 = APIRouter(prefix="/api/v1.1")
router_v2 = APIRouter(prefix="/api/v2")

# Store application start time for uptime calculation
app_start_time = time.time()

class HealthService:
    """Service for health monitoring and system diagnostics."""
    
    def __init__(self):
        self.db = db_manager
        self.start_time = app_start_time
    
    async def check_database_health(self) -> DatabaseHealth:
        """Check database connectivity and performance."""
        try:
            start_time = time.time()
            
            async with self.db.get_connection() as conn:
                # Test basic connectivity
                await conn.fetchval("SELECT 1")
                
                # Check if contacts table exists and is accessible
                table_check = await conn.fetchval(
                    "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'contacts'"
                )
                
                if table_check == 0:
                    return DatabaseHealth(
                        status="warning",
                        error="contacts table not found"
                    )
                
                # Test query performance with a simple count
                contact_count = await conn.fetchval("SELECT COUNT(*) FROM contacts")
                
                latency = (time.time() - start_time) * 1000  # Convert to milliseconds
                
                return DatabaseHealth(
                    status="healthy",
                    latency_ms=round(latency, 2),
                    connection_pool_size=self.db.pool.get_size() if hasattr(self.db, 'pool') else None
                )
                
        except Exception as e:
            return DatabaseHealth(
                status="unhealthy",
                error=str(e)
            )
    
    def get_system_metrics(self) -> SystemMetrics:
        """Get current system performance metrics."""
        try:
            memory_info = psutil.virtual_memory()
            cpu_percent = psutil.cpu_percent(interval=0.1)
            uptime = time.time() - self.start_time
            
            return SystemMetrics(
                cpu_percent=round(cpu_percent, 2),
                memory_percent=round(memory_info.percent, 2),
                memory_used_mb=round(memory_info.used / 1024 / 1024, 2),
                memory_total_mb=round(memory_info.total / 1024 / 1024, 2),
                uptime_seconds=round(uptime, 2)
            )
        except Exception as e:
            # Return minimal metrics if psutil fails
            return SystemMetrics(
                cpu_percent=0.0,
                memory_percent=0.0,
                memory_used_mb=0.0,
                memory_total_mb=0.0,
                uptime_seconds=time.time() - self.start_time
            )
    
    async def get_comprehensive_health(self, version: str = "1.0") -> HealthResponse:
        """Get comprehensive health status of the application."""
        db_health = await self.check_database_health()
        system_metrics = self.get_system_metrics()
        
        # Determine overall status
        overall_status = "healthy"
        if db_health.status == "unhealthy":
            overall_status = "unhealthy"
        elif db_health.status == "warning":
            overall_status = "degraded"
        
        # Additional checks
        checks = {
            "database_connectivity": db_health.status,
            "memory_usage": "healthy" if system_metrics.memory_percent < 80 else "warning",
            "cpu_usage": "healthy" if system_metrics.cpu_percent < 80 else "warning"
        }
        
        return HealthResponse(
            status=overall_status,
            timestamp=datetime.utcnow().isoformat() + "Z",
            version=version,
            service="DevForge Studio API",
            database=db_health,
            system_metrics=system_metrics,
            checks=checks
        )

# Initialize health service
health_service = HealthService()

# V1.0 Health Endpoints
@router_v1.get("/health", response_model=HealthResponse)
async def health_check_v1() -> HealthResponse:
    """
    Comprehensive health check endpoint for v1.0.
    
    Returns detailed system health including:
    - Database connectivity and performance
    - System resource usage (CPU, memory)
    - Service uptime
    - Component-specific health checks
    
    Returns:
        HealthResponse: Detailed health status
    """
    try:
        return await health_service.get_comprehensive_health(version="1.0")
    except Exception as e:
        print(f"Health check failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Health check service temporarily unavailable"
        ) from e

@router_v1.get("/health/live")
async def liveness_probe_v1():
    """
    Simple liveness probe for Kubernetes/Docker health checks.
    Returns 200 if the service is running.
    """
    return {"status": "live", "timestamp": datetime.utcnow().isoformat() + "Z"}

@router_v1.get("/health/ready")
async def readiness_probe_v1():
    """
    Readiness probe for Kubernetes/Docker deployment.
    Returns 200 if the service is ready to accept traffic.
    """
    try:
        db_health = await health_service.check_database_health()
        if db_health.status == "unhealthy":
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Service not ready - database unhealthy"
            )
        
        return {
            "status": "ready", 
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "database": db_health.status
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Service not ready"
        ) from e

# V1.1 Health Endpoints (Enhanced)
@router_v1_1.get("/health", response_model=HealthResponse)
async def health_check_v1_1() -> HealthResponse:
    """
    Enhanced health check endpoint for v1.1 with additional metrics.
    """
    return await health_service.get_comprehensive_health(version="1.1")

# V2.0 Health Endpoints (Future)
@router_v2.get("/health", response_model=HealthResponse)
async def health_check_v2() -> HealthResponse:
    """
    Next generation health check endpoint for v2.0.
    """
    return await health_service.get_comprehensive_health(version="2.0")

# Main router that includes all versioned routers
router = APIRouter()

# Include all version routers
router.include_router(router_v1, tags=["health-v1"])
router.include_router(router_v1_1, tags=["health-v1.1"])
router.include_router(router_v2, tags=["health-v2"])

@router.get("/health")
async def legacy_health_check():
    """
    Legacy health check endpoint (unversioned).
    Redirects to v1.0 for compatibility.
    """
    health_response = await health_service.get_comprehensive_health(version="1.0")
    return {
        "status": health_response.status,
        "service": health_response.service,
        "timestamp": health_response.timestamp
    }