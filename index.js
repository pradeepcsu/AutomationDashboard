
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



app.post('/getdatanew',function(req, res){
	res.setHeader('Content-Type', 'application/json');
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	var selectedDate=req.body.selectedDate;
	console.log(selectedDate);
    sql.connect(config, function (err) {
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();
           
request.query("Select Count(TestResult) AS Number from Table_1 where CONVERT(varchar, TestRunDate, 23) ='"+selectedDate+"'", 	function (count_err, count_recordset) {
		if (count_err) console.log(count_err)
			if(!count_err)
			{
				console.log(count_recordset);
				request.query("Select Count(TestResult) AS Number from Table_1 where CONVERT(varchar, TestRunDate, 23) ='"+selectedDate+"' and TestResult='PASS' ", 	function (pass_err, pass_recordset) {
						if(!pass_err)
						{					
							console.log(pass_recordset);					
							request.query("Select Count(TestResult) AS Number from Table_1 where CONVERT(varchar, TestRunDate, 23) ='"+selectedDate+"' and TestResult='FAIL'", 	function (fail_err, fail_recordset) {
								if(!fail_err)
								{
									console.log(fail_recordset);
									res.send(JSON.stringify({
											total: count_recordset.recordset[0].Number,
											pass: pass_recordset.recordset[0].Number,
											fail: fail_recordset.recordset[0].Number,
											error:""
										}));
									sql.close();
								}
								else
								{
									res.send(JSON.stringify({
											total: count_recordset.recordset[0].Number,
											pass: pass_recordset.recordset[0].Number,
											fail: 0,
											error:fail_err}));
									sql.close();
								}
							});
						}
						else
						{
							res.send(JSON.stringify({
											total: count_recordset.recordset[0].Number,
											pass: 0,
											fail: 0,
											error:pass_err}));
							sql.close();
						}
					});
			}
			else
			{
				res.send(JSON.stringify({
					total: "0",
					pass: "0",
					fail: "0",
					error:count_err
				}));
				sql.close();
			}
        });
	});	
});

app.listen(3050, function () {
  console.log('Server is running. Point your browser to: http://localhost:3050');
});