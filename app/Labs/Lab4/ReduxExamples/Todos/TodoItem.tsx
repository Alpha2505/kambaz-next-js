import React from "react";
import { useDispatch } from "react-redux";
import { deleteTodo, setTodo } from "./todosReducer";
import { ListGroupItem, Button } from "react-bootstrap";

export default function TodoItem({ 
  todo 
}: { 
  todo: { id: string; title: string } 
}) {
  const dispatch = useDispatch();
  
  return (
    <ListGroupItem key={todo.id} className="d-flex align-items-center justify-content-between">
      <span>{todo.title}</span>
      <div className="d-flex gap-2">
        <Button 
          onClick={() => dispatch(setTodo(todo))}
          id="wd-set-todo-click"
          variant="primary"
        > 
          Edit 
        </Button>
        <Button 
          onClick={() => dispatch(deleteTodo(todo.id))}
          id="wd-delete-todo-click"
          variant="danger"
        > 
          Delete 
        </Button>
      </div>
    </ListGroupItem>
  );
}