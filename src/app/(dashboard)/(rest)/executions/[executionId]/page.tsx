"use client"

import { requireAuth } from "@/lib/auth-utils"
import { useParams } from "next/navigation"

interface PageProps {
    params: {
        executionId: string
    }
}

const Page = async () => {
    await requireAuth()

    const params = useParams()
    
    return <p>Execution id: {params.executionId}</p>
}

export default Page;