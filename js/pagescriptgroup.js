// JavaScript Document
/** run config ************************************************/
$('#pageRunConfig').live('pageinit', function() {
	//RunRandomGroup();
});
$('#pageRunConfig').live('pagebeforeshow', function(event, ui) {
	var vars = getUrlVars(); 
	var listID = vars["tid"];
	LoadRunInfo(listID);
});
function LoadRunInfo(listID){
	$("#pageRunConfig #listID").val(listID);
	var listData = $.TableData("get", {id:listID});
	if(listData != null) {
		$('#pageRunConfig #lblList').text(listData.name);
		$("#pageRunConfig #lblTotalRows").text(listData.people);
		$("#pageRunConfig #lblNoOfGroup").text((listData.totalGroup==0)?getAutoText():listData.totalGroup);
		$("#pageRunConfig #lblMaxGroupSize").text((listData.groupSize==0)?getAutoText():listData.groupSize);
		
		var group = listData.totalGroup;
		if(group == 0){
			group = Math.ceil(listData.people/listData.groupSize);
		}
		var groupSize = listData.groupSize;
		if(groupSize == 0){
			groupSize = Math.ceil(listData.people/listData.totalGroup);
		}
		
		if(!groupAnimations.all.canPlay(listData.people,group)){
			$("#pageRunConfig #radModeAll").checkboxradio('disable');
		}
		if(!groupAnimations.group.canPlay(listData.people,group, groupSize)){
			$("#pageRunConfig #radModeGroup").checkboxradio('disable');
		}
	}
}
function ClickRunStart(){
	//$.mobile.showPageLoadingMsg();
	//$("#btnRunStart").button("disable");
	var listID = $("#pageRunConfig #listID").val();
	var mode = $("input.radMode").selectedValue();
	if(mode=="none"){mode="";}
	if(listID == null) {
		// error
	} else {
		var lang = getLang();
		var resultID = RunRandomGroup(listID, mode);
		if(mode==""||mode==null){
			$.mobile.changePage("result_"+lang+".html?rid="+resultID);
		}else {
			$.mobile.changePage("grouprun_"+lang+".html?rid="+resultID+"&mode="+mode);
		}
	}
	$.mobile.hidePageLoadingMsg();	
}
function RunRandomGroup(listID, mode) {
	if(listID != null && listID != ""){
		var listData = $.TableData("get", {id:listID});
		if(listData != null) {
			if(listData.totalGroup == 0 && listData.groupSize == 0) {
				return;
			} else if(listData.exportFields.length == 0) {
				return;
			} else {
				$.mobile.showPageLoadingMsg();
				
				var tbList = $(listData.tbListHTML);
				var totalRow = listData.people;
				
				var group = listData.totalGroup;
				var groupSize = listData.groupSize;
				
				if(group == 0) {
					group = Math.ceil(totalRow/groupSize);
				} else if(groupSize == 0) {
					groupSize = Math.ceil(totalRow/group);
				}
				
				var randomObj = $("#pageRunConfig").randomGroups({
					totalGroup: group,
					groupSize: groupSize,
					nameField: listData.nameField,
					criteriaFields:listData.criteriaFields,
					exportFields:listData.exportFields,
					tbList:tbList
				});
				var resultID = null;
				if(randomObj != null)
				{
					var resultObj = {
						listName: listData.name,
						resultName: listData.name + " - " +$.format.date(new Date(), "yyyyMMdd"),
						totalGroup: group,
						groupSize: groupSize,
						totalPeople: totalRow,
						nameField: listData.nameField,
						criteriaFields:listData.criteriaFields,
						exportFields:listData.exportFields,
						resultNameField: randomObj.nameField,
						tbListHTML:listData.tbListHTML,
						resultListHTML:$(randomObj.tbResult).htmlOuter(),
						animation:mode
					};
					resultObj = $.GroupResultData("insert", resultObj);
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
/** run list dialog *******************************************/
$('#dialogRunList').live('pageinit', function() {
	LoadRunList();
});
function LoadRunList(){
	$("#dialogRunList #divRunList").empty();
	var lang = getLang();
	var lists = $.TableData("list", null,
			function(data){
				//$("#txtLog").val("show list item");
				var listNode = $(tmpl.listRunItem);
				listNode.appendTo("#divRunList");
				$("a", listNode).text(data.name);
				$("a", listNode).attr("href", "runconfig_"+lang+".html?tid="+data.id);
			});
	$("#dialogRunList #divRunList a[data-role='button']").button();
}
/** run *******************************************************/
$('#pageRun').live('pageinit', function() {
	$("#divCompletedButtons").hide();
});
$('#pageRun').live('pagebeforeshow', function(event, ui) {
	InitAnimation();
});
$('#pageRun').live('pageshow', function(event, ui) {
	PlayAnimation();	
});
function InitAnimation(){
	var vars = getUrlVars(); 
	var resultID = vars["rid"];
	var mode = vars["mode"];
	var lang = getLang();
	if(resultID != null){
		$("#pageRun #resultID").val(resultID);
	}
	if(mode == ""||mode==null){
		$.mobile.changePage("result_"+lang+".html?rid="+resultID);
	} else{
		if(mode == "all"){
			groupAnimations.all.prepare($.GroupResultData("get", {id:resultID}), lang);
		}
		else if(mode == "group"){
			groupAnimations.group.prepare($.GroupResultData("get", {id:resultID}), lang);
		}
		$("#pageRun #divShowAnimation").show();
		$("#pageRun #divPreAnimation").hide();
	}
}
function PlayAnimation(){
	var vars = getUrlVars(); 
	var mode = vars["mode"];
	if(mode == "all"){
		groupAnimations.all.play(AnimationCompleted);
	} else {
		groupAnimations.group.play(AnimationCompleted);
	}
}
function AnimationCompleted(){
	$("#divAnimationButtons").hide();
	$("#divCompletedButtons").show();
}
function TerminateAnimation(){
	var lang = getLang();
	$.mobile.changePage("home_"+lang+".html");
}
function SkipAndShowResult(){
	var lang = getLang();
	var resultID = $("#pageRun #resultID").val();
	$.mobile.changePage("result_"+lang+".html?rid="+resultID);
}
function SkipAndShowResult2(){
	var lang = getLang();
	var resultID = $("#pageRun #resultID").val();
	$.mobile.changePage("result_"+lang+".html?rid="+resultID);
}
function ReplayResult(){
	$("#pageRun #divShowAnimation").hide();
	$("#pageRun #divPreAnimation").show();
	$("#divCompletedButtons").hide();
	$("#divAnimationButtons").show();
	InitAnimation();
	PlayAnimation();	
	
}
/** group result menu  *************************************************/

$('#pageResultMenu').live('pageinit', function() {
	LoadResultsFromStorage();
});
function LoadResultsFromStorage(){
	$("#ulHistoryList").empty();
	var lang = getLang();
	var lists = $.GroupResultData("list", null,
			function(data){
				$("#txtLog").val("show result item");
				var listNode = $(tmpl.listResultItem[lang]);
				$(".lblResultName", listNode).text(data.resultName);
				$(".lblListName", listNode).text(data.listName);
				$(".lblTotalPeople", listNode).text(data.totalPeople);
				$(".lblTotalGroup", listNode).text(data.totalGroup);
				$(".lblGroupSize", listNode).text(data.groupSize);
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
function DeleteResultFromStorage(){
	$.mobile.showPageLoadingMsg();
	var result = $(this).parents("#ulHistoryList li");
	if(result.length > 0){
		var resultID = $(result).data("id");
		$.GroupResultData("delete", {id:resultID});
		LoadResultsFromStorage();
	}
	$.mobile.hidePageLoadingMsg();	
	return false;
}
function ViewResultPage(){
	$.mobile.showPageLoadingMsg();
	var lang = getLang();
	var result = $(this).parents("#ulHistoryList li");
	if(result.length > 0){
		var resultID = $(result).data("id");
		//LoadResultFromStorage(resultID);
		$.mobile.changePage("result_"+lang+".html?rid="+resultID);
	}
	$.mobile.hidePageLoadingMsg();	
	return false;
}
/** result table **********************************************************/
$('#pageResultTable').live('pageinit', function() {
	exportHelper.tbObj = null;
	if(siteInfo.isAppIOS && false){
		$("#pageResultTable #btnDownload").parents(".ui-btn").hide();
		$("#lblDownload").hide();
	}
});
$('#pageResultTable').live('pagebeforeshow', function(event, ui) {
	var vars = getUrlVars(); 
	var lang = getLang();
	var resultID = vars["rid"];
	LoadResultFromStorage(resultID);
	if(siteInfo.isAppIOS && false){
		//$("#pageResultTable #btnDownload").css("visibility", "hidden");
	} else {
		$("#pageResultTable #btnDownload").attr("href", "groupresultdownload_"+lang+".html?rid="+resultID);
	}
});
function LoadResultFromStorage(resultID){
	var lang = getLang();
	var resultData = $.GroupResultData("get", {id:resultID});
	if(resultData != null) {
		$("#pageResultTable #lblResultTbListName").text(resultData.listName);
		$("#pageResultTable #lblResultTbResultName").text(resultData.resultName);
		$("#pageResultTable #divResultTable").empty().append(resultData.resultListHTML);
		
		$("#pageResultTable #btnRunAgain").attr("href", "grouprun_"+lang+".html?rid="+resultData.id+"&mode="+resultData.animation);
		if(resultData.animation == ""){
			$("#pageResultTable #btnRunAgain").hide();
		}
		
		$("#pageResultTable #ddlShowGroup option[value!='']").remove();
		for(var i=1; i<= resultData.totalGroup; i++){
			$("#pageResultTable #ddlShowGroup").append("<option value='"+i+"'>"+tmpl.lblGroup[lang]+" "+i+"</option>");
		}
		$("#pageResultTable #ddlShowGroup").val("");
		if(lang != "en"){
			$("#pageResultTable table thead tr th").each(function(rIndex){
				if(rIndex == 0) {$(this).text(tmpl.lblGroup[lang]);}
				if(rIndex == 1) {$(this).text(tmpl.lblPos[lang]); return false;}
			});
		}
		$("#pageResultTable #divResultTable table").tablesorter({sortList: [[0,0], [1,0]]});  // sort the first 2 column in asc
	}
}
function ResetGroupResultSort(){
	// set sorting column and direction, this will sort on the first and third column the column index starts at zero 
	var sorting = [[0,0],[1,0]]; 
	// sort on the first column and third columns 
	$("#pageResultTable #divResultTable table").trigger("sorton",[sorting]); 
	// return false to stop default link action 
	return false; 
}
function DownloadResult(){
	var vars = getUrlVars(); 
	var lang = getLang();
	var resultID = vars["rid"];
	var trsVisible = $("#pageResultTable #divResultTable table tbody tr:visible").clone();
	exportHelper.tbObj = $("#pageResultTable #divResultTable table").clone();
	$("tbody", exportHelper.tbObj).empty();
	$("tbody", exportHelper.tbObj).append(trsVisible);
	$("table, tr, td, th", exportHelper.tbObj).removeAttr("class");
	$.mobile.changePage("groupresultdownload_"+lang+".html?rid="+resultID);
}
function ChangeShowGroup(){
	if($("#ddlShowGroup").val() == "") {
		$("#pageResultTable table tbody tr").show();
	} else {
		$("#pageResultTable table tbody tr").hide().filter(function(index) {
			return $('th:eq(0)', this).text() == $("#ddlShowGroup").val();
		}).show();
	}
}
/** result Download **********************************************************/
$('#pageGroupResultDownload').live('pageinit', function() {
	if(siteInfo.isAppIOS==true){
		$("#btnDownloadDoc, #btnDownloadHtml", "#pageGroupResultDownload").parent().remove();
	} 
});
$('#pageGroupResultDownload').live('pagebeforeshow', function(event, ui) {
	var vars = getUrlVars(); 
	var lang = getLang();
	var resultID = vars["rid"];
	$(".btnBack, #pageGroupResultDownload").attr("href", "result_"+lang+".html?rid="+resultID);
	LoadResultFromStorage2(resultID);
});
function LoadResultFromStorage2(resultID){
	var lang = getLang();
	var resultData = $.GroupResultData("get", {id:resultID});
	if(resultData != null) {
		$("#pageGroupResultDownload #lblResultTbListName").text(resultData.listName);
		$("#pageGroupResultDownload #lblResultTbResultName").text(resultData.resultName);
		if(exportHelper.tbObj != null){
			$("#pageGroupResultDownload #divResultTable").empty().append(exportHelper.tbObj);
		} else {
			$("#pageGroupResultDownload #divResultTable").empty().append(resultData.resultListHTML);
		}
		if(lang != "en"){
			$("#pageGroupResultDownload table thead tr th").each(function(rIndex){
				if(rIndex == 0) {$(this).text(tmpl.lblGroup[lang]);}
				if(rIndex == 1) {$(this).text(tmpl.lblPos[lang]); return false;}
			});
		}
	}
}
function DownloadResultFile(){
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
	$("#pageGroupResultDownload #divResultTable table").attr("border", "1");
	formObj.appendTo("#pageGroupResultDownload #divForms");
	formObj.append($('<input id="filetype" name="filetype" type="hidden"/>').val(filetype));
	formObj.append($('<input id="listname" name="listname" type="hidden"/>').val($("#pageGroupResultDownload #lblResultTbResultName").text()));
	if($("#pageGroupResultDownload #divResultTable").xhtml){
		formObj.append($('<input id="data" name="data" type="hidden"/>').val($("#pageGroupResultDownload #divResultTable").xhtml()));
	} else {
		formObj.append($('<input id="data" name="data" type="hidden"/>').val($("#pageGroupResultDownload #divResultTable").html()));
	}
	if(siteInfo.isApp){
		$.ajax({
			type: "POST",
			url:exportHelper.toFile,
			data:{
				app:"app", filetype:filetype, listname:$("#pageGroupResultDownload #lblResultTbResultName").text(), 
				data:$("#pageGroupResultDownload #divResultTable").xhtml?$("#pageGroupResultDownload #divResultTable").xhtml():$("#pageGroupResultDownload #divResultTable").html(),
			},
			dataType:"text",
			success:function(data, textStatus, jqXHR){
				var ref = window.open(exportHelper.loc + data, '_system'); 
			}
		});
		formObj.remove();		
		return false;
	}
	if(siteInfo.isAppIOS){
		setTimeout(function(){
			formObj.submit();
			formObj.remove();			
		}, 1000);
		return false;
	}
	formObj.submit();
	formObj.remove();
	return false;
}
