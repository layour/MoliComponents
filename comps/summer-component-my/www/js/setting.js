/*********************************** Global Variable&&Constant Define ***********************************/

/*********************************** Summer Lifecycle Handler Define ***********************************/
summerready = function() {
	//$summer.fixStatusBar($summer.byId('header'));
	renderButton();
	/*ios更改本地存储的方法，暂时先做andorid*/
	if($summer.os=='android'){
		var localSize = getLocalSize() > 1024 * 1024 ? (getLocalSize() / 1024 / 1024).toFixed(2) + ' MB' : (getLocalSize() / 1024).toFixed(2) + ' kb';
		$('.local-storage-size').text(localSize);
	}
}
/*********************************** Init Method Define ***********************************/
function renderButton() {
	/*var recieveIM = common.G_CurUserInfo.recieveIM;
	var recieveVoice = common.G_CurUserInfo.recieveVoice;
	var recieveshock = common.G_CurUserInfo.recieveShock;
	if (recieveIM) {
		$('.recieveIM .um-switch1 input').attr('checked', true);
	} else {
		$('.recieveIM .um-switch1 input').attr('checked', false);
	}
	if (recieveVoice) {
		$('.recieveVoice .um-switch1 input').attr('checked', true)
	} else {
		$('.recieveVoice .um-switch1 input').attr('checked', false);
	}
	if (recieveshock) {
		$('.recieveShock .um-switch1 input').attr('checked', true);
	} else {
		$('.recieveShock .um-switch1 input').attr('checked', false);
	}*/
	var buttonStatus=summer.callSync('YYIM.getSettings',{});
	buttonStatus=JSON.parse(buttonStatus);
	console.log(buttonStatus);
	//新消息提醒
	if (buttonStatus.newMsgRemind) {
		$('.recieveIM .um-switch1 input').attr('checked', true);
	} else {
		$('.recieveIM .um-switch1 input').attr('checked', false);
	}
	//声音
	if (buttonStatus.playSound) {
		$('.recieveVoice .um-switch1 input').attr('checked', true)
	} else {
		$('.recieveVoice .um-switch1 input').attr('checked', false);
	}
	//震动
	if (buttonStatus.playVibrate) {
		$('.recieveShock .um-switch1 input').attr('checked', true);
	} else {
		$('.recieveShock .um-switch1 input').attr('checked', false);
	}
}

/*********************************** Private Method Define ***********************************/ 
/*获取缓存的大小*/
function getLocalSize() {
	var size = 0;
	for (item in window.localStorage) {
		if (window.localStorage.hasOwnProperty(item)) {
			size += JSON.stringify(summer.getStorage(item)).length;
		}
	};	
	return size;	
}


//退出有信
function quitIm() {
	var params = {
		"method" : "YYIM.logout",
		"params" : {}
	}	
	cordova.exec(null, null, "XService", "callSync", [params]);
}

/*********************************** DOM Event Handler Define ***********************************/ 
function openWin(type) {
	summer.openWin({
		"id" : type,
		"url" : 'summer-component-my/www/html' + type + '.html',
	});
}

function loginQuit() {
	var os = $summer.os;
	UM.confirm({
		title : '确定要退出吗？',
		btnText : ["取消", "确定"],
		overlay : true,
		ok : function() {
			summer.rmStorage("userinfo");
			quitIm()
			if (os == "android") {
				summer.closeToWin({
					id : "root"
				});
			} else {
				summer.closeWin({
					id : "root"
				});
			}
			summer.openWin({
				"id" : 'login',
				"url" : 'summer-component-my/www/html/login.html',
				"isKeep" : false
			});
		}
	});
}

/*取消消息推送*/
function changeIM(obj) {
	var type=$(obj).attr('data-type');
	if ($(obj).find('input').attr('checked') == 'checked') {
		$(obj).find('input').attr('checked', false);
		updateIM(type,false);
		/*quitIm();
		/!*更改本地存储状态*!/
		var newInfo = summer.getStorage('userinfo')
		newInfo.recieveIM = false;
		summer.setStorage('userinfo', newInfo);*/

	} else {
		$(obj).find('input').attr('checked', true);
		updateIM(type,true);
		/*loginIm();
		/!*更改本地存储状态*!/
		var newInfo = summer.getStorage('userinfo')
		newInfo.recieveIM = true;
		summer.setStorage('userinfo', newInfo);*/
	}

}

function updateIM(type,value){
	switch (type){
		case 'newMsgRemind':
			var params = {
				"newMsgRemind":value,	// 新消息提醒
			}
			break;
		case 'playSound':
			var params = {
				"playSound":value		// 声音
			}
			break;
		case 'playVibrate':
			var params = {
				"playVibrate":value,	// 振动
			}
			break;
	}
	summer.callSync("YYIM.updateSettings", params);
}
function clearCache() {
	common.toast('功能暂未开放')
}