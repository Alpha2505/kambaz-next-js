"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CourseNavigation({ cid }: { cid: string }) {
  const pathname = usePathname();
  const links = ["Home", "Modules", "Piazza", "Zoom", "Assignments", "Quizzes", "Grades", "People"];

  return (
    <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
      {links.map((link) => (
            <Link 
        href={`/Courses/${cid}/${link}`} 
        id="wd-course-home-link"
        className={`list-group-item border-0 ${pathname.includes(`/Courses/${cid}/${link}`) ? "active" : "text-danger"}`}
      >
        {link}
      </Link>
          ))}
    </div>
  );
}