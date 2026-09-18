# Task Board (Frontend)

A React-based Jira-style task management application. Tasks are organized into columns and can be created, edited, deleted, favorited, and moved between columns (via drag-and-drop or a dropdown selector).

<img width="1830" height="916" alt="Task Board Assessment" src="https://github.com/user-attachments/assets/720b8b94-45ff-406d-a52f-60353757a7ee" />


## Tech Stack

- [React 18](https://react.dev/)
- [React Router v6](https://reactrouter.com/)
- [Material-UI (MUI) v5](https://mui.com/)
- [Create React App](https://create-react-app.dev/) (`react-scripts`)
- [Testing Library](https://testing-library.com/) + Jest

## Prerequisites

- Node.js and npm
- A running backend API (see [Configuration](#configuration))

## Getting Started

Install dependencies:

```bash
yarn install
```

Start the development server:

```bash
yarn start
```

The app runs at [http://localhost:3000](http://localhost:3000).

## Configuration

This frontend expects a backend REST API, configured via the `REACT_APP_API_BASE` environment variable. It defaults to:

```
http://localhost:5000/api
```

To point at a different backend, create a `.env` file in this directory:

```
REACT_APP_API_BASE=http://localhost:5000/api
```

## Available Scripts

- `yarn start` — Runs the app in development mode.
- `yarn test` — Runs the test suite in watch mode.
- `yarn run build` — Builds the app for production to the `build` folder.
- `yarn run eject` — Ejects the Create React App configuration (irreversible).

## Project Structure

```
src/
├── api/
│   └── taskApi.js        # Fetch-based API client (columns & tasks CRUD, move, favorite)
├── components/
│   ├── Board.jsx          # Main board page: loads columns/tasks, manages dialogs & actions
│   ├── Column.jsx         # Renders a single column and its tasks; handles drag-and-drop
│   ├── TaskCard.jsx       # Renders an individual task card; draggable
│   ├── TaskDialog.jsx     # Modal form for creating/editing a task
│   └── TaskDetailPage.jsx # Standalone page for viewing a task's details
├── __tests__/             # Component tests
├── App.js                 # App routing
└── index.js                # Entry point
```

## Features

- View tasks organized into columns (Kanban board)
- Create, edit, and delete tasks
- Mark tasks as favorites
- Move tasks between columns via drag-and-drop or a dropdown selector
- View task details on a dedicated page

## Testing

Run the test suite:

```bash
yarn test
```

<img width="389" height="139" alt="image" src="https://github.com/user-attachments/assets/3e469596-cd4d-46a1-8f59-0ec3eef6fbf1" />

