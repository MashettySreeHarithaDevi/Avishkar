from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from app.routes.auth import router as auth_router
from app.routes.users import router as users_router
from app.routes.artisan import router as artisan_router
from app.routes.product import router as product_router
from app.routes.product_image import router as product_image_router
from app.routes.marketplace import router as marketplace_router
from app.routes.buyer_requests import router as buyer_requests_router
from app.routes.pricing import router as pricing_router
from app.routers.ai import router as ai_router


app = FastAPI(title="Artisan Business Manager")


# Serve uploaded images
app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)


# Register API routes
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(artisan_router)
app.include_router(product_router)
app.include_router(product_image_router)
app.include_router(marketplace_router)
app.include_router(buyer_requests_router)
app.include_router(pricing_router)
app.include_router(ai_router)


@app.get("/")
def home():
    return {"message": "Artisan Business Manager API is running"}