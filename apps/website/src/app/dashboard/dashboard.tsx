"use client"

import { useMutation } from "@tanstack/react-query"
import { logout } from "@website/app/dashboard/action"
import { Button } from "@website/components/ui/button"
import { deleteApiV1UserMeDeleteMutation } from "@website/services/client/@tanstack/react-query.gen"
import { useCallback } from "react"

const handleLogoutClick = () => {
  logout().catch(console.error)
}

export function Dashboard() {
  const deleteUserMutation = useMutation({
    ...deleteApiV1UserMeDeleteMutation(),
    onSettled: async () => {
      await logout()
    },
  })

  const handleDeleteClick = useCallback(() => {
    void deleteUserMutation.mutateAsync({})
  }, [deleteUserMutation])

  return (
    <div className={"flex flex-row gap-4"}>
      <Button onClick={handleLogoutClick}>Logout</Button>
      <Button onClick={handleDeleteClick}>Delete User</Button>
    </div>
  )
}
