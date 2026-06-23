export interface CursorData {
  createdAt: string;
  id: string;
}

export function encodeCursor(cursor: CursorData) {
  return Buffer.from(JSON.stringify(cursor)).toString("base64");
}

export function decodeCursor(cursor: string): CursorData {
  return JSON.parse(Buffer.from(cursor, "base64").toString());
}
