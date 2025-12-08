"use client"
import { MdDoNotDisturbAlt } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import { BiImport } from "react-icons/bi";
import { LiaFileImportSolid } from "react-icons/lia";
import { FaHome } from "react-icons/fa";
import { FaChartBar } from "react-icons/fa";
import { FaBullhorn } from "react-icons/fa";
import { FaBell } from "react-icons/fa";
import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

export default function CourseStatus() {
  // Check if current user is faculty
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const isFaculty = currentUser?.role === "FACULTY";

  return (
    <div id="wd-course-status" style={{ width: "350px" }}>
      <h2>Course Status</h2>
      
      {/* Only show Publish/Unpublish buttons for Faculty */}
      {isFaculty && (
        <div key="publish-buttons">
          <div className="d-flex">
            <div className="w-50 pe-1">
              <Button variant="secondary" size="lg" className="w-100 text-nowrap">
                <MdDoNotDisturbAlt className="me-2 fs-5" /> Unpublish
              </Button>
            </div>
            <div className="w-50">
              <Button variant="success" size="lg" className="w-100">
                <FaCheckCircle className="me-2 fs-5" /> Publish
              </Button>
            </div>
          </div>
          <br />
        </div>
      )}
      
      <Button key="import-content" variant="secondary" size="lg" className="w-100 mt-1 text-start">
        <BiImport className="me-2 fs-5" /> Import Existing Content
      </Button>
      <Button key="import-commons" variant="secondary" size="lg" className="w-100 mt-1 text-start">
        <LiaFileImportSolid className="me-2 fs-5" /> Import from Commons
      </Button>
      <Button key="home-page" variant="secondary" size="lg" className="w-100 mt-1 text-start">
        <FaHome className="me-2 fs-5" /> Choose Home Page
      </Button>
      <Button key="course-stream" variant="secondary" size="lg" className="w-100 mt-1 text-start">
        <FaChartBar className="me-2 fs-5" /> View Course Stream
      </Button>
      <Button key="announcement" variant="secondary" size="lg" className="w-100 mt-1 text-start">
        <FaBullhorn className="me-2 fs-5" /> New Announcement
      </Button>
      <Button key="analytics" variant="secondary" size="lg" className="w-100 mt-1 text-start">
        <FaChartBar className="me-2 fs-5" /> New Analytics
      </Button>
      <Button key="notifications" variant="secondary" size="lg" className="w-100 mt-1 text-start">
        <FaBell className="me-2 fs-5" /> View Course Notifications
      </Button>
    </div>
  );
} 