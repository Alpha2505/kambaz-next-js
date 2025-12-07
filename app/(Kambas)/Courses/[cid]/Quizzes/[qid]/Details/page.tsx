"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../store";
import * as coursesClient from "../../../../client";
import { Button } from "react-bootstrap";

export default function QuizDetails() {
  const params = useParams();
  const cid = Array.isArray(params.cid) ? params.cid[0] : params.cid || "";
  const qid = Array.isArray(params.qid) ? params.qid[0] : params.qid || "";
  const router = useRouter();
  const { quizzes } = useSelector((state: RootState) => state.quizzesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  
  const isFaculty = currentUser?.role === "FACULTY";
  const existingQuiz = quizzes.find((q: any) => q._id === qid) as any;
  
  const [quiz, setQuiz] = useState<any>(null);

  useEffect(() => {
    const loadQuiz = async () => {
      if (existingQuiz) {
        setQuiz(existingQuiz);
      } else {
        try {
          const fetchedQuiz = await coursesClient.findQuizById(qid);
          setQuiz(fetchedQuiz);
        } catch (error) {
          console.error("Failed to fetch quiz:", error);
        }
      }
    };
    loadQuiz();
  }, [qid, existingQuiz]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };
    return date.toLocaleDateString('en-US', options);
  };

  if (!quiz) {
    return <div style={{ padding: "20px" }}>Loading...</div>;
  }

  // Calculate points from questions if not set
  const calculatedPoints = quiz.questions?.reduce((sum: number, q: any) => sum + (q.points || 0), 0) || 0;
  const quizPoints = quiz.points || calculatedPoints;

  return (
    <div style={{ padding: "40px", maxWidth: "1000px", margin: "0 auto" }}>
      {/* Header with buttons */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1>{quiz.title}</h1>
        <div style={{ display: "flex", gap: "10px" }}>
          {isFaculty ? (
            <>
              <Button 
                variant="outline-secondary"
                onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/Preview`)}
              >
                Preview
              </Button>
              <Button 
                variant="primary"
                onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/Edit`)}
              >
                Edit
              </Button>
            </>
          ) : (
            <Button 
              variant="primary"
              onClick={async () => {
                // Check if quiz is available
                const now = new Date();
                const availableFrom = quiz.availableFrom ? new Date(quiz.availableFrom) : null;
                const availableUntil = quiz.availableUntil ? new Date(quiz.availableUntil) : null;
                
                if (availableFrom && now < availableFrom) {
                  alert(`This quiz is not available until ${formatDate(quiz.availableFrom)}`);
                  return;
                }
                
                if (availableUntil && now > availableUntil) {
                  alert("This quiz is no longer available.");
                  return;
                }
                
                if (!quiz.published) {
                  alert("This quiz is not published yet.");
                  return;
                }
                
                router.push(`/Courses/${cid}/Quizzes/${qid}/Take`);
              }}
            >
              Start Quiz
            </Button>
          )}
        </div>
      </div>

      {/* Quiz Properties */}
      <div style={{ marginBottom: "30px" }}>
        <div style={{ marginBottom: "15px", display: "flex", alignItems: "center" }}>
          <strong style={{ width: "250px" }}>Quiz Type:</strong>
          <span>{quiz.quizType || "Graded Quiz"}</span>
        </div>
        
        <div style={{ marginBottom: "15px", display: "flex", alignItems: "center" }}>
          <strong style={{ width: "250px" }}>Points:</strong>
          <span>{quizPoints}</span>
        </div>
        
        <div style={{ marginBottom: "15px", display: "flex", alignItems: "center" }}>
          <strong style={{ width: "250px" }}>Assignment Group:</strong>
          <span>{quiz.assignmentGroup || "Quizzes"}</span>
        </div>
        
        <div style={{ marginBottom: "15px", display: "flex", alignItems: "center" }}>
          <strong style={{ width: "250px" }}>Shuffle Answers:</strong>
          <span>{quiz.shuffleAnswers !== false ? "Yes" : "No"}</span>
        </div>
        
        <div style={{ marginBottom: "15px", display: "flex", alignItems: "center" }}>
          <strong style={{ width: "250px" }}>Time Limit:</strong>
          <span>{quiz.timeLimit || 20} Minutes</span>
        </div>
        
        <div style={{ marginBottom: "15px", display: "flex", alignItems: "center" }}>
          <strong style={{ width: "250px" }}>Multiple Attempts:</strong>
          <span>{quiz.multipleAttempts ? "Yes" : "No"}</span>
        </div>
        
        {quiz.multipleAttempts && (
          <div style={{ marginBottom: "15px", display: "flex", alignItems: "center", marginLeft: "250px" }}>
            <strong style={{ width: "200px" }}>How Many Attempts:</strong>
            <span>{quiz.attemptsAllowed || 1}</span>
          </div>
        )}
        
        <div style={{ marginBottom: "15px", display: "flex", alignItems: "center" }}>
          <strong style={{ width: "250px" }}>Show Correct Answers:</strong>
          <span>{quiz.showCorrectAnswers || "Immediately"}</span>
        </div>
        
        <div style={{ marginBottom: "15px", display: "flex", alignItems: "center" }}>
          <strong style={{ width: "250px" }}>Access Code:</strong>
          <span>{quiz.accessCode || "No access code"}</span>
        </div>
        
        <div style={{ marginBottom: "15px", display: "flex", alignItems: "center" }}>
          <strong style={{ width: "250px" }}>One Question at a Time:</strong>
          <span>{quiz.oneQuestionAtATime !== false ? "Yes" : "No"}</span>
        </div>
        
        <div style={{ marginBottom: "15px", display: "flex", alignItems: "center" }}>
          <strong style={{ width: "250px" }}>Webcam Required:</strong>
          <span>{quiz.webcamRequired ? "Yes" : "No"}</span>
        </div>
        
        <div style={{ marginBottom: "15px", display: "flex", alignItems: "center" }}>
          <strong style={{ width: "250px" }}>Lock Questions After Answering:</strong>
          <span>{quiz.lockQuestionsAfterAnswering ? "Yes" : "No"}</span>
        </div>
      </div>

      <hr style={{ border: "none", borderTop: "1px solid #ddd", margin: "30px 0" }} />

      {/* Dates Section */}
      <div>
        <div style={{ marginBottom: "15px", display: "flex", alignItems: "center" }}>
          <strong style={{ width: "150px" }}>Due:</strong>
          <span>{formatDate(quiz.dueDate || quiz.availableUntil)}</span>
        </div>
        
        <div style={{ marginBottom: "15px", display: "flex", alignItems: "center" }}>
          <strong style={{ width: "150px" }}>For:</strong>
          <span>Everyone</span>
        </div>
        
        <div style={{ marginBottom: "15px", display: "flex", alignItems: "center" }}>
          <strong style={{ width: "150px" }}>Available from:</strong>
          <span>{formatDate(quiz.availableFrom)}</span>
        </div>
        
        <div style={{ marginBottom: "15px", display: "flex", alignItems: "center" }}>
          <strong style={{ width: "150px" }}>Until:</strong>
          <span>{formatDate(quiz.availableUntil)}</span>
        </div>
      </div>
    </div>
  );
}

