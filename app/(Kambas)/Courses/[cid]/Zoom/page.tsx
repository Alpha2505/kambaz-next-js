import Link from "next/link";

export default async function Zoom({ 
  params 
}: { 
  params: Promise<{ cid: string }> 
}) {
  const { cid } = await params;
  return (
    <div>
      <h2>Zoom</h2>
    </div>
);}

