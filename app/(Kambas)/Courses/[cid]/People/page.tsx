import Link from "next/link";

export default async function People({ 
  params 
}: { 
  params: Promise<{ cid: string }> 
}) {
  const { cid } = await params;
  return (
    <div>
      <h2>People</h2>
    </div>
);}

