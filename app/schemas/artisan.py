from pydantic import BaseModel


class ArtisanProfileRequest(BaseModel):
    craft_type: str
    preferred_language: str | None = None
    location: str | None = None