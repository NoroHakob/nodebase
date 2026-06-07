import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "nodebase",
  signingKey: process.env.INNGEST_SIGNING_KEY,
});