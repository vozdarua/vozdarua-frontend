export function maskEmail(email) {
  if (!email) return email
  const at = email.indexOf('@')
  return at === -1 ? `${email}...` : `${email.slice(0, at)}...`
}
