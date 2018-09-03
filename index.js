
var express = require('express');
app = express(),
//require the body-parser nodejs module
bodyParser = require('body-parser'),
//require the path nodejs module
path = require("path");
//support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true })); 
//tell express that www is the root of our public web folder
app.use(express.static(path.join(__dirname, 'www')));

//tell express what to do when the /form route is requested

 var sql = require("mssql");
    // config for your database
    var config = {
        user: 'pradeep1',
        password: 'pradeep',
 	"port": '51359',
        server: 'localhost', 
        database: 'Test1'
    };
app.post('/getdata',function(req, res){
	res.setHeader('Content-Type', 'application/json');
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	var pagecount=req.body.pagecount;
	console.log(pagecount);
    sql.connect(config, function (err) {
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();
           
        // query to the database and get the records
        request.query("select Count(*) AS TotalPassed from Table_1 where TestResult = 'Pass'", function (err, recordset) {
            
            if (err) console.log(err)

            // send records as a response
            res.send(recordset);
            sql.close();
        });
    });
});

app.listen(3050, function () {
  console.log('Server is running. Point your browser to: http://localhost:3050');
});