<div align="center">

# 🌌 Galaxy AI Workflow

**A powerful, node-based visual workflow builder with AI integration and background task processing.**

[![Live Deployment](https://img.shields.io/badge/Live-Deployment-success?style=for-the-badge&logo=vercel)](https://galaxy-ai-assessment-theta.vercel.app/workflow)
[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Express.js-Backend-black?style=for-the-badge&logo=express)](https://expressjs.com/)
[![React Flow](https://img.shields.io/badge/React_Flow-UI-ff0073?style=for-the-badge&logo=react)](https://reactflow.dev/)
[![Trigger.dev](https://img.shields.io/badge/Trigger.dev-Background_Jobs-blueviolet?style=for-the-badge)](https://trigger.dev/)

</div>

---

## ✨ Features

- **Interactive Node-based UI**: Build complex workflows visually using a drag-and-drop interface powered by React Flow (`@xyflow/react`).
- **Comprehensive Authentication**: Secure user management and authentication handled seamlessly by **Clerk**.
- **AI-Powered Nodes**: Generate and process content dynamically using `@google/generative-ai`.
- **Robust Background Processing**: Reliable and scalable background task execution using **Trigger.dev**.
- **Media Processing**: Integrated video and media processing capabilities using `fluent-ffmpeg` and `transloadit`.
- **Modern State Management**: Robust state handling on the frontend utilizing both **Zustand** (with `zundo` for undo/redo) and **Redux Toolkit**.

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI & Styling**: React 19, Tailwind CSS v4, Lucide React
- **Flow Builder**: `@xyflow/react`
- **State Management**: Zustand, Redux Toolkit
- **Authentication**: Clerk

### Backend
- **Server**: Node.js, Express.js
- **Database**: Prisma ORM
- **Background Jobs**: Trigger.dev SDK
- **AI Integration**: Google Generative AI
- **Media & Utils**: FFmpeg, Zod (Validation), CORS

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v20+ recommended)
- `npm` or `pnpm`

### Installation

1. **Clone the repository** (if applicable) and open the directory.
2. **Install Frontend Dependencies**:
   ```bash
   cd frontend
   npm install
   ```
3. **Install Backend Dependencies**:
   ```bash
   cd ../backend
   npm install
   ```

### Environment Setup

You will need to set up environment variables for both the frontend and backend.

- Create a `.env.local` file in the `frontend/` directory (refer to `.env.local.example` if available).
- Create a `.env` file in the `backend/` directory.

> **Note:** You will require keys for Clerk, Prisma (Database URL), Trigger.dev, and Google Gemini.

### Running the Application Local

1. **Start the Backend server**:
   ```bash
   cd backend
   npm run dev
   ```
   *(Ensure you have also generated the Prisma client using `npm run db:generate` and applied migrations `npm run db:migrate`)*

2. **Start the Frontend development server**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the application**: Open [http://localhost:3000](http://localhost:3000) in your browser.

---

<div align="center">
  <p>Built as part of an assessment to showcase dynamic workflow orchestration, modern web technologies, and seamless user experiences.</p>
</div>
