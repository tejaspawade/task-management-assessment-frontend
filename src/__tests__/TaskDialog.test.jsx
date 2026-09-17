import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TaskDialog from "../components/TaskDialog";

describe("TaskDialog", () => {
  test("renders 'Add Task' title when there is no initial task", () => {
    render(<TaskDialog open onClose={jest.fn()} onSave={jest.fn()} initialTask={null} />);

    expect(screen.getByText("Add Task")).toBeInTheDocument();
  });

  test("renders 'Edit Task' title and prefills fields when editing", () => {
    const initialTask = {
      name: "Existing task",
      description: "Existing description",
      deadline: "2026-01-15T00:00:00Z",
      imageUrl: "",
    };

    render(<TaskDialog open onClose={jest.fn()} onSave={jest.fn()} initialTask={initialTask} />);

    expect(screen.getByText("Edit Task")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Existing task")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Existing description")).toBeInTheDocument();
  });

  test("shows a validation error when saving without a name", () => {
    const onSave = jest.fn();
    render(<TaskDialog open onClose={jest.fn()} onSave={onSave} initialTask={null} />);

    fireEvent.click(screen.getByText("Save"));

    expect(screen.getByText("Name is required")).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  test("calls onSave with form values when valid", () => {
    const onSave = jest.fn();
    render(<TaskDialog open onClose={jest.fn()} onSave={onSave} initialTask={null} />);

    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "New task" } });
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "New description" },
    });
    fireEvent.click(screen.getByText("Save"));

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ name: "New task", description: "New description" })
    );
  });

  test("calls onClose when Cancel is clicked", () => {
    const onClose = jest.fn();
    render(<TaskDialog open onClose={onClose} onSave={jest.fn()} initialTask={null} />);

    fireEvent.click(screen.getByText("Cancel"));

    expect(onClose).toHaveBeenCalled();
  });
});
