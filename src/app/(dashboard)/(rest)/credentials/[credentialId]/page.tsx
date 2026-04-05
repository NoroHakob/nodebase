"use client"

import { requireAuth } from "@/lib/auth-utils"
import { useParams } from "next/navigation"

interface PageProps {
    params: {
        credentialId: string
    }
}

const Page = async () => {
    await requireAuth()

    const params = useParams()
    
    return <p>Credential id: {params.credentialId}</p>
}

export default Page;