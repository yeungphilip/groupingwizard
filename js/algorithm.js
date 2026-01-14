// JavaScript Document
(function( $ ) {
  $.fn.randomGroups = function(opts) {
	  $("#txtLog").val("start");
	  var settings = $.extend( {
		totalGroup: 0,
		groupSize: 0,
		nameField: "f0",
		criteriaFields:[],
		exportFields:["f0"],
		tbList:null
	  }, opts);
	  var theList = $.parseXML("<list />");
	  
	  var isValid = true;
	  if(settings.totalGroup == 0 || settings.groupSize==0 
	  		|| settings.nameField == null || settings.nameField == "" 
	  		|| settings.exportFields == null || settings.tbList == null){
		  isValid = false;
		  return null;
	  }
	  else if(settings.exportFields.length == 0){
		  isValid = false;
		  return null;
	  }
	  $("#txtLog").val(isValid);
	  
	  if(isValid){
		  if(settings.criteriaFields == null){
			  settings.criteriaFields = [];
		  }
		  // load the table into list (xml)
		  try{
		  $("tbody tr", settings.tbList).each(function(rIndex){
			  $("#txtLog").val("importing a row: "+rIndex);
			  var tr = $(this);
			  var row = $.parseXML("<row ran='"+Math.random()+"' />");
			  
			  $("td", tr).each(function(cIndex){
				  $("#txtLog").val("importing a field: "+rIndex+","+cIndex);
				  $(row).find("row").attr("f"+cIndex, $(this).text());
			  });
			  $("#txtLog").val("Before Append");
			  
			  	$(theList).find("list").appendXML($(row));
			  $("#txtLog").val("After Append");
			  $("#txtLog").val(xmlToString(row));
		  });
		  } catch(err){
			  $("#txtLog").val("Error: "+err);
			  return null;
		  }
		  $("#txtLog").val("the List");
		  $("#txtLog").val(xmlToString(theList));
		 // return null;
		  function attrCompare(a,b){
			  if(a == b){return 0;}
			  if(a == "") {return 1;}
			  if(b == "") {return -1;}
			  return (a < b)? -1: 1;
		  }
		  // sort the list (xml) order by criteriaFields and ran	  
		  var sortedRowArray = $(theList).find('list row').get().sort(function(a,b){
			  for(var i=0; i<settings.criteriaFields.length; i++){
				  var fName = settings.criteriaFields[i];
				  var c = attrCompare($(a).attr(fName),$(b).attr(fName));
				  if(c != 0) return c;
			  }
			  return ($(a).attr('ran') < $(b).attr('ran')) ? -1 : 1;
		  });
		  $(this).delay(5); 
		  
		  // randomly remove some row if not all people has group to place
		  var maxHasGroup = settings.totalGroup * settings.groupSize;
		  if(maxHasGroup < sortedRowArray.length) {
			  var extraRowNum = sortedRowArray.length - maxHasGroup;
			  for(var i=0; i<extraRowNum; i++){
				  var ranPos = Math.random()*sortedRowArray.length;
				  sortedRowArray.splice(ranPos,1);
			  }
		  }
		  
		  // start assign group
		  for(var i=0; i<sortedRowArray.length; i+=settings.totalGroup){
			  var currRows = [];
			  var matrix = [];
			  if(i==0 || settings.criteriaFields.length < 2 || settings.totalGroup == 1 || settings.groupSize == 1) {
				  //directly assign the groups for efficiency reason
				  for(var i2=0; i2<settings.totalGroup; i2++){
					  if((i+i2) < sortedRowArray.length){
						  var row = sortedRowArray[i+i2];
						  $(row).attr("group", (i2+1)); // i2 is zero-based
					  } 
					  else{ break; }
				  }
			  }
			  else {
				  for(var i2=0; i2<totalGroup; i2++){
					  if((i+i2) < sortedRowArray.length){
						var row = sortedRowArray[i+i2];
						currRows.push(row);
						var matrixRow = [];
						for(var g=1; g<=settings.totalGroup; g++){
							matrixRow[g-1] = 0;
							for(var c=0; c<settings.criteriaFields.length; c++){
								var fName = settings.criteriaFields[c];
								var fValue = $(row).attr(fName);
								if(fValue != ""){
									matrixRow[g-1] += $(theList).find("list row["+fName+"='"+fValue+"'][group="+g+"]").length();
								}
							}
						}
						matrix.push(matrixRow);
					  }
					  else{ break; }
				  }
				  // now, use Hungarian algorithm
			  }
			  
			  
			  $("#txtLog").val(xmlToString(theList));
			  $(this).delay(1000); 
		  }
		  
		  // fill the no groups
		  $(theList).find('list row:not([group])').attr({"group":"", "pos":""});
		  
		  // Completed the group assignment, 
		  // now start assigning position
		  
		  for(var g=1; g<=settings.totalGroup; g++){
			  var groupRowArray = $(theList).find('list row[group='+g+']').get().sort(function(a,b){
				  return ($(a).attr('ran') < $(b).attr('ran')) ? -1 : 1;
			  });
			  for(var i=0; i < groupRowArray.length; i++) {
				  var row=groupRowArray[i];
				  $(row).attr("pos", (i+1)); // i is zero-based
			  }
		  }
		  
		  $("#txtLog").val(xmlToString(theList));
		  
		  
		  // gen solution table
		  var resultTable = settings.tbList.clone();
		  
		  var fName = -1;
		  var totalFields = $("thead tr th",resultTable).length;
		  for(var f=totalFields-1; f>=0; f--){
			  if(settings.nameField == ("f"+f)){
				  // name field
				 // $("thead tr",resultTable).find("th").eq(f).addClass("namefield");
				  fName = f;
			  }
			  
			  else if($.inArray("f"+f, settings.exportFields) == -1) {
				  $("tbody tr",resultTable).find("td:eq("+f+")").remove();
				  $("thead tr",resultTable).find("th:eq("+f+")").remove();
				  if(fName >= 0) {fName--;}
			  }
		  }
		   var resultObj = {
			  nameField:(fName>=0)?("f"+fName):"f0",
			  tbResult:null
		  };
		  // update new name field
		 // settings.nameField = "f"+$("thead tr th",resultTable).index(".namefield");
		  //$("thead tr th",resultTable).removeClass("namefield");
		  
		  
		  $("thead tr",resultTable).prepend("<th>Group</th><th>Pos.</th>");
		  
		  $(theList).find('list row').each(function(rIndex){
			  $("tbody tr:eq("+rIndex+")",resultTable).prepend("<th>"+$(this).attr("group")+"</th><th>"+$(this).attr("pos")+"</th>");
		  });
		  resultObj.tbResult = resultTable;
		  return resultObj;
		  //return resultTable;
	  }
	  // Do your awesome plugin stuff here

  };
})( jQuery );