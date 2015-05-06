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
	var db = openDatabase('Rail', '1.0', 'RailAppDB', 10 * 1024 * 1024);
	var def = 'id integer primary key AutoIncrement,Model,UIC,Power,Drive,Attach,Factory,Year,Type,Number,Section,Ub,Location,Data,Locomodel';
	db.transaction(function(tx) {
		tx.executeSql('CREATE TABLE IF NOT EXISTS Rail_locomotive (' + def + ')');
		tx.executeSql('INSERT INTO Rail_locomotive (Model,UIC,Power,Drive,Attach,Factory,Year,Type,Number,Section,Ub,Location,Data,Locomodel) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [db_Model, db_UIC, db_Power, db_Drive, db_Attach, db_Factory, db_Year, db_Type, db_Number, db_Section, db_Ub, db_Location, db_Data, db_Locomodel]);
		alert("添加完成");
	});
}

function sequence() {
	var db = openDatabase('Rail', '1.0', 'RailAppDB', 10 * 1024 * 1024);
	db.transaction(function(tx) {
		tx.executeSql('SELECT * FROM Rail_locomotive', [], function(tx, results) {
			var len = results.rows.length;
			document.querySelector('#rows').innerHTML += len;
			localStorage.setItem('zentry', results.rows.length);
			console.log(len);
		});
	});
}

function backup() {
	var csvdata = 'Model,Locomodel,Type,UIC,Power,Drive,Attach,Factory,Year,Number,Section,Ub,Location,Data\n';
	var db = openDatabase('Rail', '1.0', 'RailAppDB', 10 * 1024 * 1024);
	db.transaction(function(tx) {
		db.transaction(function(tx) {
			tx.executeSql('SELECT * FROM Rail_locomotive', [], function(tx, results) {
				var len = results.rows.length,
					i;
				for (i = 0; i < len; i++) {
					csvdata += results.rows.item(i).Model + "," + results.rows.item(i).Locomodel + "," + results.rows.item(i).Type + "," + results.rows.item(i).UIC + "," + results.rows.item(i).Power + "," + results.rows.item(i).Driver + "," + results.rows.item(i).Attach + "," + results.rows.item(i).Factory + "," + results.rows.item(i).Year + "," + results.rows.item(i).Number + "," + results.rows.item(i).Section + "," + results.rows.item(i).Ub + "," + results.rows.item(i).Location + "," + results.rows.item(i).Data + "\n"
				};

				console.log(csvdata);
			});
		});
		plus.io.requestFileSystem(plus.io.PUBLIC_DOCUMENTS, function(fs) {
			fs.root.getFile('backup.csv', {
				create: true
			}, function(fileEntry) {
				console.log(fileEntry.fullPath);
				fileEntry.createWriter(function(writer) {
					writer.onwritestart = function(e) {
						console.log('start');
					};
					writer.write(csvdata);
				});
			}, function(e) {
				console.log(e.message);
			});
		}, function(e) {
			console.log(e.message);
		})
	});
}

function importbp() {
		var reader = null;
		plus.io.requestFileSystem(plus.io.PUBLIC_DOCUMENTS, function(fs) {
			fs.root.getFile('backup.csv', {
				create: true
			}, function(fileEntry) {
				console.log(fileEntry.fullPath);
				fileEntry.file(function(file) {
					var fileReader = new plus.io.FileReader();
					fileReader.readAsText(file, 'utf-8');
					fileReader.onloadend = function(evt) {
						var csv = evt.target.result;
						console.log(csv);
						var bdata = csv.split("\n");
						var bresult = [];
						var bheaders = bdata[0].split(",");
						for (var bi = 1; bi < bdata.length; bi++) {
							var bobj = {};
							var currrntline = bdata[bi].split(",");
							for (var bj = 0; bj < bheaders.length; bj++) {
								bobj[bheaders[bj]] = currrntline[bj];
							}
							bresult.push(bobj);
						}
						var jsondata = bresult;
						jsondata.pop();
						var db = openDatabase('Rail', '1.0', 'RailAppDB', 10 * 1024 * 1024);
						var def = 'id integer primary key AutoIncrement,Model,UIC,Power,Drive,Attach,Factory,Year,Type,Number,Section,Ub,Location,Data,Locomodel';
						db.transaction(function(tx) {
							tx.executeSql('CREATE TABLE IF NOT EXISTS Rail_locomotive (' + def + ')');
							for (var ji = 0; ji < jsondata.length; ji++) {
								json_model = jsondata[ji].Model;
								json_locomodel = jsondata[ji].Locomodel;
								json_type = jsondata[ji].Type;
								json_uic = jsondata[ji].UIC;
								json_power = jsondata[ji].Power;
								json_drive = jsondata[ji].Drive;
								json_attach = jsondata[ji].Attach;
								json_factory = jsondata[ji].Factory;
								json_year = jsondata[ji].Year;
								json_number = jsondata[ji].Number;
								json_section = jsondata[ji].Section;
								json_ub = jsondata[ji].Ub;
								json_location = jsondata[ji].Location;
								json_data = jsondata[ji].Data;
								console.log(json_model);
								tx.executeSql('INSERT INTO Rail_locomotive (Model,UIC,Power,Drive,Attach,Factory,Year,Type,Number,Section,Ub,Location,Data,Locomodel) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [json_model, json_uic, json_power, json_drive, json_attach, json_factory, json_year, json_type, json_number, json_section, json_ub, json_location, json_data, json_locomodel]);
							}
						});
					}
				});
			});
		})
	}
function deltable() {
	var db = openDatabase('Rail', '1.0', 'RailAppDB', 10 * 1024 * 1024);
	db.transaction(function(tx) {
		tx.executeSql('DROP TABLE Rail_locomotive');
	});
}