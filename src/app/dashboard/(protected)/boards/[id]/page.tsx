import { BoardViewer } from "./board-viewer";

export default async function AdminBoardViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <BoardViewer boardId={id} />;
}
