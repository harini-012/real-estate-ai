import os
import uuid
import requests
import cloudinary
import cloudinary.uploader

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

from groq import Groq
from gtts import gTTS
from langdetect import detect

from pinecone import Pinecone
from sentence_transformers import SentenceTransformer

# =========================================
# LOAD ENV
# =========================================

load_dotenv()

# =========================================
# FLASK
# =========================================

app = Flask(__name__)

CORS(
    app,
    origins=["http://localhost:5173"]
)

# =========================================
# NESTJS API
# =========================================

NEST_API = "http://localhost:3000"

# =========================================
# GROQ
# =========================================

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

# =========================================
# CLOUDINARY
# =========================================

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

# =========================================
# PINECONE
# =========================================

pc = Pinecone(
    api_key=os.getenv("PINECONE_API_KEY")
)

index = pc.Index(
    os.getenv("PINECONE_INDEX")
)

# =========================================
# EMBEDDING MODEL
# =========================================

embed_model = SentenceTransformer(
    "BAAI/bge-large-en-v1.5"
)

# =========================================
# VOICE LANGUAGES
# =========================================

VOICE_LANG_MAP = {

    "ENGLISH": "en",
    "TAMIL": "ta",
    "HINDI": "hi",
    "TELUGU": "te",
    "KANNADA": "kn"

}

# =========================================
# EMBEDDING
# =========================================

def create_embedding(text):

    return embed_model.encode(text).tolist()

# =========================================
# LANGUAGE DETECTION
# =========================================

def detect_language(text):

    try:

        lang = detect(text)

        if lang == "ta":
            return "TAMIL"

        elif lang == "hi":
            return "HINDI"

        elif lang == "kn":
            return "KANNADA"

        elif lang == "te":
            return "TELUGU"

        else:
            return "ENGLISH"

    except:

        return "ENGLISH"

# =========================================
# GENERATE VOICE
# =========================================

def generate_voice(
    text,
    lang_code="en"
):

    try:

        os.makedirs(
            "static",
            exist_ok=True
        )

        filename = f"voice_{uuid.uuid4()}.mp3"

        path = os.path.join(
            "static",
            filename
        )

        tts = gTTS(
            text=text,
            lang=lang_code
        )

        tts.save(path)

        return f"http://127.0.0.1:5000/static/{filename}"

    except Exception as e:

        print("VOICE ERROR:", e)

        return None

# =========================================
# SAVE CHAT IN NESTJS
# =========================================

def save_chat(
    uid,
    role,
    content
):

    try:

        requests.post(

            f"{NEST_API}/chat/save",

            json={

                "userId": uid,
                "role": role,
                "content": content

            }
        )

    except Exception as e:

        print("SAVE CHAT ERROR:", e)

# =========================================
# MCP SEARCH
# =========================================

@app.route(
    "/mcp/search-properties",
    methods=["POST"]
)
def mcp_search_properties():

    try:

        data = request.json

        query = data.get(
            "query",
            ""
        )

        vector = create_embedding(query)

        results = index.query(

            vector=vector,

            top_k=5,

            include_metadata=True

        )

        matches = []

        for m in results.get(
            "matches",
            []
        ):

            matches.append({

                "id": m.get("id"),

                "score": float(
                    m.get("score", 0)
                ),

                "metadata": m.get(
                    "metadata",
                    {}
                )

            })

        return jsonify({

            "matches": matches

        })

    except Exception as e:

        return jsonify({

            "error": str(e)

        }), 500

# =========================================
# CHECK USER
# =========================================

@app.route(
    "/check-user/<int:uid>",
    methods=["GET"]
)
def check_user(uid):

    try:

        response = requests.get(
            f"{NEST_API}/user/{uid}"
        )

        if response.status_code == 200:

            return jsonify({
                "exists": True
            })

        return jsonify({
            "exists": False
        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

# =========================================
# REGISTER USER
# =========================================

@app.route(
    "/register",
    methods=["POST"]
)
def register():

    try:

        data = request.json

        response = requests.post(

            f"{NEST_API}/user/register",

            json=data

        )

        return jsonify(
            response.json()
        )

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

# =========================================
# ADD PROPERTY
# =========================================

@app.route(
    "/add-property",
    methods=["POST"]
)
def add_property():

    try:

        data = request.json

        response = requests.post(

            f"{NEST_API}/properties",

            json=data

        )

        property_data = response.json()

        property_id = property_data["id"]

        # =====================================
        # VECTOR STORE
        # =====================================

        vector_text = f"""
Property Name: {data['propertyName']}
City: {data['city']}
Locality: {data['locality']}
Property Type: {data['propertyType']}
"""

        vector = create_embedding(
            vector_text
        )

        index.upsert(vectors=[{

            "id": str(property_id),

            "values": vector,

            "metadata": {

                "propertyId": property_id,
                "propertyName": data["propertyName"],
                "city": data["city"],
                "locality": data["locality"],
                "propertyType": data["propertyType"]

            }

        }])

        return jsonify({

            "message": "property added",
            "propertyId": property_id

        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

# =========================================
# PROPERTY SEARCH
# =========================================

@app.route(
    "/properties",
    methods=["GET"]
)
def get_properties():

    try:

        city = request.args.get("city")

        response = requests.get(

            f"{NEST_API}/properties",

            params={
                "city": city
            }

        )

        return jsonify(
            response.json()
        )

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

# =========================================
# LIKE PROPERTY
# =========================================

@app.route(
    "/like",
    methods=["POST"]
)
def like_property():

    try:

        data = request.json

        response = requests.post(

            f"{NEST_API}/likes",

            json=data

        )

        return jsonify(
            response.json()
        )

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

# =========================================
# BOOK VISIT
# =========================================

@app.route(
    "/visit",
    methods=["POST"]
)
def book_visit():

    try:

        data = request.json

        response = requests.post(

            f"{NEST_API}/visits",

            json=data

        )

        return jsonify(
            response.json()
        )

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

# =========================================
# MESSAGE OWNER
# =========================================

@app.route(
    "/message",
    methods=["POST"]
)
def message_owner():

    try:

        data = request.json

        response = requests.post(

            f"{NEST_API}/messages",

            json=data

        )

        return jsonify(
            response.json()
        )

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

# =========================================
# ROOMMATE PREFERENCE
# =========================================

@app.route(
    "/roommate",
    methods=["POST"]
)
def roommate():

    try:

        data = request.json

        response = requests.post(

            f"{NEST_API}/roommate",

            json=data

        )

        return jsonify(
            response.json()
        )

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

# =========================================
# FIND MATCHES
# =========================================

@app.route(
    "/matches/<int:uid>",
    methods=["GET"]
)
def matches(uid):

    try:

        response = requests.get(
            f"{NEST_API}/roommate/matches/{uid}"
        )

        return jsonify(
            response.json()
        )

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

# =========================================
# MOVE IN ASSISTANT
# =========================================

@app.route(
    "/move-in/<int:pid>",
    methods=["GET"]
)
def move_in(pid):

    try:

        response = requests.get(
            f"{NEST_API}/properties/{pid}"
        )

        p = response.json()

        property_type = str(
            p["propertyType"]
        ).lower()

        suggestions = [

            "Deep clean before moving",

            f"Check locality {p['locality']}, {p['city']}",

            "Arrange electricity and water"

        ]

        if "pg" in property_type:

            suggestions.append(
                "Check WiFi and shared washroom"
            )

        elif "1bhk" in property_type:

            suggestions.append(
                "Use compact furniture"
            )

        elif "2bhk" in property_type:

            suggestions.append(
                "Plan room wise shifting"
            )

        elif "villa" in property_type:

            suggestions.append(
                "Inspect parking and garden"
            )

        return jsonify({

            "moveInSuggestions": suggestions

        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

# =========================================
# GENERATE AD
# =========================================

@app.route(
    "/generate-ad",
    methods=["POST"]
)
def generate_ad():

    try:

        data = request.json

        property_id = data["propertyId"]

        image_path = data["imagePath"]

        # =====================================
        # PROPERTY DETAILS
        # =====================================

        response = requests.get(
            f"{NEST_API}/ads/property/{property_id}"
        )

        property_data = response.json()

        # =====================================
        # CLOUDINARY
        # =====================================

        upload = cloudinary.uploader.upload(
            image_path
        )

        image_url = upload["secure_url"]

        # =====================================
        # PROMPT
        # =====================================

        prompt = f"""
Create a professional real estate advertisement.

Property Name:
{property_data['propertyName']}

City:
{property_data['city']}

Locality:
{property_data['locality']}

Property Type:
{property_data['propertyType']}

Parking:
{property_data['parking']}

Owner:
{property_data['ownerName']}

Mobile:
{property_data['mobile']}

Rules:
- Professional
- Short
- Attractive
- Mention locality
- Mention contact clearly
"""

        ai = client.chat.completions.create(

            model="llama-3.1-8b-instant",

            temperature=0.5,

            messages=[

                {
                    "role": "user",
                    "content": prompt
                }

            ]
        )

        ad = ai.choices[0].message.content

        return jsonify({

            "advertisement": ad,
            "imageUrl": image_url,
            "ownerName": property_data["ownerName"],
            "mobile": property_data["mobile"]

        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

# =========================================
# CHAT
# =========================================

@app.route(
    "/chat",
    methods=["POST"]
)
def chat():

    try:

        data = request.json

        uid = data["userId"]

        msg = data["message"]

        user_language = detect_language(msg)

        save_chat(
            uid,
            "user",
            msg
        )

        # =====================================
        # PINECONE SEARCH
        # =====================================

        search = requests.post(

            "http://127.0.0.1:5000/mcp/search-properties",

            json={
                "query": msg
            }

        )

        results = search.json()

        context = ""

        for m in results.get(
            "matches",
            []
        ):

            meta = m.get(
                "metadata",
                {}
            )

            context += f"""
Property:
{meta.get('propertyName')}

City:
{meta.get('city')}

Locality:
{meta.get('locality')}

Type:
{meta.get('propertyType')}
"""

        if context.strip() == "":

            context = "No matching properties found"

        # =====================================
        # GROQ AI
        # =====================================

        ai = client.chat.completions.create(

            model="llama-3.1-8b-instant",

            temperature=0.2,

            messages=[

                {
                    "role": "system",
                    "content": f"""
You are a multilingual real estate assistant.

IMPORTANT:
- Reply only in {user_language}
- Allowed languages:
English, Tamil, Hindi, Telugu, Kannada
- Keep replies short
- Never hallucinate
- Use only provided data
"""
                },

                {
                    "role": "user",
                    "content": f"""
User Query:
{msg}

Property Data:
{context}
"""
                }

            ]
        )

        reply = ai.choices[0].message.content

        save_chat(
            uid,
            "assistant",
            reply
        )

        return jsonify({

            "reply": reply,
            "context": context,
            "language": user_language

        })

    except Exception as e:

        print("CHAT ERROR:", e)

        return jsonify({
            "error": str(e)
        }), 500

# =========================================
# VOICE REPLY
# =========================================

@app.route(
    "/voice-reply",
    methods=["POST"]
)
def voice_reply():

    try:

        data = request.json

        uid = data["userId"]

        msg = data["message"]

        user_language = detect_language(msg)

        save_chat(
            uid,
            "user",
            msg
        )

        # =====================================
        # PINECONE SEARCH
        # =====================================

        search = requests.post(

            "http://127.0.0.1:5000/mcp/search-properties",

            json={
                "query": msg
            }

        )

        results = search.json()

        context = ""

        for m in results.get(
            "matches",
            []
        ):

            meta = m.get(
                "metadata",
                {}
            )

            context += f"""
Property:
{meta.get('propertyName')}

City:
{meta.get('city')}

Locality:
{meta.get('locality')}

Type:
{meta.get('propertyType')}
"""

        if context.strip() == "":

            context = "No matching properties found"

        # =====================================
        # GROQ
        # =====================================

        ai = client.chat.completions.create(

            model="llama-3.1-8b-instant",

            temperature=0.2,

            messages=[

                {
                    "role": "system",
                    "content": f"""
You are a multilingual voice assistant.

Rules:
- Respond only in {user_language}
- English, Tamil, Telugu,
Hindi, Kannada supported
- Keep replies short
- Never hallucinate
"""
                },

                {
                    "role": "user",
                    "content": f"""
Question:
{msg}

Property Data:
{context}
"""
                }

            ]
        )

        reply = ai.choices[0].message.content

        save_chat(
            uid,
            "assistant",
            reply
        )

        # =====================================
        # VOICE
        # =====================================

        lang_code = VOICE_LANG_MAP.get(
            user_language,
            "en"
        )

        audio_url = generate_voice(
            reply,
            lang_code
        )

        return jsonify({

            "reply": reply,
            "audio": audio_url,
            "language": user_language

        })

    except Exception as e:

        print("VOICE ERROR:", e)

        return jsonify({
            "error": str(e)
        }), 500

# =========================================
# RUN
# =========================================

if __name__ == "__main__":

    app.run(
        debug=True,
        port=5000
    )