var dream = require('dreamjs');
dream.customType('incrementalId', function(helper){
  return helper.previousItem ? helper.previousItem.id+1 : 1;
});

dream.customType('geometry', function(helper) {
  return {
    type: 'Point',
    coordinates: [
      helper.chance.longitude(),
      helper.chance.latitude()
    ]
  };
});
dream.customType('properties', function(helper) {
  var colors = ['red', 'green', 'blue', 'yellow'],
    city = ['London', 'Mumbai', 'New York'];
   
  return {
    color: helper.oneOf(colors),
    price: helper.chance.integer({min: 10000, max: 100000}),
    gender: helper.chance.gender(),
    available: helper.chance.bool(),
    address: {
      street: helper.chance.address(),
      areaCode: helper.chance.areacode(),
      city: helper.oneOf(city)
    }
  };
});

function createTestData(count,callback) {
  dream
    .schema({
      id: 'incrementalId',
      geometry: 'geometry',
      properties: 'properties'
    })
    .generateRnd(count)
    .output(function (err, features) {
      testData = { 
        features: features,
        stats: {
          color: getStats(features, 'properties.color'),
          gender: getStats(features, 'properties.gender'),
          city: getStats(features, 'properties.address.city'),
          price: getIntervalVals(features, 'properties.price'),
          available: getStats(features, 'properties.available')
        }
      };
      callback.call(this,testData);
    });
}

function getIntervalVals(features, prop) {
  debugger;
  return features.reduce(function(acc, f) {
    acc.push(valueAt(f, prop));
    return acc;
  },[])
  .sort();
}
function getStats(features, prop) {
  return features.reduce(function(acc,f) {
    var key = valueAt(f,prop);
    acc[key] = acc[key] ? acc[key] + 1 : 1;
    return acc;
  },{});
}
function valueAt(obj,path) {
  //taken from http://stackoverflow.com/a/6394168/713573
  function index(prev,cur) { return prev[cur]; }
  return path.split('.').reduce(index, obj);
};

module.exports = createTestData;
