var expect = require('chai').expect,
  groupBy = require('../');
describe('groupBy: ', function() {
  var features = require('./test-data.js').features;
  it('single property', function() {
    var group = groupBy(features, 'properties.color');
    expect(Object.keys(group))
      .to.have.members(['yellow','green',  'blue', 'red']);
    var counts = ['green', 'yellow', 'blue', 'red']
      .map(function(color) {
        return group[color].length;
      })
    expect(counts).to.deep.equal([3, 7, 4, 6]);
  });
  it('single deep path property', function() {
    var group = groupBy(features, 'properties.address.city');
    expect(Object.keys(group))
      .to.have.members(['London', 'Mumbai', 'New York']);
    var counts = ['London', 'Mumbai', 'New York']
      .map(function(color) {
        return group[color].length;
      })
    expect(counts).to.deep.equal([5, 8, 7]);
  });
  it('single boolean property', function() {
    var group = groupBy(features, 'properties.available');
    expect(Object.keys(group))
      .to.have.members(['true', 'false']);
    var counts = ['true', 'false']
      .map(function(color) {
        return group[color].length;
      })
    expect(counts).to.deep.equal([11, 9]);
  });

  it('lookup of invervals, no intervals\' name', function() {
    var group = groupBy(features, {
      property: 'properties.price',
      intervals: [10000, 30000, 72128, 100000] 
    });
    expect(Object.keys(group))
      .to.have.members(['0', '1', '2']);
    var counts = ['0', '1', '2'].map(function(key) {
        return group[key].length;
      });
    expect(counts).to.deep.equal([5, 7, 8]);
    expect(getIntervalVals(group['0'], 'properties.price'))
      .to.have.members([11085, 12205, 12453, 16622, 26214]);
    expect(getIntervalVals(group['1'], 'properties.price'))
      .to.have.members(
        [30312, 39281, 44766, 52593, 57908, 64813, 67382]
      );
    expect(getIntervalVals(group['2'], 'properties.price'))
      .to.have.members(
        [72128, 83008, 83076, 89221, 92862, 94245, 95282, 95878]
      );
  });

  it('lookup of invervals, with intervals\' name', function() {
    var group = groupBy(features, {
      property: 'properties.price',
      intervals: [10000, 30000, 72128, 100000],
      labels: ['low', 'medium', 'high'] 
    });
    expect(Object.keys(group))
      .to.have.members(['low', 'medium', 'high']);
    var counts = ['low', 'medium', 'high'].map(function(key) {
        return group[key].length;
      });
    expect(counts).to.deep.equal([5, 7, 8]);
  });

  it('two properties 1) lookup of invervals 2) tag/string', function() {
    var group = groupBy(
      features, 
      {
        property: 'properties.price',
        intervals: [10000, 30000, 72128, 100000], 
        labels: ['low', 'medium', 'high'] 
      },
      'properties.gender'
    );
    expect(Object.keys(group))
      .to.have.members(['low', 'medium', 'high']);
    expect(group['low']['Male']).is.an('array')
      .that.to.have.length(1);
    expect(group['low']['Female']).is.an('array')
      .that.to.have.length(4);
    expect(group['medium']['Male']).is.an('array')
      .that.to.have.length(3);
    expect(group['medium']['Female']).is.an('array')
      .that.to.have.length(4);
    expect(group['high']['Male']).is.an('array')
      .that.to.have.length(4);
    expect(group['high']['Female']).is.an('array')
      .that.to.have.length(4);
  });

  it('tag is boolean', function() {
    var group = groupBy(features, 'properties.available');
    expect(Object.keys(group))
      .to.have.members(['true', 'false']);
    expect(group['true'].length).to.be.equal(11);
    expect(group['false'].length).to.be.equal(9);
  });

  it('tags are array', function() {
    var data = [
      {labels: ['new', 'premium'], id: 1},
      {labels: ['premium', 'unique'], id: 2},
      {labels: ['old', 'unique'], id: 3},
      {labels: ['accessory'], id: 4}];
    var group = groupBy(data, 'labels');
    expect(Object.keys(group))
      .to.have.members(['new', 'premium', 'unique', 'old', 'accessory']);
    var counts = ['new', 'premium', 'unique', 'old', 'accessory']
      .map(function(key) {
        return group[key].length;
      });
    expect(counts).to.deep.equal([1, 2, 2, 1, 1]);
  });
  it('features are not modified', function() {
    var features = [
      {id: 1, geometry: {type: 'Point', coordinates: [1,2]}, 
        properties: {gender: 'Female', price: 11000}},
      {id: 2, geometry: {type: 'Point', coordinates: [11,12]}, 
        properties: {gender: 'Male', price: 10000}}
    ];
    var group = groupBy(features, 'properties.gender');
    expect(group['Female'][0]).equal(features[0]);
    expect(group['Male'][0]).to.equal(features[1]);
  });

});


function getIntervalVals(features, prop) {
  return features.reduce(function(acc, f) {
    acc.push(valueAt(f, prop));
    return acc;
  },[])
}
function valueAt(obj,path) {
  //taken from http://stackoverflow.com/a/6394168/713573
  function index(prev,cur) { return prev[cur]; }
  return path.split('.').reduce(index, obj);
};
function getStats(features, prop) {
  return features.reduce(function(acc,f) {
    var key = valueAt(f,prop);
    acc[key] = acc[key] ? acc[key] + 1 : 1;
    return acc;
  },{});
}
