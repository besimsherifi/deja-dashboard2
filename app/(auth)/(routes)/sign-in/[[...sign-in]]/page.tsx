import { SignIn } from "@clerk/nextjs";
export const maxDuration = 300

export default function Page() {
  return <SignIn />;
}