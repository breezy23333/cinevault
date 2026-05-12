import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing email or password" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid login credentials" },
        { status: 401 }
      );
    }

    if (!user.password) {
        return NextResponse.json(
            { error: "Invalid login credentials" },
            { status: 401 }
        );
        }

        const validPassword = await bcrypt.compare(
        password,
        user.password
        );

    if (!validPassword) {
      return NextResponse.json(
        { error: "Invalid login credentials" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error: any) {
    console.error("LOGIN ERROR:", error);

    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}