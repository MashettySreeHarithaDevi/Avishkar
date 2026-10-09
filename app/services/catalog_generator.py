from google import genai
from google.genai import types
from dotenv import load_dotenv

import os
import json
import time
import re


load_dotenv()


GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")


client = genai.Client(
    api_key=GEMINI_API_KEY
)


# ---------------------------------------------------------
# BASIC FALLBACK CATALOG
# ---------------------------------------------------------

def fallback_catalog(english_text: str):

    text = english_text.strip()

    lower_text = text.lower()


    # -----------------------------
    # NAME
    # -----------------------------

    name = ""

    if "carrot" in lower_text:
        name = "Handmade Carrot Craft"
    elif "pot" in lower_text:
        name = "Handmade Flower Pot"
    elif "basket" in lower_text:
        name = "Handmade Basket"
    elif "saree" in lower_text:
        name = "Handmade Saree"
    elif "pottery" in lower_text:
        name = "Handmade Pottery"
    elif "bamboo" in lower_text:
        name = "Handmade Bamboo Craft"
    elif "jewellery" in lower_text or "jewelry" in lower_text:
        name = "Handmade Jewellery"
    else:
        name = "Handmade Artisan Product"


    # -----------------------------
    # CATEGORY
    # -----------------------------

    category = ""

    if (
        "pot" in lower_text
        or "pottery" in lower_text
    ):
        category = "Home Decor"

    elif "basket" in lower_text:
        category = "Home & Lifestyle"

    elif "saree" in lower_text:
        category = "Textiles"

    elif "jewellery" in lower_text:
        category = "Jewellery"

    elif "bamboo" in lower_text:
        category = "Handicrafts"

    else:
        category = "Handicrafts"


    # -----------------------------
    # MATERIAL
    # -----------------------------

    material = ""

    material_words = [
        "terracotta",
        "bamboo",
        "clay",
        "wood",
        "cotton",
        "silk",
        "wool",
        "jute",
        "metal",
        "brass",
        "ceramic",
        "leather"
    ]

    for word in material_words:
        if word in lower_text:
            material = word.title()
            break


    # -----------------------------
    # ORIGIN
    # -----------------------------

    origin = ""

    hyderabad_match = re.search(
        r"in\s+([A-Za-z ]+?)(?:\.|,|$)",
        text,
        re.IGNORECASE
    )

    if hyderabad_match:
        possible_origin = (
            hyderabad_match.group(1)
            .strip()
        )

        if len(possible_origin.split()) <= 3:
            origin = possible_origin.title()


    if "hyderabad" in lower_text:
        origin = "Hyderabad"


    # -----------------------------
    # COLOR
    # -----------------------------

    color = ""

    colors = [
        "red",
        "blue",
        "green",
        "yellow",
        "black",
        "white",
        "brown",
        "orange",
        "pink",
        "purple",
        "golden",
        "terracotta"
    ]

    for item in colors:
        if item in lower_text:
            color = item.title()
            break


    # -----------------------------
    # CRAFT TYPE
    # -----------------------------

    craft_type = "Handmade"

    if "pottery" in lower_text:
        craft_type = "Pottery"

    elif "bamboo" in lower_text:
        craft_type = "Bamboo Craft"

    elif "weaving" in lower_text:
        craft_type = "Weaving"

    elif "embroidery" in lower_text:
        craft_type = "Embroidery"


    # -----------------------------
    # PRODUCTION TIME
    # -----------------------------

    production_time = ""

    time_match = re.search(
        r"(\d+)\s*(day|days|week|weeks)",
        lower_text
    )

    if time_match:

        number = time_match.group(1)
        unit = time_match.group(2)

        production_time = (
            f"{number} {unit}"
        )


    # -----------------------------
    # KEYWORDS
    # -----------------------------

    keywords = [
        "handmade",
        "artisan",
        "traditional",
        "craft"
    ]

    if material:
        keywords.append(
            material.lower()
        )

    if origin:
        keywords.append(
            origin.lower()
        )

    if craft_type:
        keywords.append(
            craft_type.lower()
        )


    # Remove duplicates
    keywords = list(
        dict.fromkeys(keywords)
    )


    # -----------------------------
    # DESCRIPTION
    # -----------------------------

    description = text

    if len(description) > 300:
        description = description[:300]


    return {
        "name": name,
        "category": category,
        "material": material,
        "origin": origin,
        "color": color,
        "craft_type": craft_type,
        "description_en": description,
        "production_time": production_time,
        "keywords": keywords
    }


# ---------------------------------------------------------
# GEMINI GENERATION
# ---------------------------------------------------------

def generate_with_gemini(
    english_text: str,
    model_name: str
):

    prompt = f"""
You are an AI assistant for traditional Indian artisans.

Convert the artisan's spoken product description into
structured product information.

Artisan description:
{english_text}

Extract the following information:

- name
- category
- material
- origin
- color
- craft_type
- description_en
- production_time
- keywords

Rules:

1. Do not invent information.
2. If information is unknown, return an empty string.
3. keywords must be a list of short relevant words.
4. description_en should be clear and suitable for a marketplace.
5. Do not generate a price.
6. Do not generate artisan_id.
7. Do not generate product status.

Return only valid JSON.
"""


    response = client.models.generate_content(

        model=model_name,

        contents=prompt,

        config=types.GenerateContentConfig(

            response_mime_type="application/json",

            response_schema={

                "type": "OBJECT",

                "properties": {

                    "name": {
                        "type": "STRING"
                    },

                    "category": {
                        "type": "STRING"
                    },

                    "material": {
                        "type": "STRING"
                    },

                    "origin": {
                        "type": "STRING"
                    },

                    "color": {
                        "type": "STRING"
                    },

                    "craft_type": {
                        "type": "STRING"
                    },

                    "description_en": {
                        "type": "STRING"
                    },

                    "production_time": {
                        "type": "STRING"
                    },

                    "keywords": {
                        "type": "ARRAY",
                        "items": {
                            "type": "STRING"
                        }
                    }

                },

                "required": [
                    "name",
                    "category",
                    "material",
                    "origin",
                    "color",
                    "craft_type",
                    "description_en",
                    "production_time",
                    "keywords"
                ]
            }
        )
    )


    return json.loads(
        response.text
    )


# ---------------------------------------------------------
# MAIN FUNCTION
# ---------------------------------------------------------

def generate_catalog(
    english_text: str
):

    # Models are tried in this order.
    models = [
        "gemini-3.5-flash-lite",
        "gemini-2.5-flash"
    ]


    # Try each model.
    for model_name in models:

        for attempt in range(2):

            try:

                print(
                    f"Gemini catalog attempt "
                    f"{attempt + 1}/2 "
                    f"using {model_name}"
                )


                result = generate_with_gemini(
                    english_text,
                    model_name
                )


                print(
                    "Gemini catalog generation successful"
                )


                return result


            except Exception as error:

                error_text = str(error)

                print(
                    f"Gemini error using "
                    f"{model_name}: "
                    f"{error_text}"
                )


                # Temporary server / availability
                # errors should be retried.
                if (
                    "503" in error_text
                    or "UNAVAILABLE" in error_text
                    or "high demand" in error_text
                    or "temporarily" in error_text.lower()
                ):

                    if attempt == 0:

                        print(
                            "Gemini temporarily unavailable."
                            " Retrying..."
                        )

                        time.sleep(2)

                        continue


                # Move to next model.
                break


    # -----------------------------------------------------
    # FALLBACK
    # -----------------------------------------------------

    print(
        "Gemini unavailable."
        " Using fallback catalog generation."
    )


    return fallback_catalog(
        english_text
    )