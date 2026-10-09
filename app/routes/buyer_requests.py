from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.dependencies import (
    get_db,
    get_current_user,
    require_artisan
)

from app.models.buyer_request import BuyerRequest
from app.models.product import Product
from app.models.artisan import Artisan

from app.schemas.buyer_request import (
    BuyerRequestCreate,
    BuyerRequestStatusUpdate
)


router = APIRouter(
    prefix="/buyer-requests",
    tags=["B2B Buyer Requests"]
)


# --------------------------------------------------
# CREATE BULK ORDER REQUEST
# --------------------------------------------------

@router.post("")
def create_buyer_request(
    request: BuyerRequestCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    # Only buyers can create requests
    if current_user.role != "BUYER":
        raise HTTPException(
            status_code=403,
            detail="Only buyers can create bulk-order requests"
        )

    # Check product
    product = db.query(Product).filter(
        Product.id == request.product_id,
        Product.status == "PUBLISHED"
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Published product not found"
        )

    # Create request
    buyer_request = BuyerRequest(
        buyer_id=current_user.id,
        product_id=request.product_id,
        quantity=request.quantity,
        message=request.message,
        status="PENDING"
    )

    db.add(buyer_request)
    db.commit()
    db.refresh(buyer_request)

    return {
        "message": "Bulk-order request created successfully",
        "request_id": buyer_request.id,
        "status": buyer_request.status
    }


# --------------------------------------------------
# BUYER: VIEW OWN REQUESTS
# --------------------------------------------------

@router.get("/my")
def get_my_requests(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    if current_user.role != "BUYER":
        raise HTTPException(
            status_code=403,
            detail="Only buyers can view their requests"
        )

    requests = db.query(BuyerRequest).filter(
        BuyerRequest.buyer_id == current_user.id
    ).all()

    return requests


# --------------------------------------------------
# GET ONE REQUEST
# --------------------------------------------------

@router.get("/{request_id}")
def get_request(
    request_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    buyer_request = db.query(BuyerRequest).filter(
        BuyerRequest.id == request_id
    ).first()

    if not buyer_request:
        raise HTTPException(
            status_code=404,
            detail="Request not found"
        )

    # Buyer can see own request
    if current_user.role == "BUYER":

        if buyer_request.buyer_id != current_user.id:
            raise HTTPException(
                status_code=403,
                detail="You are not allowed to view this request"
            )

        return buyer_request

    # Artisan can see request only if it belongs
    # to one of their products
    if current_user.role == "ARTISAN":

        artisan = db.query(Artisan).filter(
            Artisan.user_id == current_user.id
        ).first()

        if not artisan:
            raise HTTPException(
                status_code=404,
                detail="Artisan profile not found"
            )

        product = db.query(Product).filter(
            Product.id == buyer_request.product_id,
            Product.artisan_id == artisan.id
        ).first()

        if not product:
            raise HTTPException(
                status_code=403,
                detail="You are not allowed to view this request"
            )

        return buyer_request

    raise HTTPException(
        status_code=403,
        detail="Access denied"
    )


# --------------------------------------------------
# ARTISAN: VIEW INCOMING REQUESTS
# --------------------------------------------------

@router.get("/incoming/all")
def get_incoming_requests(
    current_user=Depends(require_artisan),
    db: Session = Depends(get_db)
):
    artisan = (
        db.query(Artisan)
        .filter(Artisan.user_id == current_user.id)
        .first()
    )

    if not artisan:
        raise HTTPException(
            status_code=404,
            detail="Artisan profile not found"
        )

    requests = (
        db.query(BuyerRequest)
        .join(
            Product,
            BuyerRequest.product_id == Product.id
        )
        .filter(
            Product.artisan_id == artisan.id
        )
        .all()
    )

    return requests


# --------------------------------------------------
# ARTISAN: UPDATE REQUEST STATUS
# --------------------------------------------------

@router.put("/{request_id}/status")
def update_request_status(
    request_id: int,
    request: BuyerRequestStatusUpdate,
    current_user=Depends(require_artisan),
    db: Session = Depends(get_db)
):

    allowed_statuses = [
        "PENDING",
        "ACCEPTED",
        "REJECTED",
        "COMPLETED"
    ]

    if request.status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Status must be one of: {allowed_statuses}"
        )

    artisan = db.query(Artisan).filter(
        Artisan.user_id == current_user.id
    ).first()

    if not artisan:
        raise HTTPException(
            status_code=404,
            detail="Artisan profile not found"
        )

    buyer_request = db.query(BuyerRequest).join(
        Product,
        BuyerRequest.product_id == Product.id
    ).filter(
        BuyerRequest.id == request_id,
        Product.artisan_id == artisan.id
    ).first()

    if not buyer_request:
        raise HTTPException(
            status_code=404,
            detail="Buyer request not found"
        )

    buyer_request.status = request.status

    db.commit()
    db.refresh(buyer_request)

    return {
        "message": "Request status updated successfully",
        "request_id": buyer_request.id,
        "status": buyer_request.status
    }