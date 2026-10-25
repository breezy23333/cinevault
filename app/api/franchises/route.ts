import { NextResponse } from "next/server";
import { getFranchises } from "@/lib/franchises";

export async function GET() {
  const franchises = await getFranchises();
  return NextResponse.json(franchises);
}