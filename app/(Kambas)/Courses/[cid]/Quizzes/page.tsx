"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { setQuizzes, deleteQuiz, updateQuiz } from "./reducer";
import { RootState } from "../../../store";
import { BsGripVertical, BsPlus } from "react-icons/bs";
import { FaSearch, FaCaretDown, FaTrash, FaBan } from "react-icons/fa";
import { IoEllipsisVertical } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";
import { MdOutlineQuiz } from "react-icons/md";
import { Modal, Button, Dropdown } from "react-bootstrap";
import { useState, useEffect, useRef } from "react";
import * as coursesClient from "../../client";
import GreenCheckmark from "../Modules/GreenCheckmark";

export default function Quizzes() {
  const params = useParams();
  const cid = Array.isArray(params.cid) ? params.cid[0] : params.cid || "";
  const router = useRouter();
  const { quizzes } = useSelector((state: RootState) => state.quizzesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const dispatch = useDispatch();
  
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<string | null>(null);
  const [showContextMenu, setShowContextMenu] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [studentScores, setStudentScores] = useState<Record<string, any>>({});
  const contextMenuRef = useRef<HTMLDivElement>(null);

  // Check if current user is faculty
  const isFaculty = (currentUser as any)?.role === "FACULTY";

  // Fetch quizzes from server
  const fetchQuizzes = async () => {
    const fetchedQuizzes = await coursesClient.findQuizzesForCourse(cid);
    dispatch(setQuizzes(fetchedQuizzes));
  };

  useEffect(() => {
    fetchQuizzes();
  }, [cid]);

  // Filter quizzes for this course
  const courseQuizzes = quizzes.filter((quiz: any) => quiz.course === cid);

  // Fetch student scores for all quizzes
  useEffect(() => {
    const fetchStudentScores = async () => {
      if (!isFaculty && currentUser && courseQuizzes.length > 0) {
        const scores: Record<string, any> = {};
        for (const quiz of courseQuizzes as any[]) {
          try {
            const latestAttempt = await coursesClient.getLatestAttempt(quiz._id);
            if (latestAttempt && latestAttempt.completed) {
              scores[quiz._id] = latestAttempt;
            }
          } catch (error) {
            // Quiz not attempted yet
          }
        }
        setStudentScores(scores);
      }
    };
    fetchStudentScores();
  }, [quizzes, cid, isFaculty, currentUser]);
  
  // Filter quizzes based on search term and published status
  const filteredQuizzes = courseQuizzes
    .filter((quiz: any) => {
      // For students and TAs, only show published quizzes
      if (!isFaculty && !quiz.published) {
        return false;
      }
      
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        quiz.title?.toLowerCase().includes(searchLower) ||
        quiz.description?.toLowerCase().includes(searchLower)
      );
    })
    .sort((a: any, b: any) => {
      // Sort by available date (availableFrom or dueDate)
      // Use availableFrom first, fall back to dueDate, then to created date
      const dateA = new Date(a.availableFrom || a.dueDate || a.createdAt || 0);
      const dateB = new Date(b.availableFrom || b.dueDate || b.createdAt || 0);
      return dateA.getTime() - dateB.getTime();
    });

  // Function to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "No date";
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

  // Get availability status
  const getAvailabilityStatus = (quiz: any) => {
    if (!quiz.published) {
      return "Unpublished";
    }
    
    const now = new Date();
    const availableFrom = quiz.availableFrom ? new Date(quiz.availableFrom) : null;
    const availableUntil = quiz.availableUntil ? new Date(quiz.availableUntil) : null;
    
    if (availableUntil && now > availableUntil) {
      return "Closed";
    }
    
    if (availableFrom && now < availableFrom) {
      return `Not available until ${formatDate(quiz.availableFrom)}`;
    }
    
    return "Available";
  };

  const handleDeleteClick = (e: React.MouseEvent, quizId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setQuizToDelete(quizId);
    setShowDeleteDialog(true);
    setShowContextMenu(null);
  };

  const onRemoveQuiz = async (quizId: string) => {
    await coursesClient.deleteQuiz(quizId);
    dispatch(deleteQuiz(quizId));
  };

  const handleConfirmDelete = () => {
    if (quizToDelete) {
      onRemoveQuiz(quizToDelete);
    }
    setShowDeleteDialog(false);
    setQuizToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setQuizToDelete(null);
  };

  const handleAddQuiz = async () => {
    const defaultQuiz = {
      title: "New Quiz",
      description: "",
      points: 0,
      published: false,
      questions: [],
      questionCount: 0,
    };
    try {
      const newQuiz = await coursesClient.createQuizForCourse(cid, defaultQuiz);
      dispatch(setQuizzes([...quizzes, newQuiz]));
      router.push(`/Courses/${cid}/Quizzes/${newQuiz._id}/Edit`);
    } catch (error) {
      console.error("Failed to create quiz:", error);
      alert("Failed to create quiz. Please try again.");
    }
  };

  const handlePublishToggle = async (e: React.MouseEvent, quiz: any) => {
    e.preventDefault();
    e.stopPropagation();
    const updatedQuiz = { ...quiz, published: !quiz.published };
    const result = await coursesClient.updateQuiz(updatedQuiz);
    dispatch(updateQuiz(result));
    setShowContextMenu(null);
  };

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setShowContextMenu(null);
      }
    };

    if (showContextMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showContextMenu]);

  return (
    <div id="wd-quizzes">
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
            placeholder="Search for Quiz"
            id="wd-search-quiz"
            className="form-control ps-5"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          {/* Only show buttons for Faculty */}
          {isFaculty && (
            <>
              <button 
                id="wd-add-quiz" 
                className="btn btn-danger"
                onClick={handleAddQuiz}
              >
                <BsPlus className="fs-5" /> Quiz
              </button>
              <button className="btn btn-link ms-2">
                <IoEllipsisVertical className="fs-5" />
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Quizzes Header */}
      <div className="d-flex justify-content-between align-items-center border p-3 bg-secondary">
        <div className="d-flex align-items-center">
          <BsGripVertical className="me-2 fs-4" />
          <FaCaretDown className="me-2" />
          <h3 id="wd-quizzes-title" className="mb-0 fs-5 fw-bold">
            Assignment Quizzes
          </h3>
        </div>
        <div className="d-flex align-items-center">
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
      
      {/* Quiz List */}
      {filteredQuizzes.length === 0 ? (
        <div className="text-center py-5 px-3">
          <p className="text-muted">
            {searchTerm ? (
              `No quizzes found matching "${searchTerm}"`
            ) : (
              isFaculty ? 
                <>No quizzes available. Click the <strong>+ Quiz</strong> button to add a new quiz.</> :
                "No published quizzes available."
            )}
          </p>
        </div>
      ) : (
        <ul id="wd-quiz-list" className="list-group border-start border-success border-5">
          {(
            filteredQuizzes.map((quiz: any) => {
            const availabilityStatus = getAvailabilityStatus(quiz);
            const isPublished = quiz.published;
            
            return (
              <li 
                key={quiz._id}
                className="wd-quiz-list-item list-group-item d-flex align-items-start p-3 border-start-0 border-end-1 border-top-0"
              >
                <BsGripVertical className="me-2 fs-3 mt-1" />
                <MdOutlineQuiz className="me-3 fs-3 text-success mt-1" />
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center mb-1">
                    <Link 
                      href={`/Courses/${cid}/Quizzes/${quiz._id}/Details`} 
                      className="wd-quiz-link text-decoration-none fs-5 fw-bold text-dark me-2"
                    >
                      {quiz.title}
                    </Link>
                    {/* Publish/Unpublish toggle - ONLY FOR FACULTY */}
                    {isFaculty && (
                      <button
                        className="btn btn-link p-0 ms-2"
                        onClick={(e) => handlePublishToggle(e, quiz)}
                        title={isPublished ? "Unpublish" : "Publish"}
                      >
                        {isPublished ? (
                          <span className="text-success"><GreenCheckmark /></span>
                        ) : (
                          <span className="text-danger"><FaBan style={{ color: "#dc3545" }} />
</span>
                        )}
                      </button>
                    )}
                  </div>
                  <div className="small">
                    <span className={`fw-bold fs-7 ${
                      availabilityStatus === "Closed" ? "text-danger" : 
                      availabilityStatus === "Available" ? "text-success" : 
                      "text-muted"
                    }`}>
                      {availabilityStatus}
                    </span>
                    {(quiz.dueDate || quiz.availableUntil) && (
                      <>
                        {" | "}
                        <span className="fw-bold fs-7">Due</span> {formatDate(quiz.dueDate || quiz.availableUntil)}
                      </>
                    )}
                    {quiz.points !== undefined && (
                      <>
                        {" | "}
                        <span className="fw-bold fs-7">{quiz.points} pts</span>
                      </>
                    )}
                    {" | "}
                    <span className="fw-bold fs-7">{quiz.questionCount || 0} Questions</span>
                    {/* Score for students */}
                    {!isFaculty && studentScores[quiz._id] && (
                      <>
                        {" | "}
                        <span className="fw-bold fs-7">
                          Score: {studentScores[quiz._id].score} / {studentScores[quiz._id].totalPoints}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Context Menu - ONLY FOR FACULTY */}
                {isFaculty && (
                  <div className="position-relative">
                    <button
                      className="btn btn-link p-0"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowContextMenu(showContextMenu === quiz._id ? null : quiz._id);
                      }}
                    >
                      <IoEllipsisVertical className="fs-5" />
                    </button>
                    {showContextMenu === quiz._id && (
                      <div 
                        ref={contextMenuRef}
                        className="position-absolute bg-white border shadow-lg rounded"
                        style={{ 
                          right: 0, 
                          top: "100%", 
                          zIndex: 1000,
                          minWidth: "150px"
                        }}
                      >
                        <button
                          className="btn btn-link text-dark text-decoration-none d-block w-100 text-start px-3 py-2"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            router.push(`/Courses/${cid}/Quizzes/${quiz._id}/Edit`);
                            setShowContextMenu(null);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-link text-dark text-decoration-none d-block w-100 text-start px-3 py-2"
                          onClick={(e) => handlePublishToggle(e, quiz)}
                        >
                          {isPublished ? "Unpublish" : "Publish"}
                        </button>
                        <button
                          className="btn btn-link text-danger text-decoration-none d-block w-100 text-start px-3 py-2"
                          onClick={(e) => handleDeleteClick(e, quiz._id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
                
                {!isFaculty && (
                  <FaCheckCircle className="text-success me-2 fs-5" />
                )}
              </li>
            );
          }))}
        </ul>
      )}

      {/* Delete Confirmation Dialog - Only for Faculty */}
      {isFaculty && (
        <Modal show={showDeleteDialog} onHide={handleCancelDelete}>
          <Modal.Header closeButton>
            <Modal.Title>Delete Quiz</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to remove this quiz?
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