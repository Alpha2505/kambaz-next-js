import Link from "next/link";

export default function CourseNavigation({ cid }: { cid: string }) {
  return (
    <div id="wd-courses-navigation">
      <Link href={`/Courses/${cid}/Home`} id="wd-course-home-link">Home</Link><br/>
      <Link href={`/Courses/${cid}/Modules`} id="wd-course-modules-link">Modules</Link><br/>
      <Link href="" id="wd-course-piazza-link">Piazza</Link><br/>
      <Link href="" id="wd-course-zoom-link">Zoom</Link><br/>
      <Link href={`/Courses/${cid}/Assignments`} id="wd-course-assignments-link">Assignments</Link><br/>
      <Link href="" id="wd-course-quizzes-link">Quizzes</Link><br/>
      <Link href="" id="wd-course-grades-link">Grades</Link><br/>
      <Link href="" id="wd-course-people-link">People</Link><br/>
    </div>
  );
}
