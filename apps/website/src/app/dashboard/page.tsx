"use server"

import { getCurrentSession } from "@website/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Dashboard } from "./dashboard"

export default async function Page() {
  const session = await getCurrentSession()
  if (!session) {
    const headersList = await headers()
    return redirect(`/login?next=${headersList.get("x-pathname") ?? "/dashboard"}`)
  }

  return <Dashboard />
}
