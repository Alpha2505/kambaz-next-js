import Link from "next/link";
import { FormControl } from "react-bootstrap";

export default function Profile() {
  return (
    <div id="wd-profile-screen" className="w-50">
      <h2>Profile</h2>
      <FormControl 
        id="wd-username"
        defaultValue="alice" 
        placeholder="username"
        className="mb-2"
      />
      <FormControl 
        id="wd-password"
        defaultValue="123" 
        placeholder="password" 
        type="password"
        className="mb-2"
      />
      <FormControl 
        id="wd-firstname"
        defaultValue="Alice" 
        placeholder="First Name"
        className="mb-2"
      />
      <FormControl 
        id="wd-lastname"
        defaultValue="Wonderland" 
        placeholder="Last Name"
        className="mb-2"
      />
      <FormControl 
        id="wd-dob"
        defaultValue="2000-01-01" 
        type="date"
        className="mb-2"
      />
      <FormControl 
        id="wd-email"
        defaultValue="alice@wonderland.com" 
        type="email"
        placeholder="Email"
        className="mb-2"
      />
      <FormControl 
        as="select"
        id="wd-role"
        defaultValue="USER"
        className="mb-2"
      >
        <option value="USER">User</option>
        <option value="ADMIN">Admin</option>
        <option value="FACULTY">Faculty</option>
        <option value="STUDENT">Student</option>
      </FormControl>
      <Link 
        href="/Account/Signin" 
        className="btn btn-danger w-100"
      >
        Sign out
      </Link>
    </div>
  );
}