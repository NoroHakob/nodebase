// import type { inferInput } from "@trpc/tanstack-react-query";
// import { prefetch, trpc } from "@/trpc/server";

// type Input = inferInput<typeof trpc.workflows.getMany>

// export const prefetchWorkflows = (params: Input) => {
//     return prefetch(trpc.workflows.getMany.queryOptions(params))
// } 

import { prefetch, trpc } from "@/trpc/server";
 
export const prefetchWorkflows = () => {
    return prefetch(trpc.workflows.getMany.queryOptions())
} 