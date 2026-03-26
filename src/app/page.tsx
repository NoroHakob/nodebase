"use client"

import { LogoutButton } from "./logout"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { useTRPC } from "@/trpc/client"
import { toast } from "sonner"

const Page = () => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const { data } = useQuery(trpc.getWorkflows.queryOptions())

  const testAi = useMutation(trpc.testAi.mutationOptions({
    onSuccess: () => {
      toast.success("AI Job queued")
    }
  }))

  console.log("QUERY DATA:", data)

  const create = useMutation(
    trpc.createWorkflow.mutationOptions({
      onSuccess: () => {
        toast.success("Job queued")
      },
      onError: (err) => {
        console.error("CREATE ERROR:", err)
      }
    })
  )

  return (
    <div className="min-h-screen min-w-screen flex flex-col items-center justify-center gap-y-6">
      protected server component
      <div>
        {JSON.stringify(data, null, 2)}
      </div>
      <Button disabled={testAi.isPending} onClick={() => testAi.mutate()}>
        Test AI
      </Button>
      <Button
        disabled={create.isPending}
        onClick={() => {
          console.log("BUTTON CLICKED")
          create.mutate()
        }}
      >
        Create workflow
      </Button>
      <LogoutButton />
    </div>
  )
}

export default Page