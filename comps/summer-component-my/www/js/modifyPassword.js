/*********************************** Global Variable&&Constant Define ***********************************/
var oldPw;
/*********************************** Summer Lifecycle Handler Define ***********************************/
summerready = function() {
	//$summer.fixStatusBar($summer.byId('header'));
	oldPw = summer.pageParam.password;
	$('#userEmail').text(summer.pageParam.userEmail)
	bindEvents() 

}
/*********************************** Init Method Define ***********************************/

/*********************************** DOM Event Handler Define ***********************************/
function bindEvents() {
	$('.password-agin').on('input', function() {
		if ($(this).val() != '' && $('.password-new').val() != '') {
			$('.um-header-right').addClass('abled')
		} else {
			$('.um-header-right').removeClass('abled')
		}
	})

	$('.um-header .um-header-right').on('click', function() {
		var strWord =$('.password-new').val();
		var newWord = $('.password-agin').val();
		console.log(strWord,newWord);
		if (strWord == '' || newWord == '') {
			common.toast('密码不能为空');
			return;
		}else if(strWord.length < 8 || newWord.length < 8){
			common.toast('密码长度不少于8字符');
			return;
		}else if(strWord.length >20 || newWord.length >20){
			common.toast('密码长度不超过20字符');
			return;
		}else if(/\s/.test(strWord) || /\s/.test(newWord)){
			common.toast('密码不包括空格');
			return;
		}else if(!(/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{8,20}$/.test(strWord)) || !(/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{8,20}$/.test(newWord))){
			common.toast('密码包括字母，数字，特殊符号其中至少两种');
			//特殊字符位其中之一  ~!@#$%^&*
			return;
		}else if(strWord != newWord){
			common.toast('两次密码不一致');
			return;
		}
		/*新旧密码都是明文*/
		var param = {
			"prePwd" : oldPw,
			"newPwd" : $.trim($('.password-new').val())
		}
		common.ajaxRequest('usercenter/modifyPwd', 'post', 'application/x-www-form-urlencoded', param, function(res) {
			if (res.status == 'success') {
				common.toast('密码修改成功');
				setTimeout('closeAPP()',700);
			}else if (res.status == 'failed') {
				common.toast('未修改成功');
			}else {
				common.toast(res.msg);
			}
		}, function(res) {
			common.toast("后台服务未启动");
		})
	})
}
//退出有信
function quitIm() {
	var params = {
		"method" : "YYIM.logout",
		"params" : {}
	}	
	cordova.exec(null, null, "XService", "callSync", [params]);
}
//关闭APP
function closeAPP(){
	quitIm()
	summer.openWin({
		"id" : 'login',
		"addBackListener":"true",
		"url" : 'summer-component-my/www/html/login.html',
		"isKeep" : false
	});
}