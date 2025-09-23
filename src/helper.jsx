export function checkHeading(str) {
  return /^\*\*(.+)\*\*$/.test(str)
}

export function replaceHeading(str) {
  return str.replace(/^\*\*|\*\*$/g, '')
}

export function cleanText(str) {
  return str.trim().replace(/^\*+|\*+$/g, '')
}
