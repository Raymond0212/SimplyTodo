# SimplyTodo Extension - AI Agent Guide

## Purpose of this Document

This document serves as a comprehensive guide for AI agents working with the SimplyTodo codebase. Its primary purposes are:

1. **Codebase Navigation**

   - Provide a clear map of the project structure
   - Explain the purpose and relationships between components
   - Help locate relevant files for specific todos

2. **Development Guidelines**

   - Establish consistent patterns for code modifications
   - Define best practices for feature implementation
   - Ensure security and data integrity standards

3. **System Understanding**

   - Document core architecture and data flows
   - Explain key technical decisions and their rationale
   - Highlight important interfaces and dependencies

4. **Quality Assurance**
   - Guide testing requirements and procedures
   - Define error handling expectations
   - Maintain consistency in code changes

AI agents should use this document to:

- Understand the system before making changes
- Follow established patterns and practices
- Maintain code quality and consistency
- Make informed technical decisions

## Project Overview

SimplyTodo is a Visual Studio Code extension that provides todo management capabilities directly within the editor. It enables users to create, organize, and track todos in a hierarchical structure with a clean, intuitive interface.

### Key Features

- Hierarchical todo organization with parent-child relationships
- todo metadata support (title, tags)
- Visual todo status tracking through checkboxes
- Rich todo detail editing through webview panels
- Persistent storage using VS Code's global state
- Tree view integration in VS Code's sidebar

## Technical Architecture

### Core Components

1. **Extension Entry Point (`extension.ts`)**

   - Manages the extension lifecycle through `activate()` function
   - Implements core todo management logic:
     - todo creation (base and sub-todos)
     - todo deletion
     - todo state persistence
     - Webview panel handling
   - Registers VS Code commands and manages command contexts
   - Maintains todo data in VS Code's global state using `todoS_STORAGE_KEY`

2. **Types (`/types` Directory)**

   - Core data structures and type definitions for the extension
   - Key files:
     - Implements interfaces for todo structure and metadata
     - Provides factory class for todo instantiation
   - Primary responsibilities:
     - Type safety for todo-related operations
     - Data model consistency across the extension
     - todo creation and hierarchy management

3. **Providers (`/providers` Directory)**

   - View integration and data management components
   - Key files:
   - Primary responsibilities:
     - todo hierarchy visualization
     - VSCode view state management
     - Data synchronization between model and view
     - Event handling for tree updates

4. **Utilities (`/utilities` Directory)**
   - Shared helper functions and utilities
   - Key files:
     - `getUri.ts`: URI management for webview resources
     - `getNonce.ts`: Security token generation
   - Primary responsibilities:
     - Resource path resolution
     - Security implementation
     - Cross-component utility functions
     - Common helper functionality

## Development Guidelines

### Command Registration

When adding new commands:

1. Define command in `package.json` under `contributes.commands`
2. Register command handler in `extension.ts`
3. Update menu contributions if needed

### UI Updates

- Use `todoDataProvider.refresh()` after any todo array modifications
- Ensure webview panel state is properly managed (creation/disposal)
- Follow VS Code's webview security best practices

### State Management

- Always update global state after todo modifications
- Use proper type guards when handling todo data
- Maintain todo tree integrity during operations

### Error Handling

- Validate todo existence before operations
- Handle webview panel lifecycle events
- Provide user feedback for failures

## Project Structure

```
src/
├── extension.ts               # Extension entry point and core logic
├── providers/
│   └── TodoDataProvider.ts   # Tree view data management
├── types/
│   └── Todo.ts              # Core data structures
└── utilities/
    ├── getNonce.ts          # Security utilities
    └── getUri.ts           # Resource path management
```
