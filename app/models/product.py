from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Numeric,
    DateTime,
    ForeignKey,
    JSON
)
from datetime import datetime
from sqlalchemy.orm import relationship

from app.database.database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)

    artisan_id = Column(
        Integer,
        ForeignKey("artisans.id"),
        nullable=False
    )

    name = Column(String(150), nullable=True)
    category = Column(String(100), nullable=True)
    material = Column(String(100), nullable=True)
    origin = Column(String(150), nullable=True)
    color = Column(String(50), nullable=True)
    craft_type = Column(String(100), nullable=True)

    description_en = Column(Text, nullable=True)
    description_hi = Column(Text, nullable=True)

    production_time = Column(String(100), nullable=True)

    keywords = Column(JSON, nullable=True)

    price = Column(Numeric(10, 2), nullable=True)

    status = Column(String(20), default="DRAFT", nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    artisan = relationship("Artisan", backref="products")