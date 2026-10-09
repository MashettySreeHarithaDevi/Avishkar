from fastapi import APIRouter, UploadFile, File, HTTPException
from pathlib import Path
import uuid
import cv2
from app.services.speech_to_text import (
    transcribe_audio,
    translate_audio_to_english
)
from app.services.catalog_generator import generate_catalog


router = APIRouter(
    prefix="/ai",
    tags=["AI"]
)


# ---------------------------------------------------------
# FOLDERS
# ---------------------------------------------------------

PRODUCTS_DIR = Path("uploads/products")
AUDIO_DIR = Path("uploads/audio")

PRODUCTS_DIR.mkdir(parents=True, exist_ok=True)
AUDIO_DIR.mkdir(parents=True, exist_ok=True)


# ---------------------------------------------------------
# IMAGE UPLOAD + ENHANCEMENT
# ---------------------------------------------------------

@router.post("/upload-image")
async def upload_image(
    image: UploadFile = File(...)
):
    try:

        if not image.filename:
            raise HTTPException(
                status_code=400,
                detail="No image file provided"
            )

        extension = Path(image.filename).suffix.lower()

        allowed_extensions = {
            ".jpg",
            ".jpeg",
            ".png",
            ".webp"
        }

        if extension not in allowed_extensions:
            raise HTTPException(
                status_code=400,
                detail="Unsupported image format"
            )

        # Generate unique filename
        filename = f"{uuid.uuid4()}.jpg"

        file_path = PRODUCTS_DIR / filename

        # Read uploaded image
        contents = await image.read()

        # Convert bytes to OpenCV image
        import numpy as np

        image_array = np.frombuffer(
            contents,
            np.uint8
        )

        img = cv2.imdecode(
            image_array,
            cv2.IMREAD_COLOR
        )

        if img is None:
            raise HTTPException(
                status_code=400,
                detail="Unable to read image"
            )

        # -------------------------------------------------
        # SIMPLE IMAGE ENHANCEMENT
        # -------------------------------------------------

        # Improve contrast and brightness
        lab = cv2.cvtColor(
            img,
            cv2.COLOR_BGR2LAB
        )

        l, a, b = cv2.split(lab)

        clahe = cv2.createCLAHE(
            clipLimit=2.0,
            tileGridSize=(8, 8)
        )

        l = clahe.apply(l)

        enhanced = cv2.merge(
            (l, a, b)
        )

        enhanced = cv2.cvtColor(
            enhanced,
            cv2.COLOR_LAB2BGR
        )

        # Slight sharpening
        kernel = np.array([
            [0, -1, 0],
            [-1, 5, -1],
            [0, -1, 0]
        ])

        enhanced = cv2.filter2D(
            enhanced,
            -1,
            kernel
        )

        # Save enhanced image
        success = cv2.imwrite(
            str(file_path),
            enhanced
        )

        if not success:
            raise HTTPException(
                status_code=500,
                detail="Failed to save enhanced image"
            )

        print("IMAGE SAVED:", file_path)

        return {
            "filename": filename,
            "image_url": f"/uploads/products/{filename}",
            "message": "Image uploaded successfully"
        }

    except HTTPException:
        raise

    except Exception as error:
        print("IMAGE UPLOAD ERROR:", error)

        raise HTTPException(
            status_code=500,
            detail="Image enhancement failed"
        )


# ---------------------------------------------------------
# AUDIO UPLOAD
# ---------------------------------------------------------

@router.post("/upload-audio")
async def upload_audio(
    audio: UploadFile = File(...)
):
    try:

        if not audio.filename:
            raise HTTPException(
                status_code=400,
                detail="No audio file provided"
            )

        extension = Path(
            audio.filename
        ).suffix.lower()

        allowed_extensions = {
            ".m4a",
            ".mp3",
            ".wav",
            ".webm",
            ".aac"
        }

        if extension not in allowed_extensions:
            raise HTTPException(
                status_code=400,
                detail="Unsupported audio format"
            )

        # Generate unique filename
        filename = f"{uuid.uuid4()}{extension}"

        file_path = AUDIO_DIR / filename

        # Read audio
        contents = await audio.read()

        # Save audio
        with open(file_path, "wb") as buffer:
            buffer.write(contents)

        print("AUDIO SAVED:", file_path)

        return {
            "message": "Audio uploaded successfully",
            "filename": filename,
            "audio_url": f"/uploads/audio/{filename}"
        }

    except HTTPException:
        raise

    except Exception as error:
        print("AUDIO UPLOAD ERROR:", error)

        raise HTTPException(
            status_code=500,
            detail="Failed to upload audio"
        )

@router.post("/transcribe-audio")
async def transcribe_uploaded_audio(
    filename: str
):
    try:

        audio_path = AUDIO_DIR / filename

        if not audio_path.exists():
            raise HTTPException(
                status_code=404,
                detail="Audio file not found"
            )

        result = transcribe_audio(
            str(audio_path)
        )

    

        return {
            "filename": filename,
            "text": result["text"],
            "language": result["language"],
            "language_probability": result["language_probability"]
        }

    except HTTPException:
        raise

    except Exception as error:
        import traceback

        print("TRANSCRIPTION ERROR:", repr(error))
        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


@router.post("/translate-audio")
async def translate_uploaded_audio(filename: str):

    try:

        audio_path = AUDIO_DIR / filename

        if not audio_path.exists():
            raise HTTPException(
                status_code=404,
                detail="Audio file not found"
            )

        result = translate_audio_to_english(
            str(audio_path)
        )

        return {
            "filename": filename,
            "source_language": result["language"],
            "language_probability": result["language_probability"],
            "english_text": result["text"]
        }

    except HTTPException:
        raise

    except Exception as error:

        import traceback

        print(
            "TRANSLATION ERROR:",
            repr(error)
        )

        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )

@router.post("/generate-catalog")
async def generate_product_catalog(
    english_text: str
):
    try:

        if not english_text.strip():
            raise HTTPException(
                status_code=400,
                detail="English product description is required"
            )

        catalog = generate_catalog(english_text)

        return {
            "message": "Product catalog generated successfully",
            "catalog": catalog
        }

    except HTTPException:
        raise

    except Exception as error:
        import traceback

        print(
            "CATALOG GENERATION ERROR:",
            repr(error)
        )

        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )

@router.post("/generate-catalog")
async def generate_product_catalog(
    english_text: str
):
    try:

        if not english_text.strip():
            raise HTTPException(
                status_code=400,
                detail="English product description is required"
            )

        catalog = generate_catalog(english_text)

        return {
            "message": "Product catalog generated successfully",
            "catalog": catalog
        }

    except HTTPException:
        raise

    except Exception as error:
        import traceback

        print(
            "CATALOG GENERATION ERROR:",
            repr(error)
        )

        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )