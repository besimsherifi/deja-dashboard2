import { SignIn } from "@clerk/nextjs";
export const maxDuration = 60

export default function Page() {
  return <SignIn />;
}