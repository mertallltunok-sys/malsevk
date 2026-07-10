import { cookies } from "next/headers";

export async function getSessionUserId(): Promise<number | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session_user_id");
  if (!sessionCookie) return null;
  const id = parseInt(sessionCookie.value, 10);
  return isNaN(id) ? null : id;
}
