export function maskEmail(email) {
  if (!email) return email
  // Backend already masks authorEmail/ranking emails before sending them — this is just a
  // display-layer safety net now, so don't double up the "..." if it arrives pre-masked.
  if (email.endsWith('...')) return email
  const at = email.indexOf('@')
  return at === -1 ? `${email}...` : `${email.slice(0, at)}...`
}
