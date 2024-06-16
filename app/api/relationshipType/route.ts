import { createRelationshipType } from "@/controllers/relationshipTypeController";

export async function POST(req: Request, res: Response){
  try {
    const body = await req.json();
    const { type } = body;
    console.log(type);
    const result = await createRelationshipType({ type });
    return (
      new Response(result),
      {
        status: 200,
        body: JSON.stringify(result),
      }
    );
  } catch (error) {
    console.log("Error creating relationship type:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
