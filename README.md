#  Haqdarshak Agent Support Platform  
**Version 2 – Local Setup Guide**

---

##  GitHub Repository  
 https://github.com/kavyakapoor420/Haqdarshak-Stackoverflow-project.git  

##  Project Documentation  

## Prerequisites
Before proceeding with the local setup, ensure you have the following set up:

# MongoDB atlas connection string, gemini API key , sarvam API key , Elastic search api key 

1. MongoDB Atlas Setup (Database)

Go to → https://www.mongodb.com/cloud/atlas/register
Create a free account or log in.

Create a Project
→ Click "Build a Database" → Choose M0 Free Tier → Give any name → Create.

Create Database User
→ Left sidebar → Database Access → Add New Database User

Username: admin (or any)
Password: Save it somewhere safe

Allow IP Access (for local dev)

→ Left sidebar → Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)
Get Connection String
→ Click "Connect" on your cluster → Connect your application → Driver
Copy the string:

mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority

Replace <username> and <password> with your values.

Add this to your .env file later as:
MONGODB_URI=mongodb+srv://admin:yourpassword@cluster0.xxxxx.mongodb.net/haqdarshak_db?retryWrites=true&w=majority

### Official Guide -> https://www.mongodb.com/docs/atlas/tutorial/create-atlas-account/

2. Get Sarvam AI API Key

Go to → https://dashboard.sarvam.ai/
Sign up / Log in
Go to API Keys section → Create New Key
Copy the key

# Add to .env file of your frontend folder 

Refer Docs: https://docs.sarvam.ai/

3. Get Google Gemini API Key

Go to → https://aistudio.google.com/app/apikey
Sign in with Google
Click "Create API Key" (in a new or existing project)
Copy the key

# Add to .env file of your frontend folder :

OFfical docs link : https://ai.google.dev/gemini-api/docs/api-key

4. Docling – First-Time Installation (Important!)
    Docling needs system-level tools for PDF parsing & OCR.
    Install System Dependencies First
    macOS
    ```
    brew install poppler tesseract
    ```
Docling Official Install Guide:
https://docling-project.github.io/docling/getting_started/installation/



##  Local Development Setup

###  Step 1: Clone the Repository  
```bash
git clone "https://github.com/kavyakapoor420/Haqdarshak-Stackoverflow-project.git" Haqdarshak-web
cd Haqdarshak-web

```
### Step 2: Go to branch correct-code 
```
git checkout correct-code 

```

### Step 3: Run the Node.js Backend (Authentication & REST APIs) And frontend (react+vite)
```
docker compose up --build
```

Frontend available at:
 http://localhost:5173

Node backend running at:
 http://localhost:5000

### Step 4: Run the RAG Backend (Python + FastAPI + Gemini)
```

cd ragbackend
python3 -m venv .venv
source .venv/bin/activate

pip install fastapi uvicorn[standard] python-multipart \
pydantic numpy pytz requests \
pymongo elasticsearch sentence-transformers \
google-generativeai docling docling-core \
bson



uvicorn app:app --reload --port 8000

```
RAG backend running at:
 http://localhost:8000




frontend hosted url -> on vercel deployed 
<br/>
https://haqdarshak-stackoverflow-project.vercel.app/
<br/>
backend hosted url-> on render deployed 
<br/>
https://haqdarshak-stackoverflow-project.onrender.com

<br/><br/>

# AI-Powered Community / Knowledge Base Project for Haqdarshak Agents

---

##  Project Context

Over the past 9 years, **Haqdarshak** has trained **40,000+ agents** to support citizens with welfare scheme access.  
These agents—along with coordinators—hold critical knowledge on **exception handling, grievance resolution, and scheme-specific workflows**.

However, this institutional knowledge is **fragmented** and **underutilized**.

This project aims to build an **AI-powered knowledge-sharing system** where:

- Agents can **ask and answer questions**.
- Verified learnings are **added to a central knowledge base**.
- A **community-driven ecosystem** grows organically — like a *StackOverflow for Scheme Agents*.
- Engagement improves, leading to **better retention and performance**.

---

##  Deliverables

| Feature | Description |
|---------|-------------|
| **Agent Q&A Post Forms** | StackOverflow-style interface where agents can post, answer, and search scheme/policy-related questions. |
| **Knowledge Base Page** | Searchable, categorized library of verified government schemes. Contributions allowed by trained agents/coordinators. |
| **Admin Dashboard / Workflow** | Backend tools for content validation, fact-checking, and quality control. |
| **Multilingual Support** | Support for Hindi, English, Marathi, and 4–5 regional Indian languages for both input and retrieval (text & voice). |
| **Analytics Dashboard** | Telemetry tracking trends, common queries, and knowledge gaps. |
| **Multilingual Chatbot** | Voice/text-based chatbot that retrieves answers from the community or knowledge base. |
| **RESTful APIs** | APIs for chatbot integration with third-party platforms and apps. |

---

##  Core Features to Develop

- **Ask/Answer Portal:** Tagging by scheme/state; peer response support.  
- **Multilingual Chatbot:** NLP bot for English, Hindi, and Marathi.  
- **Voice Input:** Speech-to-text for agents who prefer speaking queries.  
- **Knowledge Base UI:** Search/filter verified scheme summaries.  
- **Admin Verification:** Coordinator approval workflow.  
- **Rating & Feedback:** Quality checks via ratings and flags.  
- **Usage Dashboard:** Real-time activity and topic trends.  

---

##  Detailed Functional Scope

### Question & Answer Platform
- Post questions and answers.
- Categorize and tag content for retrieval.

### Knowledge Base
- Repository of verified information & best practices.
- Advanced search for quick access.

### Conversational Bot
- AI chatbot with integration to Haqdarshak platform.
- Pulls data from knowledge base & community answers.

### Multilingual Support
- Automatic language detection & translation.
- Support for Hindi, Marathi, English, and more.

### Telemetry & Analytics
- Monitor usage, query types, engagement.
- Identify knowledge/content gaps.

### Content Quality Management
- Ratings, feedback, and admin moderation.

### User Management
- Secure login & role-based access (Agent / Coordinator / Admin).

---

##  Tech Stack

**Frontend:** React.js, TailwindCSS, ShadCN, HTML, CSS, JavaScript  
**Backend:** Node.js, Express.js, JavaScript, Python  
**Database:** MongoDB (Atlas), Redis (Caching)  
**Authentication:** JWT-based Login/Signup  
**AI/NLP Layer:** HuggingFace Models, OpenAI, Sarvam.AI  
**Speech-to-Text:** Web Speech API / Google Cloud Speech-to-Text  
**Translation APIs:** Google Cloud, Microsoft Translator, OpenAI Whisper, IndicTrans2  
**Dashboard & Analytics:** Recharts, D3.js  
**APIs:** REST APIs, OpenAI API, Whisper API  

---
