"use client";

export default function QuizDetailsEditor({ 
  quiz, 
  setQuiz, 
  onSave, 
  onSaveAndPublish, 
  onCancel 
}: { 
  quiz: any; 
  setQuiz: (quiz: any) => void; 
  onSave: () => void;
  onSaveAndPublish: () => void;
  onCancel: () => void;
}) {
  return (
    <>
      {/* Quiz Name */}
      <div style={{ marginBottom: "25px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "bold" }}>
          Title
        </label>
        <input
          type="text"
          value={quiz.title}
          onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
          style={{
            width: "100%",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "16px"
          }}
        />
      </div>

      {/* Description - WYSIWYG placeholder (using textarea for now) */}
      <div style={{ marginBottom: "25px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "bold" }}>
          Description
        </label>
        <textarea
          value={quiz.description}
          onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
          rows={8}
          placeholder="Quiz Description"
          style={{
            width: "100%",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "16px"
          }}
        />
      </div>

      {/* Quiz Type */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "25px" }}>
        <label style={{ width: "220px", textAlign: "right", paddingRight: "15px", fontSize: "14px" }}>
          Quiz Type
        </label>
        <select
          value={quiz.quizType || "Graded Quiz"}
          onChange={(e) => setQuiz({ ...quiz, quizType: e.target.value })}
          style={{
            flex: 1,
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "16px"
          }}
        >
          <option value="Graded Quiz">Graded Quiz</option>
          <option value="Practice Quiz">Practice Quiz</option>
          <option value="Graded Survey">Graded Survey</option>
          <option value="Ungraded Survey">Ungraded Survey</option>
        </select>
      </div>

      {/* Points - HORIZONTAL LAYOUT */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "25px" }}>
        <label style={{ width: "220px", textAlign: "right", paddingRight: "15px", fontSize: "14px" }}>
          Points
        </label>
        <input
          type="number"
          value={quiz.points ?? 0}
          onChange={(e) => setQuiz({ ...quiz, points: e.target.value === '' ? 0 : Number(e.target.value) })}
          style={{
            flex: 1,
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "16px"
          }}
        />
        <span style={{ marginLeft: "10px", fontSize: "14px", color: "#666" }}>
          (Sum of all question points: {quiz.questions?.reduce((sum: number, q: any) => sum + (q.points || 0), 0) || 0})
        </span>
      </div>

      {/* Assignment Group */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "25px" }}>
        <label style={{ width: "220px", textAlign: "right", paddingRight: "15px", fontSize: "14px" }}>
          Assignment Group
        </label>
        <select
          value={quiz.assignmentGroup || "Quizzes"}
          onChange={(e) => setQuiz({ ...quiz, assignmentGroup: e.target.value })}
          style={{
            flex: 1,
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "16px"
          }}
        >
          <option value="Quizzes">Quizzes</option>
          <option value="Exams">Exams</option>
          <option value="Assignments">Assignments</option>
          <option value="Project">Project</option>
        </select>
      </div>

      {/* Shuffle Answers */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "25px" }}>
        <label style={{ width: "220px", textAlign: "right", paddingRight: "15px", fontSize: "14px" }}>
          Shuffle Answers
        </label>
        <select
          value={quiz.shuffleAnswers !== false ? "Yes" : "No"}
          onChange={(e) => setQuiz({ ...quiz, shuffleAnswers: e.target.value === "Yes" })}
          style={{
            flex: 1,
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "16px"
          }}
        >
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      {/* Time Limit */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "25px" }}>
        <label style={{ width: "220px", textAlign: "right", paddingRight: "15px", fontSize: "14px" }}>
          Time Limit
        </label>
        <input
          type="number"
          value={quiz.timeLimit || 20}
          onChange={(e) => setQuiz({ ...quiz, timeLimit: parseInt(e.target.value) || 20 })}
          style={{
            flex: 1,
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "16px"
          }}
        />
        <span style={{ marginLeft: "10px", fontSize: "14px" }}>Minutes</span>
      </div>

      {/* Multiple Attempts */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "25px" }}>
        <label style={{ width: "220px", textAlign: "right", paddingRight: "15px", fontSize: "14px" }}>
          Multiple Attempts
        </label>
        <select
          value={quiz.multipleAttempts ? "Yes" : "No"}
          onChange={(e) => setQuiz({ ...quiz, multipleAttempts: e.target.value === "Yes" })}
          style={{
            flex: 1,
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "16px"
          }}
        >
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </div>

      {/* How Many Attempts - only show if Multiple Attempts is Yes */}
      {quiz.multipleAttempts && (
        <div style={{ display: "flex", alignItems: "center", marginBottom: "25px", marginLeft: "220px" }}>
          <label style={{ width: "200px", paddingRight: "15px", fontSize: "14px" }}>
            How Many Attempts
          </label>
          <input
            type="number"
            min="1"
            value={quiz.attemptsAllowed || 1}
            onChange={(e) => setQuiz({ ...quiz, attemptsAllowed: parseInt(e.target.value) || 1 })}
            style={{
              flex: 1,
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "16px"
            }}
          />
        </div>
      )}

      {/* View Responses */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "25px" }}>
        <label style={{ width: "220px", textAlign: "right", paddingRight: "15px", fontSize: "14px" }}>
          View Responses
        </label>
        <select
          value={quiz.viewResponses || "Always"}
          onChange={(e) => setQuiz({ ...quiz, viewResponses: e.target.value })}
          style={{
            flex: 1,
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "16px"
          }}
        >
          <option value="Always">Always</option>
          <option value="After Submission">After Submission</option>
          <option value="After Grading">After Grading</option>
          <option value="Never">Never</option>
        </select>
      </div>

      {/* Show Correct Answers */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "25px" }}>
        <label style={{ width: "220px", textAlign: "right", paddingRight: "15px", fontSize: "14px" }}>
          Show Correct Answers
        </label>
        <select
          value={quiz.showCorrectAnswers || "Immediately"}
          onChange={(e) => setQuiz({ ...quiz, showCorrectAnswers: e.target.value })}
          style={{
            flex: 1,
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "16px"
          }}
        >
          <option value="Immediately">Immediately</option>
          <option value="After Due Date">After Due Date</option>
          <option value="After Attempts">After Attempts</option>
          <option value="Never">Never</option>
        </select>
      </div>

      {/* One Question at a Time */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "25px" }}>
        <label style={{ width: "220px", textAlign: "right", paddingRight: "15px", fontSize: "14px" }}>
          One Question at a Time
        </label>
        <select
          value={quiz.oneQuestionAtATime !== false ? "Yes" : "No"}
          onChange={(e) => setQuiz({ ...quiz, oneQuestionAtATime: e.target.value === "Yes" })}
          style={{
            flex: 1,
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "16px"
          }}
        >
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      {/* Require Respondus LockDown Browser */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "25px" }}>
        <label style={{ width: "220px", textAlign: "right", paddingRight: "15px", fontSize: "14px" }}>
          Require Respondus LockDown Browser
        </label>
        <select
          value={quiz.requireRespondusLockDown ? "Yes" : "No"}
          onChange={(e) => setQuiz({ ...quiz, requireRespondusLockDown: e.target.value === "Yes" })}
          style={{
            flex: 1,
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "16px"
          }}
        >
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </div>

      {/* Required to View Quiz Results */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "25px" }}>
        <label style={{ width: "220px", textAlign: "right", paddingRight: "15px", fontSize: "14px" }}>
          Required to View Quiz Results
        </label>
        <select
          value={quiz.requiredToViewQuizResults ? "Yes" : "No"}
          onChange={(e) => setQuiz({ ...quiz, requiredToViewQuizResults: e.target.value === "Yes" })}
          style={{
            flex: 1,
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "16px"
          }}
        >
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </div>

      {/* Webcam Required */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "25px" }}>
        <label style={{ width: "220px", textAlign: "right", paddingRight: "15px", fontSize: "14px" }}>
          Webcam Required
        </label>
        <select
          value={quiz.webcamRequired ? "Yes" : "No"}
          onChange={(e) => setQuiz({ ...quiz, webcamRequired: e.target.value === "Yes" })}
          style={{
            flex: 1,
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "16px"
          }}
        >
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </div>

      {/* Lock Questions After Answering */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "25px" }}>
        <label style={{ width: "220px", textAlign: "right", paddingRight: "15px", fontSize: "14px" }}>
          Lock Questions After Answering
        </label>
        <select
          value={quiz.lockQuestionsAfterAnswering ? "Yes" : "No"}
          onChange={(e) => setQuiz({ ...quiz, lockQuestionsAfterAnswering: e.target.value === "Yes" })}
          style={{
            flex: 1,
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "16px"
          }}
        >
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </div>

      {/* Access Code */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "25px" }}>
        <label style={{ width: "220px", textAlign: "right", paddingRight: "15px", fontSize: "14px" }}>
          Access Code
        </label>
        <input
          type="text"
          value={quiz.accessCode || ""}
          onChange={(e) => setQuiz({ ...quiz, accessCode: e.target.value })}
          placeholder="Leave blank for no access code"
          style={{
            flex: 1,
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "16px"
          }}
        />
      </div>

      {/* Assign Section - HORIZONTAL WITH BORDERED BOX */}
      <div style={{ display: "flex", alignItems: "flex-start", marginBottom: "30px" }}>
        <label style={{ width: "220px", textAlign: "right", paddingRight: "15px", paddingTop: "15px", fontSize: "14px" }}>
          Assign
        </label>
        <div style={{ 
          flex: 1,
          border: "1px solid #ccc",
          borderRadius: "4px",
          padding: "25px",
          backgroundColor: "#fff"
        }}>
          {/* Due Date */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", fontSize: "14px" }}>
              Due
            </label>
            <input
              type="datetime-local"
              value={quiz.dueDate}
              onChange={(e) => setQuiz({ ...quiz, dueDate: e.target.value })}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "16px"
              }}
            />
          </div>

          {/* Available from and Until - SIDE BY SIDE */}
          <div style={{ display: "flex", gap: "20px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", fontSize: "14px" }}>
                Available from
              </label>
              <input
                type="datetime-local"
                value={quiz.availableFrom}
                onChange={(e) => setQuiz({ ...quiz, availableFrom: e.target.value })}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "16px"
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", fontSize: "14px" }}>
                Until
              </label>
              <input
                type="datetime-local"
                value={quiz.availableUntil}
                onChange={(e) => setQuiz({ ...quiz, availableUntil: e.target.value })}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "16px"
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <hr style={{ border: "none", borderTop: "1px solid #ddd", margin: "30px 0" }} />

      {/* Buttons */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
        <button
          onClick={onCancel}
          style={{
            padding: "10px 25px",
            fontSize: "16px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          style={{
            padding: "10px 25px",
            fontSize: "16px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Save
        </button>
        <button
          onClick={onSaveAndPublish}
          style={{
            padding: "10px 25px",
            fontSize: "16px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Save & Publish
        </button>
      </div>
    </>
  );
}