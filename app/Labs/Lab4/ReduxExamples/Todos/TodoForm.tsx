import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { addTodo, updateTodo, setTodo } from "./todosReducer";
import { RootState } from "../../store";
import { ListGroupItem, Button, FormControl } from "react-bootstrap";

export default function TodoForm() {
  const { todo } = useSelector((state: RootState) => state.todosReducer);
  const dispatch = useDispatch();
  
  return (
    <ListGroupItem className="d-flex align-items-center gap-2">
      <FormControl
        defaultValue={todo.title}
        onChange={(e) => dispatch(setTodo({ ...todo, title: e.target.value }))}
        className="flex-grow-1"
      />
      <Button 
        onClick={() => dispatch(updateTodo(todo))}
        id="wd-update-todo-click"
        variant="warning"
      > 
        Update 
      </Button>
      <Button 
        onClick={() => dispatch(addTodo(todo))}
        id="wd-add-todo-click"
        variant="success"
      > 
        Add 
      </Button>
    </ListGroupItem>
  );
}