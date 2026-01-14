// JavaScript Document
$.fn.getInt = function() {
	if($(this).length > 0){ 
		try{
			var val = parseInt($(this).val());
			if (isNaN(val)) {val = 0;}
			return val;
		}catch(e){}
	}
	return 0;
};
$.fn.getIndex=function(){
	return $(this).parent().children().index($(this));
};
$.fn.getParentIndex=function(){
	var parentElem = $(this).parent();
	return $(parentElem).parent().children().index($(parentElem));
};
$.fn.selectedValue = function(a) {
	if(a==null) {
			if($(this).filter(":checked").length == 0){ return null; }
			else { return $(this).filter(":checked").val(); }
	}
	else {
		//$(this).filter("[value='"+a+"']").check(true);
		$(this).check(false).filter("[value='"+a+"']").check(true);
		return $(this);
	}
};
$.fn.selectedValueMultiple = function(a) {
	if(a==null) {
		var result = [];
		$(this).filter(":checked").each(function(){
			result.push($(this).filter(":checked").val());	
		});
		return result;
	}
	else {
		$(this).check(false);
		if($.isArray(a)){
			for(var i=0; i<a.length; i++){
				$(this).filter("[value='"+a[i]+"']").check(true);
			}
		}
		else{
			$(this).filter("[value='"+a+"']").check(true);
		}
		return $(this);
	}
}
$.fn.mustSelect = function() {
	if($(this).filter(":checked").length == 0){ 
		$(this).first().check(true); 
	}
	return $(this);
};
$.fn.disable = function(a) {
	if(a==true || a==false)
	{
		$(this).each(function(){$(this)[0].disabled = a;});
		return $(this);
		//$(this)[0].disabled = a;
	}
	else
	{
		return $(this)[0].disabled;
	}
}
$.fn.check = function(a) {
	if(a==true || a==false)
	{
		//$(this)[0].checked = a;
		$(this).each(function(){$(this)[0].checked = a;});
		return $(this);
	}
	else
	{
		return $(this)[0].checked;
	}
}
$.fn.appendXML=function(val){
	try{
		if( typeof val === "string"){
			return $(this).append($($.parseXML("<xmlobject>"+val+"</xmlobject>")).children("xmlobject").first().children());
		}
		else if(val == null) {
			return $(this);
		}
		else if($.isXMLDoc(val[0])) {
			return $(this).append($(val).children().clone());
		}
	}
	catch(err){}
};
$.fn.htmlOuter=function(){
	// avoid crashing with IE's outerHTML()
	try{
		return $("<div />").append($(this).clone()).html();
	}
	catch(err){}
};
$.fn.clearStyle = function() {
	$(this).each(function(){
		//alert($(this).text().length);
		$(this).text($(this).text());
	});
	return $(this);
};
function supportHTML5Storage() {
	var result = $.jStorage.currentBackend();
	//return !(result == false || result == "userDataBehavior");
	return !(result == false);
}
function supportWebSQL(){
	return false;
	return !!window.openDatabase;
}
function xmlToString(xmlData)
{
	try { /* Gecko, Webkit (Firefox, Chrome), Opera, IE9. */ return (new XMLSerializer()).serializeToString(xmlData); }
	catch (e) {
	   try { /* IE */ return xmlData.xml; }
	   catch (e) { /*Other*/ }
	}
	return false;
}

function getUrlVars(){ // this is for JQM
	var vars = [];
	var href = window.location.href;
	var hashIndex = href.indexOf('#');
	if( hashIndex >= 0 ) {
		href = href.slice(href.indexOf('#')+1); // ie
	};
	var hashes = href.slice(href.indexOf('?') + 1).split('&');
	for(var i = 0; i < hashes.length; ++i){
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	};
	return vars;
};
function getLang(){
	var $lang = $("input#lang");
	if($lang.length > 0){
		if($lang.length == 1){
			return $lang.val();
		}
		else {
			if($.mobile.activePage){
				if($("input#lang", $.mobile.activePage).length > 0){
					$lang = $("input#lang", $.mobile.activePage);
				}
			}
			return $lang.val();
		}
	}
	var href = window.location.href;
	var hashIndex = href.indexOf('#');
	if( hashIndex >= 0 ) {
		href = href.slice(href.indexOf('#')+1); // ie
	};
	if(href.indexOf('_en.') > -1){
		return "en";
	}
	if(href.indexOf('_ch.') > -1){
		return "ch";
	}
	//alert("show default");
	return href.indexOf('en');
}
function getAutoText(){
	var lang = getLang();
	if(lang == "ch"){
		return "(自動)";
	}
	return "(auto)";
}
function displayLength(str){
	if (typeof str === "string"){
		var arr = str.match(/[^\x00-\xff]/ig);
	    return  arr == null ? str.length : str.length + arr.length; 
	} else {return 0;}
}

$.appFunc={
	hasNetwork: function(){
		if(siteInfo.isApp){
			var networkState = navigator.network.connection.type;
			return !(networkState == Connection.NONE);
		}
		return true;
	},
	alert:function(msg){
		if(siteInfo.isApp){
			navigator.notification.alert(msg, function(){});
		}
		else {
			alert(msg);
		}
	},
	confirm:function(msg){
		if(false && siteInfo.isApp){
			return navigator.notification.confirm(msg, function(){});
		}
		else {
			return confirm(msg);
		}
	},
	quit:function(){
		if(siteInfo.isApp){
			if(device.platform == "iPhone"){
				navigator.notification.alert("Press \"Home\" button to exit.", function(){}, "Friendly Reminder");
			}
			else if(device.platform == "Android"){
				if(navigator.app.exitApp){navigator.app.exitApp();}
				else {navigator.notification.alert("Press \"Home\" button to exit.", function(){}, "Friendly Reminder");}
			}
			else {
				navigator.notification.alert("Press \"Home\" button to exit.", function(){}, "Friendly Reminder");
			}
		}
	},
	hasQuitFunc:function(){
		if(siteInfo.isApp){
			if(navigator.app.exitApp){return true;}
		}
		return false;
	}
};

$.canTouch=function doesTouch(){try{document.createEvent("TouchEvent");return true;}catch(e){return false;}};
$.canDrop=function doesDrop(){try{document.createEvent("drop");return true;}catch(e){return false;}};
$.canDragEnter=function doesDragEnter(){try{document.createEvent("dragenter");return true;}catch(e){return false;}};
$.fn.delay = function(time, callback){
     // Empty function:
     jQuery.fx.step.delay = function(){};
     // Return meaningless animation, (will be added to queue)
     return this.animate({delay:1}, time, callback);
}
$.fn.xhtml = function(){
	var needFix = false;
	if($.browser.msie){
		var version = parseInt($.browser.version, 10);
		if(version < 9){
			needFix = true;
		}
	}
	if(!needFix){
		return $(this).html();
	} else {
		var tbHtml = $(this).clone();
		$("*", tbHtml).removeAttr("sizset").removeAttr("sizcache");
		
		var tbHtmlData = tbHtml.html();
		tbHtmlData = tbHtmlData.replace(/<TABLE/g,"<table");
		tbHtmlData = tbHtmlData.replace(/<\/TABLE>/g,"</table>");
		tbHtmlData = tbHtmlData.replace(/<THEAD/g,"<thead");
		tbHtmlData = tbHtmlData.replace(/<\/THEAD>/g,"</thead>");
		tbHtmlData = tbHtmlData.replace(/<TBODY/g,"<tbody");
		tbHtmlData = tbHtmlData.replace(/<\/TBODY>/g,"</tbody>");
		
		tbHtmlData = tbHtmlData.replace(/<TR/g,"<tr");
		tbHtmlData = tbHtmlData.replace(/<\/TR>/g,"</tr>");
		tbHtmlData = tbHtmlData.replace(/<TD/g,"<td");
		tbHtmlData = tbHtmlData.replace(/<\/TD>/g,"</td>");
		tbHtmlData = tbHtmlData.replace(/<TH/g,"<th");
		tbHtmlData = tbHtmlData.replace(/<\/TH>/g,"</th>");
		
		tbHtmlData = tbHtmlData.replace(/ border=(\d) /g," border=\"$1\" ");
		tbHtmlData = tbHtmlData.replace(/ cellSpacing=(\d) /g," cellspacing=\"$1\" ");
		tbHtmlData = tbHtmlData.replace(/ cellPadding=(\d) /g," cellpadding=\"$1\" ");
		
		return tbHtmlData;
	}
}