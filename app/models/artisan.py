from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.database.database import Base


class Artisan(Base):
    __tablename__ = "artisans"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        unique=True,
        nullable=False
    )

    craft_type = Column(String(100), nullable=False)
    preferred_language = Column(String(50), nullable=True)
    location = Column(String(150), nullable=True)

    user = relationship("User", backref="artisan_profile")