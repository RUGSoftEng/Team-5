

function minWith(list, minWith, defaultValue) {
  var min = list.length == 0 ? defaultValue : minWith(list[0]);
  list.forEach(function(element) {
    if(minWith(element) < min) {
      min = minWith(element);
    }
  });
  return min;
}

function maxWith(list, maxWith, defaultValue) {
  var max = list.length == 0 ? defaultValue : maxWith(list[0]);
  list.forEach(function(element) {
    if(maxWith(element) > max) {
      max = maxWith(element);
    }
  });
  return max;
}

function partition(list, partitionFunction) {
  var result = [[], []];
  list.forEach(function(element) {
    result[partitionFunction(element) ? 0 : 1].push(element);
  });
  return result;
}

function bindField(field) {
  return function(x) {
    return x[field];
  }
}

function shuffle(itemList) {
  var shuffledItems = itemList.slice(0);
  for(var i = 0; i < shuffledItems.length; i++) {
    var j = Math.floor(Math.random() * shuffledItems.length);
    var tmp = shuffledItems[j];
    shuffledItems[j] = shuffledItems[i];
    shuffledItems[i] = tmp;
  }
  return shuffledItems;
}

function sumWith(itemList, sumWith) {
  var sum = 0;
  itemList.forEach(function(item) {
    sum += sumWith(item);
  });
  return sum;
}

function clone(element) {
  var clone = {};
  for(var field in element) {
    if(element.hasOwnProperty(field)) {
      clone[field] = element[field];
    }
  }
  return clone;
}

function merge(a, b) {
  var out = {};
  var field;
  for(field in a) {
    if(a.hasOwnProperty(field)) {
      out[field] = a[field];
    }
  }
  for(field in b) {
    if(b.hasOwnProperty(field)) {
      out[field] = b[field];
    }
  }
  return out;
}
