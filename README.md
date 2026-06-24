# 🧠 PlacePrep AI

> **Your AI-powered placement preparation platform** — personalized mock interviews, practice questions, code challenges, concept explanations, resume reviews, and study roadmaps tailored to your target role.

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_Now-00D4AA?style=for-the-badge)](https://dist-amber-eight-30.vercel.app)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Claude API](https://img.shields.io/badge/Claude_API-Anthropic-D97757?style=flat-square)](https://www.anthropic.com)

---

![PlacePrep AI Banner](https://img.shields.io/badge/PlacePrep_AI-Ace_Your_Next_Interview-0A0E1A?style=for-the-badge&labelColor=0A0E1A&color=00D4AA)

## ✨ Features

### 🎯 Role-Based Personalization
Choose from **16+ career roles** across three categories — every feature adapts to your target position:

| ML & AI | Software & Tech | Business & Strategy |
|---------|----------------|-------------------|
| ✨ AI Engineer | 🔧 SDE — Backend | 💡 Product Manager |
| 🤖 ML Engineer | ⚛️ SDE — Frontend | 📊 Business Analyst |
| 📊 Data Scientist | 🌐 SDE — Full Stack | 🏢 Management Consultant |
| 🧠 Deep Learning Engineer | ☁️ DevOps Engineer | ✍️ Technical Writer |
| 💬 NLP Engineer | 📱 Mobile Developer | |
| 👁 Computer Vision Engineer | 🔒 Cybersecurity Analyst | |
| 🚀 MLOps Engineer | | |
| 📈 Data Analyst | | |

### 🎙 Mock Interview Simulator
- Realistic AI interviewer simulating **company-specific** rounds (Google, Amazon, OpenAI, etc.)
- Choose interview round type (Coding, Theory, System Design, HR, etc.)
- **Real-time feedback** after each answer (✓ Good / ⚠ Incomplete / ✗ Incorrect)
- Comprehensive performance summary with score and improvement areas

### ⚡ Practice Questions
- AI-generated questions from **13+ topic areas** with role-relevant recommendations (★)
- Filter by **difficulty** (Easy / Medium / Hard) and **type** (Conceptual / Mathematical / Code-based / Scenario)
- Submit answers and get detailed AI evaluation with scoring

### 💻 Code Challenges
- Hands-on coding problems matched to your role's tech stack
- Split-pane interface: challenge description + code editor
- AI-powered **code review** analyzing correctness, style, efficiency, and edge cases

### 🧠 Concept Explainer
- Instant breakdowns of any concept at three depth levels:
  - 🧒 **5-year-old** — simple analogies
  - 🎯 **Interview-ready** — technical depth with code
  - 🔬 **Research-level** — mathematical rigor
- One-click access to **must-know concepts** for your role
- Follow-up questions with conversation context

### 📄 Resume Review
- Paste your resume and get AI analysis tailored to your target role
- Scoring, strengths, gaps, missing keywords, and **bullet point rewrites**
- Identifies which projects to highlight and how to improve descriptions

### 🗺 Study Roadmap
- **10-week personalized study plan** based on your current level
- Weekly themes, specific topics, tools, practice resources, and project ideas
- Levels: Beginner → Intermediate → Advanced → Career Switcher

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 with Hooks |
| **Build Tool** | Vite 6 |
| **Styling** | Vanilla CSS with custom design system |
| **AI Backend** | Anthropic Claude API (claude-sonnet-4-20250514) |
| **Deployment** | Vercel |
| **Fonts** | Inter + JetBrains Mono (Google Fonts) |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+ installed
- An [Anthropic API key](https://console.anthropic.com/) (for AI features)

### Installation

```bash
# Clone the repository
git clone https://github.com/atharvanasare16-web/PlacePrepAi.git
cd PlacePrepAi

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be running at `http://localhost:5173`

### Configuration

1. Open the app in your browser
2. Select your target role
3. Click **🔑 API Key** at the bottom of the sidebar
4. Paste your Anthropic API key (`sk-ant-...`)
5. Start using any AI-powered feature!

> 💡 Your API key is stored in `localStorage` — it never leaves your browser except for direct API calls to Anthropic.

### Build for Production

```bash
npm run build    # Outputs to ./dist
npm run preview  # Preview the production build
```

---

## 📁 Project Structure

```
PlacePrepAi/
├── index.html                  # Entry HTML with SEO meta tags
├── vite.config.js              # Vite configuration
├── package.json                # Dependencies & scripts
│
└── src/
    ├── main.jsx                # React entry point
    ├── App.jsx                 # Root component with routing
    ├── index.css               # Complete design system (880+ lines)
    │
    ├── components/
    │   ├── RoleSelector.jsx    # Landing page — role selection grid
    │   ├── Sidebar.jsx         # Navigation rail + API key input
    │   ├── RoleHub.jsx         # Personalized dashboard
    │   ├── MockInterview.jsx   # Chat-based interview simulator
    │   ├── PracticeQuestions.jsx # Question generator + evaluator
    │   ├── CodeChallenges.jsx  # Coding problems + code review
    │   ├── ConceptExplainer.jsx # Concept breakdown tool
    │   ├── ResumeReview.jsx    # Resume analysis
    │   ├── StudyRoadmap.jsx    # 10-week plan generator
    │   └── ui/                 # Reusable UI primitives
    │       ├── Badge.jsx
    │       ├── Button.jsx
    │       ├── Card.jsx
    │       ├── ChatBubble.jsx
    │       ├── EmptyState.jsx
    │       ├── Skeleton.jsx
    │       └── TopicGrid.jsx
    │
    ├── data/
    │   ├── colors.js           # Color palette constants
    │   ├── roles.js            # 16 role profiles with topics & companies
    │   └── topics.js           # 30+ topic definitions
    │
    ├── hooks/
    │   └── useLocalStorage.js  # Persistent state hook
    │
    └── services/
        └── ai.js               # Anthropic Claude API client
```

---

## 🎨 Design System

PlacePrep AI features a **premium dark-themed design** built from scratch:

- **Color Palette** — Carefully curated dark mode with `#0A0E1A` base and `#00D4AA` accent
- **Glassmorphism** — Frosted-glass card variants with backdrop blur
- **Micro-animations** — Fade-ins, slide transitions, skeleton loaders, and typing indicators
- **Custom Scrollbars** — Styled for both Webkit and Firefox
- **Responsive Components** — Cards, badges, chips, buttons, inputs, modals, progress bars, and tooltips
- **Typography** — Inter for UI, JetBrains Mono for code blocks

---

## 🌐 Live Demo

**👉 [https://dist-amber-eight-30.vercel.app](https://dist-amber-eight-30.vercel.app)**

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

<div align="center">
  <br />
  <strong>Built with ❤️ for placement prep</strong>
  <br />
  <sub>Powered by React, Vite & Claude AI</sub>
</div>
