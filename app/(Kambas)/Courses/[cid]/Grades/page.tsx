import Link from "next/link";

export default async function Grades({ 
  params 
}: { 
  params: Promise<{ cid: string }> 
}) {
  const { cid } = await params;
  return (
    <div>
      <h2>Grades</h2>
    </div>
);}

