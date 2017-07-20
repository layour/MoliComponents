/*********************************** Summer Lifecycle Handler Define ***********************************/
summerready = function() {
	//$summer.fixStatusBar($summer.byId('header'));
	loadInfo();
}
/*********************************** Init Method Define ***********************************/
function loadInfo() {
	var url = 'usercenter/curuser';
	common.ajaxRequest(url, 'get', "application/x-www-form-urlencoded", {}, function(res) {
		if (res.status == 'success') {
			document.querySelector(".userCode").innerHTML=res.data.userCode;
			document.querySelector(".userMobile").innerHTML=res.data.userMobile;
			document.querySelector(".userEmail").innerHTML=res.data.userEmail;
		} else {
			common.toast(res.status)
		}
	}, function(res) {
		common.toast("状态：" + res.status + "\n错误：" + res.error);
	})
}

/*********************************** DOM Event Handler Define ***********************************/
function showPrompt() {
	UM.prompt({
		title : '验证原密码',
		text : '为保证您的数据安全，修改密码前请填写原密码',
		btnText : ["取消", "确定"],
		ok : function(data) {
			common.ajaxRequest('usercenter/verifyPwd', 'get', 'application/x-www-form-urlencoded', {
				"shaPwd" : common.SHA1(data),
				"md5Pwd" : hex_md5(data)
			}, function(res) {
				if (res.status == 'success') {
					common.toast(res.msg);
					summer.openWin({
						id : 'modifyPassword',
						url : 'summer-component-my/www/html/modifyPassword.html',
						pageParam : {
							password : data,
							userEmail : document.querySelector(".userEmail").innerHTML
						}
					})
				} else if (res.status == 'failed') {
					common.toast(res.msg);
				} else {
					common.toast(res.msg);
				}
			}, function(res) {
				common.toast("后台服务未启动");
			});
		},
		cancle : function() {

		}
	})
}

function clearCache() {
	common.toast('功能暂未开放')
}
