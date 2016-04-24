var Chance = require('chance')
var chance = new Chance();

function createTestData(count, callback) {
  var data = [], item;
  for(var i=0; i<count; i++) {
    data.push({
      id: i+1,
      product: chance.word(),
      price: chance.natural({min: 10, max: 50}),
      color: chance.pickone(['red', 'green', 'yellow']),
      available: chance.bool({likelihood:70}),
      tags: chance.pickset(
        ['alpha', 'bravo', 'charlie', 'delta', 'echo'],
        chance.natural({min: 1, max:4})
      ),
      vendor: {
        name: chance.name(),
        address: {
          city: chance.pickone(['London', 'Mumbai', 'New York'])
        }
      }
    });
  }
  callback.call(null, data);
}

module.exports = createTestData;
