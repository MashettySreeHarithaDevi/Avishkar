from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database.dependencies import get_db
from app.models.product import Product


router = APIRouter(
    prefix="/marketplace",
    tags=["Marketplace"]
)


# ==================================================
# GET ALL PUBLISHED PRODUCTS
# ==================================================

@router.get("/products")
def get_marketplace_products(
    db: Session = Depends(get_db)
):
    products = (
        db.query(Product)
        .filter(Product.status == "PUBLISHED")
        .order_by(Product.created_at.desc())
        .all()
    )

    return products


# ==================================================
# SEARCH PRODUCTS
# ==================================================

@router.get("/search")
def search_marketplace_products(
    q: str = Query(..., min_length=1),
    db: Session = Depends(get_db)
):
    search_text = f"%{q.strip()}%"

    products = (
        db.query(Product)
        .filter(
            Product.status == "PUBLISHED",
            or_(
                Product.name.ilike(search_text),
                Product.category.ilike(search_text),
                Product.material.ilike(search_text),
                Product.origin.ilike(search_text),
                Product.craft_type.ilike(search_text),
                Product.description_en.ilike(search_text)
            )
        )
        .order_by(Product.created_at.desc())
        .all()
    )

    return products


# ==================================================
# FILTER PRODUCTS
# ==================================================

@router.get("/filter")
def filter_marketplace_products(
    category: str | None = None,
    material: str | None = None,
    craft_type: str | None = None,
    origin: str | None = None,
    q: str | None = None,
    db: Session = Depends(get_db)
):

    query = (
        db.query(Product)
        .filter(Product.status == "PUBLISHED")
    )

    # ----------------------------------------------
    # SEARCH
    # ----------------------------------------------

    if q and q.strip():

        search_text = f"%{q.strip()}%"

        query = query.filter(
            or_(
                Product.name.ilike(search_text),
                Product.category.ilike(search_text),
                Product.material.ilike(search_text),
                Product.origin.ilike(search_text),
                Product.craft_type.ilike(search_text),
                Product.description_en.ilike(search_text)
            )
        )

    # ----------------------------------------------
    # CATEGORY
    # ----------------------------------------------

    if category and category.strip():

        query = query.filter(
            Product.category.ilike(category.strip())
        )

    # ----------------------------------------------
    # MATERIAL
    # ----------------------------------------------

    if material and material.strip():

        query = query.filter(
            Product.material.ilike(material.strip())
        )

    # ----------------------------------------------
    # CRAFT TYPE
    # ----------------------------------------------

    if craft_type and craft_type.strip():

        query = query.filter(
            Product.craft_type.ilike(craft_type.strip())
        )

    # ----------------------------------------------
    # ORIGIN
    # ----------------------------------------------

    if origin and origin.strip():

        query = query.filter(
            Product.origin.ilike(origin.strip())
        )

    products = (
        query
        .order_by(Product.created_at.desc())
        .all()
    )

    return products


# ==================================================
# GET ONE PUBLISHED PRODUCT
# ==================================================

@router.get("/products/{product_id}")
def get_marketplace_product(
    product_id: int,
    db: Session = Depends(get_db)
):

    product = (
        db.query(Product)
        .filter(
            Product.id == product_id,
            Product.status == "PUBLISHED"
        )
        .first()
    )

    if not product:

        raise HTTPException(
            status_code=404,
            detail="Published product not found"
        )

    return product  