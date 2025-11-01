"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../store";

export default function AccountNavigation() {
  const pathname = usePathname();
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const links = currentUser ? ["Profile"] : ["Signin", "Signup"];

  return (
    <div id="wd-account-navigation" className="wd list-group fs-5 rounded-0">
      <Link 
        href="/Account/Signin" 
        id="wd-account-signin-link"
        className={`list-group-item border-0 ${pathname.includes("/Account/Signin") ? "active" : "text-danger"}`}
      >
        Signin
      </Link>
      <Link 
        href="/Account/Signup" 
        id="wd-account-signup-link"
        className={`list-group-item border-0 ${pathname.includes("/Account/Signup") ? "active" : "text-danger"}`}
      >
        Signup
      </Link>
      <Link 
        href="/Account/Profile" 
        id="wd-account-profile-link"
        className={`list-group-item border-0 ${pathname.includes("/Account/Profile") ? "active" : "text-danger"}`}
      >
        Profile
      </Link>
    </div>
  );
}