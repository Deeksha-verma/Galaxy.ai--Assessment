import { prisma } from "../common/services/database.service";
import { ensureUserSync } from "../user/user.service";

export const createWorkflow = async (userId: string, data: any) => {
  await ensureUserSync(userId);
  return await prisma.workflow.create({
    data: {
      userId,
      name: data.name || "Untitled Workflow",
      nodes: data.nodes || [],
      edges: data.edges || [],
    },
  });
};

export const listWorkflows = async (userId: string) => {
  return await prisma.workflow.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    select: { id: true, name: true, updatedAt: true, createdAt: true, isSample: true },
  });
};

export const getWorkflow = async (userId: string, id: string) => {
  const workflow = await prisma.workflow.findUnique({ where: { id } });
  if (!workflow) throw new Error("Workflow not found");
  if (workflow.userId !== userId) throw new Error("Forbidden access");
  return workflow;
};

export const updateWorkflow = async (userId: string, id: string, data: any) => {
  await getWorkflow(userId, id); // check ownership
  return await prisma.workflow.update({
    where: { id },
    data,
  });
};

export const deleteWorkflow = async (userId: string, id: string) => {
  await getWorkflow(userId, id); // check ownership
  await prisma.workflow.delete({ where: { id } });
};

export const exportWorkflow = async (userId: string, id: string) => {
  const workflow = await getWorkflow(userId, id);
  return {
    version: "1.0",
    name: workflow.name,
    nodes: workflow.nodes,
    edges: workflow.edges,
  };
};

export const importWorkflow = async (userId: string, data: any) => {
  return await createWorkflow(userId, data);
};

export const seedSampleWorkflow = async (userId: string) => {
  // Check if sample already seeded for this user
  const existing = await prisma.workflow.findFirst({
    where: { userId, isSample: true },
  });
  if (existing) return existing;

  // "Product Marketing Kit Generator" preset
  const nodes = [
    { id: "n1", type: "upload-image", position: { x: 100, y: 200 }, data: { label: "Upload Product Image", imageUrl: "" } },
    { id: "n2", type: "upload-video", position: { x: 100, y: 420 }, data: { label: "Upload Product Video", videoUrl: "" } },
    { id: "n3", type: "text",         position: { x: 100, y: 60  }, data: { label: "Brand Voice",          text: "Write in a professional, modern marketing tone." } },
    { id: "n4", type: "text",         position: { x: 100, y: 640 }, data: { label: "Frame Timestamp",      text: "50%" } },
    { id: "n5", type: "crop-image",   position: { x: 420, y: 160 }, data: { label: "Crop Hero Shot", x_percent: 10, y_percent: 10, width_percent: 80, height_percent: 80 } },
    { id: "n6", type: "extract-frame",position: { x: 420, y: 420 }, data: { label: "Extract Thumbnail", timestamp: "50%" } },
    { id: "n7", type: "llm",          position: { x: 720, y: 200 }, data: { label: "Generate Ad Copy", model: "gemini-2.0-flash", system_prompt: "", user_message: "Write a compelling product advertisement for this image." } },
    { id: "n8", type: "llm",          position: { x: 1020, y: 300 }, data: { label: "Final Campaign Brief", model: "gemini-2.0-flash", system_prompt: "", user_message: "Combine the ad copy and extracted frame to create a full marketing brief." } },
  ];

  const edges = [
    { id: "e1", source: "n1", target: "n5", sourceHandle: "output", targetHandle: "image_url", type: "custom", animated: true },
    { id: "e2", source: "n2", target: "n6", sourceHandle: "output", targetHandle: "video_url", type: "custom", animated: true },
    { id: "e3", source: "n4", target: "n6", sourceHandle: "output", targetHandle: "timestamp",  type: "custom", animated: true },
    { id: "e4", source: "n3", target: "n7", sourceHandle: "output", targetHandle: "system_prompt", type: "custom", animated: true },
    { id: "e5", source: "n5", target: "n7", sourceHandle: "output", targetHandle: "images",     type: "custom", animated: true },
    { id: "e6", source: "n7", target: "n8", sourceHandle: "output", targetHandle: "user_message", type: "custom", animated: true },
    { id: "e7", source: "n6", target: "n8", sourceHandle: "output", targetHandle: "images",     type: "custom", animated: true },
  ];

  return await prisma.workflow.create({
    data: {
      userId,
      name: "Product Marketing Kit Generator",
      nodes: nodes as any,
      edges: edges as any,
      isSample: true,
    },
  });
};

