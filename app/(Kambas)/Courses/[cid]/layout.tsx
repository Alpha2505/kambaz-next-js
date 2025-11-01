"use client";
import { ReactNode, useState } from "react";
import CourseNavigation from "./Navigation";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { RootState } from "../../store";
import { FaAlignJustify } from "react-icons/fa";
import Breadcrumb from "./Breadcrumb";

export default function CoursesLayout({ children }: { children: ReactNode }) {
  const { cid } = useParams();
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const course = courses.find((course: any) => course._id === cid);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  return (
    <div id="wd-courses">
      <h2 className="text-danger">
        <FaAlignJustify 
          className="me-4 fs-4 mb-1" 
          style={{ cursor: "pointer" }}
          onClick={() => setIsSidebarVisible(!isSidebarVisible)}
        />
        <Breadcrumb course={course}/> 
      </h2>
      <hr />
      <div className="d-flex">
        <CourseNavigation cid={cid} isVisible={isSidebarVisible} />
        <div className="flex-fill">{children}</div>
      </div>
    </div>
  );
}