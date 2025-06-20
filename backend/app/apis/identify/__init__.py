from fastapi import APIRouter, HTTPException, status
from typing import Optional, List, Set
from app.libs.models import (
    ContactIdentifyRequest, 
    ContactIdentifyResponse, 
    Contact, 
    ContactCreate, 
    ContactUpdate,
    LinkPrecedence
)
from app.libs.database import db_manager
import asyncio

router = APIRouter(prefix="/api/v1")


class ContactReconciliationService:
    """Service class for handling contact identity reconciliation logic."""
    
    def __init__(self):
        self.db = db_manager
    
    async def reconcile_contact_identity(self, request: ContactIdentifyRequest) -> ContactIdentifyResponse:
        """
        Core reconciliation logic for contact identity management.
        
        Process:
        1. Find existing contacts by email or phone
        2. If no matches found, create new primary contact
        3. If matches found, determine primary contact and link others as secondary
        4. Handle edge cases and maintain data consistency
        """
        try:
            # Find all existing contacts that match either email or phone
            existing_contacts = await self.db.find_contacts_by_email_or_phone(
                request.email, request.phone_number
            )
            
            if not existing_contacts:
                # Case 1: No existing contacts - create new primary contact
                return await self._create_new_primary_contact(request)
            
            # Case 2: Existing contacts found - need to reconcile
            return await self._reconcile_existing_contacts(request, existing_contacts)
            
        except Exception as e:
            print(f"Error in contact reconciliation: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal server error during contact reconciliation"
            ) from e
    
    async def _create_new_primary_contact(self, request: ContactIdentifyRequest) -> ContactIdentifyResponse:
        """Create a new primary contact when no matches are found."""
        new_contact = await self.db.create_contact(
            ContactCreate(
                email=request.email,
                phone_number=request.phone_number
            )
        )
        
        return ContactIdentifyResponse(
            primary_contact_id=new_contact.id,
            emails=[request.email] if request.email else [],
            phone_numbers=[request.phone_number] if request.phone_number else [],
            secondary_contact_ids=[]
        )
    
    async def _reconcile_existing_contacts(self, request: ContactIdentifyRequest, 
                                         existing_contacts: List[Contact]) -> ContactIdentifyResponse:
        """Reconcile identity when existing contacts are found."""
        # Separate primary and secondary contacts
        secondary_contacts = [c for c in existing_contacts if c.link_precedence == LinkPrecedence.SECONDARY]
        
        # Get all related contacts through their primary links
        # Use contact IDs to avoid hashability issues, then get full contacts
        all_related_contact_ids = set(c.id for c in existing_contacts)
        
        # For each secondary contact, get its primary and all related contacts
        for secondary in secondary_contacts:
            if secondary.linked_id:
                hierarchy = await self.db.get_contact_hierarchy(secondary.linked_id)
                if hierarchy.get('primary_contact'):
                    all_related_contact_ids.add(hierarchy['primary_contact'].id)
                    all_related_contact_ids.update(c.id for c in hierarchy.get('secondary_contacts', []))
        
        # Get full contact objects for all related IDs
        all_related_contacts = []
        for contact_id in all_related_contact_ids:
            contact = await self.db.get_contact_by_id(contact_id)
            if contact:
                all_related_contacts.append(contact)
        
        # Sort by creation date to determine precedence
        all_related_contacts = sorted(all_related_contacts, key=lambda x: x.created_at)
        
        # Determine the primary contact (oldest primary, or oldest overall if no primaries)
        primary_contact = None
        for contact in all_related_contacts:
            if contact.link_precedence == LinkPrecedence.PRIMARY:
                primary_contact = contact
                break
        
        if not primary_contact:
            # If no primary found, make the oldest contact primary
            primary_contact = all_related_contacts[0]
        
        # Check if we need to create a new contact for the new information
        needs_new_contact = True
        for contact in all_related_contacts:
            if (contact.email == request.email and 
                contact.phone_number == request.phone_number):
                needs_new_contact = False
                break
        
        if needs_new_contact:
            # Create new secondary contact linked to primary
            new_contact = await self.db.create_contact(
                ContactCreate(
                    email=request.email,
                    phone_number=request.phone_number
                )
            )
            
            # Convert the new contact to secondary and link to primary
            await self.db.update_contact(
                new_contact.id,
                ContactUpdate(
                    linked_id=primary_contact.id,
                    link_precedence=LinkPrecedence.SECONDARY
                )
            )
            
            all_related_contacts.append(new_contact)
        
        # Ensure all non-primary contacts are properly linked as secondary
        for contact in all_related_contacts:
            if contact.id != primary_contact.id and contact.link_precedence != LinkPrecedence.SECONDARY:
                await self.db.update_contact(
                    contact.id,
                    ContactUpdate(
                        linked_id=primary_contact.id,
                        link_precedence=LinkPrecedence.SECONDARY
                    )
                )
        
        # If there are multiple primary contacts, convert older ones to secondary
        primary_contacts_in_group = [c for c in all_related_contacts 
                                   if c.link_precedence == LinkPrecedence.PRIMARY]
        
        if len(primary_contacts_in_group) > 1:
            # Keep the oldest as primary, convert others to secondary
            primary_contacts_sorted = sorted(primary_contacts_in_group, key=lambda x: x.created_at)
            actual_primary = primary_contacts_sorted[0]
            
            for contact in primary_contacts_sorted[1:]:
                await self.db.update_contact(
                    contact.id,
                    ContactUpdate(
                        linked_id=actual_primary.id,
                        link_precedence=LinkPrecedence.SECONDARY
                    )
                )
            
            primary_contact = actual_primary
        
        # Get the final hierarchy to build response
        hierarchy = await self.db.get_contact_hierarchy(primary_contact.id)
        
        return ContactIdentifyResponse(
            primary_contact_id=hierarchy['primary_contact'].id,
            emails=hierarchy['all_emails'],
            phone_numbers=hierarchy['all_phone_numbers'],
            secondary_contact_ids=hierarchy['secondary_contact_ids']
        )


# Initialize the service
reconciliation_service = ContactReconciliationService()


@router.post("/identify", response_model=ContactIdentifyResponse)
async def identify_contact(request: ContactIdentifyRequest) -> ContactIdentifyResponse:
    """
    Identify and reconcile contact information.
    
    This endpoint handles contact identity reconciliation by:
    - Creating new contacts when no matches exist
    - Linking contacts with matching email or phone numbers
    - Maintaining a primary-secondary relationship hierarchy
    - Ensuring data consistency across all operations
    
    Args:
        request: ContactIdentifyRequest containing email and/or phone number
    
    Returns:
        ContactIdentifyResponse with consolidated contact information
    
    Raises:
        HTTPException: For validation errors or internal server errors
    """
    # Validate that at least one contact method is provided
    if not request.email and not request.phone_number:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one contact method (email or phone number) must be provided"
        )
    
    # Log the incoming request for debugging
    print(f"Processing identity reconciliation for email: {request.email}, phone: {request.phone_number}")
    
    try:
        result = await reconciliation_service.reconcile_contact_identity(request)
        print(f"Successfully processed identity reconciliation. Primary ID: {result.primary_contact_id}")
        return result
        
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        print(f"Unexpected error in identify endpoint: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred during contact identification"
        ) from e


@router.get("/identify/health")
async def health_check():
    """
    Health check endpoint for the identify service.
    
    Returns:
        dict: Service status and database connectivity
    """
    try:
        # Test database connectivity
        async with db_manager.get_connection() as conn:
            await conn.fetchval("SELECT 1")
        
        return {
            "status": "healthy",
            "service": "contact-identification",
            "database": "connected"
        }
    except Exception as e:
        print(f"Health check failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Service unhealthy - database connection failed"
        ) from e