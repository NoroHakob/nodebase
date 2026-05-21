import { auth } from '@/lib/auth';
import { initTRPC, TRPCError } from '@trpc/server';
import { headers } from 'next/headers';
import { cache } from 'react';
import superjson from "superjson";
import prisma from '@/lib/db';

export const createTRPCContext = cache(async () => {
  return { headers: await headers() };
});

type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  const session = await auth.api.getSession({
    headers: ctx.headers,
  });

  if (!session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Unauthorized",
    });
  }

  return next({ ctx: { ...ctx, auth: session } });
});

export const premiumProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const user = await prisma.user.findUnique({
    where: { id: ctx.auth.user.id },
    select: { isPremium: true }, // 👈 adjust field name to match your schema
  });

  if (!user?.isPremium) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "This action requires a premium subscription",
    });
  }

  return next({ ctx });
});