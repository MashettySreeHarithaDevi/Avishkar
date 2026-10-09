from pydantic import BaseModel
from decimal import Decimal


class ProductCreateRequest(BaseModel):
    name: str | None = None
    category: str | None = None
    material: str | None = None
    origin: str | None = None
    color: str | None = None
    craft_type: str | None = None
    description_en: str | None = None
    description_hi: str | None = None
    production_time: str | None = None
    keywords: list[str] | None = None
    price: Decimal | None = None


class ProductUpdateRequest(BaseModel):
    name: str | None = None
    category: str | None = None
    material: str | None = None
    origin: str | None = None
    color: str | None = None
    craft_type: str | None = None
    description_en: str | None = None
    description_hi: str | None = None
    production_time: str | None = None
    keywords: list[str] | None = None
    price: Decimal | None = None
    status: str | None = None