"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { setQuizzes, updateQuiz } from "../../reducer";
import { RootState } from "../../../../../store";
import * as coursesClient from "../../../../client";
import QuizDetailsEditor from "./DetailsEditor";
import QuizQuestionsEditor from "./QuestionsEditor";

export default function QuizEditor() {
  const params = useParams();
  const cid = Array.isArray(params.cid) ? params.cid[0] : params.cid || "";
  const qid = Array.isArray(params.qid) ? params.qid[0] : params.qid || "";
  const router = useRouter();
  const { quizzes } = useSelector((state: RootState) => state.quizzesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const dispatch = useDispatch();
  
  const isFaculty = currentUser?.role === "FACULTY";
  const isNewQuiz = qid === "new";
  const existingQuiz = (!isNewQuiz 
    ? quizzes.find((q: any) => q._id === qid)
    : null) as any;
  
  const [activeTab, setActiveTab] = useState<"details" | "questions">("details");
  const [quiz, setQuiz] = useState<any>(null);

  const formatDateTimeForInput = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  useEffect(() => {
    if (!isFaculty) {
      router.push(`/Courses/${cid}/Quizzes`);
      return;
    }
    
    const loadQuiz = async () => {
      if (existingQuiz) {
        setQuiz({
          ...existingQuiz,
          dueDate: formatDateTimeForInput(existingQuiz.dueDate || existingQuiz.availableUntil),
          availableFrom: formatDateTimeForInput(existingQuiz.availableFrom),
          availableUntil: formatDateTimeForInput(existingQuiz.availableUntil),
          quizType: existingQuiz.quizType || "Graded Quiz",
          assignmentGroup: existingQuiz.assignmentGroup || "Quizzes",
          shuffleAnswers: existingQuiz.shuffleAnswers !== false,
          timeLimit: existingQuiz.timeLimit || 20,
          multipleAttempts: existingQuiz.multipleAttempts || false,
          attemptsAllowed: existingQuiz.attemptsAllowed || 1,
          showCorrectAnswers: existingQuiz.showCorrectAnswers || "Immediately",
          accessCode: existingQuiz.accessCode || "",
          oneQuestionAtATime: existingQuiz.oneQuestionAtATime !== false,
          webcamRequired: existingQuiz.webcamRequired || false,
          lockQuestionsAfterAnswering: existingQuiz.lockQuestionsAfterAnswering || false,
          questions: existingQuiz.questions || [],
        });
      } else if (!isNewQuiz) {
        try {
          const fetchedQuiz = await coursesClient.findQuizById(qid);
          setQuiz({
            ...fetchedQuiz,
            dueDate: formatDateTimeForInput(fetchedQuiz.dueDate || fetchedQuiz.availableUntil),
            availableFrom: formatDateTimeForInput(fetchedQuiz.availableFrom),
            availableUntil: formatDateTimeForInput(fetchedQuiz.availableUntil),
            questions: fetchedQuiz.questions || [],
          });
        } catch (error) {
          console.error("Failed to fetch quiz:", error);
        }
      } else {
        // New quiz
        setQuiz({
          title: "New Quiz",
          description: "",
          points: 0,
          dueDate: "",
          availableFrom: "",
          availableUntil: "",
          published: false,
          questions: [],
          questionCount: 0,
          course: cid,
          quizType: "Graded Quiz",
          assignmentGroup: "Quizzes",
          shuffleAnswers: true,
          timeLimit: 20,
          multipleAttempts: false,
          attemptsAllowed: 1,
          showCorrectAnswers: "Immediately",
          accessCode: "",
          oneQuestionAtATime: true,
          webcamRequired: false,
          lockQuestionsAfterAnswering: false,
        });
      }
    };
    
    loadQuiz();
  }, [existingQuiz, isFaculty, router, cid, qid, isNewQuiz]);

  const handleSave = async (publish: boolean = false) => {
    if (!isFaculty || !quiz) {
      alert("Only faculty members can edit quizzes.");
      return;
    }
    
    try {
      // Calculate points from questions
      const calculatedPoints = quiz.questions?.reduce((sum: number, q: any) => sum + (q.points || 0), 0) || 0;
      const finalPoints = calculatedPoints;
      
      // Prepare quiz data for server
      const quizToSave = {
        ...quiz,
        points: finalPoints,
        published: publish ? true : quiz.published,
        availableFrom: quiz.availableFrom ? new Date(quiz.availableFrom).toISOString() : null,
        availableUntil: quiz.availableUntil ? new Date(quiz.availableUntil).toISOString() : null,
        dueDate: quiz.dueDate ? new Date(quiz.dueDate).toISOString() : null,
        questionCount: quiz.questions?.length || 0,
      };

      if (isNewQuiz) {
        // Create new quiz on server
        const newQuiz = await coursesClient.createQuizForCourse(cid, quizToSave);
        dispatch(setQuizzes([...quizzes, newQuiz]));
        if (publish) {
          router.push(`/Courses/${cid}/Quizzes`);
        } else {
          router.push(`/Courses/${cid}/Quizzes/${newQuiz._id}/Details`);
        }
      } else {
        // Update existing quiz on server
        const updatedQuiz = await coursesClient.updateQuiz(quizToSave);
        const newQuizzes = quizzes.map((q: any) => 
          q._id === updatedQuiz._id ? updatedQuiz : q
        );
        dispatch(setQuizzes(newQuizzes));
        if (publish) {
          router.push(`/Courses/${cid}/Quizzes`);
        } else {
          router.push(`/Courses/${cid}/Quizzes/${qid}/Details`);
        }
      }
    } catch (error) {
      console.error("Failed to save quiz:", error);
      alert("Failed to save quiz. Please try again.");
    }
  };

  const handleCancel = () => {
    router.push(`/Courses/${cid}/Quizzes`);
  };

  if (!isFaculty) {
    return (
      <div style={{ padding: "20px" }}>
        <div style={{ backgroundColor: "#f8d7da", border: "1px solid #f5c6cb", padding: "15px", borderRadius: "4px", color: "#721c24" }}>
          Only faculty members can create or edit quizzes.
        </div>
        <button onClick={handleCancel} style={{ marginTop: "10px", padding: "8px 16px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          Return to Quizzes
        </button>
      </div>
    );
  }

  if (!quiz) {
    return <div style={{ padding: "20px" }}>Loading...</div>;
  }

  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Tabs */}
      <div style={{ borderBottom: "2px solid #ddd", marginBottom: "30px" }}>
        <button
          onClick={() => setActiveTab("details")}
          style={{
            padding: "12px 24px",
            border: "none",
            borderBottom: activeTab === "details" ? "3px solid #dc3545" : "3px solid transparent",
            backgroundColor: "transparent",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: activeTab === "details" ? "bold" : "normal",
            color: activeTab === "details" ? "#dc3545" : "#666",
          }}
        >
          Details
        </button>
        <button
          onClick={() => setActiveTab("questions")}
          style={{
            padding: "12px 24px",
            border: "none",
            borderBottom: activeTab === "questions" ? "3px solid #dc3545" : "3px solid transparent",
            backgroundColor: "transparent",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: activeTab === "questions" ? "bold" : "normal",
            color: activeTab === "questions" ? "#dc3545" : "#666",
          }}
        >
          Questions
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "details" ? (
        <QuizDetailsEditor 
          quiz={quiz} 
          setQuiz={setQuiz}
          onSave={() => handleSave(false)}
          onSaveAndPublish={() => handleSave(true)}
          onCancel={handleCancel}
        />
      ) : (
        <QuizQuestionsEditor 
          quiz={quiz} 
          setQuiz={setQuiz}
          onSave={() => handleSave(false)}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
