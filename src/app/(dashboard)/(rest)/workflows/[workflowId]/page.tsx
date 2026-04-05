"use client"

import { requireAuth } from "@/lib/auth-utils"
import { useParams } from "next/navigation"

interface PageProps {
    params: {
        workflowId: string
    }
}

const Page = async () => {
    await requireAuth()

    const params = useParams()
    
    return <p>Workflow id: {params.workflowId}</p>
}

export default Page;