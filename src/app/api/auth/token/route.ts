import { NextRequest, NextResponse } from "next/server";
import { encode, getToken } from "next-auth/jwt";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db/mongodb";
import User from "@/lib/db/models/User";

const SECRET = process.env.NEXTAUTH_SECRET || "forbes-vn-super-secret-key-32chars-min!";

// GET /api/auth/token - Introspect current token/session
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: SECRET });
    if (!token) {
      return NextResponse.json({ authenticated: false, message: "Chưa xác thực" }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      token: token,
      user: {
        id: token.id,
        email: token.email,
        name: token.name,
        role: token.role,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/auth/token - Generate new JWT authentication token
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Vui lòng nhập email và mật khẩu" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    let authUser: { id: string; email: string; name: string; role: string } | null = null;

    // 1. Check MongoDB
    try {
      await connectDB();
      const user = await User.findOne({ email: cleanEmail });
      if (user) {
        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (isValid) {
          authUser = {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          };
        }
      }
    } catch (e) {
      console.warn("MongoDB check offline, testing default credentials...");
    }

    // 2. Check Fallback Credentials
    if (!authUser) {
      if (cleanEmail === "admin@forbes.vn" && password === "Admin@123456") {
        authUser = {
          id: "usr_admin_default",
          email: "admin@forbes.vn",
          name: "Tổng biên tập Forbes",
          role: "admin",
        };
      } else if (cleanEmail === "editor@forbes.vn" && password === "Editor@123456") {
        authUser = {
          id: "usr_editor_default",
          email: "editor@forbes.vn",
          name: "Ban Thư ký Toà soạn",
          role: "editor",
        };
      }
    }

    if (!authUser) {
      return NextResponse.json({ error: "Email hoặc mật khẩu không chính xác" }, { status: 401 });
    }

    // Encode standard NextAuth JWT token
    const token = await encode({
      token: {
        id: authUser.id,
        email: authUser.email,
        name: authUser.name,
        role: authUser.role,
      },
      secret: SECRET,
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    const response = NextResponse.json({
      success: true,
      token,
      tokenType: "Bearer",
      expiresIn: 30 * 24 * 60 * 60,
      user: authUser,
    });

    // Also set standard NextAuth session cookie so browser is immediately logged in
    response.cookies.set("next-auth.session-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
