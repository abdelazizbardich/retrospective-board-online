import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Boards",
  robots: { index: false, follow: false },
};

export default function MyBoardsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
