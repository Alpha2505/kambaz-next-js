"use client";

import { useState, useEffect } from "react";

export default function TrueFalseEditor({ 
  question, 
  onUpdate, 
  onSave, 
  onCancel 
}: { 
  question: any; 
  onUpdate: (question: any) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(question.title || "");
  const [questionText, setQuestionText] = useState(question.question || "");
  const [points, setPoints] = useState(question.points || 1);
  const [correctAnswer, setCorrectAnswer] = useState(question.correctAnswer !== undefined ? question.correctAnswer : true);

  useEffect(() => {
    onUpdate({
      ...question,
      type: "trueFalse",
      title,
      question: questionText,
      points,
      correctAnswer,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, questionText, points, correctAnswer]);

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", fontSize: "14px" }}>
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Question Title"
          style={{
            width: "100%",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "16px"
          }}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", fontSize: "14px" }}>
          Points
        </label>
        <input
          type="number"
          value={points}
          onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
          min="0"
          style={{
            width: "200px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "16px"
          }}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", fontSize: "14px" }}>
          Question
        </label>
        <textarea
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          rows={4}
          placeholder="Enter your question here..."
          style={{
            width: "100%",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "16px"
          }}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", fontSize: "14px" }}>
          True/False
        </label>
        <div style={{ display: "flex", gap: "20px", padding: "15px", backgroundColor: "#f9f9f9", borderRadius: "4px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
            <input
              type="radio"
              name="trueFalse"
              checked={correctAnswer === true}
              onChange={() => setCorrectAnswer(true)}
              style={{ width: "20px", height: "20px", cursor: "pointer" }}
            />
            <span style={{ fontSize: "16px" }}>True</span>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
            <input
              type="radio"
              name="trueFalse"
              checked={correctAnswer === false}
              onChange={() => setCorrectAnswer(false)}
              style={{ width: "20px", height: "20px", cursor: "pointer" }}
            />
            <span style={{ fontSize: "16px" }}>False</span>
          </label>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
        <button
          onClick={onCancel}
          style={{
            padding: "10px 20px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px"
          }}
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          style={{
            padding: "10px 20px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px"
          }}
        >
          Update Question
        </button>
      </div>
    </div>
  );
}

