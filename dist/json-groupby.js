(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.JSONGroupBy = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function groupBy() {
  if (arguments.length < 2) return;
  var args, features, properties;
  // get args as array 
  // http://stackoverflow.com/a/15705938/713573
  args = Array.prototype.slice.call(arguments, 0);

  var features = Array.isArray(args[0]) ? args[0] : args[0].features;
  var properties = args.slice(1);
  return properties.reduce(function(group, prop, i, arr) {
    if (Object.keys(group).length > 0) {
      for (var key in group) {
        group[key] = groupBy.apply(null,
          [group[key]].concat(arr.slice(i))
        );
      }
    } else {
	    if (typeof prop === 'string') {
	      group = groupByCategory(features, prop);
	    } else {
	      group = groupByRange(features, prop);
	    }
    }
    return group;
  },{});
}

function groupByCategory(arr, prop) {
  var isPropertyArray = Array.isArray(valueAt(arr[0], prop));
  if (isPropertyArray) {
    return arr.reduce(function(group, f) {
      var tags = valueAt(f, prop);
      tags.forEach(function(tag) { 
        group[tag] = group[tag] || [];
        group[tag].push(f);
      });
      return group;
    },{});
  } else {
    return arr.reduce(function(group, f) {
      var tag = valueAt(f, prop);
      group[tag] = group[tag] || [];
      group[tag].push(f);
      return group;
    },{});
  }
}

function groupByRange(arr, lookup) {
  return arr.reduce(function(group, f) {
    var val, ind, tag;
    val = valueAt(f, lookup.property);
    ind = locationOf(val, lookup.intervals);
    tag = lookup.labels ? lookup.labels[ind] : ind;
    group[tag] = group[tag] || [];
    group[tag].push(f);
    return group;
  },{});
}

function valueAt(obj,path) {
  //taken from http://stackoverflow.com/a/6394168/713573
  function index(prev,cur) { 
    try {
      return prev[cur]; 
    } catch(e) {
      throw new Error('Path "'+path+ '" is not valid in '+ JSON.stringify(obj)); 
    }
  }
  return path.split('.').reduce(index, obj);
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

},{}]},{},[1])(1)
});
//# sourceMappingURL=json-groupby.js.map
