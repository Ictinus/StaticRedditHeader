// Static Reddit Header
// Author: Ictinus
// Released: 03 July 2010, make the Reddit header static.
// Update: 04 July 2010, (1.01) removed outerHTML reference fixing 'undefined' error in Firefox. 
//         (1.02) Fixed FF content capture. 
//         (1.03) Fixed for pages that do not display 'side' panel (eg. Inbox)
//         (1.04) Added moveSubRedditDrop function.
//         (1.05) Fixed things.
// Update: 07 July 2010, (1.06) Fixed Firefox border radius bug. Prevent script running twice with exclude.
// Update: 10 July 2010, (1.07) Get the first 'content' class sibling of 'Side' class div, not the first 'content' class element.
//         (1.08) added 'rising' tab to header.
//         (1.09) added user tab menu containing user page tab links: overview, comments, submitted, liked, disliked, hidden
//         (1.10) fixed what was I thinking code loops. Moved user tab to end of tabs for consistent 'my reddits' positioning.
// Update: 11 July 2010, (1.11) added a link to the subreddit title in the right side pane. ok not header related, but so what.
//         (1.12) bug fix for non-existing subreddit title on main page, doh!
//         (1.13) bug fix for non-existing subreddit title on user page.
// Update: 01 October 2010, (1.14) added tab menu for 'top' pages.
//         (1.15) Added 'all time' as an option to the 'top' tab, and fixed the urls.
//         (1.16) Clear Search field text on focus, revert to 'search reddit' on blur if empty.
// Update: 06 November 2010, (1.17) fix funtionality on Search page.
// Update: 28 January 2011, (1.18) added friends to the user tab. made tab styling consistent with existing tabs.
//		   (1.19) improved header tab compatibility with custom CSS.
// Update: 08 August 2011, (1.20) added additional header resize calls to update the header height sooner when possible.
// Update: 12 October 2011, (1.21) grr, now the header should be fixed. Changed script site security to allow https and remove scary 'allow access to all domains' message. Fixed moveSubReddits menu click event.
// Update: 14 October 2011, (1.22) added Acount Activity to the user tab. Fixed 'friends' spelling in the user tab.
// Update: 05 November 2011, (1.23) added ability to move Sticky messages to above the content area.
// Update: 07 November 2011, (1.24) removed options for linking the sub-reddit title and fixing the search field as they are no longer needed.
// Update: 29 November 2011, (1.25) added ability to configure script options.

// ==UserScript==
// @name            Static Reddit Header
// @version         1.25
// @namespace       http://ictinus.com/srh/
// @description     Make the Reddit Header static, allowing it to be visible at all times.
// @match http://*.reddit.com/*
// @match https://*.reddit.com/*
// ==/UserScript==

var staticRedditHeader = {
	storeName: "staticRedditHeader",
	staticHeader: true,    //change to false to disable the static header
	moveSubReddits: true,  //change to false to prevent subreddit tab menu move and subreddit bar removal
	addRisingTab: true,    //adds a 'rising' tab next to the 'new' tab
	addUserTab: true,      //adds a 'user' dropdown tab with the user page tabs in it.
	dropdownTopTab: true,  //adds a drop down list of top options to the top tab
	moveStickyElement: true, //moves absolute positioned md child element to top of content.

	version : 1.25,
	defaultJSON: {version:"1.25", disabled:{}, options:{staticHeader:{enabled:true, label:"Static Header"}, moveSubReddits:{enabled:true, label:"Move SubReddits"}, addRisingTab:{enabled:true, label:"Add Rising Tab"}, addUserTab:{enabled:true, label:"Add User Tab"}, dropdownTopTab:{enabled:true, label:"Add Top Tab"}, moveStickyElement:{enabled:true, label:"Move Sticky Messages"}}},
	getNextSibling: function (obj) {
		obj  = obj.nextSibling;
		while (obj.nodeType != 1) {
			obj = obj.nextSibling;
		}
		return obj;
	},
	readStore : function() {
		var strJSON = window.localStorage.getItem(this.storeName);
		if (strJSON === null) {
			this.srh = this.defaultJSON;
		} else {
			this.srh = JSON.parse(strJSON);			
		}
	},
	writeStore : function() {
		window.localStorage.setItem(this.storeName, JSON.stringify(this.srh));
	},
	insertConfigMenuz: function() {
		var headerBottomRight = document.getElementById("header-bottom-right");
		var spanSeparator = document.createElement('span');
		spanSeparator.innerHTML = "|";
		spanSeparator.className = "separator";
		var spanCheck = document.createElement('span');
		spanCheck.id = "srhOptions";
		spanCheck.innerHTML = "<b>&sect;&sect;</b>";
		spanCheck.style.cursor = "pointer";
		//spanCheck.style.marginLeft = "4px";
		spanCheck.style.fontWeight = "bold";
		spanCheck.addEventListener("click", function(e) { 
			//staticRedditHeader.showOptions(); 
			e.stopPropagation();	
			var theUI = document.getElementById('srhUI');
			if (theUI.style.display === 'block') {
				theUI.style.display = 'none';
			} else { 
				staticRedditHeader.closeUIs();
				theUI.style.visibility = 'hidden';
				theUI.style.display = 'block';
				theUI.style.top = parseInt(this.offsetTop + this.offsetHeight + 2) + 'px';
				var iOffsetLeft = parseInt(this.offsetLeft) + parseInt(this.offsetWidth) - parseInt(theUI.offsetWidth);
//				alert(iOffsetLeft);
//				if (iOffsetLeft < 0) { 
//					theUI.style.left = 2 + 'px';
//				} else {
					theUI.style.left = this.offsetLeft + 'px';
//				}
				theUI.style.visibility = '';
			}
		}, false);
 		headerBottomRight.insertBefore(spanCheck, headerBottomRight.lastChild);
 		headerBottomRight.insertBefore(spanSeparator, headerBottomRight.lastChild);
 		
 		//
	},
	closeUIs: function() {
		//close other UIs
		var theUIs = document.getElementsByClassName('ictinusUI');
		for (var iUI = 0, lenUI = theUIs.length; iUI < lenUI; iUI++) {
			theUIs[iUI].style.display = 'none';
		}
	},
	createUITab : function() {
		var headerBottomRight = document.getElementById("header-bottom-right");
		var spanSeparator = document.createElement('span');
		spanSeparator.innerHTML = "|";
		spanSeparator.className = "separator";
		var spanCheck = document.createElement('span');
		spanCheck.id = "srhOptions";
		spanCheck.innerHTML = "<b>&sect;&sect;</b>";
		spanCheck.style.cursor = "pointer";
		//spanCheck.style.marginLeft = "4px";
		spanCheck.style.fontWeight = "bold";
		spanCheck.addEventListener("click", function(e) { 
			//staticRedditHeader.showOptions(); 
			e.stopPropagation();
			var theUI = document.getElementById('srhUI');
			if (theUI.style.display === 'block') {
				theUI.style.display = 'none';
			} else { 
				staticRedditHeader.closeUIs();
				theUI.style.visibility = 'hidden';
				theUI.style.display = 'block';
				theUI.style.top = parseInt(this.offsetTop + this.offsetHeight + 2) + 'px';
				var iOffsetLeft = parseInt(this.parentElement.offsetLeft) + parseInt(this.offsetLeft) + parseInt(this.offsetWidth) - parseInt(theUI.offsetWidth) + 10; 
//				if (iOffsetLeft < 0) { 
//					theUI.style.left = 2 + 'px';
//				} else {
					theUI.style.left = iOffsetLeft + 'px';
//				}
				theUI.style.visibility = '';
			}
		}, false);
 		headerBottomRight.insertBefore(spanCheck, headerBottomRight.lastChild);
 		headerBottomRight.insertBefore(spanSeparator, headerBottomRight.lastChild);

//create ui popup
		var theUI = document.createElement("div");
		theUI.id = "srhUI";
		theUI.className = "srhUI ictinusUI";

//populate the ui here
//Option 1
//	staticHeader: true,    //change to false to disable the static header
			var theOptionItem = document.createElement("div");
			var theInputBtn = document.createElement("input");
			theInputBtn.type = "checkbox";
			theInputBtn.name = "srh-option";
			theInputBtn.value = "staticHeader";
			theInputBtn.id = "srh-op1";
			theInputBtn.checked = staticRedditHeader.srh.options.staticHeader.enabled;
			theInputBtn.addEventListener('click', function(e) {
				e.stopPropagation();
				staticRedditHeader.srh.options.staticHeader.enabled = this.checked;
				staticRedditHeader.writeStore();
				window.location.reload();
			}, false);
			theOptionItem.appendChild(theInputBtn);

			var theLabel = document.createElement("label");
			theLabel.htmlFor = "srh-op1";
			theLabel.innerHTML = "Static Header";
			theOptionItem.appendChild(theLabel);
			theUI.appendChild(theOptionItem);

//Option 2
//	moveSubReddits: true,  //change to false to prevent subreddit tab menu move and subreddit bar removal
			var theOptionItem = document.createElement("div");
			var theInputBtn = document.createElement("input");
			theInputBtn.type = "checkbox";
			theInputBtn.name = "srh-option";
			theInputBtn.value = "moveSubReddits";
			theInputBtn.id = "srh-op2";
			theInputBtn.checked = staticRedditHeader.srh.options.moveSubReddits.enabled;
			theInputBtn.addEventListener('click', function(e) {
				e.stopPropagation();
				staticRedditHeader.srh.options.moveSubReddits.enabled = this.checked;
				staticRedditHeader.writeStore();
				window.location.reload();
			}, false);
			theOptionItem.appendChild(theInputBtn);

			var theLabel = document.createElement("label");
			theLabel.htmlFor = "srh-op2";
			theLabel.innerHTML = "Move subReddits List";
			theOptionItem.appendChild(theLabel);
			theUI.appendChild(theOptionItem);

//Option 3
//	addRisingTab: true,    //adds a 'rising' tab next to the 'new' tab
			var theOptionItem = document.createElement("div");
			var theInputBtn = document.createElement("input");
			theInputBtn.type = "checkbox";
			theInputBtn.name = "srh-option";
			theInputBtn.value = "addRisingTab";
			theInputBtn.id = "srh-op3";
			theInputBtn.checked = staticRedditHeader.srh.options.addRisingTab.enabled;
			theInputBtn.addEventListener('click', function(e) {
				e.stopPropagation();
				staticRedditHeader.srh.options.addRisingTab.enabled = this.checked;
				staticRedditHeader.writeStore();
				window.location.reload();
			}, false);
			theOptionItem.appendChild(theInputBtn);

			var theLabel = document.createElement("label");
			theLabel.htmlFor = "srh-op3";
			theLabel.innerHTML = "Add Rising Tab";
			theOptionItem.appendChild(theLabel);
			theUI.appendChild(theOptionItem);

//Option 4
//	addUserTab: true,      //adds a 'user' dropdown tab with the user page tabs in it.
			var theOptionItem = document.createElement("div");
			var theInputBtn = document.createElement("input");
			theInputBtn.type = "checkbox";
			theInputBtn.name = "srh-option";
			theInputBtn.value = "addUserTab";
			theInputBtn.id = "srh-op4";
			theInputBtn.checked = staticRedditHeader.srh.options.addUserTab.enabled;
			theInputBtn.addEventListener('click', function(e) {
				e.stopPropagation();
				staticRedditHeader.srh.options.addUserTab.enabled = this.checked;
				staticRedditHeader.writeStore();
				window.location.reload();
			}, false);
			theOptionItem.appendChild(theInputBtn);

			var theLabel = document.createElement("label");
			theLabel.htmlFor = "srh-op4";
			theLabel.innerHTML = "Add User Tab";
			theOptionItem.appendChild(theLabel);
			theUI.appendChild(theOptionItem);

//Option 5
//	dropdownTopTab: true,  //adds a drop down list of top options to the top tab
			var theOptionItem = document.createElement("div");
			var theInputBtn = document.createElement("input");
			theInputBtn.type = "checkbox";
			theInputBtn.name = "srh-option";
			theInputBtn.value = "dropdownTopTab";
			theInputBtn.id = "srh-op5";
			theInputBtn.checked = staticRedditHeader.srh.options.dropdownTopTab.enabled;
			theInputBtn.addEventListener('click', function(e) {
				e.stopPropagation();
				staticRedditHeader.srh.options.dropdownTopTab.enabled = this.checked;
				staticRedditHeader.writeStore();
				window.location.reload();
			}, false);
			theOptionItem.appendChild(theInputBtn);

			var theLabel = document.createElement("label");
			theLabel.htmlFor = "srh-op5";
			theLabel.innerHTML = "Add Top Tab";
			theOptionItem.appendChild(theLabel);
			theUI.appendChild(theOptionItem);

//Option 6
//	moveStickyElement: true, //moves absolute positioned md child element to top of content.
			var theOptionItem = document.createElement("div");
			var theInputBtn = document.createElement("input");
			theInputBtn.type = "checkbox";
			theInputBtn.name = "srh-option";
			theInputBtn.value = "moveStickyElement";
			theInputBtn.id = "srh-op6";
			theInputBtn.checked = staticRedditHeader.srh.options.moveStickyElement.enabled;
			theInputBtn.addEventListener('click', function(e) {
				e.stopPropagation();
				staticRedditHeader.srh.options.moveStickyElement.enabled = this.checked;
				staticRedditHeader.writeStore();
				window.location.reload();
			}, false);
			theOptionItem.appendChild(theInputBtn);

			var theLabel = document.createElement("label");
			theLabel.htmlFor = "srh-op6";
			theLabel.innerHTML = "Move Sticky Element";
			theOptionItem.appendChild(theLabel);
			theUI.appendChild(theOptionItem);
		
		// build up ui and append to the div
		document.body.appendChild(theUI);
		document.body.addEventListener('click', function () {
//			document.getElementById('srhActions').style.display = "none";
			document.getElementById('srhUI').style.display = "none";
		}, false);
		theUI.addEventListener('click', function(e) {
			document.getElementById('srhActions').style.display = "none";
			e.stopPropagation(); 
		}, false);

	},
	setOption: function() {
	
	},
	showOptionsz: function() {
		//create options div if it doesn't exist and populate it with current option values
		this.srh.options.dropdownTopTab.enabled = !this.srh.options.dropdownTopTab.enabled;
		this.srh.options.moveSubReddits.enabled = !this.srh.options.moveSubReddits.enabled;
		this.srh.options.addRisingTab.enabled = !this.srh.options.addRisingTab.enabled;
		this.srh.options.addUserTab.enabled = !this.srh.options.addUserTab.enabled;
		this.srh.options.staticHeader.enabled = !this.srh.options.staticHeader.enabled;
		this.srh.options.moveStickyElement.enabled = !this.srh.options.moveStickyElement.enabled;
		this.writeStore();
		window.location.reload();
	},
	copyStyles: function (target, source) {
		var objT, objS;
		if (target != null && source != null) {
			target.style.cssText = window.getComputedStyle(source).cssText;
			objT = target.firstElementChild;
			objS = source.firstElementChild;
			this.copyStyles(objT, objS);
			this.copyStyles(target.nextElementSibling, source.nextElementSibling);
		}	
	},
	moveSticky: function () {
	//find sticky: find md, look for absolute positioned element.
		var objMD = document.getElementsByClassName('md')[0];
//		console.log(objMD);
		if (typeof(objMD) == 'undefined') return;
		var objSticky = objMD.firstChild;
		var style = window.getComputedStyle(objSticky);
		while (objSticky && window.getComputedStyle(objSticky).position != "absolute") {
			objSticky = objSticky.nextElementSibling;
		}
//		console.log(objSticky);
		
		if (typeof(objSticky) != 'undefined') {
			
			//copy sticky into new div
			var divStickyContainer = document.createElement('div');
			divStickyContainer.className = 'srhSticky';
			divStickyContainer.innerHTML = objSticky.outerHTML;
			//Copy style and remove unwanted properties
			divStickyContainer.firstElementChild.style.cssText = window.getComputedStyle(objSticky).cssText;
			divStickyContainer.firstElementChild.style.position = 'relative';
			divStickyContainer.firstElementChild.style.top = '0px';
			divStickyContainer.firstElementChild.style.left = '';
									
			//Copy styles of children
			this.copyStyles(divStickyContainer.firstElementChild.firstElementChild, objSticky.firstElementChild);
			
			//insert new div
			var objContent = document.getElementById("srh_content");
			objContent = objContent.firstChild.nextSibling;
			objContent.style.paddingTop = "0px";
			objContent.insertBefore(divStickyContainer, objContent.firstChild);

			if (document.getElementById('siteTable').offsetTop - divStickyContainer.offsetTop - divStickyContainer.offsetHeight) {
				divStickyContainer.style.paddingBottom = "5px";
			}
			
			//remove old sticky
			objSticky.parentNode.removeChild(objSticky);
		}
	
	},
	displayHeaderHeight: function () {
		theHeader = document.getElementById("header");
		alert(theHeader.offsetHeight);
	},
	setBigHeight: function () {
		theHeader = document.getElementById("header");
		theSRHContent = document.getElementById("srh_content");
		theSRHContent.style.paddingTop = "100px";
	},
	setPadding: function () {
		theHeader = document.getElementById("header");
		theSRHContent = document.getElementById("srh_content");
		theSRHContent.style.paddingTop = "100px";
		theSRHContent.style.paddingTop = theHeader.offsetHeight + "px";
		//alert(theSRHContent.style.paddingTop);
	},
	makeHeaderStatic: function () {
		this.addGlobalStyle('#header {width:100%; position:fixed; top:0px; min-height:44px;}');
		theHeader = document.getElementById("header");
		theHeader.style.zIndex = 999;
		newDiv = document.createElement("div");

		theSide = document.getElementsByClassName("side")[0];
		if (typeof(theSide) === 'undefined') {
			theContent = document.getElementsByClassName("content")[0];
			newDiv.innerHTML = '<div class="content">' + theContent.innerHTML + '</div>';
		} else {
			obj = this.getNextSibling(theSide);
			while (obj.className != "content") {
				obj = this.getNextSibling(obj);
			}
			theContent = obj;
			newDiv.innerHTML = '<div class="side">' + theSide.innerHTML + '</div><div class="content">' + theContent.innerHTML + '</div>';
			theSide = theSide.parentNode.removeChild(theSide);
		}
		newDiv.id = "srh_content";
		theContent = theContent.parentNode.removeChild(theContent);
		theHeader.parentNode.insertBefore(newDiv, this.getNextSibling(this.getNextSibling(theHeader)));
		this.setPadding();
		setTimeout(function () {staticRedditHeader.setPadding(); }, 1000); //because sometimes there needs to be a delay.
		setTimeout(function () {staticRedditHeader.setPadding(); }, 3000); //because sometimes there needs to be a delay.
		setTimeout(function () {staticRedditHeader.setPadding(); }, 6000); //because sometimes there needs to be a delay.
	},
	moveSubRedditDrop: function () {
		theSRHeader = document.getElementById("sr-header-area");
		allSRDrop = theSRHeader.getElementsByClassName("srdrop"); //0 is label, 1 is drop choices
		
		if (allSRDrop.length != 0) {
			this.addGlobalStyle('#header-bottom-left {float:left;} #header-bottom-right {float:right; position:relative; top:0px; bottom:auto; -moz-border-radius-topleft:0px; -webkit-border-top-left-radius:0px; -moz-border-radius-bottomleft: 7px;  -webkit-border-bottom-left-radius: 7px;} ');

			theSRHeader = theSRHeader.parentNode.removeChild(theSRHeader); //remove the sub-Reddit header

			theLabel = allSRDrop[0];
			theChoices = allSRDrop[1];
	
			headerleft = document.getElementById("header-bottom-left");
			headerright = this.getNextSibling(headerleft);
			headerright = headerright.parentNode.removeChild(headerright);
			newheaderright = headerleft.parentNode.insertBefore(headerright, headerleft);
			cleardiv = document.createElement("div");
			cleardiv.style.clear = "both";
			headerleft.parentNode.appendChild(cleardiv);
			
			var arrTabMenu = headerleft.getElementsByTagName("ul");
			var tabmenu;
			dropdownli = document.createElement("li");
			dropdownli.innerHTML = "<a class='srhTab' onclick='open_menu(this)'><span class='selected title'>"+theLabel.innerHTML+"<img src='http://www.reddit.com/static/droparrowgray.gif'></span></a>";
			dropdownli.appendChild(theChoices);

			if (typeof(arrTabMenu[0]) != 'undefined') {
				tabmenu = arrTabMenu[0];
			} else {
				tabmenu = document.createElement("ul");
				tabmenu.className = "tabmenu";
				headerleft.appendChild(tabmenu);
			}
			tabmenu.appendChild(dropdownli);			
		}
	},
	createRisingTab: function () {
		headerleft = document.getElementById("header-bottom-left");
		var arrTabMenu = headerleft.getElementsByClassName("tabmenu");
		var newTab;
		if (typeof(arrTabMenu[0]) != 'undefined') {
			tabmenu = arrTabMenu[0];
			var allLIs = tabmenu.getElementsByTagName("li");
			for (var iLI = 0; iLI < allLIs.length; iLI++) {
				if (allLIs[iLI].getElementsByTagName("a")[0].innerHTML === "new") {
					newTab = allLIs[iLI];
					iLI = allLIs.length;
				}
			}
			if (typeof(newTab) != "undefined") {		
				risingTab = document.createElement("li");
				risingTab.innerHTML = "<a href='"+ newTab.getElementsByTagName("a")[0].href +"?sort=rising'>rising</a>";
				newTab.parentNode.insertBefore(risingTab, this.getNextSibling(newTab));
			}
		}
	},
	createUserTab: function () {
		//remove std 'saved' tab
		headerleft = document.getElementById("header-bottom-left");
		var arrTabMenu = headerleft.getElementsByClassName("tabmenu");
		if (typeof(arrTabMenu[0]) != 'undefined') {
			tabmenu = arrTabMenu[0];
			var allLIs = tabmenu.getElementsByTagName("li");
			for (var iLI = 0; iLI < allLIs.length; iLI++) {
				if (allLIs[iLI].getElementsByTagName("a")[0].innerHTML === "saved") {
					tabmenu.removeChild(allLIs[iLI]);
				}
			}
		} else {
			var tabmenu = document.createElement("ul");
			tabmenu.className = "tabmenu";
			headerleft.appendChild(tabmenu);
		}
		//create user tab
		user = document.getElementsByClassName("user")[0];
		userTab = document.createElement("li");
		strUserPath = user.getElementsByTagName("a")[0].href;
		strUserName = user.getElementsByTagName("a")[0].innerHTML;
		strOverview = "<a href='"+strUserPath+"overview' class='choice'>overview</a>";
		strComments = "<a href='"+strUserPath+"comments' class='choice'>comments</a>";
		strSubmitted = "<a href='"+strUserPath+"submitted' class='choice'>submitted</a>";
		strSaved = "<a href='/saved/' class='choice'>saved</a>";
		strLiked = "<a href='"+strUserPath+"liked' class='choice'>liked</a>";
		strDisliked = "<a href='"+strUserPath+"disliked' class='choice'>disliked</a>";
		strHidden = "<a href='"+strUserPath+"hidden' class='choice'>hidden</a>";
		strFriends = "<a href='/prefs/friends/' class='choice'>friends</a>";
		strActivity = "<a href='/account-activity' class='choice'>activity</a>";
		userTab.innerHTML = "<a class='srhTab' onclick='open_menu(this)'><span class='selected title'>"+strUserName+"<img src='http://www.reddit.com/static/droparrowgray.gif'></span></a><div class='drop-choices tabdrop'>"+strActivity+strComments+strDisliked+strFriends+strHidden+strLiked+strOverview+strSaved+strSubmitted+"</div>";
		tabmenu.appendChild(userTab);
	},
	extendTopTab: function () {
		//remove std 'top' tab
		headerleft = document.getElementById("header-bottom-left");
		arrTabMenu = headerleft.getElementsByClassName("tabmenu");
		if (typeof(arrTabMenu[0]) != 'undefined') {
			tabmenu = arrTabMenu[0];
			var allLIs = tabmenu.getElementsByTagName("li");
			for (var iLI = 0; iLI < allLIs.length; iLI++) {
				if (allLIs[iLI].getElementsByTagName("a")[0].innerHTML === "top") {
					tabmenu.removeChild(allLIs[iLI]);
		
					//create top drop tab
					headerleft = document.getElementById("header-bottom-left");
					user = document.getElementsByClassName("user")[0];
					tabmenu = headerleft.getElementsByClassName("tabmenu")[0];
					userTab = document.createElement("li");
					strHour = "<a href='/top/?=all&t=hour' class='choice'>this hour</a>";
					strDay = "<a href='/top/?=all&t=day' class='choice'>today</a>";
					strWeek = "<a href='/top/?=all&t=week' class='choice'>this week</a>";
					strMonth = "<a href='/top/?=all&t=month' class='choice'>this month</a>";
					strYear = "<a href='/top/?=all&t=year' class='choice'>this year</a>";
					strAllTime = "<a href='/top/?=all&t=all' class='choice'>all time</a>";
					userTab.innerHTML = "<a class='srhTab' onclick='open_menu(this)'><span class='selected title'>top<img src='http://www.reddit.com/static/droparrowgray.gif'></span></a><div class='drop-choices tabdrop'>"+strHour+strDay+strWeek+strMonth+strYear+strAllTime+"</div>";
					tabmenu.appendChild(userTab);
				}
			}
		}
	},
	addGlobalStyle: function(css) {
		var head, style;
		head = document.getElementsByTagName('head')[0];
		if (!head) { return; }
		style = document.createElement('style');
		style.type = 'text/css';
		style.innerHTML = css;
		head.appendChild(style);
	},
	init: function() {
		this.addGlobalStyle(' \
			div.srhUI { display:none; z-index: 999; border:1px solid #5F99CF; position:fixed; background: white; padding:3px; width:150px; \
			-webkit-border-bottom-right-radius: 4px; \
			-webkit-border-bottom-left-radius: 4px; \
			-moz-border-radius-bottomright: 4px; \
			-moz-border-radius-bottomleft: 4px; \
			border-bottom-right-radius: 4px; \
			border-bottom-left-radius: 4px; \
			-moz-box-shadow: 1px 3px 12px #888; -webkit-box-shadow: 1px 3px 12px #888; box-shadow: 1px 3px 12px #888;} \
			a.srhTab span img {margin-right: -5px; vertical-align:bottom; background: inherit !important;} a.srhTab span {background:inherit !important; color:inherit !important; } \
			div.srhUI div {display: block; margin: 2px 0px 2px 5px;} \
			div.srhUI input {vertical-align:text-bottom; margin-right:5px;}');
		this.readStore();
//		this.insertConfigMenu();
		this.createUITab();
		if (this.srh.options.dropdownTopTab.enabled == true) {
			this.extendTopTab();
		}
		if (this.srh.options.moveSubReddits.enabled == true) {
			this.moveSubRedditDrop();
		}
		if (this.srh.options.addRisingTab.enabled == true) {
			this.createRisingTab();
		}
		if (this.srh.options.addUserTab.enabled == true) {
			this.createUserTab();
		}
		if (this.srh.options.staticHeader.enabled == true) {
			this.makeHeaderStatic();
		}
		if (this.srh.options.moveStickyElement.enabled == true) {
			this.moveSticky();
		}
		this.writeStore();
	}
}
document.addEventListener('load',staticRedditHeader.init(),true);
