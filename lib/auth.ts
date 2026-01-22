import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


export class AuthError extends Error {
  status: number;

  constructor(type: "UNAUTHORIZED" | "FORBIDDEN") {
    super(type);
    this.status = type === "FORBIDDEN" ? 403 : 401;
  }
}


export async function requireAuth() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new AuthError("UNAUTHORIZED");
  }

  return session;
}


export async function requireAdmin() {
  const session = await requireAuth();

  if (session.user.role !== "admin") {
    throw new AuthError("FORBIDDEN");
  }

  return session;
}
