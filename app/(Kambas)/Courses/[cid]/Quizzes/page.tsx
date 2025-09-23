import Link from "next/link";

export default async function Quizzes({ 
  params 
}: { 
  params: Promise<{ cid: string }> 
}) {
  const { cid } = await params;
  return (
    <div>
      <h2>Quizzes</h2>
    </div>
);}

