"use client";

import { useState, useEffect } from "react";
import { BsPlus, BsTrash } from "react-icons/bs";

export default function MultipleChoiceEditor({ 
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
  const [choices, setChoices] = useState<string[]>(question.choices || [""]);
  const [correctAnswer, setCorrectAnswer] = useState(question.correctAnswer ?? 0);

  useEffect(() => {
    onUpdate({
      ...question,
      type: "multipleChoice",
      title,
      question: questionText,
      points,
      choices,
      correctAnswer,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, questionText, points, choices, correctAnswer]);

  const handleAddChoice = () => {
    setChoices([...choices, ""]);
  };

  const handleRemoveChoice = (index: number) => {
    if (choices.length > 1) {
      const newChoices = choices.filter((_, i) => i !== index);
      setChoices(newChoices);
      if (correctAnswer >= newChoices.length) {
        setCorrectAnswer(newChoices.length - 1);
      }
    }
  };

  const handleChoiceChange = (index: number, value: string) => {
    const newChoices = [...choices];
    newChoices[index] = value;
    setChoices(newChoices);
  };

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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <label style={{ fontWeight: "bold", fontSize: "14px" }}>
            Choices
          </label>
          <button
            onClick={handleAddChoice}
            style={{
              padding: "6px 12px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "5px"
            }}
          >
            <BsPlus /> Add Choice
          </button>
        </div>
        {choices.map((choice, index) => (
          <div key={index} style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "10px", 
            marginBottom: "10px",
            padding: "10px",
            backgroundColor: "#f9f9f9",
            borderRadius: "4px"
          }}>
            <input
              type="radio"
              name="correctAnswer"
              checked={correctAnswer === index}
              onChange={() => setCorrectAnswer(index)}
              style={{ width: "20px", height: "20px", cursor: "pointer" }}
            />
            <input
              type="text"
              value={choice}
              onChange={(e) => handleChoiceChange(index, e.target.value)}
              placeholder={`Choice ${index + 1}`}
              style={{
                flex: 1,
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "16px"
              }}
            />
            {choices.length > 1 && (
              <button
                onClick={() => handleRemoveChoice(index)}
                style={{
                  padding: "8px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                <BsTrash />
              </button>
            )}
          </div>
        ))}
        <p style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
          Select the radio button next to the correct answer
        </p>
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

