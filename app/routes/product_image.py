from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import os
import shutil
import uuid
from urllib.parse import urlparse

from app.database.dependencies import get_db, require_artisan
from app.models.product import Product
from app.models.artisan import Artisan
from app.models.product_image import ProductImage



router = APIRouter(
    prefix="/products",
    tags=["Product Images"]
)


# ============================================================
# UPLOAD NEW PRODUCT IMAGE
# ============================================================

@router.post("/{product_id}/images")
def upload_product_image(
    product_id: int,
    file: UploadFile = File(...),
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

    allowed_types = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ]

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Only JPG, PNG and WEBP images are allowed"
        )

    upload_directory = "uploads/products"

    os.makedirs(
        upload_directory,
        exist_ok=True
    )

    file_extension = os.path.splitext(
        file.filename
    )[1]

    unique_filename = (
        f"{uuid.uuid4()}{file_extension}"
    )

    file_path = os.path.join(
        upload_directory,
        unique_filename
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer
        )

    image = ProductImage(
        product_id=product.id,
        image_url=f"/uploads/products/{unique_filename}"
    )

    db.add(image)
    db.commit()
    db.refresh(image)

    return {
        "message": "Product image uploaded successfully",
        "image_id": image.id,
        "image_url": image.image_url
    }


# ============================================================
# ATTACH EXISTING AI-ENHANCED IMAGE TO PRODUCT
# ============================================================

@router.post("/{product_id}/images/from-existing")
def attach_existing_product_image(
    product_id: int,
    image_url: str,
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

    # --------------------------------------------------
# ATTACH EXISTING AI-ENHANCED IMAGE
# --------------------------------------------------

@router.post("/{product_id}/images/from-existing")
def attach_existing_product_image(
    product_id: int,
    image_url: str,
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

    # Handle either:
    # /uploads/products/file.jpg
    # or
    # http://192.168.0.109:8000/uploads/products/file.jpg

    parsed = urlparse(image_url)

    if parsed.scheme:
        clean_path = parsed.path
    else:
        clean_path = image_url

    clean_path = clean_path.split("?")[0]

    if not clean_path.startswith(
        "/uploads/products/"
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid product image path"
        )

    filename = os.path.basename(
        clean_path
    )

    if not filename:
        raise HTTPException(
            status_code=400,
            detail="Invalid image filename"
        )

    final_image_url = (
        f"/uploads/products/{filename}"
    )

    file_path = os.path.join(
        "uploads",
        "products",
        filename
    )

    # Make sure the actual AI image exists
    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=404,
            detail="AI-enhanced image file not found"
        )

    # Avoid duplicate association
    existing_image = db.query(ProductImage).filter(
        ProductImage.product_id == product.id,
        ProductImage.image_url == final_image_url
    ).first()

    if existing_image:

        return {
            "message": "Product image already attached",
            "image_id": existing_image.id,
            "product_id": product.id,
            "image_url": existing_image.image_url
        }

    image = ProductImage(
        product_id=product.id,
        image_url=final_image_url
    )

    db.add(image)
    db.commit()
    db.refresh(image)

    return {
        "message": "Existing product image attached successfully",
        "image_id": image.id,
        "product_id": product.id,
        "image_url": image.image_url
    }


# --------------------------------------------------
# PUBLIC PRODUCT IMAGES
# --------------------------------------------------

@router.get("/{product_id}/images/public")
def get_public_product_images(
    product_id: int,
    db: Session = Depends(get_db)
):

    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    images = db.query(ProductImage).filter(
        ProductImage.product_id == product_id
    ).all()

    return [
        {
            "id": image.id,
            "product_id": image.product_id,
            "image_url": image.image_url
        }
        for image in images
    ]

    # --------------------------------------------------------
    # Normalize the image URL
    # --------------------------------------------------------

    parsed = urlparse(image_url)

    if parsed.scheme:
        clean_path = parsed.path
    else:
        clean_path = image_url

    clean_path = clean_path.split("?")[0]

    if not clean_path.startswith(
        "/uploads/products/"
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid product image path"
        )

    filename = os.path.basename(
        clean_path
    )

    if not filename:
        raise HTTPException(
            status_code=400,
            detail="Invalid image filename"
        )

    final_image_url = (
        f"/uploads/products/{filename}"
    )

    file_path = os.path.join(
        "uploads",
        "products",
        filename
    )

    # --------------------------------------------------------
    # Make sure the AI-generated image actually exists
    # --------------------------------------------------------

    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=404,
            detail="AI-enhanced image file not found"
        )

    # --------------------------------------------------------
    # Avoid duplicate image association
    # --------------------------------------------------------

    existing_image = db.query(ProductImage).filter(
        ProductImage.product_id == product.id,
        ProductImage.image_url == final_image_url
    ).first()

    if existing_image:

        return {
            "message": "Product image already attached",
            "image_id": existing_image.id,
            "image_url": existing_image.image_url
        }

    # --------------------------------------------------------
    # Create database relationship
    # --------------------------------------------------------

    image = ProductImage(
        product_id=product.id,
        image_url=final_image_url
    )

    db.add(image)
    db.commit()
    db.refresh(image)

    return {
        "message": "Existing product image attached successfully",
        "image_id": image.id,
        "product_id": product.id,
        "image_url": image.image_url
    }


# ============================================================
# GET PRODUCT IMAGES - ARTISAN
# ============================================================

@router.get("/{product_id}/images")
def get_product_images(
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

    images = db.query(ProductImage).filter(
        ProductImage.product_id == product_id
    ).all()

    return [
        {
            "id": image.id,
            "product_id": image.product_id,
            "image_url": image.image_url,
            "created_at": image.created_at
        }
        for image in images
    ]


# ============================================================
# GET PRODUCT IMAGES - PUBLIC / MARKETPLACE
# ============================================================

@router.get("/{product_id}/images/public")
def get_public_product_images(
    product_id: int,
    db: Session = Depends(get_db)
):

    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    images = db.query(ProductImage).filter(
        ProductImage.product_id == product_id
    ).all()

    return [
        {
            "id": image.id,
            "product_id": image.product_id,
            "image_url": image.image_url
        }
        for image in images
    ]


# ============================================================
# DELETE PRODUCT IMAGE
# ============================================================

@router.delete("/{product_id}/images/{image_id}")
def delete_product_image(
    product_id: int,
    image_id: int,
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

    image = db.query(ProductImage).filter(
        ProductImage.id == image_id,
        ProductImage.product_id == product_id
    ).first()

    if not image:
        raise HTTPException(
            status_code=404,
            detail="Image not found"
        )

    file_path = image.image_url.lstrip("/")

    if os.path.exists(file_path):
        os.remove(file_path)

    db.delete(image)
    db.commit()

    return {
        "message": "Product image deleted successfully"
    }

@router.post("/{product_id}/images/from-existing")
def attach_existing_product_image(
    product_id: int,
    image_url: str,
    current_user=Depends(require_artisan),
    db: Session = Depends(get_db)
):
    import os

    artisan = db.query(Artisan).filter(
        Artisan.user_id == current_user.id
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

    if not image_url.startswith("/uploads/products/"):
        raise HTTPException(
            status_code=400,
            detail="Invalid image path"
        )

    filename = os.path.basename(image_url)

    file_path = os.path.join(
        "uploads",
        "products",
        filename
    )

    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=404,
            detail=f"Image file not found: {filename}"
        )

    existing = db.query(ProductImage).filter(
        ProductImage.product_id == product_id
    ).first()

    if existing:
        existing.image_url = image_url
    else:
        existing = ProductImage(
            product_id=product_id,
            image_url=image_url
        )
        db.add(existing)

    db.commit()
    db.refresh(existing)

    return {
        "message": "Product image attached successfully",
        "product_id": product_id,
        "image_id": existing.id,
        "image_url": existing.image_url
    }