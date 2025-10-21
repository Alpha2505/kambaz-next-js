"use client";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, ListGroup, ListGroupItem } from "react-bootstrap";
import ModulesControls from "./ModulesControls";
import ModuleControlButtons from "./ModulesControls";
import LessonControlButtons from "./LessonControlButtons";
import { BsGripVertical } from "react-icons/bs";
import BlackBlockIcon from "./BlackBlockIcon";
import GreenCheckmark from "./GreenCheckmark";
import { IoEllipsisVertical } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import { useParams } from "next/navigation";
import * as db from "../../../Database";


export default function Modules() {
  const { cid } = useParams();
  const modules = db.modules;
  return (
    <div>
      <ModulesControls />
      <br /><br /><br /><br />

      <ListGroup className="rounded-0" id="wd-modules">
                {modules
          .filter((module: any) => module.course === cid)
          .map((module: any) => (
          <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
            <div className="wd-title p-3 ps-2 bg-secondary">
              <BsGripVertical className="me-2 fs-3" /> {module.name} 
              <div className="float-end">
   <GreenCheckmark />
    <FaPlus className="position-relative me-2 ms-2" style={{ bottom: "1px" }} />
  <IoEllipsisVertical className="fs-4" />
</div>
            </div>

            {module.lessons && (
              <ListGroup className="wd-lessons rounded-0">
                {module.lessons.map((lesson: any) => (
                  <ListGroupItem className="wd-lesson p-3 ps-1">
                    <BsGripVertical className="me-2 fs-3" /> {lesson.name} <LessonControlButtons />
                  </ListGroupItem>
                ))}</ListGroup>)}</ListGroupItem>))}
      </ListGroup>
    </div>
  );
}