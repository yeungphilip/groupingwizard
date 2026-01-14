var groupAnimations = {
	all: {
		canPlay: function(people, group){
			return (people <= 50) && (group <= 10);
			},
		prepare:function(resultData, lang){
				$("#divBtnPause").toggle(false);
				$("#divBtnContinue").toggle(false);
				$("#divAnimation").empty();
				$("#divAnimation").addClass("playAll");
				var results = $(resultData.resultListHTML); // in-case is not node form
				$("tbody tr", results).each(function(rIndex){
				var result_item = $('<span class="item_name" />');
				result_item.appendTo("#divAnimation");
				var col = Math.floor(rIndex/18);
				var row = rIndex%18;
				var nameFieldIndex = parseInt(resultData.resultNameField.substring(1), 10);
				
				result_item.text($("td:eq("+nameFieldIndex+")", this).text()).css({
						//top:(10+20*row)+"px", 
						top:(1+5*row)+"%", 
						//left:(resultData.totalPeople<=40?(500+100*col):(465+78*col))+"px"
						left:(resultData.totalPeople<=36?(70+14*col):(67+11*col))+"%"
					}).attr({
						"gn": $("th:eq(0)", this).text(),
						"pn": $("th:eq(1)", this).text()
					});
				});
				$("#divAnimation").data("group",resultData.totalGroup );
				var groupheight = Math.floor($("#divAnimation").height()/resultData.totalGroup);
				var groupheightP = Math.floor(100/resultData.totalGroup);
				$("#divAnimation").data("groupHeight", groupheight);
				$("#divAnimation").data("groupHeightP", groupheightP);
				for(var i=1; i<=resultData.totalGroup; i++){
					var group = $('<div class="group" />');
					group.appendTo("#divAnimation");
					group.text(tmpl.lblGroup[lang]+" "+i).css({
							//top:((i-1)*groupheight)+"px", 
							top:((i-1)*groupheightP)+"%", 
							left:"0%",
							height:(groupheightP-2)+"%"
						})
				}
				
			},
		play:function(callback){
				var currAnimation = {
					batchComplete:0,
					batch: 0,
					completedItem: 0,
					totalItem:0,
					changeColor:{
						step1:false,
						step2:false
					},
					isPause:false
				};
				var groupheight = $("#divAnimation").data("groupHeight");
				var groupheightP = $("#divAnimation").data("groupHeightP");
	
				currAnimation.totalItem = $(".item_name[gn!='']").length;
				$("#btnSkip, #btnTerminate").bind("click", KillAllAnimation);
				$("#btnPause, #btnContinue").bind("click", PauseAnimation);
				$("#divBtnPause").toggle(!currAnimation.isPause);
				$("#divBtnContinue").toggle(currAnimation.isPause);
				
				MoveNextItemBatch();
				
				function MoveNextItemBatch(){
					if (currAnimation.totalItem>currAnimation.completedItem) {// should be repeat
						MoveNextItemBatch_normal();
					} else if(!currAnimation.changeColor.step1) {
						ChangeColor_normal();
					} else if(!currAnimation.changeColor.step2) {
						ChangeColor_remainder();
					} else {
						AnimationEnd();
					}
				}
				function MoveNextItemBatch_normal(){
					if (currAnimation.completedItem == currAnimation.batchComplete) {
						currAnimation.batch += 1;
						currAnimation.batchComplete += $(".item_name[pn="+currAnimation.batch+"]").length;
					}
					var p = currAnimation.batch;
					$(".item_name[pn="+p+"]").each(function(){
							var gn = parseInt($(this).attr("gn"), 10);
							var pn = parseInt($(this).attr("pn"), 10); //1-base
							var row = Math.floor((pn-1)/5); 
							var col = (pn-1)%5; // 0-base
							$(this).animate({
								//top:(gn-1) * groupheight+2 + row*20 + "px",
								top:((gn-1) * groupheightP + row*5) + "%",
								//left: (col* 75+75) + "px"
								left: (col* 11+11) + "%"
							}, 1000, "swing").delay(1000, MoveItemCompleted);
						});
					
				}
				
				function MoveItemCompleted() {
					currAnimation.completedItem++;
					if (currAnimation.completedItem == currAnimation.batchComplete) {
						MoveNextItemBatch();
					}
				}
				function ChangeColor_normal(){
					$(".item_name[gn!='']").addClass("done");
					$("#divAnimation").delay(1000, ChangeColor_normal_end);
						
				}
				function ChangeColor_normal_end(){
					currAnimation.changeColor.step1 = true;
					MoveNextItemBatch();						
				}
				function ChangeColor_remainder(){
					if($(".item_name[gn='']").length > 0){
						$(".item_name[gn='']").addClass("remain");
						$("#divAnimation").delay(2000, ChangeColor_remainder_end);
					}
					else {
						$("#divAnimation").delay(1000, ChangeColor_remainder_end);
					}
				}
				function ChangeColor_remainder_end(){
					currAnimation.changeColor.step2 = true;
					MoveNextItemBatch();						
				}
				function PauseAnimation(){
					if(currAnimation.isPause){
						currAnimation.isPause = false;
						MoveNextItemBatch();
						//$(".item_name, #divAnimation").dequeue();
					} else{
						$(".item_name, #divAnimation").stop(true, false);
						currAnimation.isPause = true;
					}
					$("#divBtnContinue").toggle(currAnimation.isPause);
					$("#divBtnPause").toggle(!currAnimation.isPause);
				}

				function KillAllAnimation(){
					$(".item_name, #divAnimation").stop(true, false);
				}
				function AnimationEnd(){
					//alert("done");
					$("#btnSkip, #btnTerminate").unbind("click", KillAllAnimation);
					$("#btnPause, #btnContinue").unbind("click", PauseAnimation);
					if($.isFunction(callback)){
						callback();
					}
				}
			
			}
	},
	group:{
		canPlay: function(people, group, groupsize){
			return (group <= 20) && (groupsize <= 21);
			},
		prepare:function(resultData, lang){
				$("#divBtnPause").toggle(false);
				$("#divBtnContinue").toggle(false);
				$("#divAnimation").empty();
				$("#divAnimation").addClass("playGroup");
				var results = $(resultData.resultListHTML); // in-case is not node form
				
				var restGroup = $('<div class="group" />').appendTo("#divAnimation");
				restGroup.appendTo("#divAnimation");
				var mainList = $("<ol />");
				mainList.appendTo(restGroup);
				$("tbody tr", results).each(function(rIndex){
					var result_item = $('<li />');
					result_item.appendTo(mainList);
					var nameFieldIndex = parseInt(resultData.resultNameField.substring(1), 10);
					result_item.attr({
							"gn": $("th:eq(0)", this).text(),
							"pn": $("th:eq(1)", this).text()
						}).append($('<span class="item_name"/>').text($("td:eq("+nameFieldIndex+")", this).text()));
				});
				
				
				for(var i=1; i<=resultData.totalGroup; i++){
					var group = $('<div class="group" />');
					group.appendTo("#divAnimation");
					group.attr("gn", i).append($("<h3 />").text(tmpl.lblGroup[lang]+" "+i));
					
					var ol = $("<ol />");
					ol.appendTo(group);
					for(var p=1; p<=resultData.groupSize; p++){
						var li = $("li[gn="+i+"][pn="+p+"]", mainList);
						if(li.length == 1){
							ol.append(li);
						} else {
							ol.append($("<li class='nonitem' />").text("--"));
						}
					}
					group.append('<br style="clear:left" />');
				}
				restGroup.remove();
				$("#divAnimation").prepend("<span class='note'/>");
				
			},
		play:function(callback){
				var currAnimation = {
					currgroup:0,
					showgroup:0,
					completedgroup:0,
					totalgroup: 0,
					itemInBatch:0,
					completedPos:0,
					isPause:false
				};
				currAnimation.totalgroup = $("#divAnimation .group").length;
				$("#btnSkip, #btnTerminate").bind("click", KillAllAnimation);
				$("#btnPause, #btnContinue").bind("click", PauseAnimation);
				$("#divBtnPause").toggle(!currAnimation.isPause);
				$("#divBtnContinue").toggle(currAnimation.isPause);
				
				animationController();
				$("#divAnimation").append("<div id='remark' />");
				function animationController(){
					if(currAnimation.completedPos < currAnimation.itemInBatch){
						loadGroupItems();
					}
					else if(currAnimation.completedgroup < currAnimation.totalgroup){
						if(currAnimation.showgroup == currAnimation.completedgroup){
							if(currAnimation.currgroup == currAnimation.showgroup){
								$("#divAnimation .group[gn="+currAnimation.currgroup+"]").hide();
								currAnimation.currgroup++;
								$("#divAnimation .note").text(tmpl.lblGroup[getLang()]+" "+currAnimation.currgroup+"/"+currAnimation.totalgroup);
								currAnimation.itemInBatch = $("#divAnimation .group[gn="+(currAnimation.currgroup)+"] ol li[pn]").length;
								currAnimation.completedPos = 0;
							}
							$("#divAnimation .group[gn="+(currAnimation.currgroup)+"]").fadeTo("normal",1.0, shownGroup);
						} else {
							if(currAnimation.completedgroup >= (currAnimation.totalgroup-1)){
								closeGroup();
							}
							else{
								$("#divAnimation .group[gn="+(currAnimation.currgroup)+"]").delay(3000, closeGroup);
							}
						}
					} 
					else {
						AnimationEnd();
					}
				}
				function shownGroup(){
					currAnimation.showgroup++;
					loadGroupItems();
				}
				
				function loadGroupItems(){
					var li = $("#divAnimation .group[gn="+currAnimation.currgroup+"] ol li[pn="+(currAnimation.completedPos+1)+"]");
					li.fadeTo(1000, 1.0, completedGroupItems);
				}
				function completedGroupItems(){
					currAnimation.completedPos++;
					animationController();
				}
				function closeGroup(){
					currAnimation.completedgroup++;
					animationController();
				}
				
				function PauseAnimation(){
					if(currAnimation.isPause){
						currAnimation.isPause = false;
						animationController();
						//$(".item_name, #divAnimation").dequeue();
					} else{
						$("#divAnimation, #divAnimation .group, #divAnimation .group ol li").stop(true, false);
						currAnimation.isPause = true;
					}
					$("#divBtnContinue").toggle(currAnimation.isPause);
					$("#divBtnPause").toggle(!currAnimation.isPause);
				}
				function KillAllAnimation(){
					$("#divAnimation, #divAnimation .group, #divAnimation .group ol li").stop(true, false);
				}
				function AnimationEnd(){
					//alert("done");
					$("#btnSkip, #btnTerminate").unbind("click", KillAllAnimation);
					//$("#btnPause, #btnContinue").unbind("click", PauseAnimation);
					if($.isFunction(callback)){
						callback();
					}
				}
			}
	},
	none:{
		canPlay: function(people, group){
			return true;
			},
		play:function(){
			/** swf object **/
			}
	}
};