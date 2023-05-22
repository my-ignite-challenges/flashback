import decode from "jwt-decode";
import { cookies } from "next/headers";

type User = {
  sub: string;
  name: string;
  avatarUrl: string;
};

export function getUserData(): User {
  const token = cookies().get("token")?.value;

  if (!token) {
    throw new Error("User is not authenticated");
  }

  const user: User = decode(token);

  return user;
}
