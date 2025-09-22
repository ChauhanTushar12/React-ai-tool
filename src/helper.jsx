export function checkHeading(str){
    return /^(\*)(\*)(.*)\*$/.test(str)
}

export function replaceHeadingStarts(str){
    return str.replace(/^(\*)(\*)|(\*)$/g,'')
}

export function cleanText(str) {
  return str.replace(/^[\*\s]+|[\*\s]+$/g, '') 
}
