"use client"

import { useMutation } from "@tanstack/react-query"
import { logout } from "@website/app/dashboard/action"
import { Button } from "@website/components/ui/button"
import { deleteApiV1UserMeDeleteMutation } from "@website/services/client/@tanstack/react-query.gen"

export function Dashboard() {
  const deleteUserMutation = useMutation({
    ...deleteApiV1UserMeDeleteMutation(),
    onSettled: async () => {
      await logout()
    },
  })

  async function handleLogout() {
    await logout()
  }

  return (
    <div className={"flex flex-row gap-4"}>
      <Button
        onClick={() => {
          handleLogout().catch(console.error)
        }}
      >
        Logout
      </Button>
      <Button
        onClick={() => {
          void deleteUserMutation.mutateAsync({})
        }}
      >
        Delete User
      </Button>
    </div>
  )
}
