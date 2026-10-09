from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import os

from app.database.dependencies import get_db, require_artisan
from app.models.product import Product
from app.models.artisan import Artisan
from app.models.product_image import ProductImage
from app.schemas.product import (
    ProductCreateRequest,
    ProductUpdateRequest
)

router = APIRouter(
    prefix="/products",
    tags=["Products"]
)


@router.post("")
def create_product(
    request: ProductCreateRequest,
    image_url: str | None = None,
    current_user=Depends(require_artisan),
    db: Session = Depends(get_db)
):
    artisan = db.query(Artisan).filter(
        Artisan.user_id == current_user.id
    ).first()

    if not artisan:
        raise HTTPException(
            status_code=404,
            detail="Artisan profile not found"
        )

    # Create product
    product = Product(
        artisan_id=artisan.id,
        **request.model_dump()
    )

    db.add(product)
    db.flush()   # gets product.id before commit

    # SAVE IMAGE FOR THIS PRODUCT
    if image_url:
        image_url = image_url.split("?")[0]

        if image_url.startswith("/uploads/products/"):
            filename = os.path.basename(image_url)

            image_path = os.path.join(
                "uploads",
                "products",
                filename
            )

            if os.path.exists(image_path):
                product_image = ProductImage(
                    product_id=product.id,
                    image_url=image_url
                )

                db.add(product_image)

    db.commit()
    db.refresh(product)

    return {
        "message": "Product created successfully",
        "product_id": product.id
    }

@router.get("")
def get_products(
    current_user=Depends(require_artisan),
    db: Session = Depends(get_db)
):
    user_id = current_user.id

    artisan = db.query(Artisan).filter(
        Artisan.user_id == user_id
    ).first()

    if not artisan:
        raise HTTPException(
            status_code=404,
            detail="Artisan profile not found"
        )

    products = db.query(Product).filter(
        Product.artisan_id == artisan.id
    ).all()

    return products


@router.get("/{product_id}")
def get_product(
    product_id: int,
    current_user=Depends(require_artisan),
    db: Session = Depends(get_db)
):
    user_id = current_user.id

    artisan = db.query(Artisan).filter(
        Artisan.user_id == user_id
    ).first()

    if not artisan:
        raise HTTPException(
            status_code=404,
            detail="Artisan profile not found"
        )

    product = db.query(Product).filter(
        Product.id == product_id,
        Product.artisan_id == artisan.id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return product


@router.put("/{product_id}")
def update_product(
    product_id: int,
    request: ProductUpdateRequest,
    current_user=Depends(require_artisan),
    db: Session = Depends(get_db)
):
    user_id = current_user.id

    artisan = db.query(Artisan).filter(
        Artisan.user_id == user_id
    ).first()

    if not artisan:
        raise HTTPException(
            status_code=404,
            detail="Artisan profile not found"
        )

    product = db.query(Product).filter(
        Product.id == product_id,
        Product.artisan_id == artisan.id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    update_data = request.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(product, field, value)

    db.commit()
    db.refresh(product)

    return {
        "message": "Product updated successfully",
        "product": product
    }


@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    current_user=Depends(require_artisan),
    db: Session = Depends(get_db)
):
    user_id = current_user.id

    artisan = db.query(Artisan).filter(
        Artisan.user_id == user_id
    ).first()

    if not artisan:
        raise HTTPException(
            status_code=404,
            detail="Artisan profile not found"
        )

    product = db.query(Product).filter(
        Product.id == product_id,
        Product.artisan_id == artisan.id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    db.delete(product)
    db.commit()

    return {
        "message": "Product deleted successfully"
    }

@router.put("/{product_id}/publish")
def publish_product(
    product_id: int,
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

    product = (
        db.query(Product)
        .filter(
            Product.id == product_id,
            Product.artisan_id == artisan.id
        )
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found or does not belong to you"
        )

    product.status = "PUBLISHED"

    db.commit()
    db.refresh(product)

    return {
        "message": "Product published successfully",
        "product_id": product.id,
        "status": product.status
    }

@router.put("/{product_id}/unpublish")
def unpublish_product(
    product_id: int,
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

    product = (
        db.query(Product)
        .filter(
            Product.id == product_id,
            Product.artisan_id == artisan.id
        )
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found or does not belong to you"
        )

    product.status = "DRAFT"

    db.commit()
    db.refresh(product)

    return {
        "message": "Product moved back to draft",
        "product_id": product.id,
        "status": product.status
    }