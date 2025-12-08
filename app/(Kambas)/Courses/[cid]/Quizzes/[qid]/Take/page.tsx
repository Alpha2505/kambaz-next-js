"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../store";
import * as coursesClient from "../../../../client";
import { Button } from "react-bootstrap";

export default function TakeQuiz() {
  const params = useParams();
  const cid = Array.isArray(params.cid) ? params.cid[0] : params.cid || "";
  const qid = Array.isArray(params.qid) ? params.qid[0] : params.qid || "";
  const router = useRouter();
  const { quizzes } = useSelector((state: RootState) => state.quizzesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  
  const isFaculty = currentUser?.role === "FACULTY";
  const existingQuiz = quizzes.find((q: any) => q._id === qid) as any;
  
  const [quiz, setQuiz] = useState<any>(null);
  const [attempt, setAttempt] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    if (isFaculty) {
      router.push(`/Courses/${cid}/Quizzes/${qid}/Preview`);
      return;
    }

    const loadQuiz = async () => {
      try {
        setLoading(true);
        let quizData = existingQuiz;
        
        if (!quizData) {
          quizData = await coursesClient.findQuizById(qid);
        }
        
        if (!quizData) {
          setError("Quiz not found");
          setLoading(false);
          return;
        }

        if (!quizData.published) {
          setError("This quiz is not available");
          setLoading(false);
          return;
        }

        setQuiz(quizData);

        // Check for existing attempt
        const latestAttempt = await coursesClient.getLatestAttempt(qid);
        
        if (latestAttempt && latestAttempt.completed) {
          // Show results
          setAttempt(latestAttempt);
          setSubmitted(true);
          const answerMap: Record<number, any> = {};
          latestAttempt.answers?.forEach((ans: any, idx: number) => {
            // Handle both old format (raw answers) and new format (objects with answer property)
            const actualAnswer = typeof ans === 'object' && ans.answer !== undefined ? ans.answer : ans;
            answerMap[idx] = actualAnswer;
          });
          setAnswers(answerMap);
        } else if (latestAttempt && !latestAttempt.completed) {
          // Resume existing attempt
          setAttempt(latestAttempt);
          const answerMap: Record<number, any> = {};
          latestAttempt.answers?.forEach((ans: any, idx: number) => {
            // Handle both old format (raw answers) and new format (objects with answer property)
            const actualAnswer = typeof ans === 'object' && ans.answer !== undefined ? ans.answer : ans;
            answerMap[idx] = actualAnswer;
          });
          setAnswers(answerMap);
        } else {
          // Start new attempt
          try {
            const newAttempt = await coursesClient.startQuizAttempt(qid);
            setAttempt(newAttempt);
          } catch (err: any) {
            setError(err.response?.data?.message || "Failed to start quiz attempt");
          }
        }
      } catch (err: any) {
        setError(err.message || "Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [existingQuiz, isFaculty, router, cid, qid]);

  // Auto-save answers
  useEffect(() => {
    if (attempt && !submitted) {
      const saveTimer = setTimeout(() => {
        setLastSaved(new Date());
      }, 30000); // Auto-save indicator every 30 seconds
      return () => clearTimeout(saveTimer);
    }
  }, [answers, attempt, submitted]);

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

  const handleSubmit = async () => {
    if (!attempt || !quiz) return;
    
    if (!confirm("Are you sure you want to submit this quiz? You cannot change your answers after submission.")) {
      return;
    }

    try {
      // Calculate score on frontend before submitting
      let calculatedScore = 0;
      const answerArray = quiz.questions?.map((question: any, idx: number) => {
        const userAnswer = answers[idx] ?? null;
        let isCorrect = false;
        
        if (question.type === "multipleChoice") {
          isCorrect = userAnswer === question.correctAnswer;
        } else if (question.type === "trueFalse") {
          isCorrect = userAnswer === question.correctAnswer;
        } else if (question.type === "fillInBlank") {
          if (Array.isArray(userAnswer)) {
            isCorrect = question.possibleAnswers?.every((correctAns: string, index: number) => {
              const userAnswerStr = String(userAnswer[index] || "").trim().toLowerCase();
              const correctAnswerStr = String(correctAns || "").trim().toLowerCase();
              return userAnswerStr === correctAnswerStr;
            }) || false;
          } else {
            const userAnswerStr = String(userAnswer || "").trim().toLowerCase();
            const correctAnswerStr = String(question.possibleAnswers?.[0] || "").trim().toLowerCase();
            isCorrect = userAnswerStr === correctAnswerStr;
          }
        }
        
        // Add points if correct
        const pointsEarned = isCorrect ? (question.points || 0) : 0;
        calculatedScore += pointsEarned;
        
        // Return answer with points earned for this question
        return {
          answer: userAnswer,
          pointsEarned: pointsEarned,
          totalScore: calculatedScore  // Include running total
        };
      }) || [];
      
      // Add total score to the last element or as a separate property
      if (answerArray.length > 0) {
        answerArray[answerArray.length - 1].totalScore = calculatedScore;
      }
      
      const submittedAttempt = await coursesClient.submitQuizAttempt(attempt._id, answerArray as any);
      setAttempt(submittedAttempt);
      setSubmitted(true);
    } catch (error) {
      console.error("Failed to submit quiz:", error);
      alert("Failed to submit quiz. Please try again.");
    }
  };

  // Calculate results if submitted
  const results: Record<number, { correct: boolean; userAnswer: any; correctAnswer: any }> = {};
  let calculatedScore = 0;
  
  if (submitted && quiz && attempt) {
    quiz.questions?.forEach((question: any, index: number) => {
      const userAnswer = answers[index];
      let isCorrect = false;
      
      if (question.type === "multipleChoice") {
        isCorrect = userAnswer === question.correctAnswer;
      } else if (question.type === "trueFalse") {
        isCorrect = userAnswer === question.correctAnswer;
      } else if (question.type === "fillInBlank") {
        if (Array.isArray(userAnswer)) {
          // Multiple blanks - check if ALL answers match their corresponding possible answers
          isCorrect = question.possibleAnswers?.every((correctAns: string, idx: number) => {
            const userAnswerStr = String(userAnswer[idx] || "").trim().toLowerCase();
            const correctAnswerStr = String(correctAns || "").trim().toLowerCase();
            return userAnswerStr === correctAnswerStr;
          }) || false;
        } else {
          // Single blank - check against first possible answer
          const userAnswerStr = String(userAnswer || "").trim().toLowerCase();
          const correctAnswerStr = String(question.possibleAnswers?.[0] || "").trim().toLowerCase();
          isCorrect = userAnswerStr === correctAnswerStr;
        }
      }
      
      // Add points if correct
      if (isCorrect) {
        calculatedScore += question.points || 0;
      }
      
      results[index] = {
        correct: isCorrect,
        userAnswer,
        correctAnswer: question.type === "multipleChoice" 
          ? question.correctAnswer 
          : question.type === "trueFalse"
          ? question.correctAnswer
          : question.possibleAnswers?.[0] || ""
      };
    });
  }

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
            {question.possibleAnswers && question.possibleAnswers.length > 0 ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {question.possibleAnswers.map((_: string, blankIndex: number) => (
                  <div key={blankIndex} style={{ flex: "0 0 auto" }}>
                    <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", color: "#666" }}>
                      Blank {blankIndex + 1}:
                    </label>
                    <input
                      type="text"
                      value={Array.isArray(userAnswer) ? (userAnswer[blankIndex] || "") : (blankIndex === 0 ? userAnswer || "" : "")}
                      onChange={(e) => {
                        if (!submitted) {
                          const newAnswers = Array.isArray(userAnswer) 
                            ? [...userAnswer] 
                            : new Array(question.possibleAnswers.length).fill("");
                          newAnswers[blankIndex] = e.target.value;
                          handleAnswerChange(index, newAnswers);
                        }
                      }}
                      disabled={submitted}
                      placeholder={`Answer ${blankIndex + 1}`}
                      style={{
                        width: "150px",
                        padding: "8px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        fontSize: "14px",
                        backgroundColor: submitted ? "#f5f5f5" : "white"
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : (
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
            )}
            
            {showResults && (
              <div style={{ marginTop: "15px", padding: "10px", backgroundColor: "#f8f9fa", borderRadius: "4px" }}>
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
              ? (userAnswer !== undefined ? (userAnswer ? "True" : "False") : "No answer")
              : Array.isArray(userAnswer) 
              ? userAnswer.join(", ") || "No answer"
              : userAnswer || "No answer"}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return <div style={{ padding: "20px" }}>Loading quiz...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: "20px" }}>
        <div style={{ backgroundColor: "#f8d7da", border: "1px solid #f5c6cb", padding: "15px", borderRadius: "4px", color: "#721c24" }}>
          {error}
        </div>
        <button onClick={() => router.push(`/Courses/${cid}/Quizzes`)} style={{ marginTop: "10px", padding: "8px 16px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          Return to Quizzes
        </button>
      </div>
    );
  }

  if (!quiz) {
    return <div style={{ padding: "20px" }}>Quiz not found</div>;
  }

  const totalPoints = quiz.questions?.reduce((sum: number, q: any) => sum + (q.points || 0), 0) || 0;
  const oneQuestionAtATime = quiz.oneQuestionAtATime !== false;

  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <div>
          <h1>{quiz.title}</h1>
          {submitted && attempt && (
            <div style={{ marginTop: "10px" }}>
              <h3 style={{ color: (attempt.score || calculatedScore) === totalPoints ? "#28a745" : "#dc3545" }}>
                Score: {attempt.score || calculatedScore} / {totalPoints} ({Math.round(((attempt.score || calculatedScore) / totalPoints) * 100)}%)
              </h3>
            </div>
          )}
        </div>
        {submitted && (
  <div style={{ display: "flex", gap: "10px" }}>
    {/* Show Retake button only if multiple attempts allowed AND attempts remaining */}
    {quiz.multipleAttempts && (attempt?.attemptNumber || 0) < (quiz.attemptsAllowed || 1) && (
      <Button 
        variant="success"
        onClick={async () => {
          if (confirm(`Start attempt ${(attempt?.attemptNumber || 0) + 1} of ${quiz.attemptsAllowed || 1}?`)) {
            window.location.reload();
          }
        }}
      >
        Retake Quiz (Attempt {(attempt?.attemptNumber || 0) + 1} of {quiz.attemptsAllowed || 1})
      </Button>
    )}
    
    {/* Always show back button */}
    <Button 
      variant="outline-primary"
      onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/Details`)}
    >
      Back to Quiz Details
    </Button>
  </div>
)}
      </div>

      {/* Preview Banner for Faculty */}
      {isFaculty && (
        <div style={{ 
          backgroundColor: "#fff3cd", 
          border: "1px solid #ffc107", 
          padding: "15px", 
          borderRadius: "4px", 
          marginBottom: "20px" 
        }}>
          ⚠️ This is a preview of the published version of the quiz
        </div>
      )}

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
              {oneQuestionAtATime ? (
                // Show one question at a time
                renderQuestion(quiz.questions[currentQuestionIndex], currentQuestionIndex)
              ) : (
                // Show all questions
                quiz.questions.map((question: any, index: number) => renderQuestion(question, index))
              )}

              {/* Navigation for one question at a time */}
              {oneQuestionAtATime && !submitted && (
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
                    onClick={() => setCurrentQuestionIndex(index)}
                    style={{
                      padding: "10px",
                      marginBottom: "8px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      backgroundColor: isCurrent ? "#007bff" : 
                                      submitted ? (isCorrect ? "#d4edda" : "#f8d7da") : 
                                      hasAnswer ? "#e7f3ff" : "white",
                      border: isCurrent ? "2px solid #0056b3" : "1px solid #ddd",
                      color: isCurrent ? "white" : "inherit",
                      fontWeight: isCurrent ? "bold" : "normal",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      if (!isCurrent) {
                        e.currentTarget.style.backgroundColor = submitted 
                          ? (isCorrect ? "#c3e6cb" : "#f5c6cb")
                          : hasAnswer ? "#d1ecf1" : "#e9ecef";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isCurrent) {
                        e.currentTarget.style.backgroundColor = submitted 
                          ? (isCorrect ? "#d4edda" : "#f8d7da")
                          : hasAnswer ? "#e7f3ff" : "white";
                      }
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

      {/* Bottom Bar */}
      {!submitted && (
        <div style={{ 
          position: "fixed", 
          bottom: 0, 
          left: 0, 
          right: 0, 
          backgroundColor: "white", 
          borderTop: "1px solid #ddd",
          padding: "15px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 -2px 10px rgba(0,0,0,0.1)"
        }}>
          <div>
            {lastSaved && (
              <span style={{ color: "#666", fontSize: "14px" }}>
                Quiz saved at {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </div>
          <button
            onClick={handleSubmit}
            style={{
              padding: "12px 30px",
              fontSize: "16px",
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
      {submitted && attempt && (
        <div style={{ 
          marginTop: "30px", 
          padding: "20px", 
          backgroundColor: "#e7f3ff", 
          borderRadius: "8px",
          border: "2px solid #007bff"
        }}>
          <h3>Quiz Results</h3>
          <p>
            You scored <strong>{attempt.score || calculatedScore} out of {totalPoints}</strong> points ({Math.round(((attempt.score || calculatedScore) / totalPoints) * 100)}%).
          </p>
          <p>
            Correct: {Object.values(results).filter(r => r.correct).length} / {quiz.questions?.length || 0}
          </p>
          {quiz.multipleAttempts && (
            <p>
              Attempt {attempt.attemptNumber} of {quiz.attemptsAllowed || 1}
            </p>
          )}
        </div>
      )}

      {/* Spacer for fixed bottom bar */}
      {!submitted && <div style={{ height: "80px" }} />}
    </div>
  );
}