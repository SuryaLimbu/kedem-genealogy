import { createPersonWithParent, getAllPersons } from "@/controllers/personController";

export async function POST(req: Request) {
    try {
        const body = await req.json(); // Parse JSON from request
        const { parentId, ...data } = body; // Extract parentId and the rest of the data

        console.log(parentId, data); // Log the extracted values

        // Call the controller function with the extracted data
        const result = await createPersonWithParent(parentId, data);

        // Return the result as a JSON response
        return new Response(JSON.stringify(result), {
            status: 201, // Created
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        // Handle errors and return an appropriate response
        console.error("Error creating person with parent:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

export async function GET(req: Request) {
    try {
       const result = await getAllPersons();

        // Return the result as a JSON response
        return new Response(JSON.stringify(result), {
            status: 200, // OK
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        // Handle errors and return an appropriate response
        console.error("Error getting person by id:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
