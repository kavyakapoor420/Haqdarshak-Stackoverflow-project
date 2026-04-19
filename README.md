#  Haqdarshak Agent Support Platform  

---

##  GitHub Repository  
 https://github.com/kavyakapoor420/Haqdarshak-Stackoverflow-project.git  

##  Project Documentation link 
https://www.notion.so/Haqdarshak-Project-Docs-20fbf08dcc0880e4bd5ae9ee66c82792

https://docs.google.com/document/d/1ML6kwwYUAfThma6EZgnwZX8_U31sdB6792obKDjEzUs/edit?usp=sharing

##  Local Development Setup

Make sure **MongoDB** and **Elasticsearch** (if enabled) are running on your system before starting.

---

###  Step 1: Clone the Repository  
```bash
git clone "https://github.com/kavyakapoor420/Haqdarshak-Stackoverflow-project.git" Haqdarshak-web
cd Haqdarshak-web

```
### Step 2: Run the Frontend (React + Vite)
```
cd frontend
npm install
npm run dev

```
Frontend available at:
 http://localhost:5173

### Step 3: Run the Node.js Backend (Authentication & REST APIs)
```
cd ..
cd NodeBackend
npm install
nodemon index.js
```

Node backend running at:
 http://localhost:5000

### Step 4: Run the RAG Backend (Python + FastAPI + Gemini)
```
cd ..
cd Rag-backend
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


# Weekly Learnings & Updates

## Week 1

1)  Had a detailed discussion with mentor about every feature and its future prospects.

2)  Created flowcharts and diagrams to visualize features clearly.

3)  Finalized the tech stack (MERN + AI/NLP layer) after mentor discussions.

4)  Drafted project documentation covering context, deliverables, and core requirements.

5) I learned more about how to visualize the  Deliverables in mind and creating draft documentaiton for easy reference . 

This week was more about planning, documentation, and getting clarity on requirements before jumping into implementation.

**Some screenshot on flowchart designed .** 

<img width="1232" height="783" alt="Image" src="https://github.com/user-attachments/assets/6d70be4a-d0cf-4f42-a00d-ef86f053f8ea" />

<img width="1257" height="619" alt="Image" src="https://github.com/user-attachments/assets/e0a8be0a-3d13-4afa-af78-8dc794dee719" />


## Week 2

1) Set up the basic React.js frontend with TailwindCSS, Shadcn, and other dependencies.

2) Configured backend with Node.js, Express, and MongoDB.

3) Built the landing page, navigation bar, and footer as the starting point of the platform.

3) Faced the challenge of duplication in content (repeat answers and overlapping scheme entries).

4) Researched multilingual open-source/free tools and APIs to handle query translation.

5) Explored **challenges in multilingual NLP**, especially maintaining accuracy across Hindi ,Marathiand English dialects.

This week marked the transition from planning to coding. While initial UI setup was completed, the major takeaway was understanding the complexity of multilingual support and quality control in knowledge entries.

**Some screenshot of Landing Page , Navbar, Footer  designed .** 

<img width="1455" height="678" alt="Image" src="https://github.com/user-attachments/assets/cecae508-7434-4ef0-a643-fb69aba8af90" />

<img width="1455" height="81" alt="Image" src="https://github.com/user-attachments/assets/0f159eb0-2ddd-4bc2-a620-1e9daacc81e8" />

<img width="1455" height="424" alt="Image" src="https://github.com/user-attachments/assets/40000484-c15c-496c-b93a-072649826039" />


## Week 3

1) Continued research on multilingual open-source models for both speech-to-text and text-to-speech.

2) Evaluated options like Google Translation API, Microsoft Translator, Bhashini API, Gemini API (flash model), and IndicBERTv2 for multilingual understanding.

3) Noted accuracy challenges with translation tools despite free tiers being available.

4) Started building the first functional feature: agents can post queries with title, description, and tags.

5) Added search by title and filter by tags to improve knowledge retrieval and indexing for the chatbot.
 
This week was focused on experimentation and building the first working feature. The biggest challenge is finding reliable multilingual solutions, but progress has been made in query posting and retrieval flow.

<img width="1455" height="551" alt="Image" src="https://github.com/user-attachments/assets/50d67289-4e4c-4b6b-bd2d-cf9181022126" />

## Week 4

1) Learned about role-based access control and implemented login/registration for agents and administrators.

2) Built secure authentication and authorization workflows on both frontend and backend.

3) Developed role-specific features: agents and coordinators have separate access levels compared to admins.

4) Explored middleware in Express.js to protect routes and restrict admin-only pages like the Admin Dashboard.

5) Understood the difference between authentication (verifying user identity) and authorization (controlling access to features).

This week strengthened the foundation for secure access. Learning middleware and access control ensured the platform is both structured and safe.

**Screenshot of Login /Signup Authentication page frontend .** 

<img width="1455" height="759" alt="Image" src="https://github.com/user-attachments/assets/36344de2-42b4-44d5-89f3-d48d890896cf" />

## Week 5 

1) Implemented content quality management for community posts.

2) Built a user rating and feedback system where agents can upvote/downvote answers.

3) Added admin workflows: questions submitted by agents (with title, scheme name, description) now require admin approval before appearing on the knowledge base.

4) Designed a community-driven interaction system with nested comments and voting on both posts and comments.

5) Researched more for Free multilingual APIs like Bhashini and Sarvam AI for Multilingual Support: Support for multiple languages, including Hindi and other regional languages and Language detection and translation services.

This week was about enabling community moderation and interaction. Quality control via admin approval and user feedback is a major step toward ensuring reliable knowledge growth.

**Screenshot of Admin verification workflow**

<img width="1455" height="759" alt="Image" src="https://github.com/user-attachments/assets/554f1ac5-3966-40a8-87c0-fd4ef2f8f88d" />
