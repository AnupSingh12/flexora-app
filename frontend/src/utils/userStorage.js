// Helpers to save/read the signed-up user and auto-detect id/email in various response shapes
export function saveUserFromResponse(resp) {
  if (!resp) return null;

  // Common wrappers: { user: {...} }, { data: {...} }, mongoose doc with _doc
  const candidate = resp.user || resp.data || resp || resp._doc || {};

  // Try several possible id fields
  const id =
    candidate._id ||
    candidate.id ||
    candidate.userId ||
    (candidate._doc && candidate._doc._id) ||
    resp._id ||
    resp.id ||
    resp.userId ||
    null;

  const email =
    candidate.email ||
    resp.email ||
    candidate.userEmail ||
    resp.userEmail ||
    null;

  const normalized = { _id: id, email };

  try {
    localStorage.setItem("flexoraUser", JSON.stringify(normalized));
  } catch (err) {
    console.warn("userStorage: could not save user to localStorage", err);
  }

  return normalized;
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem("flexoraUser");
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.warn("userStorage: could not parse stored user", err);
    return null;
  }
}

export function getStoredUserId() {
  const u = getStoredUser();
  if (!u) return null;
  return u._id || u.id || u.userId || null;
}

export default { saveUserFromResponse, getStoredUser, getStoredUserId };
