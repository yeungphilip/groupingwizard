// JavaScript Document
var tmpl = {
	tbFieldRow:null	,
	listTbItem:{
		en:null,
		ch:null
	},
	listRunItem:null,
	listResultItem:{
		en:null,
		ch:null
	},
	listDrawResultItem:{
		en:null,
		ch:null
	},
	lblGroup:{
		en:"Group",
		ch:"組別"
	},
	lblPos:{
		en:"Pos.",
		ch:"位置"
	},
	lblPrize:{
		en:"Result No.",
		ch:"抽籤結果"
	},
	lblDraw:{
		en:"Draw",
		ch:"抽籤"
	},
	lblPrev:{
		en:"Prev.",
		ch:"上一個"
	},
	lblNext:{
		en:"Next",
		ch:"下一個"
	},
	lblDrawnPrize:{
		en:"Drawn",
		ch:"已抽出"
	},
	lblBoolYes:{
		en:"Yes",
		ch:"是"
	},
	lblBoolNo:{
		en:"No",
		ch:"否"
	},
	lblEditPrompt:{
		en:"Edit Content: ",
		ch:"修改內容："
	},
	lblInsertFieldConfirm:{
		en:"Insert a field?\n(Warning: Removing fields is not allowed.)",
		ch:"確定新增欄位？\n（* 不可刪除欄位）"
	},
	runIcon:{
		en:'<span class="divListRunIcon" style="float:right">&#x2714;Default</span>',
		ch:'<span class="divListRunIcon" style="float:right">&#x2714;預設使用</span>'
	},
	addThis:{
		en:'<div class="addthis_toolbox addthis_default_style"><a class="addthis_button_compact">Share</a><span class="addthis_separator">|</span><a class="addthis_button_favorites" title="Add to Favorites"></a><a class="addthis_button_email" title="Email"></a><a class="addthis_button_facebook" title="Facebook"></a><a class="addthis_button_google" title="Google Bookmark"></a><a class="addthis_button_sinaweibo" title="Sina Weibo"></a><a class="addthis_button_twitter" title="Twitter"></a><a class="addthis_button_google_plusone" g:plusone:annotation="none" title="Google +1"></a></div>',
		ch:'<div class="addthis_toolbox addthis_default_style"><a class="addthis_button_compact">分享</a><span class="addthis_separator">|</span><a class="addthis_button_favorites" title="加入「我的最愛」"></a><a class="addthis_button_email" title="電郵"></a><a class="addthis_button_facebook" title="Facebook"></a><a class="addthis_button_google" title="Google 書籤"></a><a class="addthis_button_sinaweibo" title="新浪微博"></a><a class="addthis_button_twitter" title="Twitter"></a><a class="addthis_button_google_plusone" g:plusone:annotation="none" title="Google +1"></a></div>'
	},
	title:{
		en:"Grouping Wizard - a lucky draw and grouping tool",
		ch:"《勁抽》- 分組抽籤易"
	}
};
var importHelper = {
	fromFile2:"http://diy.fwg.hk/groupingwizard/ajax/importfromupload2.php",// (using file api)
	fromFile3:"http://diy.fwg.hk/groupingwizard/ajax/importfromupload3.php",// (using file api)
	fromWeb:"http://diy.fwg.hk/groupingwizard/ajax/importfromweb.php",
	fromFile:"../ajax/importfromupload.php",
	sampleDomain:"http://diy.fwg.hk/groupingwizard/",
	validExt: /.((txt)|(xls)|(csv)|(xlsx))$/i,
	fileObj:null
};
var exportHelper = {
	toFile:"http://diy.fwg.hk/groupingwizard/ajax/export.php",
	loc:"http://diy.fwg.hk/groupingwizard/ajax/",
	tbObj:null
};
var siteInfo = {
	version: null,
	isApp: false, // turn off if not using phonegap,
	isAppIOS: false,
	iOS:false,
	android:false,
	contentEditable:true
};
var addthis_config = {
	 ui_language: "zh-tw",
	 data_track_clickback:false
};
var addthis_share = {
	url:"http://diy.fwg.hk/groupingwizard",
	title:"《勁抽》- 分組抽籤易 | Grouping Wizard - a lucky draw and grouping tool"
};
var addthis_localize = {
	share_caption: "分享 Share",
	email_caption: "電郵 Email",
	more: "更多 More" 
}; 
/*$(function() {
	PreloadTemplate();
});*/

function PreloadTemplate_ajax(opts, tmplVal, lang){
	var ajaxOption =  $.extend( {
		async: false,
		dataType: "html",
		type: "GET",
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		success: function(data){
		  			var dataObj = $("<div />").append(data);
					$("title, meta", dataObj).remove();
					tmplVal[lang] = dataObj.html();
				}
	  }, opts);
	$.ajax(ajaxOption);
}
function PreloadTemplate(){
	//tmpl.listTbItem = $("#divList").html();
	PreloadTemplate_ajax(
	  {url: "listmenu_item_ch2.html"}, 
	  tmpl.listTbItem, "ch");
	PreloadTemplate_ajax(
	  {url: "listmenu_item_en.html"}, 
	  tmpl.listTbItem, "en");
	PreloadTemplate_ajax(
	  {url: "resultmenu_item_en.html"}, 
	  tmpl.listResultItem, "en");
	PreloadTemplate_ajax(
	  {url: "resultmenu_item_ch2.html"}, 
	  tmpl.listResultItem, "ch"); 
	PreloadTemplate_ajax(
	  {url: "drawresultmenu_item_en.html"}, 
	  tmpl.listDrawResultItem, "en");
	PreloadTemplate_ajax(
	  {url: "drawresultmenu_item_ch.html"}, 
	  tmpl.listDrawResultItem, "ch"); 
	
	tmpl.listRunItem ='<div class="divRunItem"><a href="runconfig.html?tid=" data-role="button" data-theme="a">List Name</a></div>';
	tmpl.tbFieldRow = '<tr><th>#</th><td><input type="radio" name="radNameField" class="radNameField" value="f0" data-role="none" /></td><td><input type="checkbox" name="chkCriteriaField" class="chkCriteriaField" value="f0" data-role="none" /></td><td><input type="checkbox" name="chkExportField" class="chkExportField" value="f0" data-role="none" /></td></tr>';
	
	$.ajax({
		url: "../config.xml",
		async: false,
		dataType: "xml",
		type: "GET",
		success: function(xml){
			try{
				siteInfo.version = $(xml).find("widget").attr("version");
			}catch(err){siteInfo.version ="";}
		}
	});
}
PreloadTemplate();

// PhoneGap is loaded and it is now safe to call PhoneGap methods
//
function onDeviceReady() {
	// Register the event listener
	document.addEventListener("backbutton", onBackKeyDown, false);
	if(siteInfo.isApp && $.inArray(device.platform, ["iOS", "iPad", "iPhone", "iPad Simulator", "iPhone Simulator" ]) >-1){
		siteInfo.isAppIOS = true;
	}
}

// Handle the back button
//
function onBackKeyDown() {
	if($(".btnBack:visible").length>0){
		$(".btnBack:visible").click();
	} else if($.mobile.activePage){
		if($.mobile.activePage.attr("id") == "pageMainMenu"){
			$.appFunc.quit();
		}
	}
}


$(function() {
	try{
		if(PhoneGap){
			siteInfo.isApp = true;	
		}
	}catch(err){}
	try{
		if(siteInfo.isApp == false){
			if(cordova){
				siteInfo.isApp = true;	
			}
		}
	}catch(err){}
	try{
		if(siteInfo.isApp == false){
			if(Cordova){
				siteInfo.isApp = true;	
			}
		}
	}catch(err){}
	if(siteInfo.isApp){
         if (typeof navigator.device == "undefined"){
              document.addEventListener("deviceready", onDeviceReady, false);
         } else {
        	 onDeviceReady();
         }
		//document.addEventListener("deviceready", onDeviceReady, false);
	}
	try{
		if (navigator.userAgent.match(/(iphone|ipod|ipad)/i) != null) {
	 		siteInfo.iOS = true;	
		} 
	}catch(err){}
	try{
		if (navigator.userAgent.match(/(android)/i) != null) {
	 		siteInfo.android = true;	
		} 
	}catch(err){}
	
	if(siteInfo.android || siteInfo.iOS || $.browser.opera){
		siteInfo.contentEditable = false;
	}
	/* main menu */
	$("#btnRun").live("click", ClickRun);
	$("#btnDraw").live("click", ClickDraw);
	
	/* list menu  */
	$("#divList .btnDeleteList").live("click", DeleteListFromStorage);
	$("#divList .btnUseList").live("click", SetUseList);
	
	/* new list simple */
	$("#btnCreateListWithNumber").live("click", CreateListWithNumber);
	$("#btnCreateListWithNames").live("click", CreateListWithNames);
	
	/* new list import */
	$("#btnImportFile").live("click", ImportListFromFile);
	$("#btnImportFile1").live("click", ImportListFromUpload);
	$("#btnImportFile2").live("click", ImportListFromWeb);
	$("#fileImport").live("change", ImportListFromUpload_FileSelect);
	//$("#fileiframe").live("load", ImportListFromUpload2);
	/* new list import - drag and drop handler */
	
	$("#divDragFile").live("dragenter", ImportListFromUpload_DragEnter);
	$("#divDragFile").live("dragover", ImportListFromUpload_DragOver);
	$("#divDragFile").live("drop", ImportListFromUpload_DropFile);
	
	/* new table */
	$("#btnSaveNewList").live("click", SaveNewList);
	
	/* list setting */
	$("#txtNoOfGroup, #txtMaxGroupSize").live("change", UpdateHasGroup);
	$("#divFieldSetting .chkCriteriaField").live("change", SelectCriteriaField);
	$("#btnSaveSettings").live("click", SaveSettings);
	
	/* list table */
	$('#pageDataTable #divDataTable th, #pageDataTable #divDataTable td').live("click", ListTableStartEdit);
	if(!siteInfo.contentEditable){
	} else if($.browser.msie){
		$('#pageDataTable #divDataTable th .ieContent, #pageDataTable #divDataTable td .ieContent').live("paste blur", ListTableEditTextFix);
	}else {$('#pageDataTable #divDataTable th, #pageDataTable #divDataTable td').live("paste blur", ListTableEditTextFix);}
	
	$("#pageDataTable .btnSaveTable").live("click", SaveTableData);
	$("#pageDataTable .btnDelRow").live("click", ListTableDelRow);
	$("#pageDataTable .btnInsertRowAbove").live("click", ListTableInsertRowAbove);
	$("#pageDataTable .btnInsertRowBelow").live("click", ListTableInsertRowBelow);
	$("#pageDataTable .btnCloseRowMenu").live("click", ListTableCloseRowMenu);
	$("#pageDataTable .btnNewField").live("click", ListTableInsertField);
	
	/* list action */
	$("#pageListAction .btnDeleteList").live("click", ListAction_DeleteListFromStorage);
	$("#pageListAction .btnUseList").live("click", ListAction_SetUseList);
	
	/* draw config */
	$("#pageDrawConfig #sliderDrawRepeat").live("change", ChangeDrawRepeat);
	$("#pageDrawConfig #btnDrawStart").live("click", ClickDrawStart);
	
	/* draw */
	//$("#btnTerminate").live("click", TerminateAnimation);
	$("#pageDrawRun #btnSkip").live("click", SkipAndShowDrawResult);
	$("#pageDrawRun #btnSkip2").live("click", SkipAndShowDrawResult2);
	$("#pageDrawRun #btnReplay").live("click", ReplayDrawResult);
	
	
	/* draw menu */
	$("#pageDrawResultMenu #ulHistoryList .linkHistoryListItem").live("click", ViewDrawResultPage);
	$("#pageDrawResultMenu #ulHistoryList .linkHistoryListDelete").live("click", DeleteDrawResultFromStorage);
	
	/* draw result */
	$("#pageDrawResultTable #btnDownload").live("click", DownloadDrawResult);
	
	/* draw result download */
	$("#pageDrawResultDownload .btnDownloadFile").live("click", DownloadDrawResultFile);
	
	/* run config */
	$("#pageRunConfig #btnRunStart").live("click", ClickRunStart);
	
	/* run */
	$("#btnTerminate").live("click", TerminateAnimation);
	$("#pageRun #btnSkip").live("click", SkipAndShowResult);
	$("#pageRun #btnSkip2").live("click", SkipAndShowResult2);
	$("#pageRun #btnReplay").live("click", ReplayResult);
	
	/* result menu */
	$("#pageResultMenu #ulHistoryList .linkHistoryListItem").live("click", ViewResultPage);
	$("#pageResultMenu #ulHistoryList .linkHistoryListDelete").live("click", DeleteResultFromStorage);
	
	/* result */
	$("#pageResultTable #ddlShowGroup").live("change", ChangeShowGroup);
	$("#pageResultTable #btnResetSort").live("click", ResetGroupResultSort);
	$("#pageResultTable #btnDownload").live("click", DownloadResult);
	
	
	/* result download */
	$("#pageGroupResultDownload .btnDownloadFile").live("click", DownloadResultFile);
	
	$('div').live('pagehide', function(event, ui){
		  var page = jQuery(event.target);
		  page.remove();
	});
	
	if(siteInfo.isApp){
		if($("#socialToolbar").length > 0){
			$("#socialToolbar").empty().hide();
		}
	}

});
/** all page *******************************************************/
$('div[data-role="page"]').live('pagebeforeshow', function(event, ui) {
	var lang=getLang();
	$.LangData("update", lang);
	if(siteInfo.isApp==false){
		if($("#socialToolbar .addthis_toolbox").length == 0){
			updateSocialToolbar(lang);
		} else if($("#socialToolbar").data("lang") != lang){
			updateSocialToolbar(lang);
		}
	} else {
		$("#socialToolbar").empty().hide();
	}
});
function updateSocialToolbar(lang){
	if(siteInfo.isApp==false){
	  try{
		if(cordova){
			$("#socialToolbar").empty();
			return;
		}
	  }catch(err){}
	  try{
		try{
			$("#socialToolbar").empty();
			if(addthis){
				addthis = null;
				_adr = null;
				_atc = null;
				_atd = null;
				_ate = null;
				_atr = null;
				_atw = null;
			}
		}catch(err1){}
		
		$("#socialToolbar").append(tmpl.addThis[lang]);
		addthis_share.title = tmpl.title[lang];
		if(lang=="ch"){
			addthis_config.ui_language = "zh-tw";
			addthis_localize = {
			  share_caption: "分享",
			  email_caption: "電郵",
			  more: "更多" 
			}; 
			
		}else{
			addthis_config.ui_language = "en";
			addthis_localize = {
			  share_caption: "Share",
			  email_caption: "Email",
			  more: "More" 
			}; 
		}
		$.getScript('http://s7.addthis.com/js/250/addthis_widget.js#pubid=diyfwghk&amp;async=1');
	
		//addthis.init();
		$("#socialToolbar").data("lang", lang);
	  }catch(err){}
	} else {
		$("#socialToolbar").empty();
	}
}
/** home *******************************************************/
$('#pageMainMenu').live('pageinit', function() {
	var listID = $.RunListID("get");
	var nolist = false;
	if(listID == null) {
		nolist = true;
	}
	else {
		var listData = $.TableData("get", {id:listID});
		if(listData != null) {
		}
		else{
			nolist = true;
			$.RunListID("delete");
		}
	}
	if(nolist){
		$(".nolist").show();
		$("#btnRun, #btnDraw").hide();
	}
});
function ClickRun(){
	$.mobile.showPageLoadingMsg();
	var listID = $.RunListID("get");
	if(listID == null) {
		$.appFunc.alert("No active list");
	} else {
		var lang = getLang();
		$.mobile.changePage("runconfig_"+lang+".html?tid="+listID);
	}
	$.mobile.hidePageLoadingMsg();	
}
function ClickDraw(){
	$.mobile.showPageLoadingMsg();
	//$("#btnDraw").button("disable");
	var listID = $.RunListID("get");
	if(listID == null) {
		$.appFunc.alert("No active list");
	} else {
		var lang = getLang();
		$.mobile.changePage("drawconfig_"+lang+".html?tid="+listID);
	}
	$.mobile.hidePageLoadingMsg();	
}
/** new list simple **********************************************************/
$('#pageInfo').live('pageinit', function() {
	$('#pageInfo #spanVersion').text(siteInfo.version);
	if(siteInfo.isApp){
		$("#pageInfo a.extlink").each(function(){
				var href=$(this).attr("href");
				/*$(this).attr({
					"rel":"external"});*/
				var newhref = href;
				$(this).attr({
					"newhref":newhref,
					"href": newhref}).bind("click", 
					function(){var ref = window.open($(this).attr("newhref"), '_system'); return false;});
		});
	}
});
/** list menu  *************************************************/

$('#pageListMenu').live('pageinit', function() {
	LoadListsFromStorage();
});


function LoadListsFromStorage(){
	$("#divList").empty();
	var hasDefault = false;
	var lang = getLang();
	var runID = $.RunListID("get");
	var lists = $.TableData("list", null,
			function(data){
				$("#txtLog").val("show list item");
				var listNode = $(tmpl.listTbItem[lang]);
				$(".divListHeader", listNode).text(data.name);
				$(".spanPeople", listNode).text(data.people);
				$(".spanFields", listNode).text(data.fields);
				$(".spanTotalGroups", listNode).text((data.totalGroup==0)?getAutoText():data.totalGroup);
				$(".spanGroupSize", listNode).text((data.groupSize==0)?getAutoText():data.groupSize);
				$(".spanCreateAt", listNode).text($.format.date(new Date(data.createDate), "yyyy-MM-dd HH:mm"));
				$(".spanUpdateAt", listNode).text($.format.date(new Date(data.updateDate), "yyyy-MM-dd HH:mm"));
				$(".btnViewList", listNode).attr("href", "listtable_"+lang+".html?tid="+data.id);
				$(".btnEditSettings", listNode).attr("href", "listsetting_"+lang+".html?tid="+data.id);
				$(".btnListAction", listNode).attr("href", "listaction_"+lang+".html?tid="+data.id);
				listNode.appendTo("#divList").data("id", data.id);
				if(runID == data.id){hasDefault = true;}
			});
	if($("#divList .divListItem").length == 0) {
		$(".nolist").show();
	} else {
		$(".nolist").hide();
	}
	if($("#divList .divListItem").length == 1) {
		$("#divList .divListItem").attr("data-collapsed", "false");
		$.RunListID("update", $("#divList .divListItem").data("id"));
	}
	else if(hasDefault==false){
		$.RunListID("update", $("#divList .divListItem:first").data("id"));
	}
	
	try{
		//$("#pageListMenu").page('refresh');
		$("#divList .divListItem").collapsible();
		$("input, a[data-role='button']", "#divList .divListItem").button();
	}catch(err){}
	try{
		
		$("#divList .divListItem").each(function(){
			if($.RunListID("get") == $(this).data("id")){
				$("h3 .ui-btn-text", this).prepend(tmpl.runIcon[lang]);
				//$(".divListRunIcon").button();
				return false;
			}
		});
	} catch(err){ }
}
function DeleteListFromStorage(){
	$.mobile.showPageLoadingMsg();
	var list = $(this).parents(".divListItem");
	if(list.length > 0){
		var listID = $(list).data("id");
		$.TableData("delete", {id:listID});
		LoadListsFromStorage();
	}
	$.mobile.hidePageLoadingMsg();	
}
function SetUseList(){
	var list = $(this).parents(".divListItem");
	var lang = getLang();
	if(list.length > 0){
		var listID = $(list).data("id");
		$.RunListID("update", listID);
		$(".divListRunIcon").remove();
		$("h3 .ui-btn-text", list).prepend(tmpl.runIcon[lang]);
		//$(".divListRunIcon").button();
	}
	// change
}



/** new list simple **********************************************************/
$('#pageNewListSimple').live('pageinit', function() {
	$('#pageNewListSimple #divCreateList').show();
	$('#pageNewListSimple #divSaveList').hide();
});

function CreateListWithNumber(){
	$.mobile.showPageLoadingMsg();
	var arr = [];
	var listMax = parseInt($("#sliderCreateListEndNumber").val(),10);
	for(var i=1; i<=listMax; i++) {arr.push(i);}
	CreateTable("Number", arr);
	LoadNewTable();
	var listname = "Numbers (1 to "+listMax+")";
	$("#pageNewListSimple #divSaveList #txtNewListName").val(listname);
	$.mobile.hidePageLoadingMsg();	
}
function CreateListWithNames(){
	$.mobile.showPageLoadingMsg();
	var nameString = $("#txtCreateListAllNames").val();
	nameString = nameString.replace(/[\n]{2,}/g,"\n");
	nameString = nameString.replace(/(^[\n]+)|([\n]+$)/g, "");
	if(nameString != ""){
		var arr = nameString.split("\n");
		CreateTable("Name", arr);
		LoadNewTable();
		var listname = arr.join(", ");
		if(listname.length > 10){
			listname = listname.substr(0,9)+"...";
		}
		listname = "Name List ("+listname+")";
		$("#pageNewListSimple #divSaveList #txtNewListName").val(listname);
	}
	$.mobile.hidePageLoadingMsg();	
	$("#txtCreateListAllNames").val("");
}
function CreateTable(fieldNames, data){
	var table = $('<table cellspacing="0" cellpadding="0" border="0"><thead><tr /></thead><tbody /></table>');
	if($.isArray(fieldNames)){ // 2d / multi-fields
		$.each(fieldNames, function(index, value){
			$("thead tr", table).append($("<th />").text(value));
		});
		$.each(data, function(index, rowValue){
			var tr = $("<tr />");
			$.each(rowValue, function(index2, value){
				tr.append($("<td />").text(value));
			});
			$("tbody", table).append(tr);
		})
	}
	else { // 1d / single-field
		$("thead tr", table).append($("<th />").text(fieldNames));
		$.each(data, function(index, value){
			var td = $("<td />").text(value);
			$("tbody", table).append($("<tr />").append(td));
		});
	}
	$('#pageNewListSimple #divNewDataTable').empty().append(table);
	$('#pageNewListSimple #divCreateList').hide();
	$('#pageNewListSimple #divSaveList').show();
}
/** new list import **********************************************************/
$('#pageNewListImport').live('pageinit', function() {
	if (siteInfo.iOS || siteInfo.android || siteInfo.isApp) {
	 	//iOS or android
		$(".notforios").hide();
	} 
	$('#pageNewListImport #divCreateList').show();
	$('#pageNewListImport #divSaveList').hide();
	$("#fileiframe").bind("load", ImportListFromUpload2);
	if(siteInfo.isApp){
		$("#pageNewListImport .divSupportType a").each(function(){
				var href=$(this).attr("href");
				var newhref = href.replace(/^\.\.\//, importHelper.sampleDomain);
				$(this).attr({
					"newhref":newhref,
					"href": newhref}).bind("click", 
					function(){var ref = window.open($(this).attr("newhref"), '_system'); return false;});
		})
	}
	try{
		var xhr = new XMLHttpRequest();  
		//$.canDrop() && $.canDragEnter() 
		if( window.File && window.FileList && window.FileReader && xhr.upload){
			$("#pageNewListImport .lblDragfile").show();
			$("#pageNewListImport .lblSelectfile").hide();
		}
	}catch(err){ }
	importHelper.fileObj = null;

});
function ImportListFromFile(){
	$.mobile.showPageLoadingMsg();
	$.get('../ajax/import.html', function(data) {
		
		$('#pageNewListImport #divNewDataTable').empty().append(data);
		$('#pageNewListImport #divCreateList').hide();
		$('#pageNewListImport #divSaveList').show();
		LoadNewTable();
		//$.mobile.changePage("#pageSaveList");
		$.mobile.hidePageLoadingMsg();	
	}, "html");
}
function ImportListFromUpload(){
	if(importHelper.fileObj != null){
		// use file api
		ImportListFromUpload_AjaxUpload(importHelper.fileObj);
	} 
	else{
		if($("#fileImport").val() != null){
			if(importHelper.validExt.test($("#fileImport").val())){
				$.mobile.showPageLoadingMsg();
				$("#formImport").attr("action", importHelper.fromFile).submit();
			} else {
				$(".errorMsg", "#formImport").show();
			}
		}
	}
}
function ImportListFromUpload2(){
	if($("#fileiframe").contents().find("table").length > 0){
		$('#pageNewListImport #divNewDataTable').empty().append(
			$("#fileiframe").contents().find("table")
		);
		var filename = $("#fileImport").val().replace(/^.*[\\\/]/, '');
		if(filename != ""){
			$("#pageNewListImport #divSaveList #txtNewListName").val(filename);
		}
		$('#pageNewListImport #divCreateList').hide();
		$('#pageNewListImport #divSaveList').show();
		$("#formImport").each(function(){this.reset();});
		LoadNewTable();
		$.mobile.hidePageLoadingMsg();	
	}
}
function ImportListFromWeb(){
	
	var url = $.trim($("#txtImportFromWeb").val());
	$("#txtImportFromWeb").val(url);
	if((url != "") && (url != "http://")){
		if($.appFunc.hasNetwork()){
			$.mobile.showPageLoadingMsg();
			$.ajax({
			  url: importHelper.fromWeb,
			  data: {fileurl:url},
			  dataType: "html",
			  type: "POST",
			  success: 	function(data, textStatus, XMLHttpRequest){
				  			//alert(textStatus);
							$('#pageNewListImport #divNewDataTable').empty().append(data);
							var linkname = $("#txtImportFromWeb").val().replace(/^.*[\\\/]/, '');
							if(linkname != ""){
								$("#pageNewListImport #divSaveList #txtNewListName").val(linkname);
							}
							$('#pageNewListImport #divCreateList').hide();
							$('#pageNewListImport #divSaveList').show();
							LoadNewTable();
							//$.mobile.changePage("#pageSaveList");
							$.mobile.hidePageLoadingMsg();	
						},
			  error: 	function(){
							$.appFunc.alert("error!");
							$.mobile.hidePageLoadingMsg();
						}
			});	
		} else {
			$.appFunc.alert("No Network!");
		}
	}
}
function ImportListFromUpload_FileSelect(event){
	$(".errorMsg", "#formImport").hide();
	var filename = $("#fileImport").val().replace(/^.*[\\\/]/, '');
	try{
		var files = event.originalEvent.target.files;
		if(files.length == 1) {
			importHelper.fileObj = files[0];
			filename = files[0].name;
		}
	}catch(err){
		//alert("File API is not support");
	}
	if(filename != ""){
		$("#pageNewListImport #lblSelectedPath").text(filename);
		$("#pageNewListImport #lblSelectedFile").show();
	}
}
/** new list import - drag and drop file *************************************/
function ImportListFromUpload_DragEnter(event){
	event.stopPropagation();  
	event.preventDefault();  
}
function ImportListFromUpload_DragOver(event){
	event.stopPropagation();  
	event.preventDefault();  
}

function ImportListFromUpload_DropFile(event){
	event.stopPropagation();  
	event.preventDefault();  
	$(".errorMsg", "#formImport").hide();
	var files = event.originalEvent.dataTransfer.files;  
	if(files.length == 1)
	{
		importHelper.fileObj = files[0];
		$("#pageNewListImport #lblSelectedPath").text(files[0].name);
		$("#pageNewListImport #lblSelectedFile").show();
		//ImportListFromUpload_AjaxUpload(files[0])
	}
}
function ImportListFromUpload_AjaxUpload(file){
	if(importHelper.validExt.test(file.name)){
		$(".errorMsg", "#formImport").hide();
		if($.appFunc.hasNetwork()){
			var reader = new FileReader();
			$.mobile.showPageLoadingMsg(); 
			reader.onload = ImportListFromUpload_AjaxUpload_shipoff;
			reader.readAsDataURL(importHelper.fileObj);
		} else {
			$.appFunc.alert("No Network!");
		}
	} else {
		$(".errorMsg", "#formImport").show();
	}
}
function ImportListFromUpload_AjaxUpload_shipoff(event) {
    var result = event.target.result.replace(/data:.*;base64,/, '');
    var fileName = importHelper.fileObj.name; //Should be 'picture.jpg'
	$.ajax({
		  url: importHelper.fromFile3,
		  data: {filedata: result, filename: fileName},
		  dataType: "html",
		  type: "POST",
		  success: 	function(data){
						$('#pageNewListImport #divNewDataTable').empty().append(data);
						var linkname = fileName.replace(/^.*[\\\/]/, '');
						if(linkname != ""){
							$("#pageNewListImport #divSaveList #txtNewListName").val(linkname);
						}
						$('#pageNewListImport #divCreateList').hide();
						$('#pageNewListImport #divSaveList').show();
						LoadNewTable();
						//$.mobile.changePage("#pageSaveList");
						$.mobile.hidePageLoadingMsg();	
					},
		  error: 	function(){
						$.appFunc.alert("error!");
						$.mobile.hidePageLoadingMsg();
					}
		});	
}

function ImportListFromUpload_AjaxUpload_old(file){
	if(importHelper.validExt.test(file.name)){
		$(".errorMsg", "#formImport").hide();
		var xhr = new XMLHttpRequest();  
        if (xhr.upload) { 
			$.mobile.showPageLoadingMsg(); 
			// file received/failed
			xhr.onreadystatechange = function(e) {
				if (xhr.readyState == 4) {
					if(xhr.status != 200){
						$.appFunc.alert("error"+xhr.status);
						return;
					}
					// call back
					$('#pageNewListImport #divNewDataTable').empty().append(xhr.responseText);
					var linkname = file.name.replace(/^.*[\\\/]/, '');
					if(linkname != ""){
						$("#pageNewListImport #divSaveList #txtNewListName").val(linkname);
					}
					$('#pageNewListImport #divCreateList').hide();
					$('#pageNewListImport #divSaveList').show();
					LoadNewTable();
					//$.mobile.changePage("#pageSaveList");
					$.mobile.hidePageLoadingMsg();	
				}
			};
			// start upload  
			xhr.open("POST", importHelper.fromFile2, true);  
			xhr.setRequestHeader("X_FILENAME", file.name);  
			xhr.send(file);  
		}
	} else {
		$(".errorMsg", "#formImport").show();
	}
}
/** new table ****************************************************************/

function LoadNewTable(){
	ProcessNewTable();
}
function ProcessNewTable(){
	if($("#divNewDataTable table thead tr th:first").text() != "#"){
		$("#divNewDataTable table thead tr").prepend("<th>#</th>");
		$("#divNewDataTable table tbody tr").prepend(function(index){
			return "<td>"+(index+1)+"</td>";
		});
	}
}
function SaveNewList(){
	$.mobile.showPageLoadingMsg();
	if($("#txtNewListName").val() != "") {
		var exportFields= [];
		for(var f=0; f<$("#divNewDataTable table thead tr th").length; f++){
			exportFields.push("f"+f);
		}
		var newListName = $("#txtNewListName").val();
		var i=1;
		var testNameExist = false;
		do{
			testNameExist = false;
			i=i+1;
			$.TableData("list", null,
			function(data){
				if(data.name == newListName) {
					testNameExist = true;
					newListName = $("#txtNewListName").val() + " _"+i;
				}
			});
		}while(testNameExist)
		
		var listData = $.TableData("insert", {
					name: newListName,
					people: $("#divNewDataTable table tbody tr").length,
					fields: $("#divNewDataTable table thead tr th").length - 1,
					totalGroup: 0,
					exportFields:exportFields,
					groupSize: Math.min(5, $("#divNewDataTable table tbody tr").length),
					tbListHTML:$("#divNewDataTable").html()
				});
		if(listData != null) {
			$.appFunc.alert("Saved");
			if($.TableData("list").length == 1){
				$.RunListID("update", listData.id);
			}
		}
		var lang = getLang();
		$.mobile.changePage("listsetting_"+lang+".html?tid="+listData.id);
		$.mobile.hidePageLoadingMsg();
	}
	//LoadListsFromStorage(); 
	//LoadListFromStorage(listData.id);
	//$('#pageNewListSimple #divCreateList').show();
	//$('#pageNewListSimple #divSaveList').hide();
	
}

/** list setting **********************************************************/
$('#pageListSetting').live('pageinit', function() {
});
$('#pageListSetting').live('pagebeforeshow', function(event, ui) {
	var vars = getUrlVars(); 
	var listID = vars["tid"];
	ViewListNavBar(listID);
	UpdateDefault(listID);
	LoadListSettingFromStorage(listID);
});
function LoadListSettingFromStorage(listID){
	var listData = $.TableData("get", {id:listID});
	if(listData != null) {
		$('#pageListSetting #divDataTable').empty().append(listData.tbListHTML);
		LoadTable();
		$("#pageListSetting #lblListID").val(listData.id);
		$('#pageListSetting .lblListName').text(listData.name);
		$("#pageListSetting #txtListName").val(listData.name);
		$("#pageListSetting #txtNoOfGroup").val(listData.totalGroup);
		$("#pageListSetting #txtMaxGroupSize").val(listData.groupSize);
		$("#pageListSetting #divFieldSetting .radNameField").selectedValue(listData.nameField);
		$("#pageListSetting #divFieldSetting .chkCriteriaField").selectedValueMultiple(listData.criteriaFields);
		$("#pageListSetting #divFieldSetting .chkExportField").selectedValueMultiple(listData.exportFields);
		
		UpdateHasGroup();
		SelectCriteriaField();
		$("#pageListSetting .spanPeople").text(listData.people);
		$("#pageListSetting .spanFields").text(listData.fields);
		
	}
}

function LoadFieldSetting(){
	$("#divFieldSetting table tbody").empty();
	$("#pageListSetting #divDataTable table thead tr th").each(function(index){
		var trField = $(tmpl.tbFieldRow);
		$("th", trField).text(index+": "+$(this).text());
		$("input", trField).val("f"+index);
		$("#divFieldSetting table tbody").append(trField);
	});
	$("#divFieldSetting .radNameField").mustSelect();
	$("#divFieldSetting .chkExportField").check(true);
}
function SelectCriteriaField() {
	if($("#divFieldSetting .chkCriteriaField:checked").length >= 1){ // should be 2
		$("#divFieldSetting .chkCriteriaField:not(:checked)").disable(true);
	} else {
		$("#divFieldSetting .chkCriteriaField").disable(false);
	}
}
function UpdateHasGroup(){
	var totalRow = $("#pageListSetting #divDataTable table tbody tr").length;
	var group = Math.max(0,$("#txtNoOfGroup").getInt());
	var groupSize = Math.max(0,$("#txtMaxGroupSize").getInt());
	
	if(group == 0 && groupSize == 0) {
		$("#txtNoOfGroup").val(getAutoText());
		$("#txtMaxGroupSize").val(getAutoText());
		$("#lblMaxHasGroup").text("--");
	} else if(group == 0) {
		$("#lblMaxHasGroup").text(Math.ceil(totalRow/groupSize)*groupSize);
		$("#txtNoOfGroup").val(getAutoText());
		$("#txtMaxGroupSize").val(groupSize);
	} else if(groupSize == 0) {
		$("#lblMaxHasGroup").text(Math.ceil(totalRow/group)*group);
		$("#txtMaxGroupSize").val(getAutoText());
		$("#txtNoOfGroup").val(group);
	} else {
		$("#txtNoOfGroup").val(group);
		$("#txtMaxGroupSize").val(groupSize);
		$("#lblMaxHasGroup").text(group*groupSize);
	}
}
function SaveSettings(){
	$.mobile.showPageLoadingMsg();
	var result = null;
	var listData = $.TableData("get", {id:$("#pageListSetting #lblListID").val()});
	if(listData != null) {
		if($("#txtListName").val() != ""){
			listData.name = $("#txtListName").val();
		}
		listData.totalGroup = $("#pageListSetting #txtNoOfGroup").getInt();
		listData.groupSize = $("#pageListSetting #txtMaxGroupSize").getInt();
		listData.nameField = $("#pageListSetting #divFieldSetting .radNameField").selectedValue();
		listData.criteriaFields = $("#pageListSetting #divFieldSetting .chkCriteriaField").selectedValueMultiple();
		listData.exportFields = $("#pageListSetting #divFieldSetting .chkExportField").selectedValueMultiple();
		if((listData.totalGroup == 0) && (listData.groupSize == 0)){
			if(getLang() == "ch") { $.appFunc.alert("「組數」 和 「每組最多人數」不能同時設定為「自動」！"); } 
			else { $.appFunc.alert('"No. of Group" and "Max. People in a Group" cannot be set both "auto"!'); }
		} else if(listData.exportFields.length < 1) {
			if(getLang() == "ch") { $.appFunc.alert("必須選擇最少1個「匯出欄」！"); } 
			else { $.appFunc.alert('"Export Field(s) are required!"'); }
		} else {
			result = $.TableData("update", listData);
		}
	}
	$.mobile.hidePageLoadingMsg();
	if(result != null) {
		$.appFunc.alert("Saved"); 
		$("#txtListName").val(listData.name);
		$(".lblListName").text(listData.name);
	}
}
/** list table **********************************************************/
$('#pageDataTable').live('pageinit', function() {
});
$('#pageDataTable').live('pagebeforeshow', function(event, ui) {
	var vars = getUrlVars(); 
	var listID = vars["tid"];
	ViewListNavBar(listID);
	UpdateDefault(listID);
	LoadListTableFromStorage(listID);
});
function LoadListTableFromStorage(listID){
	var listData = $.TableData("get", {id:listID});
	if(listData != null) {
		//alert(listData.tbListHTML);
		$('#pageDataTable #divDataTable').empty().append(listData.tbListHTML);
		//$('#divDataTable').append(listData.tbListHTML);
		LoadTable();
		$("#pageDataTable #lblListID").val(listData.id);
		$('#pageDataTable .lblListName').text(listData.name);
		$("#pageDataTable .spanPeople").text(listData.people);
		$("#pageDataTable .spanFields").text(listData.fields);
		
	}
	
}
function ListTableStartEdit(){
	if($(this).index() != 0){
		$("#pageDataTable #divTableRowHelper").hide();
		if(!siteInfo.contentEditable){
				// no need
		}
		else if($.browser.msie){
			var this_ieContent = $(".ieContent", this);
			$("th .ieContent, td .ieContent", '#pageDataTable #divDataTable').not(this_ieContent).removeAttr("contenteditable").parent("th, td").clearStyle();
		}else{
			$("th[contenteditable], td[contenteditable]", '#pageDataTable #divDataTable').not(this).removeAttr("contenteditable");
		}
		$("#pageDataTable #divDataTable tbody tr.toOp").removeClass("toOp");
		
		if(!siteInfo.contentEditable){
			var val = prompt(tmpl.lblEditPrompt[getLang()]+ "\""+$(this).text()+"\"", $(this).text());
			if(val==null){
				// press cancel
			}else{
				$(this).text(val);
			}
		}
		else if($.browser.msie){
			if($(".ieContent", this).length == 0){
				$(this).wrapInner('<div class="ieContent"></div>');
			}
			$(".ieContent", this).attr("contenteditable", true).focus();
		} else{
			$(this).attr("contenteditable", true).focus();
		}
	} else {
		if($(this).not("thead tr th").length > 0){
			if(!siteInfo.contentEditable){
				// no need
			} else if($.browser.msie){
				$("th .ieContent, td .ieContent", '#pageDataTable #divDataTable').parent("th, td").clearStyle();
			} else {
				$("th[contenteditable], td[contenteditable]", '#pageDataTable #divDataTable').removeAttr("contenteditable");
			}
			var parentTr = $(this).parent("#divDataTable tbody tr");
			$("#pageDataTable #divDataTable tbody tr.toOp").not(parentTr).removeClass("toOp");
			parentTr.toggleClass("toOp");
			if(parentTr.hasClass("toOp")){
				var position = $(this).offset();
				var offsetHeight = $("#pageDataTable #divTableRowHelper").height();
				$("#pageDataTable #divTableRowHelper").css({
					top:position.top-offsetHeight-5
					});
				$("#pageDataTable #divTableRowHelper").show();
			}
			else {
				$("#pageDataTable #divTableRowHelper").hide();
			}
		} else {
			ResetTable(false);
		}
	}
}
function ListTableEditTextFix(){
	$(this).clearStyle();
}
function ListTableDelRow(){
	if($("#pageDataTable #divDataTable tbody tr").length <= 1){
		$.appFunc.alert("error");
	} 
	else if($.appFunc.confirm("Are you sure to remove?")) {
		$("#pageDataTable #divTableRowHelper").hide();
		$("#pageDataTable #divDataTable tbody tr.toOp").remove();
		$("#divDataTable table tbody tr").each(function(index){
				$("td:first", this).text(index+1);
			});
	}	
}
function ListTableInsertRowAbove(){
	var tr = $("#pageDataTable #divDataTable tbody tr.toOp").clone();
	$("#pageDataTable #divDataTable tbody tr.toOp").before(tr);
	tr.removeClass("toOp");
	$("td", tr).empty();
	$("#divDataTable table tbody tr").each(function(index){
			$("td:first", this).text(index+1);
		});
}
function ListTableInsertRowBelow(){
	var tr = $("#pageDataTable #divDataTable tbody tr.toOp").clone();
	$("#pageDataTable #divDataTable tbody tr.toOp").after(tr);
	tr.removeClass("toOp");
	$("td", tr).empty();
	$("#divDataTable table tbody tr").each(function(index){
			$("td:first", this).text(index+1);
	  });

}
function ListTableCloseRowMenu(){
	$("#pageDataTable #divDataTable tbody tr.toOp").removeClass("toOp");
	$("#pageDataTable #divTableRowHelper").hide();
}
function ListTableInsertField(){
	ResetTable(false);
	if($.appFunc.confirm(tmpl.lblInsertFieldConfirm[getLang()])) {
		var th = $("<th />").appendTo($("#pageDataTable #divDataTable thead tr"));
		$("#pageDataTable #divDataTable tbody tr").append("<td />");
		th.text("Field "+th.index());
	}
}

function ResetTable(opt){
	$("#pageDataTable #divTableRowHelper").hide();
	$("#pageDataTable #divDataTable tbody tr.toOp").removeClass("toOp");
	if(!siteInfo.contentEditable){
		// no need
	}
	else if($.browser.msie){
		$("th .ieContent, td .ieContent", '#pageDataTable #divDataTable').removeAttr("contenteditable");
	}else{
		$("th[contenteditable], td[contenteditable]", '#pageDataTable #divDataTable').removeAttr("contenteditable");
	}
	if(opt == "all"){
		$("th, td", '#pageDataTable #divDataTable').clearStyle();
	}
}
function SaveTableData(){
	$.mobile.showPageLoadingMsg();
	ResetTable("all");
	var listID = $("#pageDataTable #lblListID").val();
	var listData = $.TableData("get", {id:listID});
	if(listData != null){
		listData.tbListHTML = $("#pageDataTable #divDataTable").html();
		listData.people = $("#pageDataTable #divDataTable table tbody tr").length;
		listData.fields = $("#pageDataTable #divDataTable table thead tr th").length - 1;
		result = $.TableData("update", listData);
		if(result != null) {
			LoadListTableFromStorage(listID);
			$.appFunc.alert("Saved"); 
		}
		$.mobile.hidePageLoadingMsg();
	}else {
		$.appFunc.alert("error!"); 
		$.mobile.changePage("listmenu_"+lang+".html");
		$.mobile.hidePageLoadingMsg();
	}
}
/** list action **********************************************************/
$('#pageListAction').live('pageinit', function() {
});
$('#pageListAction').live('pagebeforeshow', function(event, ui) {
	var vars = getUrlVars(); 
	var listID = vars["tid"];
	ViewListNavBar(listID);
	UpdateDefault(listID);
	LoadListActionFromStorage(listID);
});
function LoadListActionFromStorage(listID){
	var listData = $.TableData("get", {id:listID});
	if(listData != null) {
		//$('#divDataTable').append(listData.tbListHTML);
		//$("#pageListSetting #lblListID").val(listData.id);
		$('#pageListAction .lblListName').text(listData.name);
		$("#pageListAction .spanPeople").text(listData.people);
		$("#pageListAction .spanFields").text(listData.fields);
		
		var lang = getLang();
		$(".btnListRun").attr("href", "runconfig_"+lang+".html?tid="+listID);
		$(".btnListDraw").attr("href", "drawconfig_"+lang+".html?tid="+listID);
		$("#listID").val(listID);
		//$(".btnListAction").attr("href", "listaction_"+lang+".html?tid="+listID);
	}
}
function ListAction_DeleteListFromStorage(){
	if($.appFunc.confirm("Are you sure?")){
		$.mobile.showPageLoadingMsg();
		var listID = $("#listID").val();
		$.TableData("delete", {id:listID});
		var lang = getLang();
		$.mobile.changePage("listmenu_"+lang+".html");
		$.mobile.hidePageLoadingMsg();	
		$.appFunc.alert("Deleted!");
	}	
}
function ListAction_SetUseList(){
	var lang = getLang();
	var listID = $("#listID").val();
	$.RunListID("update", listID);
	UpdateDefault(listID);
	$.appFunc.alert("Set Default!");
}
/** view list (common) **********************************************************/
function UpdateDefault(listID){
	var lang = getLang();
	var defaultListID = $.RunListID("get");
	$(".divListRunIcon").remove();
	if(listID == defaultListID){
		$(".listNameBar").prepend(tmpl.runIcon[lang]);
	}
}
function LoadTable(){
	ProcessTable();
	if($("#pageListSetting").length > 0){
		LoadFieldSetting();
		$("#lblTotalRows").text($("#pageListSetting #divDataTable table tbody tr").length);
		UpdateHasGroup();
	}
}
function ProcessTable(){
	if($("#divDataTable table thead tr th:first").text() != "#"){
		$("#divDataTable table thead tr").prepend("<th>#</th>");
		$("#divDataTable table tbody tr").prepend(function(index){
			return "<td>"+(index+1)+"</td>";
		});
	}
}
function ViewListNavBar(listID){
	var lang = getLang();
	$(".btnListTable").attr("href", "listtable_"+lang+".html?tid="+listID);
	$(".btnListSetting").attr("href", "listsetting_"+lang+".html?tid="+listID);
	$(".btnListAction").attr("href", "listaction_"+lang+".html?tid="+listID);
}

/** google **********************************************************/

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-30148108-1']);
//_gaq.push(['_trackPageview']);

(function() {
var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

$('[data-role=page]').live('pageshow', function (event, ui) {
	try {
		_gaq.push(['_setAccount', 'UA-30148108-1']);
		hash = location.hash;
		if (hash) {
			_gaq.push(['_trackPageview', hash.substr(1)]);
		} else {
			_gaq.push(['_trackPageview']);
		}
	} catch(err) {

	}
});
