"use client";
import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import Link from "next/link";
import { useParams } from "next/navigation";
import PeopleDetails from "./Details";

export default function PeopleTable({ 
  users = [], 
  fetchUsers 
}: { 
  users?: any[]; 
  fetchUsers: () => void; 
}) {
  const { cid } = useParams();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  return (
    <div id="wd-people-table">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Login ID</th>
            <th>Section</th>
            <th>Role</th>
            <th>Last Activity</th>
            <th>Total Activity</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: any) => (
            <tr key={user._id}>
              <td className="wd-full-name text-nowrap">
                <Link 
                  href={`/Courses/${cid}/People/${user._id}`}
                  className="text-decoration-none text-danger"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedUserId(user._id);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <FaUserCircle className="me-2 fs-1 text-secondary" />
                  <span className="wd-first-name">{user.firstName} </span>
                  <span className="wd-last-name">{user.lastName}</span>
                </Link>
              </td>
              <td className="wd-login-id">{user.loginId}</td>
              <td className="wd-section">{user.section}</td>
              <td className="wd-role">{user.role}</td>
              <td className="wd-last-activity">{user.lastActivity}</td>
              <td className="wd-total-activity">{user.totalActivity}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <PeopleDetails 
        uid={selectedUserId} 
        onClose={() => setSelectedUserId(null)}
        fetchUsers={fetchUsers}
         
      />
    </div>
  );
}