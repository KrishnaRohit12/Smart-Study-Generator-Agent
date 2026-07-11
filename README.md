<div align="center">

# 🧠 Smart Study Generator Agent

**An AI-powered academic companion built on IBM Granite 3.3 & watsonx.ai**

[![IBM University Engagement](https://img.shields.io/badge/IBM-University%20Engagement-0f62fe?style=flat-square&logo=ibm&logoColor=white)](https://www.ibm.com/academic)
[![Powered by IBM Granite](https://img.shields.io/badge/Powered%20by-IBM%20Granite%203.3-6929c4?style=flat-square&logo=ibm&logoColor=white)](https://www.ibm.com/watsonx)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

<br />

> Transform raw lecture notes into crisp summaries, adaptive quizzes, flashcard decks,  
> and personalised study plans — all powered by **IBM Granite 3.3** on **watsonx.ai**.

<br />

![Smart Study Generator Hero](https://via.placeholder.com/860x420/040c1c/78a9ff?text=Smart+Study+Generator+Agent)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Pages & Modules](#-pages--modules)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [How It Works](#-how-it-works)
- [IBM Granite Integration](#-ibm-granite-integration)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**Smart Study Generator Agent** is a full-featured, front-end web application developed as part of the **IBM University Engagement** programme. It bridges the gap between raw academic material and effective exam preparation by leveraging the power of **IBM Granite 3.3** — IBM's enterprise-grade large language model hosted on **watsonx.ai**.

Students can upload their lecture notes (PDF, DOCX, TXT, or images), then instantly receive:

- **AI-generated summaries** that distill key concepts
- **Adaptive quizzes** tailored to the uploaded material
- **Interactive flashcard decks** for spaced repetition
- **Personalised study plans** with day-by-day schedules
- **Contextual AI chat** to ask questions about their notes
- **A progress dashboard** to track learning over time

---

## ✨ Features

| Feature | Description |
|---|---|
| 📄 **Note Upload** | Drag-and-drop PDF, DOCX, TXT, JPEG, PNG, WEBP (up to 20 MB each) |
| 🤖 **AI Chat** | Ask contextual questions grounded in your uploaded notes |
| ❓ **Quiz Generator** | Auto-generate MCQ and short-answer quizzes with instant feedback |
| 🃏 **Flashcard Deck** | Flip-card decks with keyboard navigation for spaced repetition |
| 📅 **Study Planner** | Week-by-week personalised study schedules |
| 📊 **Dashboard** | Visual progress tracking, streaks, and performance metrics |
| 🌗 **Dark / Light Mode** | Persistent theme preference stored in `localStorage` |
| 📱 **Fully Responsive** | Optimised for desktop, tablet, and mobile |
| ♿ **Accessible** | Semantic HTML, ARIA labels, keyboard navigation, reduced-motion support |

---

## 🗂 Pages & Modules

| Page | Path | Description |
|---|---|---|
| **Landing** | `index.html` | Hero, feature overview, how-it-works, IBM Granite spotlight |
| **Upload Notes** | `pages/upload.html` | File drop zone with validation, progress bar, and queue management |
| **AI Chat** | `pages/chat.html` | Conversational interface grounded in uploaded notes |
| **Quiz** | `pages/quiz.html` | Timed adaptive quizzes generated from study material |
| **Flashcards** | `pages/flashcards.html` | Interactive flip-card deck with keyboard shortcuts |
| **Study Planner** | `pages/planner.html` | Drag-and-rearrange weekly study planner |
| **Dashboard** | `pages/dashboard.html` | Analytics — scores, streaks, time studied, topic coverage |
| **About** | `pages/about.html` | Project background, team, and IBM Granite details |
| **Contact** | `pages/contact.html` | Contact form and project links |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Markup** | HTML5 with semantic elements & ARIA |
| **Styling** | Vanilla CSS3 — custom properties, CSS Grid, Flexbox, animations |
| **Logic** | Vanilla JavaScript (ES6+, strict mode, no build step required) |
| **Icons** | [Font Awesome 6.5](https://fontawesome.com/) via CDN |
| **AI Model** | [IBM Granite 3.3](https://www.ibm.com/granite) on [watsonx.ai](https://www.ibm.com/watsonx) |
| **Storage** | Browser `localStorage` for theme and session preferences |

> **Zero dependencies.** No npm, no bundler, no framework — open `index.html` and go.

---

## 📁 Project Structure

```
IBM_Study_Generator/
├── index.html              # Landing page
├── style.css               # Root stylesheet (legacy)
├── script.js               # Root script (legacy)
│
├── css/
│   ├── variables.css       # Design tokens (colours, spacing, radii)
│   ├── global.css          # Base resets, nav, buttons, layout helpers
│   ├── reset.css           # Normalisation layer
│   ├── landing.css         # Landing page styles
│   ├── chat.css            # AI Chat interface styles
│   ├── upload.css          # Upload zone & queue styles
│   └── planner.css         # Study planner calendar styles
│
├── js/
│   ├── app.js              # Shared module — nav, theme, scroll-reveal, counters, toasts
│   ├── chat.js             # AI Chat — message thread, typing indicator, export
│   ├── upload.js           # File validation, progress, queue management
│   ├── landing.js          # Landing page interactions
│   └── planner.js          # Study planner drag-and-arrange logic
│
├── pages/
│   ├── upload.html         # Upload Notes
│   ├── chat.html           # AI Chat
│   ├── quiz.html           # Quiz Generator
│   ├── flashcards.html     # Flashcard Deck
│   ├── planner.html        # Study Planner
│   ├── dashboard.html      # Progress Dashboard
│   ├── about.html          # About the project
│   └── contact.html        # Contact
│
└── assets/                 # Images, icons, and static media
```

---

## 🚀 Getting Started

No installation or build step is required — this is a **pure front-end project**.

### Run locally

```bash
# Clone the repository
git clone https://github.com/<your-username>/IBM_Study_Generator.git

# Open in your browser
cd IBM_Study_Generator
open index.html          # macOS
start index.html         # Windows
xdg-open index.html      # Linux
```

Or serve with any static file server for the best experience:

```bash
# Using Python
python -m http.server 8080

# Using Node.js (npx)
npx serve .

# Using VS Code
# Install the "Live Server" extension, then click "Go Live"
```

Then visit **http://localhost:8080** in your browser.

---

## ⚙️ How It Works

```
┌──────────────┐    ┌─────────────────┐    ┌──────────────────────┐
│  Upload Notes │───▶│  IBM Granite AI  │───▶│  Study Materials     │
│  (PDF / DOCX) │    │  (watsonx.ai)    │    │  ┌─ Summary          │
└──────────────┘    └─────────────────┘    │  ├─ Quiz             │
                                            │  ├─ Flashcards       │
                                            │  ├─ Study Plan       │
                                            │  └─ AI Chat Context  │
                                            └──────────────────────┘
```

1. **Upload** — Drop one or more notes files into the upload zone. The client validates format and size (max 20 MB per file).
2. **Process** — IBM Granite 3.3 indexes the content, extracting key concepts, formulae, and relationships.
3. **Study** — Navigate to any module. Every feature is grounded in the documents you uploaded.
4. **Track** — The dashboard records your quiz scores, time studied, and topic coverage over time.

---

## 🔷 IBM Granite Integration

This project is powered by **IBM Granite 3.3**, IBM's enterprise-ready LLM available on [watsonx.ai](https://www.ibm.com/watsonx).

| Capability | How it's used |
|---|---|
| **Text Summarisation** | Condenses uploaded notes into bullet-point concept maps |
| **Question Generation** | Creates MCQ and short-answer quizzes calibrated to difficulty |
| **Flashcard Authoring** | Produces Q&A pairs optimised for spaced repetition |
| **Study Plan Generation** | Builds day-by-day schedules based on content volume and exam date |
| **Contextual Q&A** | Answers student questions grounded strictly in uploaded documents |

> The current version ships with **simulated Granite responses** for front-end demonstration.  
> To connect to a live watsonx.ai endpoint, replace the `AI_RESPONSES` object in [`js/chat.js`](js/chat.js) with your watsonx.ai REST API calls.

---

## 📸 Screenshots

| Landing Page | AI Chat | Upload Notes |
|:---:|:---:|:---:|
|<img width="1336" height="634" alt="image" src="https://github.com/user-attachments/assets/42688dde-bd5d-4295-8671-17eaecb9765b" />|
|<img width="1364" height="642" alt="image" src="https://github.com/user-attachments/assets/f6d15607-7fbf-412d-adc3-98e824eba927" />|
|<img width="1347" height="635" alt="image" src="https://github.com/user-attachments/assets/28573ad0-388e-42b6-b1f6-efe3c1d56f46" />|

| Quiz | Flashcards | Dashboard |
|:---:|:---:|:---:|
|<img width="1345" height="767" alt="image" src="https://github.com/user-attachments/assets/f9609a57-7a76-4971-bc62-af07eed1b986" />|
|<img width="1335" height="767" alt="image" src="https://github.com/user-attachments/assets/9e34b172-4e62-4723-930e-5927a02dfc7b" />|
|<img width="1331" height="630" alt="image" src="https://github.com/user-attachments/assets/621cdd63-b358-4a7e-bcc3-5858b7d1af14" />|

---

##  Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature-name`
3. **Commit** your changes: `git commit -m "feat: add your feature"`
4. **Push** the branch: `git push origin feature/your-feature-name`
5. **Open** a Pull Request

Please follow the existing code style — vanilla JS in strict mode, BEM-style CSS class names, and semantic HTML with ARIA attributes.

---


<div align="center">
 
Powered by [IBM Granite 3.3](https://www.ibm.com/granite) on [watsonx.ai](https://www.ibm.com/watsonx)

</div>
