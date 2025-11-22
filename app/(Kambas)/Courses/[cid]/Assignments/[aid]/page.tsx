"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { setAssignments } from "../reducer";
import { RootState } from "../../../../store";
import * as coursesClient from "../../../client";

export default function AssignmentEditor() {
  const params = useParams();
  const cid = Array.isArray(params.cid) ? params.cid[0] : params.cid || "";
  const aid = Array.isArray(params.aid) ? params.aid[0] : params.aid || "";
  const router = useRouter();
  const { assignments } = useSelector((state: RootState) => state.assignmentsReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const dispatch = useDispatch();
  
  const isFaculty = currentUser?.role === "FACULTY";
  const isNewAssignment = aid === "new";
  const existingAssignment = !isNewAssignment 
    ? assignments.find((a: any) => a._id === aid)
    : null;
  
  const [assignment, setAssignment] = useState<any>(
    existingAssignment || {
      title: "New Assignment",
      description: "New Assignment Description",
      points: 100,
      dueDate: "2024-05-13",
      availableFromDate: "2024-05-06",
      availableUntilDate: "2024-05-20",
      course: cid,
    }
  );

  useEffect(() => {
    if (!isFaculty) {
      router.push(`/Courses/${cid}/Assignments`);
      return;
    }
    if (existingAssignment) {
      setAssignment(existingAssignment);
    }
  }, [existingAssignment, isFaculty, router, cid]);

  const handleSave = async () => {
    if (!isFaculty) {
      alert("Only faculty members can edit assignments.");
      return;
    }
    
    try {
      if (isNewAssignment) {
        // Create new assignment on server
        const newAssignment = await coursesClient.createAssignmentForCourse(cid, assignment);
        dispatch(setAssignments([...assignments, newAssignment]));
      } else {
        // Update existing assignment on server
        const updatedAssignment = await coursesClient.updateAssignment(assignment);
        const newAssignments = assignments.map((a: any) => 
          a._id === updatedAssignment._id ? updatedAssignment : a
        );
        dispatch(setAssignments(newAssignments));
      }
      router.push(`/Courses/${cid}/Assignments`);
    } catch (error) {
      console.error("Failed to save assignment:", error);
      alert("Failed to save assignment. Please try again.");
    }
  };

  const handleCancel = () => {
    router.push(`/Courses/${cid}/Assignments`);
  };

  if (!isFaculty) {
    return (
      <div style={{ padding: "20px" }}>
        <div style={{ backgroundColor: "#f8d7da", border: "1px solid #f5c6cb", padding: "15px", borderRadius: "4px", color: "#721c24" }}>
          Only faculty members can create or edit assignments.
        </div>
        <button onClick={handleCancel} style={{ marginTop: "10px", padding: "8px 16px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          Return to Assignments
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px", maxWidth: "1000px", margin: "0 auto" }}>
      {/* Assignment Name */}
      <div style={{ marginBottom: "25px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontSize: "14px" }}>
          Assignment Name
        </label>
        <input
          type="text"
          value={assignment.title}
          onChange={(e) => setAssignment({ ...assignment, title: e.target.value })}
          style={{
            width: "100%",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "16px"
          }}
        />
      </div>

      {/* Description - NO LABEL */}
      <div style={{ marginBottom: "25px" }}>
        <textarea
          value={assignment.description}
          onChange={(e) => setAssignment({ ...assignment, description: e.target.value })}
          rows={6}
          style={{
            width: "100%",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "16px"
          }}
        />
      </div>

      {/* Points - HORIZONTAL LAYOUT */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "25px" }}>
        <label style={{ width: "220px", textAlign: "right", paddingRight: "15px", fontSize: "14px" }}>
          Points
        </label>
        <input
          type="number"
          value={assignment.points}
          onChange={(e) => setAssignment({ ...assignment, points: parseInt(e.target.value) || 0 })}
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
              type="date"
              value={assignment.dueDate}
              onChange={(e) => setAssignment({ ...assignment, dueDate: e.target.value })}
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
                type="date"
                value={assignment.availableFromDate}
                onChange={(e) => setAssignment({ ...assignment, availableFromDate: e.target.value })}
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
                type="date"
                value={assignment.availableUntilDate}
                onChange={(e) => setAssignment({ ...assignment, availableUntilDate: e.target.value })}
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
          onClick={handleCancel}
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
          onClick={handleSave}
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