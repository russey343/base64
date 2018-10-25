# Node.js Example: MongoDB Bas64
An example of writing and reading documents containing Base64 data (JPEG only).  This example needs access to a collection named `photo`.

## Getting Started
Change the value of variable `mongourl` to your mlab database.
### Installing
```
npm install
```
### Running
```
npm start
```
### Testing
1. Send a GET request to insert a photo:
http://localhost:8099/
2. Send a GET request to show a list of photos in your `photo` collection:
http://localhost:8099/photos
