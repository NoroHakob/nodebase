import { generateSlug } from "random-word-slugs"
import prisma from "@/lib/db"
import type { Node, Edge } from "@xyflow/react"
import { createTRPCRouter, protectedProcedure} from "@/trpc/init"
import z from "zod"
import { PAGINATION } from "@/config/constants"
import { NodeType } from "@/generated/prisma"

export const workflowsRouter = createTRPCRouter({
    create: protectedProcedure.mutation(({ ctx }) => {
        return prisma.workflow.create({
            data: {
                name: generateSlug(3),
                userId: ctx.auth.user.id,
                nodes: {
                    create: {
                        type: NodeType.INITIAL,
                        position: { x: 0, y: 0 },
                        name: NodeType.INITIAL
                    }
                }
            }
        })
    }),
    remove: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(({ ctx, input }) => {
            return prisma.workflow.delete({
                where: {
                   id: input.id,
                   userId: ctx.auth.user.id,
                },
            })
        }),
    updateName: protectedProcedure
        .input(z.object({ id: z.string(), name: z.string().min(1) }))
        .mutation(({ ctx, input }) => {
            return prisma.workflow.update({
                where: { id: input.id, userId: ctx.auth.user.id },
                data: { name: input.name },
            })
        }),
    getOne: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            const workflow = await prisma.workflow.findUniqueOrThrow({
                where: { id: input.id, userId: ctx.auth.user.id },
                include: { nodes: true, connections: true },
            })

            const nodes: Node[] = workflow.nodes.map((node) => ({
                id: node.id,
                type: node.type,
                position: node.position as { x: number, y: number },
                data: { label: node.name, ...(node.data as Record<string, unknown>) },
            }))

            const edges: Edge[] = workflow.connections.map((connection) => ({
                id: connection.id,
                source: connection.fromNodeId,
                target: connection.toNodeId,
                sourceHandle: connection.fromOutput,
                targetHandle: connection.toInput,
            }))

            return {
                id: workflow.id,
                name: workflow.name,
                nodes,
                edges,
            }
        }),
    getMany: protectedProcedure
        .input(
            z.object({
                page: z.number().default(PAGINATION.DEFAULT_PAGE),
                pageSize: z
                    .number()
                    .min(PAGINATION.MIN_PAGE_SIZE)
                    .max(PAGINATION.MAX_PAGE_SIZE)
                    .default(PAGINATION.DEFAULT_PAGE_SIZE),
                search: z.string().default("")
            })
        )
        .query(async({ ctx, input }) => {
            const { page, pageSize, search } = input

            const where = {
                userId: ctx.auth.user.id,
                name: {
                    contains: search,
                    mode: "insensitive" as const,
                }
            }

            const [items, totalCount] = await Promise.all([
                prisma.workflow.findMany({
                    skip: (page - 1) * pageSize,
                    take: pageSize,
                    where,
                    orderBy: { updatedAt: "desc" },
                }),
                prisma.workflow.count({ where })
            ])

            const totalPages = Math.ceil(totalCount / pageSize)

            return {
                items,
                page,
                pageSize,
                totalCount,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
            }
        })
})