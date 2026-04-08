# 🤖 Amkyaw AI - Local Intent-Routing Chatbot

<p align="center">
  <img src="https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge&logo=version">
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge">
  <img src="https://img.shields.io/badge/100%20Client--Side-orange?style=for-the-badge">
</p>

> 🧠 100% Client-Side AI Chatbot with Intent Routing - No API Required

## 📋 Overview

**Amkyaw AI** is a rule-based expert system that identifies user intent from input keywords, routes queries to specific CSV files, and retrieves corresponding answers. Built entirely with vanilla JavaScript - no external LLM API needed!

## ✨ Features

- 🔍 **Intent-Based Routing** - Automatically detects user intent using keyword matching
- 📊 **Local CSV Database** - All data stored locally in CSV files
- 🎬 **Typewriter Effect** - ChatGPT-like streaming response animation
- 🎨 **Professional Design** - Modern, responsive UI with Tailwind CSS
- 📱 **Mobile Responsive** - Works on all device sizes
- ⚡ **Fast Performance** - Zero server dependency, instant responses
- 🛡️ **Privacy First** - All data stays on your device

## 🏗️ Project Structure

```
amkyaw-ai-web/
├── index.html          # Entry Layer - UI Skeleton
├── style.css          # Visual Layer - Custom Styles
├── data/chat/          # Local Knowledge Base
│   ├── chat.csv       # General conversations
│   ├── coder.csv      # Programming Q&A
│   ├── website.csv    # Web Development
│   ├── contact.csv    # Contact information
│   └── fallback.csv   # No-match responses
└── js/                 # Logic Layer
    ├── config.js      # Configuration & Keywords
    ├── intent-router.js  # Intent Classifier
    ├── database.js    # CSV Engine
    ├── ui-manager.js  # Renderer with Streaming
    └── main.js        # Orchestrator
```

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/amkyawdev/amkyaw-ai-web.git
cd amkyaw-ai-web
```

### 2. Open in browser
Simply open `index.html` in your browser, or use a local server:

```bash
# Python
python3 -m http.server 8080

# Node.js
npx serve
```

Then visit: `http://localhost:8080`

## 📖 How It Works

### Data Flow
```
1. User: "How do I contact you?"
2. Intent Router: Detects "contact" keyword → Selects contact.csv
3. Database: Fetches contact.csv → Finds matching user row
4. Logic: Returns the assistant response
5. UI: Renders text with typewriter animation
```

### Intent Mapping
| Intent | Keywords | CSV File |
|--------|----------|----------|
| Coding | python, javascript, code, programming | coder.csv |
| Web | website, web, frontend, backend | website.csv |
| Contact | contact, email, phone, ဆက်သွယ် | contact.csv |
| Chat | hello, hi, မင်္ဂလာပါ | chat.csv |
| Default | (no match) | fallback.csv |

## 🎨 Design Highlights

- **Gradient Header** - Purple/Blue gradient accent
- **Chat Bubbles** - Rounded corners with shadows
- **Typing Indicator** - Animated dots while "thinking"
- **Smooth Transitions** - Fade-in animations
- **Mobile Friendly** - Responsive layout

## 🛠️ Customization

### Adding New Intents
Edit `js/config.js`:

```javascript
intents: {
    mynewintent: {
        csv: 'mynew.csv',
        keywords: ['keyword1', 'keyword2']
    }
}
```

### Adding Q&A Pairs
Edit the CSV files in `data/chat/`:

```csv
role,content
user,Your question here
assistant,Your answer here
```

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/amkyawdev">Amkyaw Dev</a>
</p>