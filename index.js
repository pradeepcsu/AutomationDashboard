
var express = require('express');
app = express(),
bodyParser = require('body-parser'),
path = require("path");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
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
	var selectedDate=req.body.selectedDate;
	console.log(selectedDate);
    sql.connect(config, function (err) {
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();
           
        // query to the database and get the records
       // request.query("Select TestResult, Count(TestResult) AS Number from Table_1 where convert(char(8), TestRunDate, 112) = convert(char(8), '20180829', 
//112) group by TestResult", function (err, recordset) {
request.query("Select TestResult, Count(TestResult) AS Number from Table_1 where CONVERT(varchar, TestRunDate, 23) ='"+selectedDate+"' group by TestResult", function (err, recordset) {
            
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