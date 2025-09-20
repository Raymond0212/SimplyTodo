# SimplyTodo Extension Documentation

## Overview

SimplyTodo is a Visual Studio Code extension that provides a simple task management system directly within the editor. It allows users to create, organize, and track tasks in a hierarchical structure.

## Core Components

### 1. Extension Entry Point (`extension.ts`)

- Main activation point of the extension
- Manages the task list storage and state
- Registers and handles VSCode commands
- Implements webview panel functionality for task details

### 2. Data Provider (`TodoDataProvider.ts`)

- Implements VSCode's `TreeDataProvider` interface
- Manages the tree view data structure
- Handles task data refresh and updates
- Provides data for the VSCode tree view

### 3. Task Model (`Task.ts`)

- Defines the core Task interface:
  - `id`: Unique identifier
  - `title`: Task name
  - `content`: Optional task description
  - `tags`: Optional array of tags
  - `children`: Array of subtasks
  - `status`: Task completion status
- Implements `NewTask` class for task creation

### 4. UI Components (`ui/getWebviewContent.ts`)

- Generates HTML content for task detail views
- Implements webview panel UI
- Handles task editing interface
- Manages content security with nonce

### 5. Utility Functions

- `getNonce.ts`: Generates security nonces for webview content
- `getUri.ts`: Manages URI creation for webview resources

## Extension Features

1. Task Management:

   - Create base tasks
   - Create subtasks
   - Delete tasks
   - View task details
   - Edit task properties

2. User Interface:

   - Tree view for task hierarchy
   - Webview panel for task details
   - Task completion status indicators
   - Inline task actions

3. Data Persistence:
   - Tasks stored in VSCode's global state
   - Automatic saving of task updates
   - Persistent task hierarchy

## Technical Details

1. Commands:

   - `simplytodo.createBaseTask`: Create a top-level task
   - `simplytodo.createTask`: Create a subtask
   - `simplytodo.showTaskDetailView`: Open task details
   - `simplytodo.deleteTask`: Remove a task

2. Views:
   - Task tree view in activity bar
   - Task detail webview panel
   - Welcome view with task creation shortcut

## Project Structure

```
src/
├── extension.ts           # Main extension file
├── providers/
│   └── TodoDataProvider.ts  # Tree view data provider
├── types/
│   └── Task.ts           # Task type definitions
├── ui/
│   └── getWebviewContent.ts # Webview UI generator
└── utilities/
    ├── getNonce.ts       # Security utility
    └── getUri.ts         # URI management utility
```

## Development Notes

- Built using TypeScript
- Uses VSCode's Extension API
- Implements Tree View and Webview APIs
- Follows VSCode's security best practices
- Supports hierarchical task organization
