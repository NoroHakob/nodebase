import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";
import type { NodeExecutor } from "@/features/executions/types";
import { httpRequestChannel } from "@/inngest/channels/http-request";

Handlebars.registerHelper("json", (context) => {
  return new Handlebars.SafeString(JSON.stringify(context, null, 2));
});

type HttpRequestData = {
  variableName?: string;
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
};

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish("loading", httpRequestChannel.status, { nodeId, status: "loading" });

  try {
    const result = await step.run("http-request", async () => {
      if (!data.endpoint) {
        throw new NonRetriableError("HTTP Request node: No endpoint configured");
      }
      if (!data.variableName) {
        throw new NonRetriableError("HTTP Request node: Variable name not configured");
      }
      if (!data.method) {
        throw new NonRetriableError("HTTP Request node: Method not configured");
      }

      const endpoint = Handlebars.compile(data.endpoint)(context);
      const method = data.method;
      const options: KyOptions = { method };

      if (["POST", "PUT", "PATCH"].includes(method)) {
        const resolved = Handlebars.compile(data.body || "{}")(context);
        JSON.parse(resolved);
        options.body = resolved;
        options.headers = { "Content-Type": "application/json" };
      }

      const response = await ky(endpoint, options);
      const contentType = response.headers.get("content-type");
      const responseData = contentType?.includes("application/json")
        ? await response.json()
        : await response.text();

      return {
        ...context,
        [data.variableName]: {
          httpResponse: {
            status: response.status,
            statusText: response.statusText,
            data: responseData,
          },
        },
      };
    });

    await publish("success", httpRequestChannel.status, { nodeId, status: "success" });

    return result;
  } catch (error) {
    await publish("error", httpRequestChannel.status, { nodeId, status: "error" });
    throw error;
  }
};