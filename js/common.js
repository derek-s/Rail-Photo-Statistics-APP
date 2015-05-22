function addproc() {
	var db_Model = sessionStorage.getItem('s_Model');
	var db_UIC = sessionStorage.getItem('s_UIC');
	var db_Power = sessionStorage.getItem('s_Power');
	var db_Drive = sessionStorage.getItem('s_Drive');
	var db_Attach = sessionStorage.getItem('s_Attach');
	var db_Factory = sessionStorage.getItem('s_Factory');
	var db_Year = sessionStorage.getItem('s_Year');
	var db_Type = sessionStorage.getItem('s_Type');
	var db_Number = sessionStorage.getItem('s_Number');
	var db_Section = sessionStorage.getItem('s_Section');
	var db_Ub = sessionStorage.getItem('s_Ub');
	var db_Location = sessionStorage.getItem('s_Location');
	var db_Data = sessionStorage.getItem('s_Data');
	var db_Locomodel = sessionStorage.getItem('s_Locomodel');
	var db_Remark = sessionStorage.getItem('s_Remark');
	var db = openDatabase('Rail', '1.0', 'RailAppDB', 10 * 1024 * 1024);
	var def = 'id integer primary key AutoIncrement,Model,UIC,Power,Drive,Attach,Factory,Year,Type,Number,Section,Ub,Location,Data,Locomodel,Remark';
	db.transaction(function(tx) {
		tx.executeSql('CREATE TABLE IF NOT EXISTS Rail_locomotive (' + def + ')');
		tx.executeSql('INSERT INTO Rail_locomotive (Model,UIC,Power,Drive,Attach,Factory,Year,Type,Number,Section,Ub,Location,Data,Locomodel,Remark) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [db_Model, db_UIC, db_Power, db_Drive, db_Attach, db_Factory, db_Year, db_Type, db_Number, db_Section, db_Ub, db_Location, db_Data, db_Locomodel,db_Remark]);
		alert("添加完成");
		plus.webview.getWebviewById("main.html").reload(true);
	});
}
function sequence() {
	var db = openDatabase('Rail', '1.0', 'RailAppDB', 10 * 1024 * 1024);
	db.transaction(function(tx) {
		tx.executeSql('SELECT * FROM Rail_locomotive', [], function(tx, results) {
			var len = results.rows.length;
			document.querySelector('#rows').innerHTML += len;
			localStorage.setItem('zentry', results.rows.length);
		});
	});
}
function backup() {
	var btnArray = ['是', '否'];
		mui.confirm('确认备份数据么？', '拍车统计', btnArray, function(e) {
			if (e.index == 0) {
	var db = openDatabase('Rail', '1.0', 'RailAppDB', 10 * 1024 * 1024);
				db.transaction(function(tx) {
		tx.executeSql('SELECT * FROM Rail_locomotive', [], function(tx, results) {
						var data = convertResults(results);
			});
	});
}
			});
}
function convertResults(resultset) {
	var results = [];
	for(var i=0,len=resultset.rows.length;i<len;i++) {
		row = resultset.rows.item(i);
		var result = {};
		for(var key in row) {
			result[key] = row[key];
		}
		results.push(result);
	}
	var serializedData = JSON.stringify(results);
	mui.plusReady(function() {
					plus.io.requestFileSystem(plus.io.PUBLIC_DOCUMENTS, function(fs) {
						fs.root.getFile('backup.json', {
							create: true
						}, function(fileEntry) {
							bfpath = fileEntry.fullPath;
							fileEntry.createWriter(function(writer) {
								writer.onwritestart = function(e) {
									console.log('start')
								};
								writer.onprogress = function(e) {
									console.log('progress')
								};
								writer.onwrite = function(e) {
									console.log('onwrite')
								};
								writer.onabort = function(e) {
									console.log('abort')
								};
								writer.onerror = function(e) {
									console.log('error')
								};
								writer.onwriteend = function(e) {
									console.log('writeend')
								};
								writer.onwritestart = function(e) {
									console.log('writestart')
								};
								writer.write(serializedData);
							},function(e){
								console.log(e.message);
							});
							
						},function(e){
								console.log(e.message);
							});
					});
					plus.nativeUI.alert('数据备份完成', function() {}, '拍车统计');
					plus.webview.getWebviewById("setting.html").reload(true);
				});		
	return results;
}
function importbp() {
	mui.plusReady(function() {
		var btnArray = ['是', '否'];
		mui.confirm('确认恢复数据么？', '拍车统计', btnArray, function(e) {
			if (e.index == 0) {
				var wait = plus.nativeUI.showWaiting("正在恢复，请稍后……");
				var reader = null;
				plus.io.requestFileSystem(plus.io.PUBLIC_DOCUMENTS, function(fs) {
					fs.root.getFile('backup.json', {
						create: true
					}, function(fileEntry) {
						console.log(fileEntry.fullPath);
						fileEntry.file(function(file) {
							var fileReader = new plus.io.FileReader();
							fileReader.readAsText(file, 'utf-8');
							fileReader.onloadend = function(evt) {
								var csv = evt.target.result;
								var db = openDatabase('Rail', '1.0', 'RailAppDB', 10 * 1024 * 1024);
								var def = 'id integer primary key AutoIncrement,Model,UIC,Power,Drive,Attach,Factory,Year,Type,Number,Section,Ub,Location,Data,Locomodel,Remark';
								var importdata = JSON.parse(csv);
								db.transaction(function(tx) {
									tx.executeSql('CREATE TABLE IF NOT EXISTS Rail_locomotive (' + def + ')');
									for (o in importdata) {
										json_model = importdata[o].Model;
										json_locomodel = importdata[o].Locomodel;
										json_type = importdata[o].Type;
										json_uic = importdata[o].UIC;
										json_power = importdata[o].Power;
										json_drive = importdata[o].Drive;
										json_attach = importdata[o].Attach;
										json_factory = importdata[o].Factory;
										json_year = importdata[o].Year;
										json_number = importdata[o].Number;
										json_section = importdata[o].Section;
										json_ub = importdata[o].Ub;
										json_location = importdata[o].Location;
										json_data = importdata[o].Data;
										json_Remark = importdata[o].Remark;
										tx.executeSql('INSERT INTO Rail_locomotive (Model,UIC,Power,Drive,Attach,Factory,Year,Type,Number,Section,Ub,Location,Data,Locomodel,Remark) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [json_model, json_uic, json_power, json_drive, json_attach, json_factory, json_year, json_type, json_number, json_section, json_ub, json_location, json_data, json_locomodel,json_Remark]);
									}
									if (o == importdata.length-1) {
										wait.close();
										plus.nativeUI.alert('数据恢复完成', function() {}, '拍车统计');
										plus.webview.getWebviewById("main.html").reload(true);
										plus.webview.getWebviewById("setting.html").reload(true);
									}
								});

							}
						});
					});

				})
			} else {}
		})

	})
}

function deltable() {
	var btnArray = ['是', '否'];
	mui.confirm('确认删除数据么？', '拍车统计', btnArray, function(e) {
		if (e.index == 0) {
			var db = openDatabase('Rail', '1.0', 'RailAppDB', 10 * 1024 * 1024);
			db.transaction(function(tx) {
				tx.executeSql('DROP TABLE Rail_locomotive');
			});
			plus.nativeUI.alert('数据删除完毕', function() {}, '拍车统计');
			plus.webview.getWebviewById("main.html").reload(true);

		} else {}
	})
}

function setting() {
	mui('#topPopover').popover('hide');
	mui.openWindow({
		url: 'setting.html'
	});

}