var expect = require('chai').expect,
  groupBy = require('../json-groupby.js'),
  products =
    [{"id": 1,
      "product": "ri", "price": 16, "color": "green", "available": false,
      "tags": ["bravo"],
      "vendor": {"name": "Donald Chambers", "address": {"city": "Mumbai"}}},
     {"id": 2,
      "product": "foef", "price": 44, "color": "yellow", "available": false,
      "tags": ["alpha"],
      "vendor": {"name": "Barbara Garrett", "address": {"city": "Mumbai"}}},
     {"id": 3,
      "product": "jehnojto", "price": 29, "color": "red", "available": true,
      "tags": ["alpha"],
      "vendor": {"name": "Anne Leonard", "address": {"city": "New York"}}},
     {"id": 4,
      "product": "ru", "price": 35, "color": "yellow", "available": false,
      "tags": ["echo", "charlie", "bravo"],
      "vendor": {"name": "Justin Doyle", "address": {"city": "London"}}},
     {"id": 5,
      "product": "pihluve", "price": 47, "color": "green", "available": true,
      "tags": ["delta", "echo", "bravo"],
      "vendor": {"name": "Emily Abbott", "address": {"city": "New York"}}},
     {"id": 6,
      "product": "dum", "price": 28, "color": "green", "available": true,
      "tags": ["echo", "delta", "charlie"],
      "vendor": {"name": "Henry Peterson", "address": {"city": "New York"}}},
     {"id": 7,
      "product": "zifpeza", "price": 10, "color": "green", "available": false,
      "tags": ["echo", "charlie", "bravo"],
      "vendor": {"name": "Jesus Lowe", "address": {"city": "Mumbai"}}},
     {"id": 8,
      "product": "av", "price": 39, "color": "green", "available": true,
      "tags": ["bravo"],
      "vendor": {"name": "Rosalie Erickson", "address": {"city": "New York"}}}];
var vendors = [{
  id: 1,
  addresses : [{
    city: 'a',
    localities: [
      {size: "small", zipcode: '12345', storeType: ['electronic', 'food']},
      {size: "medium", zipcode: '12346', storeType: ['food']}]
  }, {
    city: 'b',
    localities: [
      {size: "medium", zipcode: '12345', storeType: ['electronic', 'food']},
      {size: "small", zipcode: '12347', storeType: ['electronic']}]
  }],
  details: {
    name: 'foo', 
    items: 400, 
    rating: 'high'}
}, {
  id: 2,
  addresses : [{
    city: 'a',
    localities: [
      {size: "large", zipcode: '12345', storeType: ['apparel', 'furniture']},
      {size: "small", zipcode: '12346', storeType: ['furniture']}]
  }, {
    city: 'b',
    localities: [
      {size: "small", zipcode: '12345', storeType: ['food', 'furniture']},
      {size: "medium", zipcode: '12347', storeType: ['food']}]
  }],
  details: {
    name: 'bar', 
    items: 500, 
    rating: 'low'}
}]

describe('groupBy: ', function() {

  it('single property', function() {
    expect(groupBy(products, ['color'], ['id'])).to.deep.equal(
      { green: { id: [ 1, 5, 6, 7, 8 ] },
        yellow: { id: [ 2, 4 ] },
        red: { id: [ 3 ] } }
    )
  });

  it('single deep path property', function() {
    expect(groupBy(products, ['vendor.address.city'], ['id'])).to.deep.equal(
      { Mumbai: { id: [ 1, 2, 7 ] },
        'New York': { id: [ 3, 5, 6, 8 ] },
        London: { id: [ 4 ] } }
    )
  });

  it('boolean property', function() {
    expect(groupBy(products, ['available'], ['id'])).to.deep.equal(
      { false: { id: [ 1, 2, 4, 7 ] }, true: { id: [ 3, 5, 6, 8 ] }}); 
  });

  it('lookup of invervals, no intervals\' name', function() {
    expect(groupBy(
      products, 
      [{property: 'price', intervals: [10,20,40,50]}],
      ['id']
    )).to.deep.equal(
      { '0': { id: [ 1, 7 ] },
        '1': { id: [ 3, 4, 6, 8 ] },
        '2': { id: [ 2, 5 ] } }
    )
  });

  it('lookup of invervals, with intervals\' name', function() {
    expect(groupBy(
      products, 
      [{
        property: 'price', 
        intervals: [10,20,40,50], 
        labels: ['low','medium','high']}],
      ['id']
    )).to.deep.equal(
      { 'low': { id: [ 1, 7 ] },
        'medium': { id: [ 3, 4, 6, 8 ] },
        'high': { id: [ 2, 5 ] } }
    )
  });

  it('two properties 1) lookup of invervals 2) tag/string', function() {
    expect(groupBy(
      products, 
      [
        {
          property: 'price', 
          intervals: [10,20,40,50], 
          labels: ['low','medium','high']
        },
        'vendor.address.city'
      ],
      ['id']
    )).to.deep.equal(
      {
        "low":
          {"Mumbai":{"id":[1,7]}},
        "high":
          {"Mumbai":{"id":[2]},
          "New York":{"id":[5]}},
        "medium":
          {"New York":{"id":[3,6,8]},
          "London":{"id":[4]}}
      }
    )
  });

  it('tags are in array', function() {
    expect(groupBy(products, ['tags'], ['id'])).to.deep.equal(
      { bravo: { id: [ 1, 4, 5, 7, 8 ] },
        alpha: { id: [ 2, 3 ] },
        echo: { id: [ 4, 5, 6, 7 ] },
        charlie: { id: [ 4, 6, 7 ] },
        delta: { id: [ 5, 6 ] } }
    )
  })

  it('collect many properties', function() {
    var group = groupBy(
      products, 
      ['color'], 
      ['vendor.address.city', 'available'])
    expect(group).to.deep.equal(
      { green: 
         { 'vendor.address.city': [ 'Mumbai', 'New York', 'New York', 'Mumbai', 'New York' ],
           available: [ false, true, true, false, true ] },
        yellow: 
         { 'vendor.address.city': [ 'Mumbai', 'London' ],
           available: [ false, false ] },
        red: { 'vendor.address.city': [ 'New York' ], available: [ true ] } }
    )
  })

  it('single property, without collect option', function() {
    var group = groupBy(products, ['color']) 
    expect(group).is.an('Object')
      .that.to.have.all.keys(['green', 'yellow', 'red'])
    Object.keys(group).forEach(function(key) {
      expect(group[key]).is.an('Array')})
    expect(group['green'].map(function(item){return item.id}))
      .to.have.members([1, 5, 6, 7, 8])
    expect(group['yellow'].map(function(item){return item.id}))
      .to.have.members([2, 4])
    expect(group['red'].map(function(item){return item.id}))
      .to.have.members([3])
  });

  it('many properties, without collect option', function() {
    var group = groupBy(products, ['available', 'color', 'vendor.address.city'])
    Object.keys(group).forEach(function(keyLevel1) {
      expect(group[keyLevel1]).is.an('Object')
      Object.keys(group[keyLevel1]).forEach(function(keyLevel2) {
        expect(group[keyLevel1][keyLevel2]).is.an('Object')
        Object.keys(group[keyLevel1][keyLevel2]).forEach(function(keyLevel3) {
          expect(group[keyLevel1][keyLevel2][keyLevel3]).is.an('Array')
        })
      })
    })
    expect(group).to.deep.equal(
{"false": 
  {"green": 
    {"Mumbai": [
      {"id": 1, "product": "ri", "price": 16, "color": "green", 
       "available": false, "tags": ["bravo"], 
       "vendor": {"name": "Donald Chambers",  "address": {"city": "Mumbai"}}},
      {"id": 7, "product": "zifpeza", "price": 10, "color": "green",
       "available": false, "tags": ["echo", "charlie", "bravo"],
       "vendor": {"name": "Jesus Lowe", "address": {"city": "Mumbai"}}}]},
   "yellow": {
     "Mumbai": [
       {"id": 2, "product": "foef", "price": 44, "color": "yellow", 
        "available": false, "tags": ["alpha"], 
        "vendor": {"name": "Barbara Garrett",  "address": {"city": "Mumbai"}}}], 
     "London": [
       {"id": 4, "product": "ru", "price": 35, "color": "yellow",
        "available": false, "tags": ["echo", "charlie", "bravo"],
        "vendor": {"name": "Justin Doyle", "address": {"city": "London"}}}]}},
 "true": 
  {"red": 
    {"New York": [
      {
        "id": 3, "product": "jehnojto", "price": 29, "color": "red",
        "available": true, "tags": ["alpha"],
        "vendor": {"name": "Anne Leonard", "address": {"city": "New York"}}}]},
   "green": {
     "New York": [
        {"id": 5, "product": "pihluve", "price": 47, "color": "green",
         "available": true, "tags": ["delta", "echo", "bravo"],
         "vendor": {"name": "Emily Abbott", "address": {"city": "New York"}}},
         {"id": 6, "product": "dum", "price": 28, "color": "green",
         "available": true, "tags": ["echo", "delta", "charlie"],
         "vendor": {"name": "Henry Peterson", "address": {"city": "New York"}}},
         {"id": 8, "product": "av", "price": 39, "color": "green",
         "available": true, "tags": ["bravo"],
         "vendor": {"name": "Rosalie Erickson", "address": {"city": "New York"}}}
     ]}}}
    
    )
  })

  it('items are not cloned', function() {
    var items = [
      {id: 1, geometry: {type: 'Point', coordinates: [1,2]}, 
        properties: {gender: 'Female', price: 11000}},
      {id: 2, geometry: {type: 'Point', coordinates: [11,12]}, 
        properties: {gender: 'Male', price: 10000}}
    ];
    var group = groupBy(items, ['properties.gender']);
    expect(group['Female'][0] == items[0]).to.be.true;
    expect(group['Male'][0] == items[1]).to.be.true;
  });

  it('not a valid proeprty path', function() {
    expect(
      function() {
        groupBy(products, ['vendor.address.zip'], ['id'])
      }
    ).to.throw(Error);
  });

  it('path for property lies in object that is in array', function() {
    // in vendors(array of objects) addresses(array of objects)
    // localities(array) size(string property of object)  
    var group = groupBy(vendors, ['addresses.localities.size'], ['id'])
    expect(group).to.be.an('object')
    expect(Object.keys(group).length).to.be.equal(3)
    expect(group).to.have.all.keys(['small', 'medium', 'large'])
    expect(group).to.be.deep.equal({
      "small": {id: [1, 2]},
      "medium": {id: [1, 2]},
      "large": {id: [2]}
    })
  })

  it('path for property those are collction of tags lies in object that is in' 
    + ' array', function() {
    // in vendors(array of objects) details(object)
    // localities(array) storeType(array of string tags)  
    var group = groupBy(vendors, ['addresses.localities.storeType'], ['id'])
    expect(group).to.be.an('object')
    expect(Object.keys(group).length).to.be.equal(4)
    expect(group).to.have.all.keys(['food', 'furniture','electronic',
      'apparel'])
    expect(group).to.be.deep.equal({
      "food": {id: [1, 2]},
      "furniture": {id: [2]},
      "electronic": {id: [1]},
      "apparel": {id: [2]}
    })
  })

  it('path for property lies in object that is in array and collect multiple'
    + ' properties', function() {
    // in vendors(array of objects) addresses(array of objects)
    // localities(array) size(string property of object)  
    var group = groupBy(
      vendors, 
      ['addresses.localities.size'], 
      ['addresses.localities.zipcode','details.items'])
    expect(group).to.be.an('object')
    expect(Object.keys(group).length).to.be.equal(3)
    expect(group).to.have.all.keys(['small', 'medium', 'large'])
    expect(group).to.be.deep.equal({
      small: {
       'addresses.localities.zipcode': 
					['12345', '12346', '12347', '12345', '12346', '12347'],
       'details.items': [ 400, 500]},
      medium: {
       'addresses.localities.zipcode': 
					['12345', '12346', '12347', '12345', '12346', '12347'],
       'details.items': [400, 500]},
      large: {
       'addresses.localities.zipcode': ['12345', '12346', '12347'],
         'details.items': [500]}
		})
  })
});
