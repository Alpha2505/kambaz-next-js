import Link from "next/link";
import { FormControl } from "react-bootstrap";
export default function Signup() {
  return (
<div id="wd-signup-screen" className="w-50">
      <h1>Sign up</h1>
      <FormControl id="wd-username"
             placeholder="username"
             className="mb-2"/>
      <FormControl id="wd-password"
             placeholder="password" type="password"
             className="mb-2"/>
             <FormControl id="wd-password"
             placeholder="verify password"
             type="password" className="mb-2"/>
      <Link id="wd-signup-btn"
            href="/Account/Profile"
            className="btn btn-primary w-100 mb-2">
            Sign up </Link>
      <Link id="wd-signin-link" href="/Account/Signin">Sign in</Link>
    </div>
);}
