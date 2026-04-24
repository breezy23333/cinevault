export function GET() {
  return new Response(
    "google-site-verification: google69d250b64c5f7c21.html",
    {
      headers: {
        "Content-Type": "text/plain",
      },
    }
  );
}