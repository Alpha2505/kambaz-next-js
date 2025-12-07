"use client";

import { useState } from "react";
import { BsPlus, BsTrash } from "react-icons/bs";
import MultipleChoiceEditor from "./questionEditors/MultipleChoiceEditor";
import TrueFalseEditor from "./questionEditors/TrueFalseEditor";
import FillInBlankEditor from "./questionEditors/FillInBlankEditor";

export default function QuizQuestionsEditor({ 
  quiz, 
  setQuiz, 
  onSave, 
  onCancel 
}: { 
  quiz: any; 
  setQuiz: (quiz: any) => void; 
  onSave: () => void;
  onCancel: () => void;
}) {
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
  const [newQuestionType, setNewQuestionType] = useState<string>("multipleChoice");

  const questions = quiz.questions || [];
  const totalPoints = questions.reduce((sum: number, q: any) => sum + (q.points || 0), 0);

  const handleAddQuestion = () => {
    const newQuestion = {
      _id: `q-${Date.now()}`,
      type: newQuestionType,
      title: "",
      question: "",
      points: 1,
      ...(newQuestionType === "multipleChoice" ? { choices: [""], correctAnswer: 0 } : {}),
      ...(newQuestionType === "trueFalse" ? { correctAnswer: true } : {}),
      ...(newQuestionType === "fillInBlank" ? { possibleAnswers: [""] } : {}),
    };
    const updatedQuestions = [...questions, newQuestion];
    setQuiz({ ...quiz, questions: updatedQuestions });
    setEditingQuestionIndex(updatedQuestions.length - 1);
  };

  const handleDeleteQuestion = (index: number) => {
    if (confirm("Are you sure you want to delete this question?")) {
      const updatedQuestions = questions.filter((_: any, i: number) => i !== index);
      setQuiz({ ...quiz, questions: updatedQuestions });
      if (editingQuestionIndex === index) {
        setEditingQuestionIndex(null);
      } else if (editingQuestionIndex !== null && editingQuestionIndex > index) {
        setEditingQuestionIndex(editingQuestionIndex - 1);
      }
    }
  };

  const handleUpdateQuestion = (index: number, updatedQuestion: any) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = updatedQuestion;
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleSaveQuestion = (index: number) => {
    setEditingQuestionIndex(null);
  };

  const handleCancelEdit = () => {
    setEditingQuestionIndex(null);
  };

  const renderQuestionEditor = (question: any, index: number) => {
    if (editingQuestionIndex !== index) {
      // Preview mode
      return (
        <div key={question._id || index} style={{ 
          border: "1px solid #ddd", 
          borderRadius: "8px", 
          padding: "20px", 
          marginBottom: "20px",
          backgroundColor: "#f9f9f9"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "15px" }}>
            <div>
              <h4 style={{ margin: 0, marginBottom: "5px" }}>
                {question.title || `Question ${index + 1}`} ({question.points || 0} pts)
              </h4>
              <span style={{ 
                fontSize: "12px", 
                color: "#666",
                textTransform: "uppercase",
                fontWeight: "bold"
              }}>
                {question.type === "multipleChoice" ? "Multiple Choice" : 
                 question.type === "trueFalse" ? "True/False" : "Fill in the Blank"}
              </span>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => setEditingQuestionIndex(index)}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px"
                }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteQuestion(index)}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px"
                }}
              >
                <BsTrash />
              </button>
            </div>
          </div>
          <div style={{ 
            padding: "15px", 
            backgroundColor: "white", 
            borderRadius: "4px",
            border: "1px solid #ddd"
          }}>
            <div dangerouslySetInnerHTML={{ __html: question.question || "No question text" }} />
            {question.type === "multipleChoice" && question.choices && (
              <ul style={{ marginTop: "10px", paddingLeft: "20px" }}>
                {question.choices.map((choice: string, i: number) => (
                  <li key={i} style={{ 
                    color: i === question.correctAnswer ? "#28a745" : "inherit",
                    fontWeight: i === question.correctAnswer ? "bold" : "normal"
                  }}>
                    {choice || `Choice ${i + 1}`}
                    {i === question.correctAnswer && " ✓"}
                  </li>
                ))}
              </ul>
            )}
            {question.type === "trueFalse" && (
              <div style={{ marginTop: "10px" }}>
                <strong>Correct Answer: </strong>
                <span style={{ color: "#28a745" }}>{question.correctAnswer ? "True" : "False"}</span>
              </div>
            )}
            {question.type === "fillInBlank" && question.possibleAnswers && (
              <div style={{ marginTop: "10px" }}>
                <strong>Possible Answers: </strong>
                <span style={{ color: "#666" }}>
                  {question.possibleAnswers.join(", ")}
                </span>
              </div>
            )}
          </div>
        </div>
      );
    } else {
      // Edit mode
      return (
        <div key={question._id || index} style={{ 
          border: "2px solid #007bff", 
          borderRadius: "8px", 
          padding: "20px", 
          marginBottom: "20px",
          backgroundColor: "#f0f8ff"
        }}>
          {question.type === "multipleChoice" && (
            <MultipleChoiceEditor
              question={question}
              onUpdate={(updated) => handleUpdateQuestion(index, updated)}
              onSave={() => handleSaveQuestion(index)}
              onCancel={handleCancelEdit}
            />
          )}
          {question.type === "trueFalse" && (
            <TrueFalseEditor
              question={question}
              onUpdate={(updated) => handleUpdateQuestion(index, updated)}
              onSave={() => handleSaveQuestion(index)}
              onCancel={handleCancelEdit}
            />
          )}
          {question.type === "fillInBlank" && (
            <FillInBlankEditor
              question={question}
              onUpdate={(updated) => handleUpdateQuestion(index, updated)}
              onSave={() => handleSaveQuestion(index)}
              onCancel={handleCancelEdit}
            />
          )}
        </div>
      );
    }
  };

  return (
    <div>
      {/* Header with total points */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "30px",
        padding: "15px",
        backgroundColor: "#f8f9fa",
        borderRadius: "8px"
      }}>
        <div>
          <h3 style={{ margin: 0 }}>Questions</h3>
          <p style={{ margin: "5px 0 0 0", color: "#666" }}>
            Total Points: <strong>{totalPoints}</strong>
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <select
            value={newQuestionType}
            onChange={(e) => setNewQuestionType(e.target.value)}
            style={{
              padding: "8px 12px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px"
            }}
          >
            <option value="multipleChoice">Multiple Choice</option>
            <option value="trueFalse">True/False</option>
            <option value="fillInBlank">Fill in the Blank</option>
          </select>
          <button
            onClick={handleAddQuestion}
            style={{
              padding: "10px 20px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <BsPlus /> New Question
          </button>
        </div>
      </div>

      {/* Questions List */}
      {questions.length === 0 ? (
        <div style={{ 
          textAlign: "center", 
          padding: "60px 20px",
          color: "#666",
          border: "2px dashed #ddd",
          borderRadius: "8px"
        }}>
          <p style={{ fontSize: "18px", marginBottom: "10px" }}>No questions yet</p>
          <p>Click "New Question" to add your first question</p>
        </div>
      ) : (
        <div>
          {questions.map((question: any, index: number) => renderQuestionEditor(question, index))}
        </div>
      )}

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
      </div>
    </div>
  );
}

