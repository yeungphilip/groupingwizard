// JavaScript Document
(function( $ ) {
  $.fn.luckyDraw = function(opts,totalPrize,repeat) {
	  $("#txtLog").val("start");
	  var settings = $.extend( {
		totalPrize: 0,
		repeat: true,
		nameField: "f0",
		criteriaFields:[],
		exportFields:["f0"],
		tbList:null
	  }, opts);
	  settings.totalPrize = totalPrize;
	  settings.repeat = repeat;
	  
	  var theList = $.parseXML("<list />");
	  
	  var isValid = true;
	  if(settings.totalPrize == 0
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
			  var row = $.parseXML("<row ran='"+Math.random()+"' id='"+rIndex+"' />");
			  
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
		  
		  // gen solution table - part 1
		  var resultTable = settings.tbList.clone();
		  $("tbody", resultTable).empty();
		  
		  if(settings.repeat){
			  // to be coded
			  var resultList = $.parseXML("<list />");
			  var sortedRowArray = $(theList).find('list row').get();
			  $(this).delay(5); 
			  for(var i=0; i<settings.totalPrize; i++){
				  var pos = Math.floor(Math.random() * sortedRowArray.length);
				  //alert(settings.totalPrize+" "+i+" "+pos);
				  // error in here
				  var row = sortedRowArray[pos];
				  var row2 = $(row).clone();
				  $(row2).attr("prize", (i+1)); // i is zero-based
				  $(resultList).find("list").append(row2);
				  // gen solution table - part 2
				  $("tbody",resultTable).append($("tbody tr:eq("+ $(row).attr("id")+")", settings.tbList).clone());
			  }
			  $("#txtLog").val(xmlToString(theList));
			  $(this).delay(1000); 		
			  //alert(xmlToString(resultList));
			  theList = resultList;
		  }
		  else{
			  // sort the list (xml) order by ran	  
			  var sortedRowArray = $(theList).find('list row').get().sort(function(a,b){
				  return ($(a).attr('ran') < $(b).attr('ran')) ? -1 : 1;
			  });
			  $(this).delay(5); 
			  // remove last rows if not all people has prize
			  if(settings.totalPrize < sortedRowArray.length) {
				  var extraRowNum = sortedRowArray.length - settings.totalPrize;
				  sortedRowArray.splice(settings.totalPrize, extraRowNum);
			  }
			  // start assign prize
			  for(var i=0; i<sortedRowArray.length; i++){
				  var row = sortedRowArray[i];
				  $(row).attr("prize", (i+1)); // i is zero-based
				  // gen solution table - part 2
				  $("tbody",resultTable).append($("tbody tr:eq("+ $(row).attr("id")+")", settings.tbList).clone());
			  }
			  // remove no groups
		 	  $(theList).find('list row:not([prize])').remove();
			  
			  $("#txtLog").val(xmlToString(theList));
			  $(this).delay(1000); 			  
		  }
		  // to be coded
		  // fill the no groups
		  //$(theList).find('list row:not([group])').attr({"group":"", "pos":""});
		  
		  
		  
		  
		  // gen solution table - part 3
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
		  
		  
		  $("thead tr",resultTable).prepend("<th>Prize No.</th>");
		  
		  $(theList).find('list row').each(function(rIndex){
			  $("tbody tr:eq("+rIndex+")",resultTable).prepend("<th>"+$(this).attr("prize")+"</th>");
		  });
		  resultObj.tbResult = resultTable;
		  return resultObj;
		  //return resultTable;
	  }
	  // Do your awesome plugin stuff here

  };
})( jQuery );