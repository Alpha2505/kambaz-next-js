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
      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: "30px", gap: "10px" }}>
        {isFaculty ? (
          <>
            <Button 
              variant="outline-secondary"
              onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/Preview`)}
            >
              Preview
            </Button>
            <Button 
              variant="outline-secondary"
              onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/Edit`)}
            >
              <span style={{ marginRight: "5px" }}></span> Edit
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

      {/* Quiz Details Box */}
      <div style={{ 
        border: "1px dashed #ccc", 
        padding: "30px", 
        borderRadius: "8px",
        backgroundColor: "#f9f9f9"
      }}>
        {/* Quiz Title */}
        <h2 style={{ marginBottom: "30px", fontSize: "28px" }}>{quiz.title}</h2>

        {/* Quiz Properties Table */}
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td style={{  paddingRight: "40px", paddingBottom: "15px", fontWeight: "bold", color: "#666" }}>
                Quiz Type
              </td>
              <td style={{ paddingBottom: "15px", color: "#333" }}>
                {quiz.quizType || "Graded Quiz"}
              </td>
            </tr>
            
            <tr>
              <td style={{  paddingRight: "40px", paddingBottom: "15px", fontWeight: "bold", color: "#666" }}>
                Points
              </td>
              <td style={{ paddingBottom: "15px", color: "#333" }}>
                {quizPoints}
              </td>
            </tr>
            
            <tr>
              <td style={{  paddingRight: "40px", paddingBottom: "15px", fontWeight: "bold", color: "#666" }}>
                Assignment Group
              </td>
              <td style={{ paddingBottom: "15px", color: "#333" }}>
                {quiz.assignmentGroup || "QUIZZES"}
              </td>
            </tr>
            
            <tr>
              <td style={{  paddingRight: "40px", paddingBottom: "15px", fontWeight: "bold", color: "#666" }}>
                Shuffle Answers
              </td>
              <td style={{ paddingBottom: "15px", color: "#333" }}>
                {quiz.shuffleAnswers !== false ? "Yes" : "No"}
              </td>
            </tr>
            
            <tr>
              <td style={{  paddingRight: "40px", paddingBottom: "15px", fontWeight: "bold", color: "#666" }}>
                Time Limit
              </td>
              <td style={{ paddingBottom: "15px", color: "#333" }}>
                {quiz.timeLimit || 20} Minutes
              </td>
            </tr>
            
            <tr>
              <td style={{  paddingRight: "40px", paddingBottom: "15px", fontWeight: "bold", color: "#666" }}>
                Multiple Attempts
              </td>
              <td style={{ paddingBottom: "15px", color: "#333" }}>
                {quiz.multipleAttempts ? "Yes" : "No"}
              </td>
            </tr>
            
            <tr>
              <td style={{  paddingRight: "40px", paddingBottom: "15px", fontWeight: "bold", color: "#666" }}>
                View Responses
              </td>
              <td style={{ paddingBottom: "15px", color: "#333" }}>
                {quiz.viewResponses || "Always"}
              </td>
            </tr>
            
            <tr>
              <td style={{  paddingRight: "40px", paddingBottom: "15px", fontWeight: "bold", color: "#666" }}>
                Show Correct Answers
              </td>
              <td style={{ paddingBottom: "15px", color: "#333" }}>
                {quiz.showCorrectAnswers || "Immediately"}
              </td>
            </tr>
            
            <tr>
              <td style={{  paddingRight: "40px", paddingBottom: "15px", fontWeight: "bold", color: "#666" }}>
                One Question at a Time
              </td>
              <td style={{ paddingBottom: "15px", color: "#333" }}>
                {quiz.oneQuestionAtATime !== false ? "Yes" : "No"}
              </td>
            </tr>
            
            <tr>
              <td style={{  paddingRight: "40px", paddingBottom: "15px", fontWeight: "bold", color: "#666" }}>
                Require Respondus LockDown Browser
              </td>
              <td style={{ paddingBottom: "15px", color: "#333" }}>
                {quiz.requireRespondusLockDown ? "Yes" : "No"}
              </td>
            </tr>
            
            <tr>
              <td style={{  paddingRight: "40px", paddingBottom: "15px", fontWeight: "bold", color: "#666" }}>
                Required to View Quiz Results
              </td>
              <td style={{ paddingBottom: "15px", color: "#333" }}>
                {quiz.requiredToViewQuizResults ? "Yes" : "No"}
              </td>
            </tr>
            
            <tr>
              <td style={{  paddingRight: "40px", paddingBottom: "15px", fontWeight: "bold", color: "#666" }}>
                Webcam Required
              </td>
              <td style={{ paddingBottom: "15px", color: "#333" }}>
                {quiz.webcamRequired ? "Yes" : "No"}
              </td>
            </tr>
            
            <tr>
              <td style={{  paddingRight: "40px", paddingBottom: "15px", fontWeight: "bold", color: "#666" }}>
                Lock Questions After Answering
              </td>
              <td style={{ paddingBottom: "15px", color: "#333" }}>
                {quiz.lockQuestionsAfterAnswering ? "Yes" : "No"}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Dates Table */}
        <div style={{ marginTop: "40px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #ccc" }}>
                <th style={{ textAlign: "left", paddingBottom: "10px", paddingRight: "20px", fontWeight: "bold", color: "#666" }}>
                  Due
                </th>
                <th style={{ textAlign: "left", paddingBottom: "10px", paddingRight: "20px", fontWeight: "bold", color: "#666" }}>
                  For
                </th>
                <th style={{ textAlign: "left", paddingBottom: "10px", paddingRight: "20px", fontWeight: "bold", color: "#666" }}>
                  Available from
                </th>
                <th style={{ textAlign: "left", paddingBottom: "10px", fontWeight: "bold", color: "#666" }}>
                  Until
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ paddingTop: "15px", paddingRight: "20px", color: "#333" }}>
                  {formatDate(quiz.dueDate || quiz.availableUntil)}
                </td>
                <td style={{ paddingTop: "15px", paddingRight: "20px", color: "#333" }}>
                  Everyone
                </td>
                <td style={{ paddingTop: "15px", paddingRight: "20px", color: "#333" }}>
                  {formatDate(quiz.availableFrom)}
                </td>
                <td style={{ paddingTop: "15px", color: "#333" }}>
                  {formatDate(quiz.availableUntil)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}