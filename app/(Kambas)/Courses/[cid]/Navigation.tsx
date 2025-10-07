"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CourseNavigation({ cid }: { cid: string }) {
  const pathname = usePathname();

  return (
    <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
      <Link 
        href={`/Courses/${cid}/Home`} 
        id="wd-course-home-link"
        className={`list-group-item border-0 ${pathname.includes(`/Courses/${cid}/Home`) ? "active" : "text-danger"}`}
      >
        Home
      </Link>
      <Link 
        href={`/Courses/${cid}/Modules`} 
        id="wd-course-modules-link"
        className={`list-group-item border-0 ${pathname.includes(`/Courses/${cid}/Modules`) ? "active" : "text-danger"}`}
      >
        Modules
      </Link>
      <Link 
        href={`/Courses/${cid}/Piazza`} 
        id="wd-course-piazza-link"
        className={`list-group-item border-0 ${pathname.includes(`/Courses/${cid}/Piazza`) ? "active" : "text-danger"}`}
      >
        Piazza
      </Link>
      <Link 
        href={`/Courses/${cid}/Zoom`} 
        id="wd-course-zoom-link"
        className={`list-group-item border-0 ${pathname.includes(`/Courses/${cid}/Zoom`) ? "active" : "text-danger"}`}
      >
        Zoom
      </Link>
      <Link 
        href={`/Courses/${cid}/Assignments`} 
        id="wd-course-assignments-link"
        className={`list-group-item border-0 ${pathname.includes(`/Courses/${cid}/Assignments`) ? "active" : "text-danger"}`}
      >
        Assignments
      </Link>
      <Link 
        href={`/Courses/${cid}/Quizzes`} 
        id="wd-course-quizzes-link"
        className={`list-group-item border-0 ${pathname.includes(`/Courses/${cid}/Quizzes`) ? "active" : "text-danger"}`}
      >
        Quizzes
      </Link>
      <Link 
        href={`/Courses/${cid}/Grades`} 
        id="wd-course-grades-link"
        className={`list-group-item border-0 ${pathname.includes(`/Courses/${cid}/Grades`) ? "active" : "text-danger"}`}
      >
        Grades
      </Link>
      <Link 
        href={`/Courses/${cid}/People`} 
        id="wd-course-people-link"
        className={`list-group-item border-0 ${pathname.includes(`/Courses/${cid}/People`) ? "active" : "text-danger"}`}
      >
        People
      </Link>
    </div>
  );
}