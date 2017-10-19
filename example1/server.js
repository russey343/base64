var http = require('http');
var url = require('url');
var fs = require('fs');
var formidable = require('formidable');

var server = http.createServer(function (req, res) {
  var parsedURL = url.parse(req.url,true);
  
  if (parsedURL.pathname == '/fileupload' && 
      req.method.toLowerCase() == "post") {
    // parse a file upload
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var filename = files.filetoupload.path;
      console.log("filename = " + filename);
      fs.readFile(filename, function(err,data) {
         var base64 = new Buffer(data).toString('base64');
         res.writeHead(200,{"Content-Type": "text/plain"});
         res.write('File uploaded\n');         
         res.end(base64);
      })
    });
  } else {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="filetoupload"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    res.end();
  }
});

server.listen(process.env.PORT || 8099);