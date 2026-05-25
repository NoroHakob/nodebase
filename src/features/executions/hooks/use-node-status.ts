import { useRealtime } from "inngest/react";
import { useState, useEffect } from "react";
import type { NodeStatus } from "@/components/react-flow/node-status-indicator";

type StatusData = {
  nodeId: string;
  status: "loading" | "success" | "error";
};

interface UseNodeStatusOptions {
  nodeId: string;
  channel: Parameters<typeof useRealtime>[0]["channel"];
  refreshToken: () => Promise<any>;
};

export function useNodeStatus({
  nodeId,
  channel,
  refreshToken,
}: UseNodeStatusOptions) {
  const [status, setStatus] = useState<NodeStatus>("initial");

  const { messages } = useRealtime({
    channel,
    topics: ["status"] as const,
    token: refreshToken,
  });

  useEffect(() => {
    if (!messages?.all?.length) return;

    const latestMessage = messages.all
      .filter((msg) => msg.topic === "status" && (msg.data as StatusData).nodeId === nodeId)
      .at(-1);

    if (latestMessage) {
      setStatus((latestMessage.data as StatusData).status as NodeStatus);
    }
  }, [messages, nodeId]);

  return status;
};