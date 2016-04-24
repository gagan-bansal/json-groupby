var groupBy = require('../')
  createTestData = require('./create-test-data.js')
console.log('Creating random test data.....') 
createTestData(100000, function(data) {
  console.log('created test data with 100,000 json object')
  
  console.time('single property')
  groupBy(data, ['vendor.address.city'])
  console.timeEnd('single property')
  
  console.time('group by range')
  groupBy(data, [{
    property: 'price', 
    intervals: [0, 20, 40, 50]
  }])
  console.timeEnd('group by range')
  
  console.time('group by two properties')
  groupBy(data, [
    'vendor.address.city',
    {
      property: 'price', 
      intervals: [0, 20, 40, 50]
    }
  ])
  console.timeEnd('group by two properties')
  
  console.time('group by two properties and collect')
  groupBy(
    data, 
    [
      'vendor.address.city',
      {
        property: 'price', 
        intervals: [0, 20, 40, 50]
      }
    ],
    ['color', 'available']
  )
  console.timeEnd('group by two properties and collect')
})
