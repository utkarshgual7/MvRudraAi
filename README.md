# 💬 Software Support Chatbot

A professional AI-powered chatbot built with **React**, **Tailwind CSS**, and **OpenAI GPT-4**, designed to provide intelligent software support to users in real time.

---

## ✨ Features

- 🔗 Integrates OpenAI GPT-4 for natural, human-like conversations
- ⚡ Instant response with typing indicator
- 🧠 Handles technical/software queries intelligently
- 🎨 Styled with Tailwind CSS for clean and responsive UI
- 🔐 Backend proxy for secure API key handling

---

## 🛠 Tech Stack

| Frontend | Backend | AI Engine |
|----------|---------|-----------|
| React    | Node.js (Express) | OpenAI GPT-4 |
| Tailwind CSS | CORS & .env | Chat Completion API |

---

## 🖼️ Architecture Overview

```mermaid
graph TD
    A[User Interface (React + Tailwind)] --> B[Backend API (Express)]
    B --> C[OpenAI GPT-4 API]
    C --> B
    B --> A
