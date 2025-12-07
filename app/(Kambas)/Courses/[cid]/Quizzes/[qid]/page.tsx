"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function QuizDetailsRedirect() {
  const params = useParams();
  const cid = Array.isArray(params.cid) ? params.cid[0] : params.cid || "";
  const qid = Array.isArray(params.qid) ? params.qid[0] : params.qid || "";
  const router = useRouter();

  useEffect(() => {
    // Redirect to Details page
    router.replace(`/Courses/${cid}/Quizzes/${qid}/Details`);
  }, [cid, qid, router]);

  return null;
}

