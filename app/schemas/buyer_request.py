from pydantic import BaseModel, Field


class BuyerRequestCreate(BaseModel):
    product_id: int

    quantity: int = Field(
        gt=0,
        description="Number of units required"
    )

    message: str | None = None


class BuyerRequestStatusUpdate(BaseModel):
    status: str