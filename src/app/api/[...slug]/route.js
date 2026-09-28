// JSON 404 for any /api path that doesn't exist (instead of the HTML "page not found").
function notFound(request) {
  const { pathname } = new URL(request.url);
  return Response.json(
    { success: false, message: `Route not found: ${request.method} ${pathname}` },
    { status: 404 },
  );
}

export const GET = notFound;
export const POST = notFound;
export const PUT = notFound;
export const PATCH = notFound;
export const DELETE = notFound;
