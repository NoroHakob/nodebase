import { requireAuth } from "@/lib/auth-utils"
import { HydrateClient } from "@/trpc/server"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

interface PageProps {
    params: Promise<{
        workflowId: string
    }>
}

const Page = async ({ params }: PageProps) => {
    await requireAuth()

    const { workflowId } = await params

    return (
        <HydrateClient>
            <ErrorBoundary fallback={<p>Error loading workflow!</p>}>
                <Suspense fallback={<p>Loading workflow...</p>}>
                    <p>Workflow id: {workflowId}</p>
                    {/* Replace with your WorkflowDetail component later */}
                </Suspense>
            </ErrorBoundary>
        </HydrateClient>
    )
}

export default Page;
