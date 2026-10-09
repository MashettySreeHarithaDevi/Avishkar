from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.dependencies import get_db, require_artisan
from app.models.artisan import Artisan
from app.schemas.artisan import ArtisanProfileRequest


router = APIRouter(
    prefix="/artisans",
    tags=["Artisans"]
)


@router.post("")
def create_artisan_profile(
    request: ArtisanProfileRequest,
    current_user=Depends(require_artisan),
    db: Session = Depends(get_db)
):
    user_id = current_user.id

    existing_profile = db.query(Artisan).filter(
        Artisan.user_id == user_id
    ).first()

    if existing_profile:
        raise HTTPException(
            status_code=400,
            detail="Artisan profile already exists"
        )

    artisan = Artisan(
        user_id=user_id,
        craft_type=request.craft_type,
        preferred_language=request.preferred_language,
        location=request.location
    )

    db.add(artisan)
    db.commit()
    db.refresh(artisan)

    return {
        "message": "Artisan profile created successfully",
        "artisan_id": artisan.id
    }


@router.get("/me")
def get_my_artisan_profile(
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

    return {
        "id": artisan.id,
        "user_id": artisan.user_id,
        "craft_type": artisan.craft_type,
        "preferred_language": artisan.preferred_language,
        "location": artisan.location
    }