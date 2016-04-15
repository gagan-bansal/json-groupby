var groupBy = require('../')
  createTestData = require('./create-test-data.js');
console.log('Creating random features.....'); 
createTestData(100000, function(data) {
  console.log('created random 100,000 features');
  var features = data.features; 
  t = Date.now();
  var cluster = groupBy(features, 'properties.address.city');
  console.log('single property as tag - time taken: '+ (Date.now() - t)/1000 + ' s');
  t = Date.now();
  var cluster = groupBy(features, {
    property: 'properties.price', 
    intervals: [10000, 30000, 70000, 10000]
  });
  console.log('single property as inervals - time taken: '+ (Date.now() - t)/1000 + ' s');
  t = Date.now();
  var cluster = groupBy(features, 'properties.address.city',
    {
      property: 'properties.price', 
      intervals: [10000, 30000, 70000, 10000]}
  );
  console.log('two properties combined - time taken: '+ (Date.now() - t)/1000 + ' s');
});
