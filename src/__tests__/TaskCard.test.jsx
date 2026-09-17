import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TaskCard from "../components/TaskCard";

const baseTask = {
  id: "task-1",
  name: "Write proposal",
  description: "Draft the Q3 proposal document",
  deadline: null,
  columnId: "col-1",
  isFavorite: false,
  imageUrl: null,
};

const columns = [
  { id: "col-1", name: "To Do" },
  { id: "col-2", name: "In Progress" },
];

function renderCard(overrides = {}, handlers = {}) {
  const task = { ...baseTask, ...overrides };
  const onEdit = handlers.onEdit || jest.fn();
  const onDelete = handlers.onDelete || jest.fn();
  const onToggleFavorite = handlers.onToggleFavorite || jest.fn();
  const onMove = handlers.onMove || jest.fn();

  render(
    <MemoryRouter>
      <TaskCard
        task={task}
        columns={columns}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggleFavorite={onToggleFavorite}
        onMove={onMove}
      />
    </MemoryRouter>
  );

  return { task, onEdit, onDelete, onToggleFavorite, onMove };
}

describe("TaskCard", () => {
  test("renders task name and description", () => {
    renderCard();

    expect(screen.getByText("Write proposal")).toBeInTheDocument();
    expect(screen.getByText("Draft the Q3 proposal document")).toBeInTheDocument();
  });

  test("truncates long descriptions", () => {
    const longDescription = "x".repeat(120);
    renderCard({ description: longDescription });

    expect(screen.getByText(`${"x".repeat(80)}...`)).toBeInTheDocument();
  });

  test("shows a deadline chip when a deadline is set", () => {
    renderCard({ deadline: "2026-12-31T00:00:00Z" });

    expect(screen.getByText(/Due/)).toBeInTheDocument();
  });

  test("calls onToggleFavorite when the star button is clicked", () => {
    const { task, onToggleFavorite } = renderCard();

    fireEvent.click(screen.getByLabelText("Favorite task"));

    expect(onToggleFavorite).toHaveBeenCalledWith(task);
  });

  test("shows filled star and different label when task is a favorite", () => {
    renderCard({ isFavorite: true });

    expect(screen.getByLabelText("Unfavorite task")).toBeInTheDocument();
  });

  test("calls onEdit when the edit button is clicked", () => {
    const { task, onEdit } = renderCard();

    fireEvent.click(screen.getByLabelText("Edit task"));

    expect(onEdit).toHaveBeenCalledWith(task);
  });

  test("calls onDelete when the delete button is clicked", () => {
    const { task, onDelete } = renderCard();

    fireEvent.click(screen.getByLabelText("Delete task"));

    expect(onDelete).toHaveBeenCalledWith(task);
  });

  test("links to the task detail page", () => {
    renderCard();

    expect(screen.getByText("Write proposal").closest("a")).toHaveAttribute(
      "href",
      "/tasks/task-1"
    );
  });
});
