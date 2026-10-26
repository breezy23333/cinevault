
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const detectedCountry = request.headers
    .get("x-vercel-ip-country")
    ?.trim()
    .toUpperCase();

  const country =
    detectedCountry && /^[A-Z]{2}$/.test(detectedCountry)
      ? detectedCountry
      : "US";

  return Response.json(
    { country },
    {
      headers: {
        "Cache-Control": "private, no-store",
      },
    }
  );
}
