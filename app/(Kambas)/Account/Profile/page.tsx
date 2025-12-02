"use client";
import * as client from "../client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "../reducer";
import { RootState } from "../../store";
import { Button, FormControl } from "react-bootstrap";

export default function Profile() {
  const [profile, setProfile] = useState<any>({});
  const dispatch = useDispatch();
  const router = useRouter();
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  
  // Helper function to format date for input field (YYYY-MM-DD)
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const updateProfile = async () => {
    try {
      const updatedProfile = await client.updateUser(profile);
      dispatch(setCurrentUser(updatedProfile));
      alert("Profile updated successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };
  
  const fetchProfile = () => {
    if (!currentUser) {
      router.push("/Account/Signin");
      return;
    }
    // Format the date when loading profile
    setProfile({
      ...currentUser,
      dob: formatDateForInput(currentUser.dob)
    });
  };
  
  const signout = async () => {
    await client.signout();
    dispatch(setCurrentUser(null));
    router.push("/Account/Signin");
  };
  
  useEffect(() => {
    fetchProfile();
  }, [currentUser]);
  
  return (
    <div className="wd-profile-screen">
      <h3>Profile</h3>
      {profile && (
        <div>
          <label htmlFor="wd-username">Username</label>
          <FormControl 
            id="wd-username" 
            className="mb-2"
            value={profile.username || ""}
            onChange={(e) => setProfile({ ...profile, username: e.target.value })}
          />
          
          <label htmlFor="wd-password">Password</label>
          <FormControl 
            id="wd-password" 
            className="mb-2"
            type="password"
            value={profile.password || ""}
            onChange={(e) => setProfile({ ...profile, password: e.target.value })}
          />
          
          <label htmlFor="wd-firstname">First Name</label>
          <FormControl 
            id="wd-firstname" 
            className="mb-2"
            value={profile.firstName || ""}
            onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
          />
          
          <label htmlFor="wd-lastname">Last Name</label>
          <FormControl 
            id="wd-lastname" 
            className="mb-2"
            value={profile.lastName || ""}
            onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} 
          />
          
          <label htmlFor="wd-dob">Date of Birth</label>
          <FormControl 
            id="wd-dob" 
            className="mb-2" 
            type="date"
            value={profile.dob || ""}
            onChange={(e) => setProfile({ ...profile, dob: e.target.value })} 
          />
          
          <label htmlFor="wd-email">Email</label>
          <FormControl 
            id="wd-email" 
            className="mb-2"
            type="email"
            value={profile.email || ""}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })} 
          />
          
          <label htmlFor="wd-role">Role</label>
          <select 
            className="form-control mb-2" 
            id="wd-role"
            value={profile.role || "STUDENT"}
            onChange={(e) => setProfile({ ...profile, role: e.target.value })} 
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
            <option value="FACULTY">Faculty</option>
            <option value="STUDENT">Student</option>
          </select>
          
          <Button onClick={updateProfile} className="btn btn-primary w-100 mb-2"> 
            Update 
          </Button>
          <Button onClick={signout} className="w-100 mb-2" id="wd-signout-btn">
            Sign out
          </Button>
        </div>
      )}
    </div>
  );
}