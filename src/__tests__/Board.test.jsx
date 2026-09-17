import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Board from "../components/Board";
import * as api from "../api/taskApi";

jest.mock("../api/taskApi");

const columns = [
  { id: "col-1", name: "To Do" },
  { id: "col-2", name: "In Progress" },
];

const tasksCol1 = [
  { id: "t1", name: "Alpha task", description: "", deadline: null, columnId: "col-1", isFavorite: false, imageUrl: null },
];
const tasksCol2 = [];

function setupApiMocks() {
  api.fetchColumns.mockResolvedValue(columns);
  api.fetchTasksForColumn.mockImplementation((columnId) =>
    Promise.resolve(columnId === "col-1" ? tasksCol1 : tasksCol2)
  );
  api.createTask.mockResolvedValue({ id: "t2", name: "New task", columnId: "col-1" });
  api.deleteTask.mockResolvedValue(null);
  api.toggleFavorite.mockResolvedValue({ ...tasksCol1[0], isFavorite: true });
  api.moveTask.mockResolvedValue({ ...tasksCol1[0], columnId: "col-2" });
}

function renderBoard() {
  render(
    <MemoryRouter>
      <Board />
    </MemoryRouter>
  );
}

describe("Board", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupApiMocks();
  });

  test("loads and displays columns with their tasks", async () => {
    renderBoard();

    expect(await screen.findByText("To Do (1)")).toBeInTheDocument();
    expect(screen.getByText("In Progress (0)")).toBeInTheDocument();
    expect(screen.getByText("Alpha task")).toBeInTheDocument();
  });

  test("opens the add-task dialog when 'Add task' is clicked", async () => {
    renderBoard();
    await screen.findByText("Alpha task");

    fireEvent.click(screen.getAllByText("Add task")[0]);

    expect(screen.getByText("Add Task")).toBeInTheDocument();
  });

  test("creates a new task and refreshes the column", async () => {
    renderBoard();
    await screen.findByText("Alpha task");

    fireEvent.click(screen.getAllByText("Add task")[0]);
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "New task" } });
    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => expect(api.createTask).toHaveBeenCalledWith(
      expect.objectContaining({ name: "New task", columnId: "col-1" })
    ));
  });

  test("deletes a task when the delete button is clicked", async () => {
    renderBoard();
    await screen.findByText("Alpha task");

    fireEvent.click(screen.getByLabelText("Delete task"));

    await waitFor(() => expect(api.deleteTask).toHaveBeenCalledWith("t1"));
  });

  test("toggles favorite when the star is clicked", async () => {
    renderBoard();
    await screen.findByText("Alpha task");

    fireEvent.click(screen.getByLabelText("Favorite task"));

    await waitFor(() => expect(api.toggleFavorite).toHaveBeenCalledWith("t1"));
  });

  test("shows an error message when loading the board fails", async () => {
    api.fetchColumns.mockRejectedValue(new Error("Network down"));
    renderBoard();

    expect(await screen.findByText("Network down")).toBeInTheDocument();
  });
});
