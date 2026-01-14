// JavaScript Document
$(document).bind("mobileinit", function(){
  //apply overrides here
	$.extend(  $.mobile , {
		/* metaViewportContent: "width=device-width, minimum-scale=1, maximum-scale=2, initial-scale=1", */
		defaultPageTransition: "none",
		allowCrossDomainPages:true,
		ajaxLinksEnabled:false,
		loadingMessageTheme:"i",
		pageLoadErrorMessageTheme:"i",
		loadingMessageTextVisible:true,
		useFastClick:true
	});
	$.extend(  $.mobile.page.prototype.options , {
		theme: "a",
		headerTheme: "a",
		contentTheme:"a",
		footerTheme:"a"
	});
	$.extend(  $.mobile.listview.prototype.options , {
		theme: "a",
		headerTheme: "a",
		dividerTheme:"a",
		splitTheme:"a",
		countTheme:"a",
		filterTheme:"a",
		filterPlaceholder: "Search ..."
	});
	$.extend(  $.mobile.dialog.prototype.options , {
		theme: "a"
	});
	$.extend(  $.mobile.selectmenu.prototype.options , {
		theme: "a",
		menuPageTheme: "a",
		overlayTheme:"a"
	});
	$.extend(  $.mobile.collapsible.prototype.options , {
		theme: "a",
		iconTheme: "a"
	});
	$.extend(  $.mobile.checkboxradio.prototype.options , {
		theme: "a"
	});
	$.extend(  $.mobile.button.prototype.options , {
		theme: "a"
	});
	$.extend(  $.mobile.slider.prototype.options , {
		theme: "a",
		trackTheme:"a"
	});
	$.extend(  $.mobile.textinput.prototype.options , {
		theme: "a"
	});
	try{
		$.mobile.buttonMarkup.hoverDelay = 10;
	} catch(err){}
	/*$.mobile.metaViewportContent = "width=device-width, minimum-scale=1, maximum-scale=2";
	$.support.touchOverflow = true;
  	$.mobile.touchOverflowEnabled = true;*/
});

