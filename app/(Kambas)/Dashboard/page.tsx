"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { RootState } from "../store";
import { useDispatch, useSelector } from "react-redux";
import { setCourses } from "../Courses/reducer";
import { setEnrollments, enrollInCourse, unenrollFromCourse } from "../Dashboard/reducer";
import { Row, Col, Card, CardImg, CardBody, CardTitle, CardText, Button, FormControl } from "react-bootstrap";
import * as client from "../Courses/client";

export default function Dashboard() {
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const { enrollments } = useSelector((state: RootState) => state.enrollmentsReducer);
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const dispatch = useDispatch();
  
  const onDeleteCourse = async (courseId: string) => {
    const status = await client.deleteCourse(courseId);
    dispatch(setCourses(courses.filter((course) => course._id !== courseId)));
  };

  const onUpdateCourse = async () => {
    await client.updateCourse(course);
    dispatch(setCourses(courses.map((c) => {
        if (c._id === course._id) { return course; }
        else { return c; }
    })));
  };
  
  const onAddNewCourse = async () => {
    const courseToCreate = {
      ...course,
      number: course.number || "NEW000",
      startDate: course.startDate || new Date().toISOString().split('T')[0],
      endDate: course.endDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      image: course.image || "/images/Course1.jpg",
      department: course.department || "D123",
      credits: course.credits || 4
    };
    
    const newCourse = await client.createCourse(courseToCreate);
    dispatch(setCourses([...courses, newCourse]));
  };
  
  const [course, setCourse] = useState<any>({
    _id: "0", 
    name: "New Course", 
    number: "New Number",
    startDate: "2023-09-10", 
    endDate: "2023-12-15",
    image: "/images/Course1.jpg", 
    description: "New Description",
    department: "D123",
    credits: 4
  });

  const [showAllCourses, setShowAllCourses] = useState(false);
  const isFaculty = currentUser?.role === "FACULTY";

  // UPDATED: Fetch courses AND enrollments from server on component load
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load all courses
        const fetchedCourses = await client.fetchAllCourses();
        dispatch(setCourses(fetchedCourses));
        
        // Load enrollments for current user (students only)
        if (currentUser && !isFaculty) {
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
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    
    loadData();
  }, [currentUser]); // Re-run when currentUser changes

  // Check if user is enrolled in a course
  const isEnrolled = (courseId: string) => {
    if (!currentUser) return false;
    return enrollments.some(
      (enrollment: any) =>
        enrollment.user === currentUser._id && enrollment.course === courseId
    );
  };

  // Calls API then updates Redux state
  const handleEnroll = async (courseId: string) => {
    if (!currentUser) return;
    try {
      await client.enrollIntoCourse(currentUser._id, courseId);
      dispatch(enrollInCourse({ userId: currentUser._id, courseId }));
    } catch (error) {
      console.error("Failed to enroll:", error);
      alert("Failed to enroll in course");
    }
  };

  const handleUnenroll = async (courseId: string) => {
    if (!currentUser) return;
    try {
      await client.unenrollFromCourse(currentUser._id, courseId);
      dispatch(unenrollFromCourse({ userId: currentUser._id, courseId }));
    } catch (error) {
      console.error("Failed to unenroll:", error);
      alert("Failed to unenroll from course");
    }
  };

  // Filter courses based on toggle
  const displayedCourses = isFaculty 
    ? courses // Faculty always sees all courses
    : showAllCourses
    ? courses // Show all courses when toggled ON
    : currentUser
    ? courses.filter((course) => isEnrolled(course._id)) // Show only enrolled courses when toggled OFF
    : [];

  return (
    <div id="wd-dashboard">
      <div className="d-flex justify-content-between align-items-center">
        <h1 id="wd-dashboard-title">Dashboard</h1>
        {!isFaculty && currentUser && (
          <Button
            variant="primary"
            onClick={() => setShowAllCourses(!showAllCourses)}
            id="wd-enrollments-btn"
          >
            {showAllCourses ? "My Enrollments" : "All Courses"}
          </Button>
        )}
      </div>
      <hr />

      {/* Only show course management for Faculty */}
      {isFaculty && (
        <>
          <h5>
            New Course
            <button 
              className="btn btn-primary float-end"
              id="wd-add-new-course-click"
              onClick={onAddNewCourse}
            > 
              Add 
            </button>
            <button 
              className="btn btn-warning float-end me-2"
              onClick={onUpdateCourse}  
              id="wd-update-course-click"
            >
              Update 
            </button>
          </h5>
          <br />
          <FormControl 
            value={course.name} 
            className="mb-2"
            onChange={(e) => setCourse({ ...course, name: e.target.value })} 
          />
          <FormControl 
            value={course.description} 
            as="textarea"
            rows={3}
            onChange={(e) => setCourse({ ...course, description: e.target.value })} 
          />
          <hr />
        </>
      )}

      <h2 id="wd-dashboard-published">
        {showAllCourses ? "All Courses" : "Published Courses"} ({displayedCourses.length})
      </h2> 
      <hr />

      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {displayedCourses.map((course) => (
            <Col 
              key={course._id} 
              className="wd-dashboard-course" 
              style={{ width: "300px" }}
            >
              <Card>
                <Link 
                  href={`/Courses/${course._id}/Home`}
                  className="wd-dashboard-course-link text-decoration-none text-dark"
                  onClick={(e) => {
                    if (!isFaculty && !isEnrolled(course._id)) {
                      e.preventDefault();
                      alert("You must be enrolled in this course to access it.");
                    }
                  }}
                >
                  <CardImg 
                    variant="top" 
                    src={course.image}
                    width="100%" 
                    height={160} 
                  />
                  <CardBody className="card-body">
                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                      {course.name}
                    </CardTitle>
                    <CardText 
                      className="wd-dashboard-course-description overflow-hidden" 
                      style={{ height: "100px" }}
                    >
                      {course.description}
                    </CardText>

                    {isFaculty && (
                      <>
                        <Button variant="primary"> Go </Button>
                        <button 
                          onClick={(event) => {
                            event.preventDefault();
                            onDeleteCourse(course._id);
                          }}
                          className="btn btn-danger float-end"
                          id="wd-delete-course-click"
                        >
                          Delete
                        </button>
                        <button 
                          id="wd-edit-course-click"
                          onClick={(event) => {
                            event.preventDefault();
                            setCourse(course);
                          }}
                          className="btn btn-warning me-2 float-end"
                        >
                          Edit
                        </button>
                      </>
                    )}

                    {!isFaculty && currentUser && (
                      <>
                        {isEnrolled(course._id) ? (
                          <>
                            <Button variant="primary"> Go </Button>
                            <button 
                              onClick={async (event) => {
                                event.preventDefault();
                                await handleUnenroll(course._id);
                              }} 
                              className="btn btn-danger float-end"
                              id={`wd-unenroll-course-${course._id}`}
                            >
                              Unenroll
                            </button>
                          </>
                        ) : (
                          <button 
                            onClick={async (event) => {
                              event.preventDefault();
                              await handleEnroll(course._id);
                            }} 
                            className="btn btn-success w-100"
                            id={`wd-enroll-course-${course._id}`}
                          >
                            Enroll
                          </button>
                        )}
                      </>
                    )}
                  </CardBody>
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}