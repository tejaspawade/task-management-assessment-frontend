import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import Board from "./components/Board";
import TaskDetailPage from "./components/TaskDetailPage";

export default function App() {
  return (
    <>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Board />} />
          <Route path="/tasks/:taskId" element={<TaskDetailPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
