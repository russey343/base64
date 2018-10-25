var http = require('http');
var url = require('url');
var fs = require('fs');
var formidable = require('formidable');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var mongourl = "";

var server = http.createServer(function (req, res) {
  var parsedURL = url.parse(req.url,true);
  
  if (parsedURL.pathname == '/fileupload') {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      console.log(JSON.stringify(files));
      if (files.filetoupload.size == 0) {
        res.writeHead(500,{"Content-Type":"text/plain"});
        res.end("No file uploaded!");  
      }
      var filename = files.filetoupload.path;
      var title = (fields.title.length > 0) ? fields.title : "untitled";
      var mimetype = files.filetoupload.type;
      console.log("title = " + title);
      console.log("filename = " + filename);
      fs.readFile(filename, function(err,data) {
        MongoClient.connect(mongourl,function(err,db) {
          try {
            assert.equal(err,null);
          } catch (err) {
            res.writeHead(500,{"Content-Type":"text/plain"});
            res.end("MongoClient connect() failed!");
          }
          var new_r = {};
          new_r['title'] = title;
          new_r['mimetype'] = mimetype;
          new_r['image'] = new Buffer(data).toString('base64');
          insertPhoto(db,new_r,function(result) {
            db.close();
            res.writeHead(200, {"Content-Type": "text/plain"});
            res.end('Photo was inserted into MongoDB!');
          })
        });
      })
    });
  } else {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
    res.write('Title: <input type="text" name="title" minlength=1><br>');
    res.write('<input type="file" name="filetoupload"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    res.end();
  }
});

function insertPhoto(db,r,callback) {
  db.collection('photo').insertOne(r,function(err,result) {
    assert.equal(err,null);
    console.log("insert was successful!");
    console.log(JSON.stringify(result));
    callback(result);
  });
}

server.listen(process.env.PORT || 8099);
