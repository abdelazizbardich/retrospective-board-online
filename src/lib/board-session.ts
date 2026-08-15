import { getSessionSecret, newNonce, safeEqual, signPayload } from "./session-crypto";

const DEV_FALLBACK = "dev-board-session-secret";
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function secret(): string {
  return getSessionSecret("BOARD_SESSION_SECRET", DEV_FALLBACK);
}

/** Signed participant session: boardId.participantId.issuedAt.nonce.hmac */
export function createBoardSessionToken(boardId: string, participantId: string): string {
  const issuedAt = Date.now().toString(36);
  const nonce = newNonce();
  const payload = `${boardId}.${participantId}.${issuedAt}.${nonce}`;
  return `${payload}.${signPayload(payload, secret())}`;
}

export function verifyBoardSessionToken(
  token: string,
  expectedBoardId: string
): { participantId: string } | null {
  const parts = token.split(".");
  if (parts.length !== 5) return null;
  const [boardId, participantId, issuedAtHex, nonce, hmac] = parts;
  if (boardId !== expectedBoardId || !participantId) return null;
  const payload = `${boardId}.${participantId}.${issuedAtHex}.${nonce}`;
  if (!safeEqual(hmac, signPayload(payload, secret()))) return null;
  const issuedAt = parseInt(issuedAtHex, 36);
  if (!Number.isFinite(issuedAt) || Date.now() - issuedAt > MAX_AGE_MS) return null;
  return { participantId };
}

/** Pending join claim token: boardId.requestId.issuedAt.nonce.hmac (prefix p.) */
export function createPendingJoinToken(boardId: string, requestId: string): string {
  const issuedAt = Date.now().toString(36);
  const nonce = newNonce();
  const payload = `p.${boardId}.${requestId}.${issuedAt}.${nonce}`;
  return `${payload}.${signPayload(payload, secret())}`;
}

export function verifyPendingJoinToken(
  token: string,
  expectedBoardId: string
): { requestId: string } | null {
  const parts = token.split(".");
  if (parts.length !== 6 || parts[0] !== "p") return null;
  const [, boardId, requestId, issuedAtHex, nonce, hmac] = parts;
  if (boardId !== expectedBoardId || !requestId) return null;
  const payload = `p.${boardId}.${requestId}.${issuedAtHex}.${nonce}`;
  if (!safeEqual(hmac, signPayload(payload, secret()))) return null;
  const issuedAt = parseInt(issuedAtHex, 36);
  if (!Number.isFinite(issuedAt) || Date.now() - issuedAt > MAX_AGE_MS) return null;
  return { requestId };
}

/** Extract bearer or body sessionToken from a request. */
export function extractBoardToken(
  request: { headers: Headers },
  body: Record<string, unknown>
): string | null {
  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) {
    const bearer = auth.slice(7).trim();
    if (bearer) return bearer;
  }
  if (typeof body.sessionToken === "string" && body.sessionToken.trim()) {
    return body.sessionToken.trim();
  }
  return null;
}
