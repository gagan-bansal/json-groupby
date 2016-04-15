# json-groupby
Group array of JOSN based on associated properties.
## installation

```
npm install json-groupby
```

## usage
```javascript
var groupBy = require('json-groupby');
var group = groupBy(array, property [,property, ...]);
```
The function accepts multiple number of properties.
* **array**  Array of JSON objects
* **property**  JSON properties' path like `address.city` or lookup object

  **lookup**
  ```
  {
    intervals: array of numbers
    ,property: string
    [,labels: array of string]
  }
  ``` 
  **intervals** Array of intervals. Like [ 10, 20, 30, 40, 50] group the data in four ranges, whereas lower bound is inclusive and upper bound is exclusive.

  **peroperty** Property path like 'peroperties.color'

  **labels** Array of interval labels like [ 'low', 'medium', 'high']

### examples

##### data set
````javascript
var features = [
  {
    "id": 1, "geometry": "geojson-point",
    "properties": {"color": "blue","price": 150,"address": {"city": "New York"}}
  }, {
    "id": 2, "geometry": "geojson-point",
    "properties": {"color": "green","price": 200,"address": {"city": "London"}}
  }, {
    "id": 3, "geometry": "geojson-point",
    "properties": {"color": "red","price": 210,"address": {"city": "London"}}
  }, {
    "id": 4, "geometry": "geojson-point",
    "properties": {"color": "red","price": 280,"address": {"city": "New York"}}
  }, {
    "id": 5, "geometry": "geojson-point",
    "properties": {"color": "green","price": 300,"address": {"city": "New York"}}
  }, {
    "id": 6, "geometry": "geojson-point",
    "properties": {"color": "red","price": 360,"address": {"city": "Mumbai"}}
  }, {
    "id": 7, "geometry": "geojson-point",
    "properties": {"color": "yellow","price": 400,"address": {"city": "New York"}}
  }, {
    "id": 8, "geometry": "geojson-point",
    "properties": {"color": "yellow","price": 410,"address": {"city": "Mumbai"}}
  }
];
```

##### group by single property
```javascript
groupBy(features, 'properties.color')
// output as
{ blue: 
   [ { id: 1,
       geometry: 'geojson-point',
       properties: { color: 'blue', price: 150, address: { city: 'New York' } } } ],
  green: 
   [ { id: 2,
       geometry: 'geojson-point',
       properties: { color: 'green', price: 200, address: { city: 'London' } } },
     { id: 5,
       geometry: 'geojson-point',
       properties: { color: 'green', price: 300, address: { city: 'New York' } } } ],
  red: 
   [ { id: 3,
       geometry: 'geojson-point',
       properties: { color: 'red', price: 210, address: { city: 'London' } } },
     { id: 4,
       geometry: 'geojson-point',
       properties: { color: 'red', price: 280, address: { city: 'New York' } } },
     { id: 6,
       geometry: 'geojson-point',
       properties: { color: 'red', price: 360, address: { city: 'Mumbai' } } } ],
  yellow: 
   [ { id: 7,
       geometry: 'geojson-point',
       properties: { color: 'yellow', price: 400, address: { city: 'New York' } } },
     { id: 8,
       geometry: 'geojson-point',
       properties: { color: 'yellow', price: 410, address: { city: 'Mumbai' } } } ] }
```
##### group by intervals
```javascript
groupBy(features, {
  intervals: [100, 200, 300, 500],
  property: 'properties.price'
})
// output as
{ '0': 
   [ { id: 1,
       geometry: 'geojson-point',
       properties: { color: 'blue', price: 150, address: { city: 'New York' } } } ],
  '1': 
   [ { id: 2,
       geometry: 'geojson-point',
       properties: { color: 'green', price: 200, address: { city: 'London' } } },
     { id: 3,
       geometry: 'geojson-point',
       properties: { color: 'red', price: 210, address: { city: 'London' } } },
     { id: 4,
       geometry: 'geojson-point',
       properties: { color: 'red', price: 280, address: { city: 'New York' } } } ],
  '2': 
   [ { id: 5,
       geometry: 'geojson-point',
       properties: { color: 'green', price: 300, address: { city: 'New York' } } },
     { id: 6,
       geometry: 'geojson-point',
       properties: { color: 'red', price: 360, address: { city: 'Mumbai' } } },
     { id: 7,
       geometry: 'geojson-point',
       properties: { color: 'yellow', price: 400, address: { city: 'New York' } } },
     { id: 8,
       geometry: 'geojson-point',
       properties: { color: 'yellow', price: 410, address: { city: 'Mumbai' } } } ] }
```
##### group by intervals and labeling intervals
```javascript
groupBy(features, {
  intervals: [100, 200, 300, 500],
  property: 'properties.price',
  labels: ['low', 'medium', 'high']
})
// output as
{ low: 
   [ { id: 1,
       geometry: 'geojson-point',
       properties: { color: 'blue', price: 150, address: { city: 'New York' } } } ],
  medium: 
   [ { id: 2,
       geometry: 'geojson-point',
       properties: { color: 'green', price: 200, address: { city: 'London' } } },
     { id: 3,
       geometry: 'geojson-point',
       properties: { color: 'red', price: 210, address: { city: 'London' } } },
     { id: 4,
       geometry: 'geojson-point',
       properties: { color: 'red', price: 280, address: { city: 'New York' } } } ],
  high: 
   [ { id: 5,
       geometry: 'geojson-point',
       properties: { color: 'green', price: 300, address: { city: 'New York' } } },
     { id: 6,
       geometry: 'geojson-point',
       properties: { color: 'red', price: 360, address: { city: 'Mumbai' } } },
     { id: 7,
       geometry: 'geojson-point',
       properties: { color: 'yellow', price: 400, address: { city: 'New York' } } },
     { id: 8,
       geometry: 'geojson-point',
       properties: { color: 'yellow', price: 410, address: { city: 'Mumbai' } } } ] }
```
##### group by intervals and another property
```javascript
groupBy(
  features, 
  {
    intervals: [100, 200, 300, 500],
    property: 'properties.price',
    labels: ['low', 'medium', 'high']
  },
  'properties.address.city'
)
// output as
{ low: 
   { 'New York': 
      [ { id: 1,
          geometry: 'geojson-point',
          properties: { color: 'blue', price: 150, address: { city: 'New York' } } } ] },
  medium: 
   { London: 
      [ { id: 2,
          geometry: 'geojson-point',
          properties: { color: 'green', price: 200, address: { city: 'London' } } },
        { id: 3,
          geometry: 'geojson-point',
          properties: { color: 'red', price: 210, address: { city: 'London' } } } ],
     'New York': 
      [ { id: 4,
          geometry: 'geojson-point',
          properties: { color: 'red', price: 280, address: { city: 'New York' } } } ] },
  high: 
   { 'New York': 
      [ { id: 5,
          geometry: 'geojson-point',
          properties: { color: 'green', price: 300, address: { city: 'New York' } } },
        { id: 7,
          geometry: 'geojson-point',
          properties: { color: 'yellow', price: 400, address: { city: 'New York' } } } ],
     Mumbai: 
      [ { id: 6,
          geometry: 'geojson-point',
          properties: { color: 'red', price: 360, address: { city: 'Mumbai' } } },
        { id: 8,
          geometry: 'geojson-point',
          properties: { color: 'yellow', price: 410, address: { city: 'Mumbai' } } } ] } }
```
##### group by property that value is an array of tags
```javascript
var features = [
  {labels: ['new', 'premium'], id: 1},
  {labels: ['premium', 'unique'], id: 2},
  {labels: ['old', 'unique'], id: 3},
  {labels: ['accessory'], id: 4}];
groupBy(features, 'labels')
// output as
{ new: [ { labels: [ 'new', 'premium' ], id: 1 } ],
  premium: 
   [ { labels: [ 'new', 'premium' ], id: 1 },
     { labels: [ 'premium', 'unique' ], id: 2 } ],
  unique: 
   [ { labels: [ 'premium', 'unique' ], id: 2 },
     { labels: [ 'old', 'unique' ], id: 3 } ],
  old: [ { labels: [ 'old', 'unique' ], id: 3 } ],
  accessory: [ { labels: [ 'accessory' ], id: 4 } ] }
```
  
## developing
Once you run
 
```npm isntall```

then for running test 

```npm run test```

to create build

```npm run build```

## license
This project is licensed under the terms of the MIT license.
