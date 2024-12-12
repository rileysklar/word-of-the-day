import type { APIRoute } from "astro";
import { wordOperations, type WordEntry } from "../../db/wordOperations";

export const prerender = false;

export const GET: APIRoute = async ({ params, request }) => {
  try {
    const url = new URL(request.url);
    const date = url.searchParams.get("date");

    if (date) {
      const word = await wordOperations.getWordByDate(date);
      if (!word) {
        return new Response(null, {
          status: 404,
          statusText: "Word not found",
        });
      }
      return new Response(JSON.stringify(word), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const words = await wordOperations.getAllWords();
    return new Response(JSON.stringify(words), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error('Error in GET /api/word:', error);
    return new Response(null, {
      status: 500,
      statusText: "Internal server error",
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    if (request.headers.get("Content-Type") !== "application/json") {
      return new Response(null, {
        status: 400,
        statusText: "Content-Type must be application/json",
      });
    }

    const wordEntry = (await request.json()) as WordEntry;

    if (
      !wordEntry.dt ||
      !wordEntry.wd ||
      !wordEntry.definition ||
      !wordEntry.partOfSpeech
    ) {
      return new Response(null, {
        status: 400,
        statusText: "Missing required fields",
      });
    }

    await wordOperations.addWord(wordEntry);
    return new Response(null, {
      status: 201,
      statusText: "Word added successfully",
    });
  } catch (error) {
    console.error('Error in POST /api/word:', error);
    return new Response(null, {
      status: 500,
      statusText: "Internal server error",
    });
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    if (request.headers.get("Content-Type") !== "application/json") {
      return new Response(null, {
        status: 400,
        statusText: "Content-Type must be application/json",
      });
    }

    const { dt, ...updates } = (await request.json()) as WordEntry;

    if (!dt) {
      return new Response(null, {
        status: 400,
        statusText: "Date is required",
      });
    }

    const updatedWord = await wordOperations.updateWord(dt, updates);
    return new Response(JSON.stringify(updatedWord), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error('Error in PUT /api/word:', error);
    return new Response(null, {
      status: 500,
      statusText: "Internal server error",
    });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const dt = url.searchParams.get("dt");

    if (!dt) {
      return new Response(null, {
        status: 400,
        statusText: "Date is required",
      });
    }

    await wordOperations.deleteWord(dt);
    return new Response(null, {
      status: 200,
      statusText: "Word deleted successfully",
    });
  } catch (error) {
    console.error('Error in DELETE /api/word:', error);
    return new Response(null, {
      status: 500,
      statusText: "Internal server error",
    });
  }
};
