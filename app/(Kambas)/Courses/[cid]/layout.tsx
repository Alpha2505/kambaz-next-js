// app/(Kambaz)/Courses/[cid]/layout.tsx
"use client";
import { ReactNode, useState, useEffect, useRef } from "react";
import CourseNavigation from "./Navigation";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { RootState } from "../../store";
import { FaAlignJustify } from "react-icons/fa";
import Breadcrumb from "./Breadcrumb";
import { setEnrollments } from "../../Dashboard/reducer";
import * as client from "../../Courses/client";

export default function CoursesLayout({ children }: { children: ReactNode }) {
  const params = useParams();
  const cid = Array.isArray(params.cid) ? params.cid[0] : params.cid || "";
  const router = useRouter();
  const dispatch = useDispatch();
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const { enrollments } = useSelector((state: RootState) => state.enrollmentsReducer);
  
  const course = courses.find((course: any) => course._id === cid);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  
  const isFaculty = currentUser?.role === "FACULTY";
  
  // Check if user is enrolled in this course
  const isEnrolled = currentUser
    ? enrollments.some(
        (enrollment: any) =>
          enrollment.user === currentUser._id && enrollment.course === cid
      )
    : false;
  
  // Use ref to track if we've already shown the alert
  const hasCheckedAccess = useRef(false);

  // Load enrollments on mount
  useEffect(() => {
    const loadEnrollments = async () => {
      if (!currentUser) {
        setIsLoading(false);
        return;
      }

      try {
        const enrolledCourses = await client.findMyCourses();
        
        // Convert courses to enrollment format for Redux
        const userEnrollments = enrolledCourses.map((course: any) => ({
          _id: `${currentUser._id}-${course._id}`,
          user: currentUser._id,
          course: course._id
        }));
        
        dispatch(setEnrollments(userEnrollments));
      } catch (error) {
        console.error("Failed to fetch enrollments:", error);
        dispatch(setEnrollments([]));
      } finally {
        setIsLoading(false);
      }
    };

    loadEnrollments();
  }, [currentUser, dispatch]);

  useEffect(() => {
    // Only run the access check once and after loading
    if (hasCheckedAccess.current || isLoading) return;

    // Redirect to dashboard if:
    // 1. Not logged in
    // 2. Not faculty AND not enrolled
    if (!currentUser) {
      hasCheckedAccess.current = true;
      alert("Please sign in to access courses.");
      router.push("/Account/Signin");
      return;
    }

    if (!isFaculty && !isEnrolled) {
      hasCheckedAccess.current = true;
      alert("You must be enrolled in this course to access it.");
      router.push("/Dashboard");
      return;
    }

    // Mark as checked if access is valid
    if (currentUser && (isFaculty || isEnrolled)) {
      hasCheckedAccess.current = true;
    }
  }, [currentUser, isFaculty, isEnrolled, cid, router, isLoading]);

  // Show loading state while checking permissions
  if (isLoading) {
    return (
      <div className="p-4">
        <div className="alert alert-warning">
          Checking course access...
        </div>
      </div>
    );
  }

  if (!currentUser || (!isFaculty && !isEnrolled)) {
    return null; // Will redirect in useEffect
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