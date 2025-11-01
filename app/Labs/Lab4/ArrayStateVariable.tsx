import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import { ListGroup, ListGroupItem, Button } from "react-bootstrap";

export default function ArrayStateVariable() {
  const { todos } = useSelector((state: RootState) => state.todosReducer);
  const [array, setArray] = useState([1, 2, 3, 4, 5]);
  
  const addElement = () => {
    setArray([...array, Math.floor(Math.random() * 100)]);
  };
  
  const deleteElement = (index: number) => {
    setArray(array.filter((item, i) => i !== index));
  };
  
  return (
    <div id="wd-array-state-variables">
      <h2>Array State Variable</h2>
      <Button 
        onClick={addElement}
        variant="success"
        className="mb-3"
      >
        Add Element
      </Button>
      <ListGroup className="mb-3">
        {array.map((item, index) => (
          <ListGroupItem 
            key={index}
            className="d-flex align-items-center justify-content-between"
          >
            <span className="fs-4">{item}</span>
            <Button 
              onClick={() => deleteElement(index)}
              variant="danger"
            >
              Delete
            </Button>
          </ListGroupItem>
        ))}
      </ListGroup>
      <hr/>
      <ListGroup>
        {todos.map((todo: any) => (
          <ListGroupItem key={todo.id}>
            {todo.title}
          </ListGroupItem>
        ))}
      </ListGroup>
      <hr />
    </div>
  );
}