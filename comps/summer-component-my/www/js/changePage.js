/*********************************** Global Variable&&Constant Define ***********************************/
var userinfo,attr,title,flag,param;

/*********************************** Summer Lifecycle Handler Define ***********************************/
summerready = function() {
	userinfo = summer.getStorage("userinfo");
	//$summer.fixStatusBar($summer.byId('header'));
	attr = summer.pageParam.attr;
	title = summer.pageParam.title;
	flag = summer.pageParam.flag;
	param = summer.pageParam.data;
	Init();
	bindEvents()
}
/*********************************** Init Method Define ***********************************/
function Init() {
	$('.um-header h3').text(title)
	$('.change-name-box .form-control').val(attr);
}

/*********************************** DOM Event Handler Define ***********************************/
function bindEvents() {
	$('.change-name-box .form-control').on('input propertychange', function() {
		if ($('.um-content .form-control').val() != attr && $('.um-content .form-control').val() != '') {
			$('.um-header-right').removeClass('disabled');
		} else {
			$('.um-header-right').addClass('disabled');
		}
	})
	/*点击清除按钮*/
	$(".change-name-box .um-input-clear").click(function() {
		$(this).prev("input").val("");
		$('.um-header-right').addClass('disabled');
	});
	/*保存按钮点击事件*/
	$('.um-header-right').on('click', function() {
		if ($(this).hasClass('disabled')) {
			if ($('.um-content .form-control').val() == '') {
				common.toast('请完善信息!');
			} else {
				common.toast('信息未作修改!');
			}
			return;
		}
		switch (flag) {
			case 'name':
				param.name = $.trim($('.um-content .form-control').val());
				break;
			case 'mobile':
				param.mobile = $.trim($('.um-content .form-control').val());
				if (!(/^1[34578]\d{9}$/.test(param.mobile))) {
					common.toast("手机号码有误，请完善信息");
					return false;
				}
				break;
			case 'email':
				param.email = $.trim($('.um-content .form-control').val());
				var reg =  /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
				if (!reg.test(param.email)) {
					common.toast("邮箱号码有误，请完善信息");
					return false;
				};
				break;
		}
		common.ajaxRequest('usercenter/update', 'post', "application/x-www-form-urlencoded", param, function(res) {
			if (res.status == 'success') {
				//回写userinfo
				var obj=JSON.stringify(param)
				userinfo.userName = param.name;
				summer.setStorage("userinfo", userinfo);
				summer.execScript({
					winId : 'information',
					script : 'edit('+obj+');'
				});
				summer.execScript({
					winId : 'root',
					frameId : 'my',
					script : 'edit('+obj+');'
				});
				summer.closeWin();
			}
			if (res.status == 'failed') {
				common.toast(res.errormsg);
				return false;
			}
		}, function(res) {
			common.toast(res.errormsg)
		})
	})
}
