import { connectToDb } from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      // if any of these feids are not comming then send 400
      return NextResponse.json(
        { success: false, error: "Name ,Email, Password id required" },
        { status: 400 }
      );
    }
    await connectToDb();
    // if user already in database send 400
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "User is already registered" },
        { status: 400 }
      );
    }

    // create a new User and send 200
    await User.create({
      name,
      email,
      password,
    });
    return NextResponse.json(
      { success: true, message: "User registered successfully" },
      { status: 200 }
    );
  } catch (error) {
    // if issue in server send the error
    console.error("Registration Error: ", error);
    return NextResponse.json(
      { success: false, error: "filed to register User" },
      { status: 400 }
    );
  }
}
