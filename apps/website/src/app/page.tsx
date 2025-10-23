import { Button } from "@website/components/ui/button"
import { getCurrentSession } from "@website/lib/auth"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function Page() {
  const session = await getCurrentSession()
  if (session) {
    return redirect("/dashboard")
  }

  return (
    <div>
      <Link href={"/login"}>
        <Button>Login</Button>
      </Link>
    </div>
  )
}
