# json-groupby
Group array of JSON objects based on associated properties.

It also groups objects containing [nested arrays](#nested-arrays).

## installation

```
npm install json-groupby
```

## usage

```javascript
var groupBy = require('json-groupby')
var group = groupBy(array, properties [, collect])
```
* **array**  Array of JSON objects
* **properties**  Array JSON properties' path like `address.city` or lookup object

  **lookup**
  ```
  {
    intervals: array of numbers
    ,property: string
    [,labels: array of string]
  }
  ``` 
  **intervals** Array of intervals. Like [ 10, 20, 30, 40, 50] group the data in four ranges, whereas lower bound is inclusive and upper bound is exclusive.

  **peroperty** Property path like `price`

  **labels** Array of interval labels like [ 'low', 'medium', 'high']

* **collect** Array of properties that need to be collected in array 

### examples

#### data set

```javascript
var products = 
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
   "vendor": {"name": "Rosalie Erickson", "address": {"city": "New York"}}}]

```


#### group by single property

```javascript
groupBy(products, ['color'], ['id'])
// output is 
{ green: { id: [ 1, 5, 6, 7, 8 ] },
  yellow: { id: [ 2, 4 ] },
  red: { id: [ 3 ] } }
```

#### group by many properties and without collect option

```javascript
groupBy(products, ['available', 'color', 'vendor.address.city'])
// output is 
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
``` 

#### single deep path property
 
```javascript
groupBy(products, ['vendor.address.city'], ['id'])
// output is 
{ Mumbai: { id: [ 1, 2, 7 ] },
  'New York': { id: [ 3, 5, 6, 8 ] },
  London: { id: [ 4 ] } }
```   

#### group with boolean property

```javascript
groupBy(products, ['available'], ['id'])
// output is 
{ false: { id: [ 1, 2, 4, 7 ] }, 
  true: { id: [ 3, 5, 6, 8 ] }}
```  

#### group by intervals (lookup of intervals) without intervals' name

```javascript 
groupBy(
  products, 
  [{property: 'price', intervals: [10,20,40,50]}],
  ['id'])
//output is 
{ '0': { id: [ 1, 7 ] },
  '1': { id: [ 3, 4, 6, 8 ] },
  '2': { id: [ 2, 5 ] } }
``` 

#### group by intervals (lookup of intervals) with intervals' lable name 

```javascript
groupBy(
  products, 
  [{
    property: 'price', 
    intervals: [10,20,40,50], 
    labels: ['low','medium','high']}],
  ['id'])
//ouptu is 
{'low': { id: [ 1, 7 ] },
 'medium': { id: [ 3, 4, 6, 8 ] },
 'high': { id: [ 2, 5 ] } }
```
#### group with mixed properties lookup and property path 

```javascript
groupBy(
  products, 
  [
    {
      property: 'price', 
      intervals: [10,20,40,50], 
      labels: ['low','medium','high']
    },
    'vendor.address.city'
  ],
  ['id'])
// output is
{
  "low":
    {"Mumbai":{"id":[1,7]}},
  "high":
    {"Mumbai":{"id":[2]},
    "New York":{"id":[5]}},
  "medium":
    {"New York":{"id":[3,6,8]},
    "London":{"id":[4]}}
```

#### group by tags that are in array 

```javascript
groupBy(products, ['tags'], ['id'])
//ouput is
{ bravo: { id: [ 1, 4, 5, 7, 8 ] },
  alpha: { id: [ 2, 3 ] },
  echo: { id: [ 4, 5, 6, 7 ] },
  charlie: { id: [ 4, 6, 7 ] },
  delta: { id: [ 5, 6 ] } }
```

#### group and collect many properties

```javascript
groupBy(
  products, 
  ['color'], 
  ['vendor.address.city', 'available'])
// output is
{ green: 
   { 'vendor.address.city': [ 'Mumbai', 'New York', 'New York', 'Mumbai', 'New York' ],
     available: [ false, true, true, false, true ] },
  yellow: 
   { 'vendor.address.city': [ 'Mumbai', 'London' ],
     available: [ false, false ] },
  red: { 'vendor.address.city': [ 'New York' ], available: [ true ] } }
```

#### Nested Arrays

Group by property path that lies in nested arrays, in the following example `addresses.localities.size`

```javascript
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

var group = groupBy(vendors, ['addresses.localities.size'], ['id'])

// output gruop is
{
  "small": {id: [1, 2]},
  "medium": {id: [1, 2]},
  "large": {id: [2]}
}

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
