import { getAllRealtionships } from "@/controllers/relationshipController";

export async function GET(res: Response) {
  try {
    const result = await getAllRealtionships();
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify(error), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
