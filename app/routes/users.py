from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.dependencies import get_db, get_current_user
from app.models.user import User
from app.schemas.auth import UpdateProfileRequest


router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.get("/me")
def get_me(
    current_user=Depends(get_current_user)
):
    return {
        "user_id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "phone": current_user.phone,
        "role": current_user.role,
        "language": current_user.language,
        "location": current_user.location
    }


@router.put("/me")
def update_my_profile(
    request: UpdateProfileRequest,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_id = current_user.id

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if request.name is not None:
        user.name = request.name

    if request.phone is not None:
        existing_phone = db.query(User).filter(
            User.phone == request.phone,
            User.id != user_id
        ).first()

        if existing_phone:
            raise HTTPException(
                status_code=400,
                detail="Phone already registered"
            )

        user.phone = request.phone

    if request.language is not None:
        user.language = request.language

    if request.location is not None:
        user.location = request.location

    db.commit()
    db.refresh(user)

    return {
        "message": "Profile updated successfully",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "phone": user.phone,
            "role": user.role,
            "language": user.language,
            "location": user.location
        }
    }