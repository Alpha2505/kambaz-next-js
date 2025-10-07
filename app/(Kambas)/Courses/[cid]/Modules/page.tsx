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

export default function Modules() {
  return (
    <div>
      <ModulesControls />
      <br /><br /><br /><br />

      <ListGroup className="rounded-0" id="wd-modules">
        {/* Week 1 - Lecture 1 */}
        <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-secondary d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <BsGripVertical className="me-2 fs-3" />
              Week 1, Lecture 1 - Course Introduction, Syllabus, Agenda
            </div>
            
            
<div className="float-end">
   <GreenCheckmark />
    <FaPlus className="position-relative me-2 ms-2" style={{ bottom: "1px" }} />
  <IoEllipsisVertical className="fs-4" />
</div>

          </div>

          <ListGroup className="wd-lessons rounded-0">
            {/* LEARNING OBJECTIVES */}
            <ListGroupItem className="wd-lesson p-3 ps-1 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <BsGripVertical className="me-2 fs-3" />
                LEARNING OBJECTIVES
              </div>
              <LessonControlButtons />
            </ListGroupItem>
            <ListGroupItem className="wd-lesson p-3 ps-1 d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <BsGripVertical className="me-2 fs-3" />
                  Introduction to the course
                </div>
                <LessonControlButtons />
              </ListGroupItem>
              <ListGroupItem className="wd-lesson p-3 ps-1 d-flex d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <BsGripVertical className="me-2 fs-3" />
                  Learn what is Web Development
                </div>
                <LessonControlButtons />
              </ListGroupItem>

            {/* READING */}
            <ListGroupItem className="wd-lesson p-3 ps-1 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <BsGripVertical className="me-2 fs-3" />
                READING
              </div>
              <LessonControlButtons />
            </ListGroupItem>
            <ListGroupItem className="wd-lesson p-3 ps-1 d-flex d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <BsGripVertical className="me-2 fs-3" />
                  Full Stack Developer - Chapter 1 - Introduction
                </div>
                <LessonControlButtons />
              </ListGroupItem>
              <ListGroupItem className="wd-lesson p-3 ps-1 d-flex d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <BsGripVertical className="me-2 fs-3" />
                  Full Stack Developer - Chapter 2 - Creating User
                </div>
                <LessonControlButtons />
              </ListGroupItem>

            {/* SLIDES */}
            <ListGroupItem className="wd-lesson p-3 ps-1 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <BsGripVertical className="me-2 fs-3" />
                SLIDES
              </div>
              <LessonControlButtons />
            </ListGroupItem>
            <ListGroupItem className="wd-lesson p-3 ps-1 d-flex d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <BsGripVertical className="me-2 fs-3" />
                  Introduction to Web Development
                </div>
                <LessonControlButtons />
              </ListGroupItem>
              <ListGroupItem className="wd-lesson p-3 ps-1 d-flex d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <BsGripVertical className="me-2 fs-3" />
                  Creating an HTTP server with Node.js
                </div>
                <LessonControlButtons />
              </ListGroupItem>
              <ListGroupItem className="wd-lesson p-3 ps-1 d-flex d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <BsGripVertical className="me-2 fs-3" />
                  Creating a React Application
                </div>
                <LessonControlButtons />
              </ListGroupItem>
          </ListGroup>
        </ListGroupItem>

        {/* Week 1 - Lecture 2 */}
        <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-secondary d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <BsGripVertical className="me-2 fs-3" />
              Week 1, Lecture 2 - Formatting User Interfaces with HTML
            </div>
            <div className="float-end">
   <GreenCheckmark />
    <FaPlus className="position-relative me-2 ms-2" style={{ bottom: "1px" }} />
  <IoEllipsisVertical className="fs-4" />
</div>
          </div>

          <ListGroup className="wd-lessons rounded-0">
            {/* LEARNING OBJECTIVES */}
            <ListGroupItem className="wd-lesson p-3 ps-1 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <BsGripVertical className="me-2 fs-3" />
                LEARNING OBJECTIVES
              </div>
              <LessonControlButtons />
            </ListGroupItem>
            <ListGroupItem className="wd-lesson p-3 ps-1 d-flex d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <BsGripVertical className="me-2 fs-3" />
                  Learn how to create user interfaces with HTML
                </div>
                <LessonControlButtons />
              </ListGroupItem>
              <ListGroupItem className="wd-lesson p-3 ps-1 d-flex d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <BsGripVertical className="me-2 fs-3" />
                  Deploy to Netlify
                </div>
                <LessonControlButtons />
              </ListGroupItem>

            {/* READING */}
            <ListGroupItem className="wd-lesson p-3 ps-1 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <BsGripVertical className="me-2 fs-3" />
                READING
              </div>
              <LessonControlButtons />
            </ListGroupItem>
            <ListGroupItem className="wd-lesson p-3 ps-1 d-flex d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <BsGripVertical className="me-2 fs-3" />
                  Full Stack Developer - Chapter 3 - HTML
                </div>
                <LessonControlButtons />
              </ListGroupItem>
              <ListGroupItem className="wd-lesson p-3 ps-1 d-flex d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <BsGripVertical className="me-2 fs-3" />
                  Intro to HTML and CSS - Chapter 1 - Getting Started
                </div>
                <LessonControlButtons />
              </ListGroupItem>

            {/* SLIDES */}
            <ListGroupItem className="wd-lesson p-3 ps-1 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <BsGripVertical className="me-2 fs-3" />
                SLIDES
              </div>
              <LessonControlButtons />
            </ListGroupItem>
            <ListGroupItem className="wd-lesson p-3 ps-1 d-flex d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <BsGripVertical className="me-2 fs-3" />
                  HTML Fundamentals
                </div>
                <LessonControlButtons />
              </ListGroupItem>
              <ListGroupItem className="wd-lesson p-3 ps-1 d-flex d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <BsGripVertical className="me-2 fs-3" />
                  HTML Forms
                </div>
                <LessonControlButtons />
              </ListGroupItem>
              <ListGroupItem className="wd-lesson p-3 ps-1 d-flex d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <BsGripVertical className="me-2 fs-3" />
                  HTML Tables
                </div>
                <LessonControlButtons />
              </ListGroupItem>
          </ListGroup>
        </ListGroupItem>

        {/* Week 2 */}
        <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-secondary d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <BsGripVertical className="me-2 fs-3" />
              Week 2
            </div>
            <div className="float-end">
   <GreenCheckmark />
    <FaPlus className="position-relative me-2 ms-2" style={{ bottom: "1px" }} />
  <IoEllipsisVertical className="fs-4" />
</div>
          </div>

          <ListGroup className="wd-lessons rounded-0">
            <ListGroupItem className="wd-lesson p-3 ps-1 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <BsGripVertical className="me-2 fs-3" />
                LEARNING OBJECTIVES
              </div>
              <LessonControlButtons />
            </ListGroupItem>
            <ListGroupItem className="wd-lesson p-3 ps-1 d-flex d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <BsGripVertical className="me-2 fs-3" />
                  Learn CSS styling fundamentals
                </div>
                <LessonControlButtons />
              </ListGroupItem>
              <ListGroupItem className="wd-lesson p-3 ps-1 d-flex d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <BsGripVertical className="me-2 fs-3" />
                  Understand responsive design
                </div>
                <LessonControlButtons />
              </ListGroupItem>
          </ListGroup>
        </ListGroupItem>

        {/* Week 3 */}
        <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-secondary d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <BsGripVertical className="me-2 fs-3" />
              Week 3
            </div>
            <div className="float-end">
   <GreenCheckmark />
    <FaPlus className="position-relative me-2 ms-2" style={{ bottom: "1px" }} />
  <IoEllipsisVertical className="fs-4" />
</div>
          </div>

          <ListGroup className="wd-lessons rounded-0">
            <ListGroupItem className="wd-lesson p-3 ps-1 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <BsGripVertical className="me-2 fs-3" />
                LEARNING OBJECTIVES
              </div>
              <LessonControlButtons />
            </ListGroupItem>
            <ListGroupItem className="wd-lesson p-3 ps-1 d-flex d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <BsGripVertical className="me-2 fs-3" />
                  JavaScript fundamentals
                </div>
                <LessonControlButtons />
              </ListGroupItem>
              <ListGroupItem className="wd-lesson p-3 ps-1 d-flex d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <BsGripVertical className="me-2 fs-3" />
                  DOM manipulation
                </div>
                <LessonControlButtons />
              </ListGroupItem>
          </ListGroup>
        </ListGroupItem>
      </ListGroup>
    </div>
  );
}