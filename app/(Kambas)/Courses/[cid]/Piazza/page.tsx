import Link from "next/link";

export default async function Piazza({ 
  params 
}: { 
  params: Promise<{ cid: string }> 
}) {
  const { cid } = await params;
  return (
    <div>
      <h2>Piazza</h2>
    </div>
);}

