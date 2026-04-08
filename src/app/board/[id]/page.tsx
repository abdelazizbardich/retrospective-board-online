import { BoardProvider } from "@/lib/board-context";
import { BoardView } from "./board-view";

export default async function BoardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <BoardProvider boardId={id}>
      <BoardView />
    </BoardProvider>
  );
}
