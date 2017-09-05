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
