import Link from "next/link";
import { BsGripVertical, BsPlus } from "react-icons/bs";
import { FaSearch, FaCaretDown } from "react-icons/fa";
import { IoEllipsisVertical } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";
import { MdOutlineAssignment } from "react-icons/md";

export default async function Assignments({ 
  params 
}: { 
  params: Promise<{ cid: string }> 
}) {
  const { cid } = await params;

  return (
    <div id="wd-assignments">
      {/* Search and Buttons Row */}
      <div className="d-flex justify-content-between align-items-center mb-3 px-3 pt-3">
        <div className="position-relative" style={{ width: "300px" }}>
          <FaSearch className="position-absolute" style={{ left: "10px", top: "50%", transform: "translateY(-50%)", color: "#6c757d" }} />
          <input 
            placeholder="Search..."
            id="wd-search-assignment"
            className="form-control ps-5"
          />
        </div>
        <div>
          <button id="wd-add-assignment-group" className="btn btn-secondary me-2">
            <BsPlus className="fs-5" /> Group
          </button>
          <button id="wd-add-assignment" className="btn btn-danger">
            <BsPlus className="fs-5" /> Assignment
          </button>
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
          <span className="border border-dark rounded px-2 py-1 me-2">40% of Total</span>
          <button className="btn btn-sm">
            <BsPlus className="fs-4" />
          </button>
          <button className="btn btn-sm">
            <IoEllipsisVertical className="fs-5" />
          </button>
        </div>
      </div>
      
      {/* Assignment List */}
      <ul id="wd-assignment-list" className="list-group border-start border-success border-5">
        <li className="wd-assignment-list-item list-group-item d-flex align-items-start p-3 border-start-0 border-end-1 border-top-0">
          <BsGripVertical className="me-2 fs-3 mt-1" />
          <MdOutlineAssignment className="me-3 fs-3 text-success mt-1" />
          <div className="flex-grow-1">
            <Link href={`/Courses/${cid}/Assignments/123`} className="wd-assignment-link text-decoration-none fs-5 fw-bold text-dark">
              A1
            </Link>
            <div className="small">
              <span className="text-danger fs-7">Multiple Modules</span> | <span className="fw-bold fs-7">Not available until</span> May 6 at 12:00am<br />
              <span className="fw-bold fs-7">Due</span> May 13 at 11:59pm | 100 pts
            </div>
          </div>
          <FaCheckCircle className="text-success me-2 fs-5" />
          <IoEllipsisVertical className="fs-5" />
        </li>
        
        <li className="wd-assignment-list-item list-group-item d-flex align-items-start p-3 border-start-0 border-end-1 border-top-0">
          <BsGripVertical className="me-2 fs-3 mt-1" />
          <MdOutlineAssignment className="me-3 fs-3 text-success mt-1" />
          <div className="flex-grow-1">
            <Link href={`/Courses/${cid}/Assignments/124`} className="wd-assignment-link text-decoration-none fs-5 fw-bold text-dark">
              A2
            </Link>
            <div className="small">
              <span className="text-danger fs-7">Multiple Modules</span> | <span className="fw-bold fs-7">Not available until</span> May 13 at 12:00am<br />
              <span className="fw-bold fs-7">Due</span> May 20 at 11:59pm | 100 pts
            </div>
          </div>
          <FaCheckCircle className="text-success me-2 fs-5" />
          <IoEllipsisVertical className="fs-5" />
        </li>
        
        <li className="wd-assignment-list-item list-group-item d-flex align-items-start p-3 border-start-0 border-end-1 border-top-0">
          <BsGripVertical className="me-2 fs-3 mt-1" />
          <MdOutlineAssignment className="me-3 fs-3 text-success mt-1" />
          <div className="flex-grow-1">
            <Link href={`/Courses/${cid}/Assignments/125`} className="wd-assignment-link text-decoration-none fs-5 fw-bold text-dark">
              A3
            </Link>
            <div className="small">
              <span className="text-danger fs-7">Multiple Modules</span> | <span className="fw-bold fs-7">Not available until</span> May 20 at 12:00am<br />
              <span className="fw-bold fs-7">Due</span> May 27 at 11:59pm | 100 pts
            </div>
          </div>
          <FaCheckCircle className="text-success me-2 fs-5" />
          <IoEllipsisVertical className="fs-5" />
        </li>
      </ul>
    </div>
  );
}