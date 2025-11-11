"use client";
import { useState } from "react";
import { FormControl, ListGroup, ListGroupItem } from "react-bootstrap";
import ModulesControls from "./ModulesControls";
import LessonControlButtons from "./LessonControlButtons";
import { BsGripVertical } from "react-icons/bs";
import GreenCheckmark from "./GreenCheckmark";
import { IoEllipsisVertical } from "react-icons/io5";
import { FaPlus, FaTrash, FaPencil } from "react-icons/fa6";
import { useParams } from "next/navigation";
import { addModule, editModule, updateModule, deleteModule } from "./reducer";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";

export default function Modules() {
  const { cid } = useParams();
  const [moduleName, setModuleName] = useState("");
  const { modules } = useSelector((state: RootState) => state.modulesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const dispatch = useDispatch();
  
  // Check if current user is faculty
  const isFaculty = currentUser?.role === "FACULTY";

  return (
    <div>
      <ModulesControls 
        moduleName={moduleName} 
        setModuleName={setModuleName}
        addModule={() => {
          dispatch(addModule({ name: moduleName, course: cid }));
          setModuleName("");
        }} 
      />
      <br /><br /><br /><br />
      <ListGroup className="rounded-0" id="wd-modules">
        {modules
          .filter((module: any) => module.course === cid)
          .map((module: any) => (
            <ListGroupItem key={module._id} className="wd-module p-0 mb-5 fs-5 border-gray">
              <div className="wd-title p-3 ps-2 bg-secondary">
                <BsGripVertical className="me-2 fs-3" />
                
                {/* Show module name or edit field */}
                {!module.editing && module.name}
                {module.editing && isFaculty && (
                  <FormControl 
                    className="w-50 d-inline-block"
                    onChange={(e) =>
                      dispatch(updateModule({ ...module, name: e.target.value }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        dispatch(updateModule({ ...module, editing: false }));
                      }
                    }}
                    defaultValue={module.name} 
                  />
                )}
                
                {/* Show control buttons */}
                <div className="float-end">
                  {/* Only show edit/delete/plus for Faculty */}
                  {isFaculty && (
                    <>
                      <FaPencil 
                        onClick={() => dispatch(editModule(module._id))} 
                        className="text-primary me-3" 
                        style={{ cursor: "pointer" }}
                      />
                      <FaTrash 
                        className="text-danger me-2 mb-1" 
                        onClick={() => dispatch(deleteModule(module._id))}
                        style={{ cursor: "pointer" }}
                      />
                    </>
                  )}
                  {/* Show checkmark and ellipsis for everyone */}
                  <GreenCheckmark />
                  {isFaculty && (
                    <FaPlus className="position-relative me-2 ms-2" style={{ bottom: "1px" }} />
                  )}
                  <IoEllipsisVertical className="fs-4" />
                </div>
              </div>
              
              {/* Lessons */}
              {module.lessons && (
                <ListGroup className="wd-lessons rounded-0">
                  {module.lessons.map((lesson: any) => (
                    <ListGroupItem key={lesson._id} className="wd-lesson p-3 ps-1">
                      <BsGripVertical className="me-2 fs-3" /> {lesson.name}
                      
                      {/* Only show lesson control buttons for Faculty */}
                      {isFaculty && (
                        <LessonControlButtons 
                          moduleId={module._id}
                          deleteModule={(moduleId) => {
                            dispatch(deleteModule(moduleId));
                          }}
                          editModule={(moduleId) => dispatch(editModule(moduleId))} 
                        />
                      )}
                    </ListGroupItem>
                  ))}
                </ListGroup>
              )}
            </ListGroupItem>
          ))}
      </ListGroup>
    </div>
  );
}