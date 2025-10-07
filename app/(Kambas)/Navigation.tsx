"use client";

import { usePathname } from "next/navigation";
import { AiOutlineDashboard } from "react-icons/ai";
import { IoCalendarOutline } from "react-icons/io5";
import { LiaBookSolid, LiaCogSolid } from "react-icons/lia";
import { FaInbox, FaRegCircleUser } from "react-icons/fa6";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import Link from "next/link";

export default function KambazNavigation() {
  const pathname = usePathname();

  // Make Account the default when visiting /Kambaz or /
  const effectivePath =
    pathname === "/" || pathname === "/Kambaz" ? "/Account" : pathname;

  return (
    <ListGroup
      className="rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-black z-2"
      style={{ width: 110, textAlign: "center" }}
      id="wd-kambaz-navigation"
    >
      {/* NEU Logo */}
      <ListGroupItem
        className="bg-black border-0 text-center"
        as="a"
        target="_blank"
        href="https://www.northeastern.edu/"
        id="wd-neu-link"
      >
        <img src="/images/NEU.png" width="75px" alt="Northeastern University" />
      </ListGroupItem>
      <br />

      {/* Account */}
      <ListGroupItem
        className={`border-0 text-center ${
          effectivePath.includes("/Account") ? "bg-white" : "bg-black"
        }`}
      >
        <Link
          href="/Account"
          id="wd-account-link"
          className={`text-decoration-none ${
            effectivePath.includes("/Account") ? "text-danger" : "text-white"
          }`}
        >
          <FaRegCircleUser
            className={`fs-1 ${
              effectivePath.includes("/Account") ? "text-danger" : "text-white"
            }`}
          />
          <br />
          Account
        </Link>
      </ListGroupItem>
      <br />

      {/* Dashboard */}
      <ListGroupItem
        className={`border-0 text-center ${
          effectivePath.includes("/Dashboard") ? "bg-white" : "bg-black"
        }`}
      >
        <Link
          href="/Dashboard"
          id="wd-dashboard-link"
          className={`text-decoration-none ${
            effectivePath.includes("/Dashboard") ? "text-danger" : "text-white"
          }`}
        >
          <AiOutlineDashboard
            className={`fs-1 ${
              effectivePath.includes("/Dashboard") ? "text-danger" : "text-danger"
            }`}
          />
          <br />
          Dashboard
        </Link>
      </ListGroupItem>
      <br />

      {/* Courses */}
      <ListGroupItem
        className={`border-0 text-center ${
          effectivePath.includes("/Course") ? "bg-white" : "bg-black"
        }`}
      >
        <Link
          href="/Course"
          id="wd-course-link"
          className={`text-decoration-none ${
            effectivePath.includes("/Course") ? "text-danger" : "text-white"
          }`}
        >
          <LiaBookSolid
            className={`fs-1 ${
              effectivePath.includes("/Course") ? "text-danger" : "text-danger"
            }`}
          />
          <br />
          Courses
        </Link>
      </ListGroupItem>
      <br />

      {/* Calendar */}
      <ListGroupItem
        className={`border-0 text-center ${
          effectivePath.includes("/Calendar") ? "bg-white" : "bg-black"
        }`}
      >
        <Link
          href="/Calendar"
          id="wd-calendar-link"
          className={`text-decoration-none ${
            effectivePath.includes("/Calendar") ? "text-danger" : "text-white"
          }`}
        >
          <IoCalendarOutline
            className={`fs-1 ${
              effectivePath.includes("/Calendar") ? "text-danger" : "text-danger"
            }`}
          />
          <br />
          Calendar
        </Link>
      </ListGroupItem>
      <br />

      {/* Inbox */}
      <ListGroupItem
        className={`border-0 text-center ${
          effectivePath.includes("/Inbox") ? "bg-white" : "bg-black"
        }`}
      >
        <Link
          href="/Inbox"
          id="wd-inbox-link"
          className={`text-decoration-none ${
            effectivePath.includes("/Inbox") ? "text-danger" : "text-white"
          }`}
        >
          <FaInbox
            className={`fs-1 ${
              effectivePath.includes("/Inbox") ? "text-danger" : "text-danger"
            }`}
          />
          <br />
          Inbox
        </Link>
      </ListGroupItem>
      <br />

      {/* Labs */}
      <ListGroupItem
        className={`border-0 text-center ${
          effectivePath.includes("/Labs") ? "bg-white" : "bg-black"
        }`}
      >
        <Link
          href="/Labs"
          id="wd-labs-link"
          className={`text-decoration-none ${
            effectivePath.includes("/Labs") ? "text-danger" : "text-white"
          }`}
        >
          <LiaCogSolid
            className={`fs-1 ${
              effectivePath.includes("/Labs") ? "text-danger" : "text-danger"
            }`}
          />
          <br />
          Labs
        </Link>
      </ListGroupItem>
    </ListGroup>
  );
}
