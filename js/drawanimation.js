var drawAnimations = {
	all: {
		canPlay: function(){
			return true;
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
	prize:{
		canPlay: function(){
			return true;
			},
		prepare:function(resultData, lang){
				$("#divBtnPause").toggle(false);
				$("#divBtnContinue").toggle(false);
				$("#divAnimation").empty();
				$("#divAnimation").addClass("drawPrize");
				$("#divAnimation").append("<div id='divAnimation2'/>");
				
				/*$("#divAnimation").prepend("<div class='prizeOuter'><div class='prizeOuterL'/><div class='prizeOuterR' /></div>");*/
				$("#divAnimation").prepend("<div class='prizeOuter'><div class='prizeOuter2'><div class='prizeOuterL'/><div class='prizeOuterR' /></div></div>");
				var prizeTitle = $('<div class="prize" />');
				$("#divAnimation .prizeOuterL").after(prizeTitle);
				//prizeTitle.appendTo("#divAnimation2");
				prizeTitle.text(tmpl.lblPrize[lang]+" #");
				prizeTitle.append('<span class="prizeCount" />');
				
				
				$('<div class="nameFieldOuter"><div class="nameField" /></div>').appendTo("#divAnimation2");
				$("#divAnimation2").prepend("<span class='note'/>");
				$('<div class="divPrizeButtons"><a class="nextBtn" /><a class="prevBtn" /></div>').appendTo("#divAnimation");
				$("#divAnimation.drawPrize .nextBtn").text(tmpl.lblDraw[lang]+" \u25B6").attr({"data-role":"button", "data-theme":"j"}); 
				$("#divAnimation.drawPrize .prevBtn").text("\u25C0 "+tmpl.lblPrev[lang]).attr({"data-role":"button", "data-theme":"d"});
				$("#divAnimation.drawPrize .nextBtn, #divAnimation.drawPrize .prevBtn").button();
				$('<div class="allNames" />').appendTo("#divAnimation");
				
				var resultNameFieldIndex = parseInt(resultData.resultNameField.substring(1), 10);
				var results = $(resultData.resultListHTML); // in-case is not node form
				var maxChars = 0;
				$("tbody tr", results).each(function(rIndex){
					var nameVal = $("td:eq("+resultNameFieldIndex+")", this).text();
					var result_item = $('<span class="result_item_name" />');
					result_item.appendTo("#divAnimation .allNames");
					result_item.text(nameVal).attr({
							"prize": $("th:eq(0)", this).text()
						});
					var nameLength = displayLength(nameVal);
					if(nameLength > maxChars){
						maxChars = nameLength;
					}
				});
				
				
				var nameFieldIndex = parseInt(resultData.nameField.substring(1), 10);
				var tbList = $(resultData.tbListHTML); // in-case is not node form
				$("tbody tr", tbList).each(function(lIndex){
				var list_item = $('<span class="list_item_name" />');
				list_item.appendTo("#divAnimation .allNames");
				list_item.text($("td:eq("+nameFieldIndex+")", this).text()).attr({
						"ln": lIndex+1
					});
				});
				
				if(maxChars > 10){
					maxChars = Math.min(maxChars, 30); // over 30 char will  be clipped.
					var newFontSize = Math.floor(150 * (10/maxChars));
					$(".nameFieldOuter").css("font-size", newFontSize+"px");
				}
			},
		play:function(callback){
				var currAnimation = {
					currPrizeNo:1,
					totalPrizes:0,
					drawnPrizes:0,
					drawingCounter:0,
					drawPerRound:5, 
					totalListItem:0,
					lastRandom:0
				};
				currAnimation.totalListItem = $("#divAnimation .list_item_name").length;
				currAnimation.totalPrizes = $("#divAnimation .result_item_name").length;

				$("#btnSkip, #btnTerminate").bind("click", KillAllAnimation);
				$("#divAnimation.drawPrize .nextBtn").bind("click", function(){
					if(currAnimation.currPrizeNo < currAnimation.totalPrizes){
						currAnimation.currPrizeNo++;
						animationController();
					}
					});
				$("#divAnimation.drawPrize .prevBtn").bind("click", function(){
					if(currAnimation.currPrizeNo > 1){
						currAnimation.currPrizeNo--;
						animationController();
					}
					});
				
				//$("#btnPause, #btnContinue").bind("click", PauseAnimation);
				//$("#divBtnPause").toggle(!currAnimation.isPause);
				//$("#divBtnContinue").toggle(currAnimation.isPause);
				
				animationController();
				$("#divAnimation").append("<div id='remark' />");
				function animationController(){
					$("#divAnimation .note").text(tmpl.lblDrawnPrize[getLang()]+" "+currAnimation.drawnPrizes+"/"+currAnimation.totalPrizes);
					if(currAnimation.currPrizeNo <= currAnimation.totalPrizes)
					{
						// get curr prize
						$("#divAnimation .prizeCount").text(currAnimation.currPrizeNo);
						if(currAnimation.currPrizeNo <= currAnimation.drawnPrizes)
						{
							// get curr prize (prize has been drawn)
							$(".nextBtn", "#divAnimation .divPrizeButtons").toggle(currAnimation.currPrizeNo < currAnimation.totalPrizes); 
							$(".prevBtn", "#divAnimation .divPrizeButtons").toggle(currAnimation.currPrizeNo > 1); 
							if(currAnimation.currPrizeNo == currAnimation.drawnPrizes)
							{
								$("#divAnimation.drawPrize .nextBtn .ui-btn-text").text(tmpl.lblDraw[getLang()]+" \u25B6");
							}
							else {
								$("#divAnimation.drawPrize .nextBtn .ui-btn-text").text(tmpl.lblNext[getLang()]+" \u25B6");
							}
							currAnimation.drawingCounter = 0; //reset
							var result_item = $("#divAnimation .result_item_name[prize="+(currAnimation.currPrizeNo)+"]");
							$("#divAnimation .nameField").text(result_item.text()).toggleClass("result", true);
						}
						else {
							// draw new prize
							$(".nextBtn, .prevBtn", "#divAnimation .divPrizeButtons").hide();
							currAnimation.drawingCounter = 0; //reset
							currAnimation.drawPerRound = Math.floor(Math.random() * 4)+2;
							DrawAPrize();
						}
					}
					/*
					else {
						AnimationEnd();
					}*/
				}
				function DrawAPrize(){
					if(currAnimation.drawingCounter < currAnimation.drawPerRound) {
						currAnimation.drawingCounter++;
						var ran = Math.floor(Math.random() * currAnimation.totalListItem)+1;
						while ((ran == currAnimation.lastRandom) && (currAnimation.totalListItem > 1)){ran = Math.floor(Math.random() * currAnimation.totalListItem)+1;}
						currAnimation.lastRandom = ran;
						//$("#divAnimation #remark").append(" "+speed);
						var list_item = $("#divAnimation .list_item_name[ln="+(ran)+"]");
						$("#divAnimation .nameField").text(list_item.text()).toggleClass("result", false).css({top: -100 + "%"});
						//$("#divAnimation").delay(75, DrawAPrize); // xx/1000 sec 
						var speed = 300;
						$("#divAnimation .nameField").animate({
								top: 100 + "%"
							}, speed, "swing", DrawAPrize);
							//$("#divAnimation #remark").append(" "+speed);
					} else {
						var result_item = $("#divAnimation .result_item_name[prize="+(currAnimation.currPrizeNo)+"]");
						$("#divAnimation .nameField").text(result_item.text()).css({top: -100 + "%"});
						$("#divAnimation .nameField").animate({
								top: 5 + "%"
							}, 280, "swing", DrawAPrize_end);
					}
				}
				
				function DrawAPrize_end(){
					$("#divAnimation .nameField").toggleClass("result", true);
					$(".nextBtn", "#divAnimation .divPrizeButtons").toggle(currAnimation.currPrizeNo < currAnimation.totalPrizes); 
					$(".prevBtn", "#divAnimation .divPrizeButtons").toggle(currAnimation.currPrizeNo > 1); 
					$("#divAnimation.drawPrize .nextBtn .ui-btn-text").text(tmpl.lblDraw[getLang()]+" \u25B6");
					currAnimation.drawnPrizes = currAnimation.currPrizeNo;
					
					$("#divAnimation .note").text(tmpl.lblDrawnPrize[getLang()]+" "+currAnimation.drawnPrizes+"/"+currAnimation.totalPrizes);
					
					if(currAnimation.drawnPrizes >= currAnimation.totalPrizes){
						AnimationEnd();
					}
				}
				function KillAllAnimation(){
					$("#divAnimation").stop(true, false);
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
		canPlay: function(){
			return true;
			},
		play:function(){
			/** swf object **/
			}
	}
};