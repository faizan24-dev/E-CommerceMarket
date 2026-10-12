import "server-only";
import { toSessionDTO } from "../dto.js";
import { notFound } from "../errors.js";
import { Session } from "../models/index.js";

/** Active sessions for a user, current one first. */
export async function listSessions(userId, currentSessionId) {
  const sessions = await Session.find({ user: userId, expiresAt: { $gt: new Date() } })
    .sort({ lastSeenAt: -1 })
    .limit(50)
    .lean();
  return sessions
    .map((session) => toSessionDTO(session, currentSessionId))
    .sort((a, b) => Number(b.isCurrent) - Number(a.isCurrent));
}

export async function revokeSession(userId, sessionId) {
  const { deletedCount } = await Session.deleteOne({ _id: sessionId, user: userId });
  if (!deletedCount) throw notFound("That session has already ended.");
}

export async function revokeOtherSessions(userId, keepSessionId) {
  const { deletedCount } = await Session.deleteMany({ user: userId, _id: { $ne: keepSessionId } });
  return deletedCount;
}

export async function revokeAllSessions(userId) {
  await Session.deleteMany({ user: userId });
}
