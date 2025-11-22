
"use client";
import * as client from "../client";
import { redirect } from "next/dist/client/components/navigation";
import { setCurrentUser } from "../reducer";
import { useDispatch } from "react-redux";
import { useState } from "react";
import * as db from "../../Database";
import { FormControl, Button } from "react-bootstrap";import Link from "next/link";
export default function Signin() {
        const [credentials, setCredentials] = useState<any>({});
 const dispatch = useDispatch();
 const signin = async () => {
 const user =  await client.signin(credentials);
   if (!user) return;
   dispatch(setCurrentUser(user));
   redirect("/Dashboard");
 };
 return (
   <div id="wd-signin-screen" className="w-50">
      <h1>Sign in</h1>
      <FormControl id="wd-username"
             placeholder="username"
             className="mb-2"
             defaultValue={credentials.username}
             onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}/>
      <FormControl id="wd-password"
             placeholder="password" type="password"
             className="mb-2"
             defaultValue={credentials.password}
             onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}/>
            <Button onClick={signin} id="wd-signin-btn" className="w-100" > Sign in </Button>
      <Link id="wd-signup-link" href="/Account/Signup">Sign up</Link>
    </div>
);}
