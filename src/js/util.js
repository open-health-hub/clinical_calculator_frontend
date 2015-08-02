function mergeObjects(source, destination, overwrite) {
  if (source === null || source === undefined) {
    return;
  }

  if (destination === null || destination === undefined) {
    return;
  }

  if (overwrite === undefined) {
    overwrite = false;
  }

  for (var key in source) {
    if (overwrite || !destination.hasOwnProperty(key)) {
      destination[key] = source[key];
    }
  }
}

function copyMergeObjects(source, destination, overwrite) {
  var result = {};

  mergeObjects(destination, result, true);
  mergeObjects(source, result, overwrite);

  return result;
}
