"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../store";
import * as coursesClient from "../../../../client";
import { Button } from "react-bootstrap";

export default function QuizPreview() {
  const params = useParams();
  const cid = Array.isArray(params.cid) ? params.cid[0] : params.cid || "";
  const qid = Array.isArray(params.qid) ? params.qid[0] : params.qid || "";
  const router = useRouter();
  const { quizzes } = useSelector((state: RootState) => state.quizzesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  
  const isFaculty = currentUser?.role === "FACULTY";
  const existingQuiz = quizzes.find((q: any) => q._id === qid) as any;
  
  const [quiz, setQuiz] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<Record<number, { correct: boolean; userAnswer: any; correctAnswer: any }>>({});

  useEffect(() => {
    if (!isFaculty) {
      router.push(`/Courses/${cid}/Quizzes`);
      return;
    }
    
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
  }, [existingQuiz, isFaculty, router, cid, qid]);

  const handleAnswerChange = (questionIndex: number, answer: any) => {
    setAnswers({ ...answers, [questionIndex]: answer });
  };

  const handleNext = () => {
    if (quiz && currentQuestionIndex < (quiz.questions?.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    if (!quiz) return;
    
    if (!confirm("Are you sure you want to submit this quiz preview?")) {
      return;
    }
    
    let totalScore = 0;
    const newResults: Record<number, { correct: boolean; userAnswer: any; correctAnswer: any }> = {};
    
    quiz.questions?.forEach((question: any, index: number) => {
      const userAnswer = answers[index];
      let isCorrect = false;
      
      if (question.type === "multipleChoice") {
        isCorrect = userAnswer === question.correctAnswer;
      } else if (question.type === "trueFalse") {
        isCorrect = userAnswer === question.correctAnswer;
      } else if (question.type === "fillInBlank") {
        const userAnswerStr = String(userAnswer || "").trim().toLowerCase();
        isCorrect = question.possibleAnswers?.some((ans: string) => 
          ans.trim().toLowerCase() === userAnswerStr
        ) || false;
      }
      
      if (isCorrect) {
        totalScore += question.points || 0;
      }
      
      newResults[index] = {
        correct: isCorrect,
        userAnswer,
        correctAnswer: question.type === "multipleChoice" 
          ? question.correctAnswer 
          : question.type === "trueFalse"
          ? question.correctAnswer
          : question.possibleAnswers?.[0] || ""
      };
    });
    
    setScore(totalScore);
    setResults(newResults);
    setSubmitted(true);
  };

  const renderQuestion = (question: any, index: number) => {
    const isCorrect = submitted && results[index]?.correct;
    const userAnswer = answers[index];
    const showResults = submitted;

    return (
      <div 
        key={question._id || index} 
        style={{ 
          border: "1px solid #ddd", 
          borderRadius: "8px", 
          padding: "20px", 
          marginBottom: "20px",
          backgroundColor: showResults ? (isCorrect ? "#d4edda" : "#f8d7da") : "white",
          display: currentQuestionIndex === index ? "block" : "none"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "15px" }}>
          <h4 style={{ margin: 0 }}>
            Question {index + 1} ({question.points || 0} pts)
          </h4>
          {showResults && (
            <span style={{ 
              padding: "5px 10px",
              borderRadius: "4px",
              backgroundColor: isCorrect ? "#28a745" : "#dc3545",
              color: "white",
              fontSize: "14px",
              fontWeight: "bold"
            }}>
              {isCorrect ? "✓ Correct" : "✗ Incorrect"}
            </span>
          )}
        </div>
        
        <div style={{ marginBottom: "15px" }}>
          <div dangerouslySetInnerHTML={{ __html: question.question || "No question text" }} />
        </div>

        {question.type === "multipleChoice" && (
          <div>
            {question.choices?.map((choice: string, choiceIndex: number) => (
              <label 
                key={choiceIndex}
                style={{ 
                  display: "block", 
                  padding: "10px",
                  marginBottom: "8px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  backgroundColor: showResults && choiceIndex === question.correctAnswer ? "#d4edda" : 
                                  showResults && userAnswer === choiceIndex && !isCorrect ? "#f8d7da" : "white",
                  cursor: submitted ? "default" : "pointer"
                }}
              >
                <input
                  type="radio"
                  name={`question-${index}`}
                  checked={userAnswer === choiceIndex}
                  onChange={() => !submitted && handleAnswerChange(index, choiceIndex)}
                  disabled={submitted}
                  style={{ marginRight: "10px", cursor: submitted ? "default" : "pointer" }}
                />
                {choice || `Choice ${choiceIndex + 1}`}
                {showResults && choiceIndex === question.correctAnswer && (
                  <span style={{ marginLeft: "10px", color: "#28a745", fontWeight: "bold" }}>✓ Correct Answer</span>
                )}
              </label>
            ))}
          </div>
        )}

        {question.type === "trueFalse" && (
          <div>
            <label style={{ 
              display: "block", 
              padding: "10px",
              marginBottom: "8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              backgroundColor: showResults && question.correctAnswer === true ? "#d4edda" : 
                              showResults && userAnswer === true && !isCorrect ? "#f8d7da" : "white",
              cursor: submitted ? "default" : "pointer"
            }}>
              <input
                type="radio"
                name={`question-${index}`}
                checked={userAnswer === true}
                onChange={() => !submitted && handleAnswerChange(index, true)}
                disabled={submitted}
                style={{ marginRight: "10px", cursor: submitted ? "default" : "pointer" }}
              />
              True
              {showResults && question.correctAnswer === true && (
                <span style={{ marginLeft: "10px", color: "#28a745", fontWeight: "bold" }}>✓ Correct Answer</span>
              )}
            </label>
            <label style={{ 
              display: "block", 
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              backgroundColor: showResults && question.correctAnswer === false ? "#d4edda" : 
                              showResults && userAnswer === false && !isCorrect ? "#f8d7da" : "white",
              cursor: submitted ? "default" : "pointer"
            }}>
              <input
                type="radio"
                name={`question-${index}`}
                checked={userAnswer === false}
                onChange={() => !submitted && handleAnswerChange(index, false)}
                disabled={submitted}
                style={{ marginRight: "10px", cursor: submitted ? "default" : "pointer" }}
              />
              False
              {showResults && question.correctAnswer === false && (
                <span style={{ marginLeft: "10px", color: "#28a745", fontWeight: "bold" }}>✓ Correct Answer</span>
              )}
            </label>
          </div>
        )}

        {question.type === "fillInBlank" && (
          <div>
            <input
              type="text"
              value={userAnswer || ""}
              onChange={(e) => !submitted && handleAnswerChange(index, e.target.value)}
              disabled={submitted}
              placeholder="Enter your answer"
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "16px",
                backgroundColor: submitted ? "#f5f5f5" : "white"
              }}
            />
            {showResults && (
              <div style={{ marginTop: "10px", padding: "10px", backgroundColor: "#f8f9fa", borderRadius: "4px" }}>
                <strong>Correct Answer(s): </strong>
                {question.possibleAnswers?.join(", ")}
              </div>
            )}
          </div>
        )}

        {showResults && !isCorrect && (
          <div style={{ 
            marginTop: "10px", 
            padding: "10px", 
            backgroundColor: "#fff3cd", 
            borderRadius: "4px",
            border: "1px solid #ffc107"
          }}>
            <strong>Your Answer: </strong>
            {question.type === "multipleChoice" 
              ? question.choices?.[userAnswer] || "No answer"
              : question.type === "trueFalse"
              ? (userAnswer ? "True" : "False")
              : userAnswer || "No answer"}
          </div>
        )}
      </div>
    );
  };

  if (!isFaculty) {
    return (
      <div style={{ padding: "20px" }}>
        <div style={{ backgroundColor: "#f8d7da", border: "1px solid #f5c6cb", padding: "15px", borderRadius: "4px", color: "#721c24" }}>
          Only faculty members can preview quizzes.
        </div>
        <button onClick={() => router.push(`/Courses/${cid}/Quizzes`)} style={{ marginTop: "10px", padding: "8px 16px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          Return to Quizzes
        </button>
      </div>
    );
  }

  if (!quiz) {
    return <div style={{ padding: "20px" }}>Loading...</div>;
  }

  const totalPoints = quiz.questions?.reduce((sum: number, q: any) => sum + (q.points || 0), 0) || 0;

  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <div>
          <h1>{quiz.title}</h1>
          {submitted && (
            <div style={{ marginTop: "10px" }}>
              <h3 style={{ color: score === totalPoints ? "#28a745" : "#dc3545" }}>
                Score: {score} / {totalPoints} ({Math.round((score / totalPoints) * 100)}%)
              </h3>
            </div>
          )}
        </div>
        <Button 
          variant="primary"
          onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/Edit`)}
        >
          Edit Quiz
        </Button>
      </div>

      {/* Preview Banner */}
      <div style={{ 
        backgroundColor: "#fff3cd", 
        border: "1px solid #ffc107", 
        padding: "15px", 
        borderRadius: "4px", 
        marginBottom: "20px" 
      }}>
        ⚠️ This is a preview of the published version of the quiz
      </div>

      {/* Quiz Instructions */}
      {quiz.description && (
        <div style={{ marginBottom: "30px", padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "4px" }}>
          <h3>Quiz Instructions</h3>
          <div dangerouslySetInnerHTML={{ __html: quiz.description }} />
        </div>
      )}

      {/* Main Content Area */}
      <div style={{ display: "flex", gap: "20px" }}>
        {/* Questions Area */}
        <div style={{ flex: 1 }}>
          {quiz.questions && quiz.questions.length > 0 ? (
            <>
              {/* Show one question at a time */}
              {renderQuestion(quiz.questions[currentQuestionIndex], currentQuestionIndex)}

              {/* Navigation for questions */}
              {!submitted && (
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
                  <button
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                    style={{
                      padding: "10px 20px",
                      backgroundColor: currentQuestionIndex === 0 ? "#ccc" : "#007bff",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: currentQuestionIndex === 0 ? "not-allowed" : "pointer"
                    }}
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={currentQuestionIndex === (quiz.questions?.length || 0) - 1}
                    style={{
                      padding: "10px 20px",
                      backgroundColor: currentQuestionIndex === (quiz.questions?.length || 0) - 1 ? "#ccc" : "#007bff",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: currentQuestionIndex === (quiz.questions?.length || 0) - 1 ? "not-allowed" : "pointer"
                    }}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
              <p>No questions in this quiz yet.</p>
            </div>
          )}
        </div>

        {/* Sidebar - Question Navigation */}
        {quiz.questions && quiz.questions.length > 0 && (
          <div style={{ width: "250px", padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "8px", height: "fit-content" }}>
            <h4 style={{ marginTop: 0 }}>Questions</h4>
            <div>
              {quiz.questions.map((question: any, index: number) => {
                const hasAnswer = answers[index] !== undefined && answers[index] !== null;
                const isCurrent = currentQuestionIndex === index;
                const isCorrect = submitted && results[index]?.correct;
                
                return (
                  <div
                    key={index}
                    onClick={() => !submitted && setCurrentQuestionIndex(index)}
                    style={{
                      padding: "10px",
                      marginBottom: "8px",
                      borderRadius: "4px",
                      cursor: submitted ? "default" : "pointer",
                      backgroundColor: isCurrent ? "#007bff" : 
                                      submitted ? (isCorrect ? "#d4edda" : "#f8d7da") : 
                                      hasAnswer ? "#e7f3ff" : "white",
                      border: isCurrent ? "2px solid #0056b3" : "1px solid #ddd",
                      color: isCurrent ? "white" : "inherit",
                      fontWeight: isCurrent ? "bold" : "normal"
                    }}
                  >
                    Question {index + 1}
                    {hasAnswer && !submitted && <span style={{ marginLeft: "5px" }}>✓</span>}
                    {submitted && (isCorrect ? " ✓" : " ✗")}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      {!submitted && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
          <button
            onClick={handleSubmit}
            style={{
              padding: "15px 40px",
              fontSize: "18px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Submit Quiz
          </button>
        </div>
      )}

      {/* Results Summary */}
      {submitted && (
        <div style={{ 
          marginTop: "30px", 
          padding: "20px", 
          backgroundColor: "#e7f3ff", 
          borderRadius: "8px",
          border: "2px solid #007bff"
        }}>
          <h3>Quiz Results</h3>
          <p>
            You scored <strong>{score} out of {totalPoints}</strong> points ({Math.round((score / totalPoints) * 100)}%).
          </p>
          <p>
            Correct: {Object.values(results).filter(r => r.correct).length} / {quiz.questions?.length || 0}
          </p>
        </div>
      )}
    </div>
  );
}
