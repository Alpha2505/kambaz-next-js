// app/(Kambaz)/Courses/[cid]/layout.tsx

"use client";
import { ReactNode, useState, useEffect } from "react";
import CourseNavigation from "./Navigation";
import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { RootState } from "../../store";
import { FaAlignJustify } from "react-icons/fa";
import Breadcrumb from "./Breadcrumb";

export default function CoursesLayout({ children }: { children: ReactNode }) {
  const params = useParams();
  const cid = Array.isArray(params.cid) ? params.cid[0] : params.cid || "";
  const router = useRouter();
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const { enrollments } = useSelector((state: RootState) => state.enrollmentsReducer);
  
  const course = courses.find((course: any) => course._id === cid);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  
  const isFaculty = currentUser?.role === "FACULTY";

  // Check if user is enrolled in this course
  const isEnrolled = currentUser
    ? enrollments.some(
        (enrollment: any) =>
          enrollment.user === currentUser._id && enrollment.course === cid
      )
    : false;

  useEffect(() => {
    // Redirect to dashboard if:
    // 1. Not logged in
    // 2. Not faculty AND not enrolled
    if (!currentUser) {
      alert("Please sign in to access courses.");
      router.push("/Account/Signin");
      return;
    }

    if (!isFaculty && !isEnrolled) {
      alert("You must be enrolled in this course to access it.");
      router.push("/Dashboard");
      return;
    }
  }, [currentUser, isFaculty, isEnrolled, cid, router]);

  // Show loading state while checking permissions
  if (!currentUser || (!isFaculty && !isEnrolled)) {
    return (
      <div className="p-4">
        <div className="alert alert-warning">
          Checking course access...
        </div>
      </div>
    );
  }

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