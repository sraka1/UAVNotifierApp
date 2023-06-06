export function generateRandomString(length) {
  const char = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890"
  const random = Array.from({ length }, () => char[Math.floor(Math.random() * char.length)])
  return random.join("")
}
