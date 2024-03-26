(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.JSONGroupBy = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';
var propertyAt = require('./property-value.js')

function groupBy(items, properties, collect) {
  // TODO argument validation
  if (arguments.length < 2) return arr;
  var groups = _groupBy(items, properties);
  // collect other properties values in array
  if (collect && collect.length > 0)
    groups = collectProperties(groups, collect);

  return groups;
}

function _groupBy(items, properties) {
  var group = {};
 	if (typeof properties[0] === 'string') {
 	  group = groupByCategory(items, properties[0]);
 	} else {
 	  group = groupByRange(items, properties[0]);
 	}
  properties = properties.slice(1);
  if (properties.length > 0) {
    for (var key in group) {
      group[key] = _groupBy(group[key], properties);
    }
  }
  return group;
}

function groupByCategory(arr, prop) {
  return arr.reduce(function(group, item) {
    var tags = propertyAt(item, prop);
    tags.forEach(function(tag) { 
      group[tag] = group[tag] || [];
      group[tag].push(item);
    });
    return group;
  },{});
}

function groupByRange(arr, lookup) {
  return arr.reduce(function(group, f) {
    var val, ind, tag;
    val = propertyAt(f, lookup.property);
    ind = locationOf(val, lookup.intervals);
    if (ind === lookup.intervals.length -1) ind--;
    tag = lookup.labels ? lookup.labels[ind] : ind;
    group[tag] = group[tag] || [];
    group[tag].push(f);
    return group;
  },{});
}

// collect the properties in an array 
function collectProperties(groups, properties) { 
  var collection = {};
  for (var key in groups) {
    if (Array.isArray(groups[key])) {
      collection[key] = groups[key].reduce(function(coll, item) {
        properties.forEach(function(prop) { 
          if (!coll[prop]) coll[prop] = [];
          coll[prop] = coll[prop].concat(propertyAt(item,prop));
        })
        return coll;
      }, {})
    } else {
      collection[key] = collectProperties(groups[key], properties);
    }
  }
  return collection;
}

// similar to Array.findIndex but more efficient
// http://stackoverflow.com/q/1344500/713573
function locationOf(element, array, start, end) {
  start = start || 0;
  end = end || array.length;
  var pivot = parseInt(start + (end - start) / 2, 10);
  if (end-start <= 1 || array[pivot] === element) return pivot;
  if (array[pivot] < element) {
    return locationOf(element, array, pivot, end);
  } else {
    return locationOf(element, array, start, pivot);
  }
}
module.exports = groupBy;

},{"./property-value.js":2}],2:[function(require,module,exports){
function valueAt(obj, path) {
  var parts = path.split('.')
  var prop = parts.shift()
  if (isPrimitive(obj[prop])) {
    return [obj[prop]]
  } else if (isObject(obj[prop])) {
    return valueAt(obj[prop], parts.join('.'))
  } else if (isPrimitiveArray(obj[prop])) {
    return obj[prop].reduce(function(values, val) {
			if (values.indexOf(val) < 0) values.push(val)
      return values
    },[])
  } else if (isObjectArray(obj[prop])) {
    return obj[prop].reduce(function(values, item) {
      var vals = valueAt(item, parts.join('.'))
      vals.reduce(function(sum, key) {
				if (sum.indexOf(key) < 0) sum.push(key)
        return sum
      }, values)
			return values
    }, [])
  } else {
    throw new TypeError('property path: "'+ path + '" not valid in your data at object: '+ JSON.stringify(obj))
  }
}

function isPrimitive(val) {
  return typeof val === 'string' || typeof val === 'number' 
    || typeof val === 'boolean' 
}

function isPrimitiveArray(val) {
  return Array.isArray(val) && val.length > 0 && isPrimitive(val[0])
}

function isObject(val) {
  // `typeof [{id: 1}]` returns value object so frst negate array 
  return !Array.isArray(val) && typeof val === 'object'
}

function isObjectArray(val) {
  return Array.isArray(val) && val.length > 0 && typeof val[0] === 'object' 
}

module.exports = valueAt 

},{}]},{},[1])(1)
});
//# sourceMappingURL=json-groupby.js.map
