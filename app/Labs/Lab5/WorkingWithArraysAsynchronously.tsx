import React, { useState, useEffect } from "react";
import { FaPencil } from "react-icons/fa6";
import * as client from "./client";
import { FormControl, ListGroup, ListGroupItem } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import { FaPlusCircle } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";

export default function WorkingWithArraysAsynchronously() {
  const [todos, setTodos] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const createNewTodo = async () => {
    try {
      const todos = await client.createNewTodo();
      setTodos(todos);
      setErrorMessage(null);
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Failed to create todo");
    }
  };

  const postNewTodo = async () => {
    try {
      const newTodo = await client.postNewTodo({ 
        title: "New Posted Todo", 
        completed: false 
      });
      setTodos([...todos, newTodo]);
      setErrorMessage(null);
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Failed to post todo");
    }
  };

  const fetchTodos = async () => {
    try {
      const todos = await client.fetchTodos();
      setTodos(todos);
      setErrorMessage(null);
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Failed to fetch todos");
    }
  };

  const removeTodo = async (todo: any) => {
    try {
      const updatedTodos = await client.removeTodo(todo);
      setTodos(updatedTodos);
      setErrorMessage(null);
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Failed to remove todo");
    }
  };

  const deleteTodo = async (todo: any) => {
    try {
      await client.deleteTodo(todo);
      const newTodos = todos.filter((t) => t.id !== todo.id);
      setTodos(newTodos);
      setErrorMessage(null);
    } catch (error: any) {
      console.log(error);
      setErrorMessage(error.response?.data?.message || "Failed to delete todo");
    }
  };

  const editTodo = (todo: any) => {
    const updatedTodos = todos.map(
      (t) => t.id === todo.id ? { ...todo, editing: true } : t
    );
    setTodos(updatedTodos);
  };

  const updateTodo = async (todo: any) => {
    try {
      await client.updateTodo(todo);
      setTodos(todos.map((t) => (t.id === todo.id ? todo : t)));
      setErrorMessage(null);
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Failed to update todo");
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div id="wd-asynchronous-arrays">
      <h3>Working with Arrays Asynchronously</h3>

      {/* Error Message Display */}
      {errorMessage && (
        <div id="wd-todo-error-message" className="alert alert-danger mb-2 mt-2">
          {errorMessage}
        </div>
      )}

      <h4>
        Todos 
        <FaPlusCircle 
          onClick={createNewTodo} 
          className="text-success float-end fs-3" 
        />
        <FaPlusCircle 
          onClick={postNewTodo} 
          className="text-primary float-end fs-3 me-3" 
          id="wd-post-todo" 
        />
      </h4>

      <ListGroup>
        {todos.map((todo) => (
          <ListGroupItem key={todo.id}>
            <FaTrash 
              onClick={() => removeTodo(todo)}
              className="text-danger float-end mt-1" 
              id="wd-remove-todo"
            />
            <TiDelete 
              onClick={() => deleteTodo(todo)} 
              className="text-danger float-end me-2 fs-3" 
              id="wd-delete-todo" 
            />
            <FaPencil 
              onClick={() => editTodo(todo)} 
              className="text-primary float-end me-2 mt-1" 
            />
            <input 
              type="checkbox" 
              defaultChecked={todo.completed} 
              className="form-check-input me-2 float-start"
              onChange={(e) => updateTodo({ ...todo, completed: e.target.checked })} 
            />
            {!todo.editing ? (
              todo.title
            ) : (
              <FormControl 
                className="w-50 float-start" 
                defaultValue={todo.title}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    updateTodo({ ...todo, editing: false });
                  }
                }}
                onChange={(e) =>
                  updateTodo({ ...todo, title: e.target.value })
                }
              />
            )}
          </ListGroupItem>
        ))}
      </ListGroup>
      <hr />
    </div>
  );
}