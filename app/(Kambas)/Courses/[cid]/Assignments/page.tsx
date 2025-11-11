"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { deleteAssignment } from "./reducer";
import { RootState } from "../../../store";
import { BsGripVertical, BsPlus } from "react-icons/bs";
import { FaSearch, FaCaretDown, FaTrash } from "react-icons/fa";
import { IoEllipsisVertical } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";
import { MdOutlineAssignment } from "react-icons/md";
import { Modal, Button } from "react-bootstrap";
import { useState } from "react";

export default function Assignments() {
  const { cid } = useParams();
  const router = useRouter();
  const { assignments } = useSelector((state: RootState) => state.assignmentsReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const dispatch = useDispatch();
  
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<string | null>(null);

  // Check if current user is faculty
  const isFaculty = (currentUser as any)?.role === "FACULTY";

  // Filter assignments for this course
  const courseAssignments = assignments.filter((assignment: any) => assignment.course === cid);

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric' 
    };
    const time = date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    return `${date.toLocaleDateString('en-US', options)} at ${time}`;
  };

  const handleDeleteClick = (e: React.MouseEvent, assignmentId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setAssignmentToDelete(assignmentId);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (assignmentToDelete) {
      dispatch(deleteAssignment(assignmentToDelete));
    }
    setShowDeleteDialog(false);
    setAssignmentToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setAssignmentToDelete(null);
  };

  return (
    <div id="wd-assignments">
      {/* Search and Buttons Row */}
      <div className="d-flex justify-content-between align-items-center mb-3 px-3 pt-3">
        <div className="position-relative" style={{ width: "300px" }}>
          <FaSearch 
            className="position-absolute" 
            style={{ 
              left: "10px", 
              top: "50%", 
              transform: "translateY(-50%)", 
              color: "#6c757d" 
            }} 
          />
          <input 
            placeholder="Search..."
            id="wd-search-assignment"
            className="form-control ps-5"
          />
        </div>
        <div>
          {/* Only show buttons for Faculty */}
          {isFaculty && (
            <>
              <button id="wd-add-assignment-group" className="btn btn-secondary me-2">
                <BsPlus className="fs-5" /> Group
              </button>
              <button 
                id="wd-add-assignment" 
                className="btn btn-danger"
                onClick={() => router.push(`/Courses/${cid}/Assignments/new`)}
              >
                <BsPlus className="fs-5" /> Assignment
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Assignments Header */}
      <div className="d-flex justify-content-between align-items-center border p-3 bg-secondary">
        <div className="d-flex align-items-center">
          <BsGripVertical className="me-2 fs-4" />
          <FaCaretDown className="me-2" />
          <h3 id="wd-assignments-title" className="mb-0 fs-5 fw-bold">
            ASSIGNMENTS
          </h3>
        </div>
        <div className="d-flex align-items-center">
          <span className="border border-dark rounded px-2 py-1 me-2">
            40% of Total
          </span>
          {/* Only show control buttons for Faculty */}
          {isFaculty && (
            <>
              <button className="btn btn-sm">
                <BsPlus className="fs-4" />
              </button>
              <button className="btn btn-sm">
                <IoEllipsisVertical className="fs-5" />
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Assignment List */}
      <ul id="wd-assignment-list" className="list-group border-start border-success border-5">
        {courseAssignments.length === 0 ? (
          <li className="list-group-item text-center py-4 text-muted">
            No assignments available for this course
          </li>
        ) : (
          courseAssignments.map((assignment: any) => (
            <li 
              key={assignment._id}
              className="wd-assignment-list-item list-group-item d-flex align-items-start p-3 border-start-0 border-end-1 border-top-0"
            >
              <BsGripVertical className="me-2 fs-3 mt-1" />
              <MdOutlineAssignment className="me-3 fs-3 text-success mt-1" />
              <div className="flex-grow-1">
                {/* Faculty: clickable link to edit; Students: just clickable link to view */}
                <Link 
                  href={isFaculty 
                    ? `/Courses/${cid}/Assignments/${assignment._id}` 
                    : `/Courses/${cid}/Assignments/${assignment._id}`
                  } 
                  className="wd-assignment-link text-decoration-none fs-5 fw-bold text-dark"
                >
                  {assignment.title}
                </Link>
                <div className="small">
                  <span className="text-danger fs-7">Multiple Modules</span> | 
                  <span className="fw-bold fs-7"> Not available until</span> {formatDate(assignment.availableFromDate || assignment.availableFrom)}
                  <br />
                  <span className="fw-bold fs-7">Due</span> {formatDate(assignment.dueDate || assignment.availableUntil)} | {assignment.points} pts
                </div>
              </div>
              
              {/* Only show delete icon for Faculty */}
              {isFaculty && (
                <FaTrash 
                  className="text-danger me-2 fs-5 cursor-pointer" 
                  onClick={(e) => handleDeleteClick(e, assignment._id)}
                  style={{ cursor: "pointer" }}
                  title="Delete Assignment"
                />
              )}
              
              <FaCheckCircle className="text-success me-2 fs-5" />
              <IoEllipsisVertical className="fs-5" />
            </li>
          ))
        )}
      </ul>

      {/* Delete Confirmation Dialog - Only for Faculty */}
      {isFaculty && (
        <Modal show={showDeleteDialog} onHide={handleCancelDelete}>
          <Modal.Header closeButton>
            <Modal.Title>Delete Assignment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to remove this assignment?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCancelDelete}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete}>
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}