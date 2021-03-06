
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
           
request.query("Select Count(TestPassed) AS Number from Table_1 where CONVERT(varchar, RunDateTime, 23) ='"+selectedDate+"'", 	function (count_err, count_recordset) {
		if (count_err) console.log(count_err)
			if(!count_err)
			{
				console.log(count_recordset);
				request.query("Select Count(TestPassed) AS Number from Table_1 where CONVERT(varchar, RunDateTime, 23) ='"+selectedDate+"' and TestPassed='passed' ", 	function (pass_err, pass_recordset) {
						if(!pass_err)
						{					
							console.log(pass_recordset);					
							request.query("Select Count(TestPassed) AS Number from Table_1 where CONVERT(varchar, RunDateTime, 23) ='"+selectedDate+"' and TestPassed='failed'", 	function (fail_err, fail_recordset) {
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

app.post('/getdatanew_1',function(req, res){
	res.setHeader('Content-Type', 'application/json');
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	var selectedDate=req.body.selectedDate;
	console.log(selectedDate);
    sql.connect(config, function (err) {
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();
           
request.query("Select Count(TestPassed) AS Number from Table_1 where CONVERT(varchar, RunDateTime, 23) ='"+selectedDate+"'", 	function (count_err, count_recordset) {
		if (count_err) console.log(count_err)
			if(!count_err)
			{
				console.log(count_recordset);
				request.query("Select Count(TestPassed) AS Number from Table_1 where CONVERT(varchar, RunDateTime, 23) ='"+selectedDate+"' and TestPassed='passed' ", 	function (pass_err, pass_recordset) {
						if(!pass_err)
						{					
							console.log(pass_recordset);					
							request.query("Select Count(TestPassed) AS Number from Table_1 where CONVERT(varchar, RunDateTime, 23) ='"+selectedDate+"' and TestPassed='failed'", 	function (fail_err, fail_recordset) {
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


app.post('/getDuplicates',function(req, res){
	res.setHeader('Content-Type', 'application/json');
	  res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	
	sql.connect(config, function (err) {
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();
           
		request.query("WITH NewTable AS	(  SELECT ScenarioName, Count(*) AS Total FROM Table_1 where TestFailReason = 'environmentslow' group by ScenarioName ) SELECT ScenarioName, Total FROM NewTable WHERE Total > 1", function (err, rows) {

			if (err) {
				// connection.end();
				res.send(JSON.stringify({
					data: [],
					error:err
				}));
				sql.close();
			} 
			else 
			{
				// connection.end();
				res.send(JSON.stringify({
					data: rows,
					error:""
				}));
				sql.close();		
	}
});
});	
});
	
app.listen(8080, function () {
  console.log('Server is running. Point your browser to: http://localhost:8080');
});