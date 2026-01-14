// JavaScript Document
/** draw config ************************************************/
$('#pageDrawConfig').live('pageinit', function() {
	//RunRandomGroup();
});
$('#pageDrawConfig').live('pagebeforeshow', function(event, ui) {
	var vars = getUrlVars(); 
	var listID = vars["tid"];
	LoadDrawInfo(listID);
});
function LoadDrawInfo(listID){
	$("#pageDrawConfig #listID").val(listID);
	var listData = $.TableData("get", {id:listID});
	if(listData != null) {
		$('#pageDrawConfig #lblList').text(listData.name);
		$("#pageDrawConfig #lblTotalRows").text(listData.people);
		ChangeDrawRepeat();
		
		
		//$("#pageDrawConfig #radModeAll").checkboxradio('disable');
		//$("#pageDrawConfig #radModePrize").checkboxradio('disable');
		/*
		if(!drawAnimations.all.canPlay(listData.people,group)){
			$("#pageDrawConfig #radModeAll").checkboxradio('disable');
		}
		if(!drawAnimations.group.canPlay(listData.people,group, groupSize)){
			$("#pageDrawConfig #radModeGroup").checkboxradio('disable');
		}*/
	}
}
function ChangeDrawRepeat(){
	var people = parseInt($("#pageDrawConfig #lblTotalRows").text(), 10);
	var val = $("#sliderTotalPrize").val();
	var maxVal  = $("#sliderTotalPrize").attr("max");
	var newMax = 1;
	var newVal = 1;
	if($("#pageDrawConfig #sliderDrawRepeat").val() == "true"){
		newMax = 200;
		newVal = Math.min(val,newMax);		
	} else {
		newMax = Math.min(people, 200);
		newVal = Math.min(val,newMax);		
	}
	$("#sliderTotalPrize").attr("max", newMax);
	$("#sliderTotalPrize").val(newVal);
	$("#sliderTotalPrize").slider('refresh');
}
function ClickDrawStart(){
	//$.mobile.showPageLoadingMsg();
	//$("#btnDrawStart").button("disable");
	var listID = $("#pageDrawConfig #listID").val();
	var prize = $("#sliderTotalPrize").getInt();
	var repeat = ($("#pageDrawConfig #sliderDrawRepeat").val() == "true");
	var mode = $("input.radMode").selectedValue();
	if(mode=="none"){mode="";}
	if(listID == null) {
		// error
	} else {
		var lang = getLang();
		var resultID = RunLuckyDraw(listID, prize, repeat, mode);
		if(mode==""||mode==null){
			$.mobile.changePage("drawresult_"+lang+".html?rid="+resultID);
		}else {
			//$.mobile.changePage("drawresult_"+lang+".html?rid="+resultID);
			$.mobile.changePage("drawrun_"+lang+".html?rid="+resultID+"&mode="+mode);
		}
	}
	$.mobile.hidePageLoadingMsg();	
}
function RunLuckyDraw(listID, prize, repeat, mode) {
	if(listID != null && listID != ""){
		var listData = $.TableData("get", {id:listID});
		if(listData != null) {
			if(prize == 0) {
				return;
			} else if(listData.exportFields.length == 0) {
				return;
			} else {
				$.mobile.showPageLoadingMsg();
				
				var tbList = $(listData.tbListHTML);
				var totalRow = listData.people;
								
				var randomObj = $("#pageDrawConfig").luckyDraw({
					nameField: listData.nameField,
					criteriaFields:listData.criteriaFields,
					exportFields:listData.exportFields,
					tbList:tbList
				}, prize, repeat);
				//alert($(randomObj.tbResult).htmlOuter());
				var resultID = null;
				if(randomObj != null)
				{
					var resultObj = {
						listName: listData.name,
						resultName: listData.name + " - " +$.format.date(new Date(), "yyyyMMdd"),
						totalPrize: prize,
						repeat: repeat,
						totalPeople: totalRow,
						nameField: listData.nameField,
						exportFields:listData.exportFields,
						resultNameField: randomObj.nameField,
						tbListHTML:listData.tbListHTML,
						resultListHTML:$(randomObj.tbResult).htmlOuter(),
						animation:mode
					};
					resultObj = $.DrawResultData("insert", resultObj);
					resultID = resultObj.id;
					//$("#pageRun #resultID").val(resultObj.id);
					//LoadResultFromStorage(resultObj.id);
				}
				$.mobile.hidePageLoadingMsg();	
				return resultID;
				
			}
		} else {
			return null;
		}
	} else {
		return null;
	}
	//$("#btnRun").button("enable");
}
/** draw list dialog *******************************************/
$('#dialogDrawList').live('pageinit', function() {
	LoadDrawList();
});
function LoadDrawList(){
	$("#dialogDrawList #divDrawList").empty();
	var lang = getLang();
	var lists = $.TableData("list", null,
			function(data){
				//$("#txtLog").val("show list item");
				var listNode = $(tmpl.listRunItem);
				listNode.appendTo("#divDrawList");
				$("a", listNode).text(data.name);
				$("a", listNode).attr("href", "drawconfig_"+lang+".html?tid="+data.id);
			});
	$("#dialogDrawList #divDrawList a[data-role='button']").button();
}
/** run *******************************************************/
$('#pageDrawRun').live('pageinit', function() {
	$("#divCompletedButtons").hide();
});
$('#pageDrawRun').live('pagebeforeshow', function(event, ui) {
	InitDrawAnimation();
});
$('#pageDrawRun').live('pageshow', function(event, ui) {
	PlayDrawAnimation();	
});
function InitDrawAnimation(){
	var vars = getUrlVars(); 
	var resultID = vars["rid"];
	var mode = vars["mode"];
	var lang = getLang();
	if(resultID != null){
		$("#pageDrawRun #resultID").val(resultID);
	}
	if(mode == ""||mode==null){
		$.mobile.changePage("drawresult_"+lang+".html?rid="+resultID);
	} else{
		if(mode == "all"){
			//drawAnimations.all.prepare($.DrawResultData("get", {id:resultID}), lang);
		}
		else if(mode == "prize"){
			drawAnimations.prize.prepare($.DrawResultData("get", {id:resultID}), lang);
		}
		$("#pageDrawRun #divShowAnimation").show();
		$("#pageDrawRun #divPreAnimation").hide();
	}
}
function PlayDrawAnimation(){
	var vars = getUrlVars(); 
	var mode = vars["mode"];
	if(mode == "all"){
		//drawAnimations.all.play(AnimationCompleted);
	} else {
		drawAnimations.prize.play(DrawAnimationCompleted);
	}
}
function DrawAnimationCompleted(){
	$("#divAnimationButtons").hide();
	$("#divCompletedButtons").show();
}
/*
function TerminateAnimation(){
	var lang = getLang();
	$.mobile.changePage("home_"+lang+".html");
}*/
function SkipAndShowDrawResult(){
	var lang = getLang();
	var resultID = $("#pageDrawRun #resultID").val();
	$.mobile.changePage("drawresult_"+lang+".html?rid="+resultID);
}
function SkipAndShowDrawResult2(){
	var lang = getLang();
	var resultID = $("#pageDrawRun #resultID").val();
	$.mobile.changePage("drawresult_"+lang+".html?rid="+resultID);
}
function ReplayDrawResult(){
	$("#pageDrawRun #divShowAnimation").hide();
	$("#pageDrawRun #divPreAnimation").show();
	$("#divCompletedButtons").hide();
	$("#divAnimationButtons").show();
	InitDrawAnimation();
	PlayDrawAnimation();	
	
}
/** draw result menu  *************************************************/

$('#pageDrawResultMenu').live('pageinit', function() {
	LoadDrawResultsFromStorage();
});
function LoadDrawResultsFromStorage(){
	$("#ulHistoryList").empty();
	var lang = getLang();
	var lists = $.DrawResultData("list", null,
			function(data){
				$("#txtLog").val("show result item");
				var listNode = $(tmpl.listDrawResultItem[lang]);
				$(".lblResultName", listNode).text(data.resultName);
				$(".lblListName", listNode).text(data.listName);
				$(".lblTotalPeople", listNode).text(data.totalPeople);
				$(".lblTotalGroup", listNode).text(data.totalPrize);
				$(".lblGroupSize", listNode).text(data.repeat?tmpl.lblBoolYes[lang]:tmpl.lblBoolNo[lang]);
				$(".lblGenerateDate", listNode).text($.format.date(new Date(data.generateDate), "yyyy-MM-dd HH:mm:ss"));
				$(listNode).attr("data-filtertext", data.resultName + " " +data.listName);
				
				listNode.appendTo("#ulHistoryList").data("id", data.id);
			});
	try{
		$("#ulHistoryList").listview("refresh");
		//$("#pageListMenu").page('refresh');
		//$("#divList .divListItem").collapsible();
		//$("#divList .divListItem input").button();
	}catch(err){}
}
function DeleteDrawResultFromStorage(){
	$.mobile.showPageLoadingMsg();
	var result = $(this).parents("#ulHistoryList li");
	if(result.length > 0){
		var resultID = $(result).data("id");
		$.DrawResultData("delete", {id:resultID});
		LoadDrawResultsFromStorage();
	}
	$.mobile.hidePageLoadingMsg();	
	return false;
}
function ViewDrawResultPage(){
	$.mobile.showPageLoadingMsg();
	var lang = getLang();
	var result = $(this).parents("#ulHistoryList li");
	if(result.length > 0){
		var resultID = $(result).data("id");
		//LoadResultFromStorage(resultID);
		$.mobile.changePage("drawresult_"+lang+".html?rid="+resultID);
	}
	$.mobile.hidePageLoadingMsg();	
	return false;
}
/** draw result table **********************************************************/
$('#pageDrawResultTable').live('pageinit', function() {
	exportHelper.tbObj = null;
	if(siteInfo.isAppIOS && false){
	 	$("#pageDrawResultTable #btnDownload").parents(".ui-btn").hide();
		$("#lblDownload").hide();
	}
});
$('#pageDrawResultTable').live('pagebeforeshow', function(event, ui) {
	var vars = getUrlVars(); 
	var lang = getLang();
	var resultID = vars["rid"];
	LoadDrawResultFromStorage(resultID);
	if(siteInfo.isAppIOS && false){
	 	//$("#pageDrawResultTable #btnDownload").css("visibility", "hidden");
	} else {
		$("#pageDrawResultTable #btnDownload").attr("href", "drawresultdownload_"+lang+".html?rid="+resultID);
	}
	//ViewListNavBar(listID);
	//LoadListTableFromStorage(listID);
});
function LoadDrawResultFromStorage(resultID){
	var lang = getLang();
	var resultData = $.DrawResultData("get", {id:resultID});
	if(resultData != null) {
		$("#pageDrawResultTable #lblResultTbListName").text(resultData.listName);
		$("#pageDrawResultTable #lblResultTbResultName").text(resultData.resultName);
		$("#pageDrawResultTable #divResultTable").empty().append(resultData.resultListHTML);
		
		$("#pageDrawResultTable #btnRunAgain").attr("href", "drawrun_"+lang+".html?rid="+resultData.id+"&mode="+resultData.animation);
		if(resultData.animation == ""){
			$("#pageDrawResultTable #btnRunAgain").hide();
		}
		
		if(lang != "en"){
			$("#pageDrawResultTable table thead tr th").each(function(rIndex){
				if(rIndex == 0) {$(this).text(tmpl.lblPrize[lang]);return false;}
			});
		}
		$("#pageDrawResultTable #divResultTable table").tablesorter({sortList: [[0,0]]});
	}
}
function DownloadDrawResult(){
	var vars = getUrlVars(); 
	var lang = getLang();
	var resultID = vars["rid"];
	var trsVisible = $("#pageDrawResultTable #divResultTable table tbody tr:visible").clone();
	exportHelper.tbObj = $("#pageDrawResultTable #divResultTable table").clone();
	$("tbody", exportHelper.tbObj).empty();
	$("tbody", exportHelper.tbObj).append(trsVisible);
	$("table, tr, td, th", exportHelper.tbObj).removeAttr("class");
	$.mobile.changePage("drawresultdownload_"+lang+".html?rid="+resultID);
}

/** draw result Download **********************************************************/
$('#pageDrawResultDownload').live('pageinit', function() {
	if(siteInfo.isAppIOS==true){
		$("#btnDownloadDoc, #btnDownloadHtml", "#pageDrawResultDownload").parent().remove();
	} 
});
$('#pageDrawResultDownload').live('pagebeforeshow', function(event, ui) {
	var vars = getUrlVars(); 
	var lang = getLang();
	var resultID = vars["rid"];
	$(".btnBack, #pageDrawResultDownload").attr("href", "drawresult_"+lang+".html?rid="+resultID);
	LoadDrawResultFromStorage2(resultID);
});
function LoadDrawResultFromStorage2(resultID){
	var lang = getLang();
	var resultData = $.DrawResultData("get", {id:resultID});
	if(resultData != null) {
		$("#pageDrawResultDownload #lblResultTbListName").text(resultData.listName);
		$("#pageDrawResultDownload #lblResultTbResultName").text(resultData.resultName);
		if(exportHelper.tbObj != null){
			$("#pageDrawResultDownload #divResultTable").empty().append(exportHelper.tbObj);
		} else {
			$("#pageDrawResultDownload #divResultTable").empty().append(resultData.resultListHTML);
		}
		if(lang != "en"){
			$("#pageDrawResultDownload table thead tr th").each(function(rIndex){
				if(rIndex == 0) {$(this).text(tmpl.lblPrize[lang]); return false;}
			});
		}
	}
}
function DownloadDrawResultFile(){
	var filetype = "";
	switch($(this).attr("id")){
		case "btnDownloadDoc":
			filetype = "doc";
			break;
		case "btnDownloadHtml":
			filetype = "html";
			break;
		case "btnDownloadXls":
			filetype = "xls";
			break;
		case "btnDownloadTxt":
			filetype = "txt";
			break;
		case "btnDownloadCsv":
			filetype = "csv";
			break;
		case "btnDownloadXml":
			filetype = "xml";
			break;
		case "btnDownloadPdf":
			filetype = "pdf";
			break;
	}
	var formObj = $('<form action="#" id="aForm" name="aForm" />').attr(
    {
        "method": "post",
        "action": exportHelper.toFile,
		"target":"_blank",
		"data-ajax":"false",
		"rel":"external"
    });
	if(siteInfo.isAppIOS){
		formObj.removeAttr("data-ajax");
	}
	$("#pageDrawResultDownload #divResultTable table").attr("border", "1");
	
	formObj.appendTo("#pageDrawResultDownload #divForms");
	formObj.append($('<input id="filetype" name="filetype" type="hidden"/>').val(filetype));
	formObj.append($('<input id="listname" name="listname" type="hidden"/>').val($("#pageDrawResultDownload #lblResultTbResultName").text()));
	if($("#pageDrawResultDownload #divResultTable").xhtml){
		formObj.append($('<input id="data" name="data" type="hidden"/>').val( $("#pageDrawResultDownload #divResultTable").xhtml()));
	}else{
		formObj.append($('<input id="data" name="data" type="hidden"/>').val( $("#pageDrawResultDownload #divResultTable").html()));
	}
	if(siteInfo.isApp){
		$.ajax({
			type: "POST",
			url:exportHelper.toFile,
			data:{
				app:"app", filetype:filetype, listname:$("#pageDrawResultDownload #lblResultTbResultName").text(), 
				data:$("#pageDrawResultDownload #divResultTable").xhtml?$("#pageDrawResultDownload #divResultTable").xhtml():$("#pageDrawResultDownload #divResultTable").html(),
			},
			dataType:"text",
			success:function(data, textStatus, jqXHR){
				var ref = window.open(exportHelper.loc + data, '_system'); 
			}
		});
		formObj.remove();		
		return false;
	}
	formObj.submit();
	formObj.remove();
	return false;
}
