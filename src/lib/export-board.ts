import * as XLSX from "xlsx";
import type { Board } from "./types";

export function exportBoardToExcel(board: Board) {
  const wb = XLSX.utils.book_new();

  // --- Sheet 1: Summary ---
  const summaryData = [
    ["Board Name", board.name],
    ["Created", new Date(board.createdAt).toLocaleString()],
    ["Phase", board.phase],
    ["Participants", board.participants.map((p) => p.name).join(", ")],
    ["Total Participants", board.participants.length],
  ];
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  summarySheet["!cols"] = [{ wch: 20 }, { wch: 50 }];
  XLSX.utils.book_append_sheet(wb, summarySheet, "Summary");

  // --- Sheet 2: All Cards (flat table) ---
  const cardRows: (string | number)[][] = [
    ["Column", "Card", "Author", "Votes", "Voters"],
  ];
  for (const col of board.columns) {
    const sortedCards = [...col.cards].sort(
      (a, b) => b.votes.length - a.votes.length
    );
    for (const card of sortedCards) {
      const authorName = card.anonymous
        ? "Anonymous"
        : board.participants.find((p) => p.id === card.authorId)?.name ?? "Unknown";
      const voterNames = card.votes
        .map((v) => board.participants.find((p) => p.id === v)?.name ?? "?")
        .join(", ");
      cardRows.push([
        `${col.emoji} ${col.title}`,
        card.text,
        authorName,
        card.votes.length,
        voterNames,
      ]);
    }
  }
  const cardsSheet = XLSX.utils.aoa_to_sheet(cardRows);
  cardsSheet["!cols"] = [
    { wch: 20 },
    { wch: 50 },
    { wch: 18 },
    { wch: 8 },
    { wch: 30 },
  ];
  XLSX.utils.book_append_sheet(wb, cardsSheet, "Cards");

  // --- One sheet per column ---
  for (const col of board.columns) {
    const rows: (string | number)[][] = [["Card", "Author", "Votes"]];
    const sortedCards = [...col.cards].sort(
      (a, b) => b.votes.length - a.votes.length
    );
    for (const card of sortedCards) {
      const authorName = card.anonymous
        ? "Anonymous"
        : board.participants.find((p) => p.id === card.authorId)?.name ?? "Unknown";
      rows.push([card.text, authorName, card.votes.length]);
    }
    const colSheet = XLSX.utils.aoa_to_sheet(rows);
    colSheet["!cols"] = [{ wch: 50 }, { wch: 18 }, { wch: 8 }];
    // Sheet names max 31 chars and must not contain: \ / ? * : [ ]
    const sheetName = `${col.emoji} ${col.title}`
      .replace(/[\\/\?*:\[\]]/g, "") // Remove all invalid Excel sheet name characters
      .slice(0, 31)
      .trim() || "Sheet"; // Ensure name is not empty after sanitization
    XLSX.utils.book_append_sheet(wb, colSheet, sheetName);
  }

  // Download
  const filename = `${board.name.replace(/[^a-zA-Z0-9 _-]/g, "")}_retro.xlsx`;
  XLSX.writeFile(wb, filename);
}
