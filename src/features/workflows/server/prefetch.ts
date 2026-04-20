import { prefetch, trpc } from "@/trpc/server";
import type { workflowsParams } from "../params";
import type { inferParserType } from "nuqs/server";
 
type WorkflowsParams = inferParserType<typeof workflowsParams>

export const prefetchWorkflows = (params: WorkflowsParams) => {
    return prefetch(trpc.workflows.getMany.queryOptions(params))
}

export const prefetchWorkflow = (workflowId: string) => {
    return prefetch(trpc.workflows.getOne.queryOptions({ id: workflowId }))
}