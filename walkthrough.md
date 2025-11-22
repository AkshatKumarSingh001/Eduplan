# Smart Education Planner - Walkthrough

## Overview
This project is an AI-powered study tool designed to reduce information overload. It features a 3D knowledge graph ("Sets"), a unified dashboard, and intelligent progress tracking.

## Features Implemented

### 1. Interactive Knowledge Map (The "Sets")
- **Visual**: A 3D Force-Directed Graph representing study topics as nodes.
- **Interaction**: Click on any node to open its "Set Detail View".
- **Tech**: `react-force-graph-3d`.

### 2. Set Detail View (Planner + Content)
- **Combined Interface**: When a node is clicked, a panel opens showing:
    - **AI Study Plan**: A checklist of tasks for that topic.
    - **Content Finder**: An editable area for study materials and notes.
- **Goal**: Keeps planning and content in one context.

### 3. Headline Sidebar
- **Context**: A sidebar on the left of the map showing related news and headlines.
- **Purpose**: Connects current study topics with broader context.

### 4. Progress Tracking & Gap Analysis
- **Visual**: A Scatter Plot showing **Proficiency vs. Time Spent**.
- **Analysis**: Automatically identifies "Lagging" topics (High Time / Low Proficiency).
- **Recommendations**: AI-driven suggestions based on the graph data.
- **Tech**: `recharts`.

## How to Run

Prerequisites: **Node.js** must be installed.

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
    *(This will install React, Vite, Three.js, Recharts, and Lucide icons)*

2.  **Start Development Server**:
    ```bash
    npm run dev
    ```

3.  **Open in Browser**:
    Click the link provided in the terminal (usually `http://localhost:5173`).

## Project Structure
- `src/components/GraphView.jsx`: The 3D Map component.
- `src/components/SetDetailView.jsx`: The slide-over panel for node details.
- `src/components/ProgressView.jsx`: The analytics dashboard.
- `src/components/HeadlineSidebar.jsx`: The related content sidebar.
- `src/App.jsx`: Main layout and state management.

## Troubleshooting

### "npm : The term 'npm' is not recognized..."
If you see this error, it means **Node.js is not installed** or not added to your system's PATH.

1.  **Download Node.js**: Go to [nodejs.org](https://nodejs.org/) and download the **LTS** version.
2.  **Install**: Run the installer. Ensure the option **"Add to PATH"** is checked during installation.
3.  **Restart VS Code**: This is critical. After installing, close VS Code completely and reopen it for the new PATH to take effect.
4.  **Verify**: Open the terminal and run `node --version`. If it shows a version number, you are ready to run `npm install`.

### How to "Add to PATH"

**Option 1: Re-run the Installer (Recommended)**
1.  Run the Node.js installer again.
2.  When you reach the "Custom Setup" screen, look for a tree of features.
3.  Ensure **"Add to PATH"** is selected (it usually is by default).
4.  Finish the installation.

**Option 2: Manually (If you already installed it)**
1.  Press `Windows Key` and search for **"Edit the system environment variables"**.
2.  Click **"Environment Variables"** at the bottom right.
3.  Under **"System variables"** (the bottom list), find the variable named **`Path`** and select **Edit**.
4.  Click **New** and paste the path to your Node.js installation (usually `C:\Program Files\nodejs\`).
5.  Click OK on all windows.
6.  **Restart VS Code** for changes to apply.
