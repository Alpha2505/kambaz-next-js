"use client";
import { useState } from "react";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, FormControl, ListGroup, ListGroupItem } from "react-bootstrap";
import ModulesControls from "./ModulesControls";
import ModuleControlButtons from "./ModulesControls";
import LessonControlButtons from "./LessonControlButtons";
import { BsGripVertical } from "react-icons/bs";
import BlackBlockIcon from "./BlackBlockIcon";
import GreenCheckmark from "./GreenCheckmark";
import { IoEllipsisVertical } from "react-icons/io5";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { useParams } from "next/navigation";
import * as db from "../../../Database";
import { v4 as uuidv4 } from "uuid";
import { FaPencil } from "react-icons/fa6";
import { addModule, editModule, updateModule, deleteModule }
  from "./reducer";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";

export default function Modules() {
  const { cid } = useParams();
  const [moduleName, setModuleName] = useState("");
  const { modules } = useSelector((state: RootState) => state.modulesReducer);
  const dispatch = useDispatch();
  return (
    <div>
      <ModulesControls moduleName={moduleName} setModuleName={setModuleName}
        addModule={() => {
          dispatch(addModule({ name: moduleName, course: cid }));
          setModuleName("");
        }} />

      <br /><br /><br /><br />

      <ListGroup className="rounded-0" id="wd-modules">
        {modules
          .filter((module: any) => module.course === cid)
          .map((module: any) => (
            <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
              <div className="wd-title p-3 ps-2 bg-secondary">
                <BsGripVertical className="me-2 fs-3" />
                {!module.editing && module.name}
                {module.editing && (
                  <FormControl className="w-50 d-inline-block"
                    onChange={(e) =>
                      dispatch(
                        updateModule({ ...module, name: e.target.value })
                      )
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        dispatch(updateModule({ ...module, editing: false }));

                      }
                    }}
                    defaultValue={module.name} />
                )}
                <div className="float-end">
                  <FaPencil onClick={() => dispatch(editModule(module._id))} className="text-primary me-3" />
                  <FaTrash className="text-danger me-2 mb-1" onClick={() => dispatch(deleteModule(module._id))} />
                  <GreenCheckmark />
                  <FaPlus className="position-relative me-2 ms-2" style={{ bottom: "1px" }} />
                  <IoEllipsisVertical className="fs-4" />
                </div>
              </div>

              {module.lessons && (
                <ListGroup className="wd-lessons rounded-0">
                  {module.lessons.map((lesson: any) => (
                    <ListGroupItem className="wd-lesson p-3 ps-1">
                      <BsGripVertical className="me-2 fs-3" /> {lesson.name} <LessonControlButtons moduleId={module._id}
                        deleteModule={(moduleId) => {
                    dispatch(deleteModule(moduleId));
                  }}
                  editModule={(moduleId) => dispatch(editModule(moduleId))} />
                    </ListGroupItem>
                  ))}</ListGroup>)}</ListGroupItem>))}
      </ListGroup>
    </div>
  );
}