# 🎓 EduPlan AI - Intelligent Educational Planning Platform

<div align="center">

![EduPlan AI](https://img.shields.io/badge/AI-Powered-blue?style=for-the-badge)
![Google Gemini](https://img.shields.io/badge/Google-Gemini%202.0-orange?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js)

**Transform scattered study materials into an intelligent, interconnected knowledge ecosystem**

[🚀 Live Demo](https://eduplan-ai-sable.vercel.app) | [📖 Documentation](#)

*Developed for Delhi NCR Buildathon by Team Elite-Brains*

</div>

---

## 👥 Team Elite-Brains

| Name | Role | GitHub |
|------|------|--------|
| **Akshat Kumar Singh** | Full-Stack Developer & AI Integration | [@AkshatKumarSingh001](https://github.com/AkshatKumarSingh001) |
| **Anshuman Singh** | Backend Developer | |
| **Harshil Srivastava** | Frontend Developer | |

---

## 🎯 Problem Statement

Students today face a critical challenge: **information overload and disorganized learning**. Despite having access to countless educational resources, they struggle with:

- 📚 **Scattered Resources**: PDFs, notes, and materials spread across multiple platforms
- 🔍 **Quality Discovery**: Hours wasted searching for reliable educational content
- 🧩 **Missing Connections**: Unable to see relationships between different topics
- ⏱️ **Time Inefficiency**: 40% of study time spent organizing rather than learning
- 📊 **No Progress Insights**: Lack of data-driven feedback on learning gaps
- 🎯 **Decision Fatigue**: Overwhelmed by choices with no clear learning path

**The Impact**: Students waste valuable time, miss important concept connections, and lack personalized guidance for improvement.

---

## 💡 Our Solution

**EduPlan AI** is an intelligent educational planning platform that uses **Google Gemini 2.0 Flash** and **RAG (Retrieval Augmented Generation)** technology to transform how students organize, discover, and master learning materials.

### 🌟 Core Innovation

We treat education as a **knowledge graph problem** combined with **semantic AI**:
1. **RAG Architecture**: Combines semantic search with AI generation for context-aware answers
2. **Vector Embeddings**: 768-dimensional embeddings enable intelligent content matching
3. **Knowledge Graph**: Visualizes learning as an interconnected network, not isolated topics
4. **Adaptive Learning**: AI analyzes patterns and provides personalized recommendations

---

## ✨ Key Features

### 🧠 **AI-Powered Content Discovery**
- Search the entire internet for curated educational resources
- AI analyzes and recommends content from Khan Academy, MIT OCW, Coursera, YouTube
- Personalized difficulty ratings and quality scores
- Direct links with descriptions and estimated durations

### 📚 **Smart Study Sets**
- Organize materials by subject, grade level, and difficulty
- Upload PDFs, Word docs, and text files
- Automatic document processing and semantic chunking
- Persistent SQLite database for instant access

### 🤖 **RAG-Powered Q&A System**
- Ask questions about uploaded documents in natural language
- AI retrieves relevant context using 768-dim embeddings
- Cosine similarity matching (0.3 threshold) for precision
- Answers include citations to source document sections

### 🗺️ **3D Knowledge Map**
- Interactive force-directed graph visualization
- Color-coded nodes by subject area
- Dynamic relationship detection between topics
- Click-to-explore detailed content

### 📊 **AI Progress Analytics**
- Gap analysis dashboard identifies weak areas
- Scatter plots and charts show mastery levels
- Machine learning-based personalized recommendations
- AI-generated actionable improvement strategies

### 📰 **AI Headlines Generator**
- Automatically extracts key insights from documents
- Gemini-powered summarization
- Quick overview of important concepts

### 🎓 **Interactive Onboarding**
- 2-minute guided tour for new users
- Spotlight effects on key features
- Skip option for experienced users

---

## 🛠️ Tech Stack

### **Frontend**
```
React 18 + Vite 7.2.4
Tailwind CSS
Lucide Icons
Recharts (Data Visualization)
Axios
```

### **Backend**
```
Node.js + Express
SQLite (Vector Storage)
Multer (File Upload)
CORS Middleware
```

### **AI & Machine Learning**
```
Google Gemini 2.0 Flash (Content Generation)
Text-Embedding-004 (768-dim Vectors)
Cosine Similarity Algorithm
RAG Architecture
Semantic Search
```

### **Database Schema**
```sql
- sets (id, name, subject, grade, difficulty, description)
- documents (id, set_id, filename, filepath, file_type)
- chunks (id, document_id, set_id, content, embedding)
- connections (id, source_set_id, target_set_id, strength)
- study_plans (id, set_id, plan_data)
- headlines (id, set_id, title, content, relevance_score)
- study_sessions (id, set_id, duration_minutes, activities)
- quiz_results (id, set_id, score, weak_areas)
- user_interactions (id, set_id, interaction_type, query)
```

### **Deployment**
```
Frontend: Vercel (Auto-deploy from GitHub)
Backend: Render (Node.js Web Service)
Database: SQLite with persistent storage
CI/CD: GitHub Actions
```

---

## 🚀 Installation & Setup

### **Prerequisites**
- Node.js 18+ and npm
- Git
- Google Gemini API Key

### **1. Clone Repository**
```bash
git clone https://github.com/AkshatKumarSingh001/Eduplan.git
cd Eduplan
```

### **2. Backend Setup**
```bash
cd backend
npm install
```

Create `.env` file in backend directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
NODE_ENV=development
```

Start backend server:
```bash
node server.js
```

Server will run on `http://localhost:5000`

### **3. Frontend Setup**
```bash
cd ..  # Return to root
npm install
```

Update `src/services/api.js` if needed:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

Start frontend:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

### **4. Access Application**
Open browser and navigate to: `http://localhost:5173`

---

## 📖 Usage Guide

### **Getting Started**
1. **Sign Up/Login**: Create account or use demo credentials
   - Demo: `demo@eduplan.ai` / `Demo@123`
2. **Complete Tour**: Interactive walkthrough explains all features
3. **Create First Set**: Click Brainstorm → Create Set

### **Creating Study Sets**
1. Navigate to **Brainstorm** section
2. Click **"Create New Set"**
3. Fill in: Name, Subject, Grade, Difficulty, Description
4. Upload documents (PDF, TXT, DOC, DOCX)
5. AI automatically processes and indexes content

### **Using Content Finder**
1. Go to **Content** section
2. Enter your search query (e.g., "Python programming basics")
3. AI searches internet and returns curated resources
4. Click links to access educational materials

### **Asking Questions (RAG)**
1. Create a set and upload documents
2. Go to **Brainstorm** → Select your set
3. Type question in query box
4. AI retrieves relevant content and generates answer with citations

### **Viewing Knowledge Map**
1. Navigate to **Map** section
2. Explore 3D visualization of all study sets
3. Click nodes to view detailed information
4. See connections between related topics

### **Tracking Progress**
1. Go to **Progress** section
2. View gap analysis charts
3. Read AI-generated recommendations
4. Track study sessions and quiz results

---

## 🏗️ Project Structure

```
Eduplan/
├── backend/                    # Node.js Backend
│   ├── config/
│   │   └── database.js        # SQLite configuration
│   ├── routes/
│   │   ├── sets.js           # Study sets CRUD
│   │   ├── documents.js      # Document upload/processing
│   │   ├── rag.js            # RAG query endpoints
│   │   ├── search.js         # Content finder API
│   │   └── progress.js       # Analytics endpoints
│   ├── services/
│   │   ├── ragEngine.js      # RAG implementation
│   │   ├── vectorStore.js    # Embedding storage
│   │   ├── documentProcessor.js
│   │   └── progressAnalytics.js
│   ├── utils/
│   │   ├── geminiClient.js   # Gemini API wrapper
│   │   ├── embeddings.js     # Text embedding generation
│   │   └── promptTemplates.js
│   ├── uploads/              # Uploaded documents
│   ├── database.sqlite       # SQLite database
│   └── server.js            # Express server
│
├── src/                      # React Frontend
│   ├── components/
│   │   ├── GraphView.jsx    # Knowledge Map
│   │   ├── ContentFinder.jsx # Content discovery
│   │   ├── RAGTestUI.jsx    # Brainstorm interface
│   │   ├── ProgressView.jsx # Analytics dashboard
│   │   ├── Tour.jsx         # Onboarding tour
│   │   └── auth/            # Authentication components
│   ├── contexts/
│   │   └── RAGContext.jsx   # Global state management
│   ├── services/
│   │   └── api.js           # API client
│   ├── App.jsx              # Main app component
│   └── main.jsx             # Entry point
│
├── package.json
├── vite.config.js
└── README.md
```

---

## 🔬 Technical Deep Dive

### **RAG Architecture**
```
User Query → Embedding Generation → 
Vector Search (Cosine Similarity) → 
Context Retrieval → Gemini Generation → 
Cited Answer
```

### **Vector Embedding Pipeline**
```
Document Upload → Text Chunking → 
Embedding Generation (768-dim) → 
SQLite Storage → Semantic Search Ready
```

### **AI Features**
- **Semantic Search**: Understands meaning, not just keywords
- **Context-Aware**: Retrieves relevant document sections
- **Citation System**: Links answers to source material
- **Adaptive Learning**: Improves recommendations over time

---

## 🌐 API Endpoints

### **Sets Management**
```
GET    /api/sets           # Get all sets
POST   /api/sets           # Create new set
GET    /api/sets/:id       # Get set details
PUT    /api/sets/:id       # Update set
DELETE /api/sets/:id       # Delete set
```

### **RAG Operations**
```
POST   /api/rag/query              # Ask question
POST   /api/rag/generate-plan/:id  # Generate study plan
GET    /api/rag/connections/:id    # Get knowledge connections
POST   /api/rag/headlines/:id      # Generate headlines
```

### **Content Discovery**
```
POST   /api/search         # Search for educational resources
```

### **Document Management**
```
POST   /api/documents/upload/:setId  # Upload document
GET    /api/documents/set/:setId     # Get set documents
DELETE /api/documents/:id            # Delete document
```

---

## 🎓 Key Learnings & Challenges

### **Challenges Overcome**
1. **Vector Storage**: Implemented efficient SQLite-based vector storage instead of ChromaDB
2. **CORS Issues**: Resolved cross-origin problems for production deployment
3. **Embedding Performance**: Optimized chunking strategy for better semantic search
4. **Real-time Processing**: Asynchronous document processing without blocking UI

### **Technical Achievements**
- Built complete RAG system from scratch
- Integrated Google Gemini 2.0 Flash API
- Designed efficient vector similarity search
- Created interactive 3D knowledge visualization
- Implemented real-time AI analytics

---

## 🚀 Future Enhancements

- [ ] Backend authentication with JWT
- [ ] Password hashing and security improvements
- [ ] Mobile responsive optimization
- [ ] PostgreSQL migration for better scalability
- [ ] Real-time collaboration features
- [ ] Advanced analytics dashboard
- [ ] Voice-based query input
- [ ] Multi-language support
- [ ] Export study plans to PDF
- [ ] Integration with calendar apps

---

## 📄 License

This project is developed for the Delhi NCR Buildathon. All rights reserved by Team Elite-Brains.

---

## 🙏 Acknowledgments

- **Google Gemini Team** - For providing powerful AI capabilities
- **Delhi NCR Buildathon Organizers** - For the opportunity and platform
- **NxtWave & OpenAI Academy** - For mentorship and guidance
- **Open Source Community** - For amazing tools and libraries

---

## 📞 Contact & Support

**Team Elite-Brains**
- GitHub: [@AkshatKumarSingh001](https://github.com/AkshatKumarSingh001)
- Project Repository: [Eduplan](https://github.com/AkshatKumarSingh001/Eduplan)
- Live Demo: [EduPlan AI](https://eduplan-ai-sable.vercel.app)

For issues or questions, please open an issue on GitHub.

---

<div align="center">

**Built with ❤️ by Team Elite-Brains**

*Empowering students through AI-powered education*

</div>
