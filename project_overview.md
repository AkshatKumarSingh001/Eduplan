# Smart Education Planner & Study Tool - Project Overview

## 1. Problem Statement
Students struggle with cluttered workspaces and information overload, leading to study paralysis and inefficient learning.

## 2. Solution
An AI-powered, unified dashboard that organizes study plans and content into a visual, interactive knowledge map, reducing cognitive load and tracking progress effectively.

## 3. Core Architecture: The "Set" (Node)
The fundamental unit of the application is a **Set**.
- **Definition**: A "Set" combines the **AI Planner** and **Content Finder** into a single entity.
- **Visualization**: Each Set is represented as a **Node** in a knowledge graph (similar to Obsidian).
- **Interaction**:
    - Users can click a Node to open it.
    - Inside, they access the specific Study Plan and related Content for that topic.
    - Content is editable and dynamic.

## 4. Key Features

### A. The Dashboard
A clean interface featuring three primary navigation icons at the top:
1.  **AI Powered Planner** (Integrated into Map/Sets)
2.  **Content Finder** (Integrated into Map/Sets)
3.  **Progress Tracking**

### B. Interactive Knowledge Map
- **Visual Style**: 3D/2D Force-Directed Graph (Reference: Obsidian).
- **Functionality**:
    - Visualizes connections between different "Sets" (Topics).
    - Allows navigation through the curriculum via nodes.

### C. Progress Tracking
- **Visuals**: Various graphs and charts.
- **Analysis**: **Knowledge Gap Analysis** to identify weak areas.

### D. Headline Space (Context Sidebar)
- **Location**: Situated beside the Map feature.
- **Function**: Displays related content and headlines from previously covered topics to reinforce learning and show connections.

## 5. User Experience (UX) Goals
- **Minimalist & Focused**: Reduce clutter.
- **Visual & Spatial**: Use the map to create a mental model of the curriculum.
- **AI-Driven**: Automate planning and content discovery.
