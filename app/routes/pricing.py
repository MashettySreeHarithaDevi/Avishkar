from pathlib import Path

from fastapi import APIRouter
from pydantic import BaseModel
import pandas as pd
import joblib


router = APIRouter(
    prefix="/pricing",
    tags=["Pricing"]
)


# Find the project root
BASE_DIR = Path(__file__).resolve().parents[2]

# Load trained pricing model
MODEL_PATH = BASE_DIR / "ml_models" / "pricing_model.pkl"

model = joblib.load(MODEL_PATH)


class PricingRequest(BaseModel):
    category: str
    material: str
    craft_type: str
    region: str

    raw_material_cost: float
    labour_cost: float
    production_days: float
    packaging_cost: float
    transport_cost: float

    demand_score: float
    season: str


@router.post("/predict")
def predict_price(request: PricingRequest):

    data = pd.DataFrame([{
        "category": request.category,
        "material": request.material,
        "craft_type": request.craft_type,
        "region": request.region,
        "raw_material_cost": request.raw_material_cost,
        "labour_cost": request.labour_cost,
        "production_days": request.production_days,
        "packaging_cost": request.packaging_cost,
        "transport_cost": request.transport_cost,
        "demand_score": request.demand_score,
        "season": request.season
    }])

    predicted_price = model.predict(data)[0]

    recommended_price = round(predicted_price, 2)

    lower_price = round(predicted_price * 0.90, 2)
    upper_price = round(predicted_price * 1.10, 2)

    return {
        "recommended_price": recommended_price,
        "price_range": {
            "minimum": lower_price,
            "maximum": upper_price
        }
    }