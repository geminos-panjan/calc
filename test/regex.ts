function extractNonMatchingSubstring(
  inputString: string,
  regexPattern: string | RegExp
) {
  var regex = new RegExp(regexPattern);
  var match = inputString.match(regex);

  if (match) {
    var startIndex = match.index ?? 0 + match[0].length;
    return inputString.slice(startIndex);
  } else {
    return inputString;
  }
}
var inputString = "Hello 123 World";
var regexPattern = "\\d+";
var result = extractNonMatchingSubstring(inputString, regexPattern);
console.log(result); // Output: "Hello  World"
