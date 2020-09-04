const descriptionParser = require("./description.pegjs")

export function parseDescription(description){
  // See https://intheam.readthedocs.io/en/latest/api/task_format.html for the
  // accepted format.
  // Try using this regex and iterate over matches:
	// const regex = /(\w+:|\+)?((?:[^"'\s]|\\\s)(?:\S|\\\s)+|(['"])(?:.*?)(?<!\\)(>\\\\)*?\3(?:,(['"])(?:.*?)(?<!\\)(>\\\\)*?\5)*)/gm; 
  let parsed_description = descriptionParser.parse(description);
  return parsed_description; 
}
