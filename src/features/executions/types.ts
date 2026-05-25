import type { GetStepTools, Inngest } from "inngest";

export type WorkflowContext = Record<string, unknown>;
export type StepTools = GetStepTools<Inngest.Any>;
export type PublishFn = StepTools["realtime"]["publish"];

export interface NodeExecutorParams<TData = Record<string, unknown>> {
  data: TData;
  nodeId: string;
  userId: string;
  context: WorkflowContext;
  step: StepTools;
  publish: PublishFn;
};

export type NodeExecutor<TData = Record<string, unknown>> = (
  params: NodeExecutorParams<TData>,
) => Promise<WorkflowContext>;