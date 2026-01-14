// JavaScript Document
(function( $ ) {
	var OPERATION = {
		INSERT:"insert", UPDATE:"update", DELETE:"delete", GET:"get", LIST:"list", MODIFY:"modify"
	};
	var defaultTbObj =  {
		  type: "RandomGroup",
		  subtype: "tb",
		  id: "",
		  name: "List Name",
		  people:0,
		  fields:0,
		  totalGroup: 0,
		  groupSize: 0,
		  nameField: "f1",
		  criteriaFields:[],
		  exportFields:["f0"],
		  tbListHTML:"",
		  createDate:"",
		  updateDate:""
		};
	var defaultGroupResultObj =  {
		  type: "RandomGroup",
		  subtype: "result",
		  id: "",
		  listName: "List Name",
		  resultName: "List Name - YYYYMMDD",
		  totalGroup: 0,
		  groupSize: 0,
		  totalPeople: 0,
		  nameField: "f1",
		  criteriaFields:[],
		  exportFields:["f0"],
		  resultNameField: "f1",
		  tbListHTML:"",
		  resultListHTML:"",
		  animation:"",
		  generateDate:""
		};
	var defaultDrawResultObj =  {
		  type: "RandomGroup",
		  subtype: "drawresult",
		  id: "",
		  listName: "List Name",
		  resultName: "List Name - YYYYMMDD",
		  totalPrize: 0,
		  repeat: true,
		  totalPeople: 0,
		  nameField: "f1",
		  exportFields:["f0"],
		  resultNameField: "f1",
		  tbListHTML:"",
		  resultListHTML:"",
		  animation:"",
		  generateDate:""
		};
		
		
	var dbHelper = {
		getDB:function(){return openDatabase(defaultGroupResultObj.type, '1.0', "(Random Group web app's db)", 5 * 1024 * 1024); }
	};
	var tbMethods = {
		modify:	function(operation, opts) {
							var settings = $.extend({}, defaultTbObj, opts);
							
							settings.updateDate = (new Date()).getTime();
							if(settings.id == "") {
								settings.id = defaultTbObj.subtype + (new Date()).getTime() + "";
								settings.createDate = settings.updateDate;
							}
							
							if(supportWebSQL()){
								$("#txtLog").val("Use: WebSQL Database");
								var db = dbHelper.getDB();
								db.transaction(function (tx) {
									tx.executeSql("CREATE TABLE IF NOT EXISTS "+settings.subtype
										+" (id unique, name, people, fields, totalGroup, groupSize, nameField, criteriaFields, exportFields, tbListHTML, createDate, updateDate)");
									if(operation == OPERATION.INSERT) {
										tx.executeSql("INSERT INTO "+settings.subtype
														+" (id, name, people, fields, totalGroup, groupSize, nameField, criteriaFields, exportFields, tbListHTML, createDate, updateDate) "
														+" VALUES (?,?,?,?,?,?,?,?,?,?,?,?)", 
														[settings.id, settings.name, settings.people, settings.fields, settings.totalGroup, settings.groupSize, 
														settings.nameField, settings.criteriaFields.join("|"), settings.exportFields.join("|"), 
														settings.tbListHTML, settings.createDate, settings.updateDate]);
									} else if(operation == OPERATION.UPDATE) {
										tx.executeSql("UPDATE "+settings.subtype
														+ " SET name = ?, people = ?, fields = ?, totalGroup = ?, groupSize = ?, nameField = ?, criteriaFields = ?, exportFields = ?, tbListHTML = ?, updateDate = ? "
														+ " WHERE id=?", 
														[settings.name, settings.people, settings.fields, settings.totalGroup, settings.groupSize, 
														settings.nameField, settings.criteriaFields.join("|"), settings.exportFields.join("|"), 
														settings.tbListHTML, settings.updateDate, settings.id]);
									} else if(operation == OPERATION.DELETE) {
										tx.executeSql("DELETE FROM "+settings.subtype
														+ " WHERE id=?", 
														[settings.id]);
										$.RunListID(OPERATION.DELETE, settings.id);
									}
								});
							}
							else if(supportHTML5Storage()) {
								$("#txtLog").val("Use: Web Storage");
								if(operation == OPERATION.INSERT ||operation == OPERATION.UPDATE) {
									$.jStorage.set(settings.id, settings);
								} else if (operation == OPERATION.DELETE) {
									$.jStorage.deleteKey(settings.id);
									$.RunListID(OPERATION.DELETE, settings.id);
								}
								$("#txtLog").val("Use: Web Storage\n"+operation);
							}
							return settings;
						},
		list: 	function(func) {
						var list = [];
						if(supportWebSQL()){
							var db = dbHelper.getDB();
							db.transaction(function (tx) {
								tx.executeSql("CREATE TABLE IF NOT EXISTS "+defaultTbObj.subtype+" (id unique, name, totalGroup, groupSize, nameField, criteriaFields, exportFields, tbListHTML, createDate, updateDate)");
								tx.executeSql("SELECT * FROM "+defaultTbObj.subtype + " ORDER BY updateDate DESC", [],
												function(tx2, results){
													for(var i=0; i<results.rows.length; i++) {
														var data = {
															id: results.rows.item(i).id,
															name: results.rows.item(i).name,
															createDate:results.rows.item(i).createDate,
															updateDate:results.rows.item(i).updateDate
														};
														if($.isFunction(func)){
															func(data);
														}
														list.push(data);
													}
												});
							});
						}
						else if(supportHTML5Storage()) {
							$("#txtLog").val("Use: Web Storage");
							var index = $.jStorage.index();
							for(var i=0; i<index.length; i++) {
								try{
									var result = $.jStorage.get(index[i]);
									if(result.type == defaultTbObj.type && result.subtype == defaultTbObj.subtype){
										var data = {
											id: result.id,
											name: result.name,
											people: result.people,
											fields:result.fields,
											totalGroup: result.totalGroup,
											groupSize: result.groupSize,
											createDate:result.createDate,
											updateDate:result.updateDate
										};
										if($.isFunction(func)){
											func(data);
										}
										list.push(data);
									}
								} catch(err){}
							}
							$("#txtLog").val("Use: Web Storage\nList Size: "+list.length);
						}
						return list;
					},
		get:	function(opts) {
					var settings = $.extend({}, defaultTbObj, opts);
					var id = settings.id;
					var data = null;
					if(supportWebSQL()){
						var db = dbHelper.getDB();
						db.transaction(function (tx) {
							tx.executeSql("CREATE TABLE IF NOT EXISTS "+defaultTbObj.subtype+" (id unique, name, totalGroup, groupSize, nameField, criteriaFields, exportFields, tbListHTML, createDate, updateDate)");
							tx.executeSql("SELECT * FROM "+defaultTbObj.subtype + " WHERE id=?", [settings.id],
											function(tx2, results){
												if(results.rows.length > 0) {
													data = {
														id: results.rows.item(0).id,
														name: results.rows.item(0).name,
														totalGroup: results.rows.item(0).totalGroup,
														groupSize: results.rows.item(0).groupSize,
														nameField: results.rows.item(0).nameField,
														criteriaFields:results.rows.item(0).criteriaFields.split("|"),
														exportFields:results.rows.item(0).exportFields.split("|"),
														tbListHTML:results.rows.item(0).tbListHTML,
														createDate:results.rows.item(0).createDate,
														updateDate:results.rows.item(0).updateDate
													};
												}
											});
						});
					}
					else if(supportHTML5Storage()) {
						data = $.jStorage.get(id);
					}
					if(data == null){
						return null;
					} else {
						return $.extend({}, defaultTbObj, data);
					}
					
				}
	}
	//$.format.date(new Date(), "yyyy-MM-dd HH:mm:ss");
	$.TableData = function(operation, opts, func) {
		if(operation == OPERATION.INSERT || operation == OPERATION.UPDATE || operation == OPERATION.DELETE){
			return tbMethods.modify(operation, opts);
		} else if(operation == OPERATION.LIST){
			return tbMethods.list(func);
		} else if(operation == OPERATION.GET){
			return tbMethods.get(opts);	
		}
		return null;
	};
	
	$.RunListID = function(operation, id){
		try{
			if(supportHTML5Storage()) {
				if(operation == OPERATION.INSERT || operation == OPERATION.UPDATE){
					$.jStorage.set("RunList", id);
				}
				else if(operation == OPERATION.DELETE){
					if(id != null) {
						if($.jStorage.get(id) == id) {
							$.jStorage.deleteKey("RunList");
						}
					} else {
						$.jStorage.deleteKey("RunList");
					}
				}
				else if(operation == OPERATION.GET){
					return $.jStorage.get("RunList");
				}
			}
		}catch(err){}
		return null;
	}
	
	var groupResultMethods = {
		modify:	function(operation, opts) {
							var settings = $.extend({}, defaultGroupResultObj, opts);
							
							if(settings.id == "") {
								settings.id = defaultGroupResultObj.subtype +(new Date()).getTime() + "";
								settings.generateDate = (new Date()).getTime();
							}
							
							if(supportWebSQL()){
								$("#txtLog").val("Use: WebSQL Database");
								var db = dbHelper.getDB();
								db.transaction(function (tx) {
									tx.executeSql("CREATE TABLE IF NOT EXISTS "+settings.subtype
										+" (id unique, listName, resultName, totalGroup, groupSize, totalPeople, "
										+" nameField, criteriaFields, exportFields, tbListHTML, resultListHTML, animation, generateDate)");
									if(operation == OPERATION.INSERT) {
										tx.executeSql("INSERT INTO "+settings.subtype
														+" (id unique, listName, resultName, totalGroup, groupSize, totalPeople, "
														+" nameField, criteriaFields, exportFields, tbListHTML, resultListHTML, animation, generateDate) "
														+" VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)", 
														[settings.id, settings.listName, settings.resultName, settings.totalGroup, settings.groupSize, settings.totalPeople,
														settings.nameField, settings.criteriaFields.join("|"), settings.exportFields.join("|"), 
														settings.tbListHTML, settings.resultListHTML, settings.generateDate]);
									} else if(operation == OPERATION.UPDATE) {
										tx.executeSql("UPDATE "+settings.subtype
														+ " SET resultName = ? "
														+ " WHERE id=?", 
														[settings.resultName, settings.id]);
									} else if(operation == OPERATION.DELETE) {
										tx.executeSql("DELETE FROM "+settings.subtype
														+ " WHERE id=?", 
														[settings.id]);
										$.RunListID(OPERATION.DELETE, settings.id);
									}
								});
							}
							else if(supportHTML5Storage()) {
								$("#txtLog").val("Use: Web Storage");
								if(operation == OPERATION.INSERT ||operation == OPERATION.UPDATE) {
									$.jStorage.set(settings.id, settings);
								} else if (operation == OPERATION.DELETE) {
									$.jStorage.deleteKey(settings.id);
									$.RunListID(OPERATION.DELETE, settings.id);
								}
								$("#txtLog").val("Use: Web Storage\n"+operation);
							}
							return settings;
						},
		list: 	function(func) {
						var list = [];
						if(supportWebSQL()){
							var db = dbHelper.getDB();
							db.transaction(function (tx) {
								tx.executeSql("CREATE TABLE IF NOT EXISTS "+defaultGroupResultObj.subtype
										+" (id unique, listName, resultName, totalGroup, groupSize, totalPeople, "
										+" nameField, criteriaFields, exportFields, tbListHTML, resultListHTML, animation, generateDate)");
								tx.executeSql("SELECT * FROM "+defaultGroupResultObj.subtype + " ORDER BY generateDate DESC", [],
												function(tx2, results){
													for(var i=0; i<results.rows.length; i++) {
														var data = {
															id: results.rows.item(i).id,
															listName: results.rows.item(i).listName,
															resultName: results.rows.item(i).resultName,
															totalGroup: results.rows.item(i).totalGroup,
															groupSize: results.rows.item(i).groupSize,
															totalPeople:results.rows.item(i).totalPeople,
															generateDate:results.rows.item(i).generateDate
														};
														if($.isFunction(func)){
															func(data);
														}
														list.push(data);
													}
												});
							});
						}
						else if(supportHTML5Storage()) {
							$("#txtLog").val("(Result) Use: Web Storage");
							var index = $.jStorage.index();
							for(var i=index.length-1; i>=0; i--) {
								try{
									var result = $.jStorage.get(index[i]);
									if(result.type == defaultGroupResultObj.type && result.subtype == defaultGroupResultObj.subtype){
										var data = {											
											id: result.id,
											listName: result.listName,
											resultName: result.resultName,
											totalPeople:result.totalPeople,
											totalGroup: result.totalGroup,
											groupSize: result.groupSize,
											generateDate:result.generateDate
										};
										if($.isFunction(func)){
											func(data);
										}
										list.push(data);
									}
								} catch(err){}
							}
							$("#txtLog").val("(Result) Use: Web Storage\nList Size: "+list.length);
						}
						return list;
					},
		get:	function(opts) {
					var settings = $.extend({}, defaultGroupResultObj, opts);
					var id = settings.id;
					var data = null;
					if(supportWebSQL()){
						var db = dbHelper.getDB();
						db.transaction(function (tx) {
							tx.executeSql("CREATE TABLE IF NOT EXISTS "+defaultGroupResultObj.subtype
										+" (id unique, listName, resultName, totalGroup, groupSize, totalPeople, "
										+" nameField, criteriaFields, exportFields, tbListHTML, resultListHTML, animation, generateDate)");
							tx.executeSql("SELECT * FROM "+defaultGroupResultObj.subtype + " WHERE id=?", [settings.id],
											function(tx2, results){
												if(results.rows.length > 0) {
													data = {
														id: results.rows.item(0).id,
														listName: results.rows.item(0).listName,
														resultName: results.rows.item(0).resultName,
														totalGroup: results.rows.item(0).totalGroup,
														groupSize: results.rows.item(0).groupSize,
														totalPeople: results.rows.item(0).totalPeople,
														nameField: results.rows.item(0).nameField,
														criteriaFields:results.rows.item(0).criteriaFields.split("|"),
														exportFields:results.rows.item(0).exportFields.split("|"),
														tbListHTML:results.rows.item(0).tbListHTML,
														resultListHTML:results.rows.item(0).resultListHTML,
														animation:results.rows.item(0).animation,
														generateDate:results.rows.item(0).generateDate
													};
												}
											});
						});
					}
					else if(supportHTML5Storage()) {
						data = $.jStorage.get(id);
					}
					if(data == null){
						return null;
					} else {
						return $.extend({}, defaultGroupResultObj, data);
					}
					
				}
	};
	$.GroupResultData = function(operation, opts, func) {
		if(operation == OPERATION.INSERT || operation == OPERATION.UPDATE || operation == OPERATION.DELETE){
			return groupResultMethods.modify(operation, opts);
		} else if(operation == OPERATION.LIST){
			return groupResultMethods.list(func);
		} else if(operation == OPERATION.GET){
			return groupResultMethods.get(opts);	
		}
		return null;
	};

	var drawResultMethods = {
		modify:	function(operation, opts) {
							var settings = $.extend({}, defaultDrawResultObj, opts);
							
							if(settings.id == "") {
								settings.id = defaultDrawResultObj.subtype +(new Date()).getTime() + "";
								settings.generateDate = (new Date()).getTime();
							}
							
							if(supportWebSQL()){
								$("#txtLog").val("Use: WebSQL Database");
								var db = dbHelper.getDB();
								db.transaction(function (tx) {
									tx.executeSql("CREATE TABLE IF NOT EXISTS "+settings.subtype
										+" (id unique, listName, resultName, totalPrize, repeat, totalPeople, "
										+" nameField, criteriaFields, exportFields, tbListHTML, resultListHTML, animation, generateDate)");
									if(operation == OPERATION.INSERT) {
										tx.executeSql("INSERT INTO "+settings.subtype
														+" (id unique, listName, resultName, totalPrize, repeat, totalPeople, "
														+" nameField, criteriaFields, exportFields, tbListHTML, resultListHTML, animation, generateDate) "
														+" VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)", 
														[settings.id, settings.listName, settings.resultName, settings.totalPrize, settings.repeat, settings.totalPeople,
														settings.nameField, settings.criteriaFields.join("|"), settings.exportFields.join("|"), 
														settings.tbListHTML, settings.resultListHTML, settings.generateDate]);
									} else if(operation == OPERATION.UPDATE) {
										tx.executeSql("UPDATE "+settings.subtype
														+ " SET resultName = ? "
														+ " WHERE id=?", 
														[settings.resultName, settings.id]);
									} else if(operation == OPERATION.DELETE) {
										tx.executeSql("DELETE FROM "+settings.subtype
														+ " WHERE id=?", 
														[settings.id]);
										$.RunListID(OPERATION.DELETE, settings.id);
									}
								});
							}
							else if(supportHTML5Storage()) {
								$("#txtLog").val("Use: Web Storage");
								if(operation == OPERATION.INSERT ||operation == OPERATION.UPDATE) {
									$.jStorage.set(settings.id, settings);
								} else if (operation == OPERATION.DELETE) {
									$.jStorage.deleteKey(settings.id);
									$.RunListID(OPERATION.DELETE, settings.id);
								}
								$("#txtLog").val("Use: Web Storage\n"+operation);
							}
							return settings;
						},
		list: 	function(func) {
						var list = [];
						if(supportWebSQL()){
							var db = dbHelper.getDB();
							db.transaction(function (tx) {
								tx.executeSql("CREATE TABLE IF NOT EXISTS "+defaultDrawResultObj.subtype
										+" (id unique, listName, resultName, totalPrize, repeat, totalPeople, "
										+" nameField, criteriaFields, exportFields, tbListHTML, resultListHTML, animation, generateDate)");
								tx.executeSql("SELECT * FROM "+defaultDrawResultObj.subtype + " ORDER BY generateDate DESC", [],
												function(tx2, results){
													for(var i=0; i<results.rows.length; i++) {
														var data = {
															id: results.rows.item(i).id,
															listName: results.rows.item(i).listName,
															resultName: results.rows.item(i).resultName,
															totalPrize: results.rows.item(i).totalPrize,
															repeat: results.rows.item(i).repeat,
															totalPeople:results.rows.item(i).totalPeople,
															generateDate:results.rows.item(i).generateDate
														};
														if($.isFunction(func)){
															func(data);
														}
														list.push(data);
													}
												});
							});
						}
						else if(supportHTML5Storage()) {
							$("#txtLog").val("(Result) Use: Web Storage");
							var index = $.jStorage.index();
							for(var i=index.length-1; i>=0; i--) {
								try{
									var result = $.jStorage.get(index[i]);
									if(result.type == defaultDrawResultObj.type && result.subtype == defaultDrawResultObj.subtype){
										var data = {											
											id: result.id,
											listName: result.listName,
											resultName: result.resultName,
											totalPeople:result.totalPeople,
											totalPrize: result.totalPrize,
											repeat: result.repeat,
											generateDate:result.generateDate
										};
										if($.isFunction(func)){
											func(data);
										}
										list.push(data);
									}
								} catch(err){}
							}
							$("#txtLog").val("(Result) Use: Web Storage\nList Size: "+list.length);
						}
						return list;
					},
		get:	function(opts) {
					var settings = $.extend({}, defaultDrawResultObj, opts);
					var id = settings.id;
					var data = null;
					if(supportWebSQL()){
						var db = dbHelper.getDB();
						db.transaction(function (tx) {
							tx.executeSql("CREATE TABLE IF NOT EXISTS "+defaultDrawResultObj.subtype
										+" (id unique, listName, resultName, totalPrize, repeat, totalPeople, "
										+" nameField, criteriaFields, exportFields, tbListHTML, resultListHTML, animation, generateDate)");
							tx.executeSql("SELECT * FROM "+defaultDrawResultObj.subtype + " WHERE id=?", [settings.id],
											function(tx2, results){
												if(results.rows.length > 0) {
													data = {
														id: results.rows.item(0).id,
														listName: results.rows.item(0).listName,
														resultName: results.rows.item(0).resultName,
														totalPrize: results.rows.item(0).totalPrize,
														repeat: results.rows.item(0).repeat,
														totalPeople: results.rows.item(0).totalPeople,
														nameField: results.rows.item(0).nameField,
														criteriaFields:results.rows.item(0).criteriaFields.split("|"),
														exportFields:results.rows.item(0).exportFields.split("|"),
														tbListHTML:results.rows.item(0).tbListHTML,
														resultListHTML:results.rows.item(0).resultListHTML,
														animation:results.rows.item(0).animation,
														generateDate:results.rows.item(0).generateDate
													};
												}
											});
						});
					}
					else if(supportHTML5Storage()) {
						data = $.jStorage.get(id);
					}
					if(data == null){
						return null;
					} else {
						return $.extend({}, defaultDrawResultObj, data);
					}
					
				}
	};
	$.DrawResultData = function(operation, opts, func) {
		if(operation == OPERATION.INSERT || operation == OPERATION.UPDATE || operation == OPERATION.DELETE){
			return drawResultMethods.modify(operation, opts);
		} else if(operation == OPERATION.LIST){
			return drawResultMethods.list(func);
		} else if(operation == OPERATION.GET){
			return drawResultMethods.get(opts);	
		}
		return null;
	};
	$.LangData = function(operation, lang){
		if(operation == OPERATION.UPDATE){
			$.jStorage.set("randomlang", lang);
			return true;
		} else if(operation == OPERATION.GET){
			return $.jStorage.get("randomlang");	
		}
		return null;
	}
})( jQuery );