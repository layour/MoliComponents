/**
 * Created by XYC on 2017/6/19.
 */
function getDeviceidAndToken() {
	var deviceId = summer.getDeviceInfo().deviceid;
	var userinfo = summer.getStorage("userinfo");
	var token = userinfo ? userinfo.token : "";
	return {
		"deviceId" : deviceId,
		"token" : token
	}
}
function ajaxRequest(paramObj, successCallback, errorCallback){
	//var testPath = "http://uculture-test.app.yyuap.com" + paramObj.url;
		var testPath = "http://172.27.35.1:8080" + paramObj.url;
	var header = getDeviceidAndToken();
	if(paramObj.contentType){
		header["Content-Type"] = paramObj.contentType;
	}
	summer.ajax({
		type : paramObj.type,
		url : testPath,
		param : paramObj.param,
		// 考虑接口安全，每个请求都需要将这个公告header带过去
		header: header
	},function(response){
		var data = JSON.parse(response.data);
		var tokenerror = summer.getStorage("G-TOKEN-ERROR");
		if (tokenerror) {
			return false;
		}
		if (data.code == "sys.token.error"){
			// 设置token标志
			summer.setStorage("G-TOKEN-ERROR",true);
			// 清除userinfo，直接退出之后，再进入可以直接跳入到登录
			summer.setStorage("userinfo","");
			// 提示框
			summer.toast({
				msg : "token失效,即将跳转登录页"
			});
			//  退出有信
			var params = {
				"method": "YYIM.logout",
				"params": {}
			}
			cordova.exec(null, null, "XService", "callSync", [params]);
			// 跳转到登录页面
			setTimeout(function(){
				summer.openWin({
					id : "login",
					url : "Account/Login.html",
					isKeep : false
				});
			},500);
			return false;
		}
		successCallback(data);
	},function(response){
		errorCallback(response)
	});
}

//判断是否为空
function isEmpty(data) {
	if (data == undefined || data == null || data == "" || data=='NULL' || data==false || data=='false') {
		return true;
	}
	return false;
}

function createNull (id) {
	var html = '<div class="default-error" style="display: -webkit-box;display: flex; -webkit-box-pack: center;justify-content: center; -webkit-box-align: center;align-items: center; -webkit-box-orient: vertical; -webkit-box-direction: normal;flex-direction: column;width: 100%;height: 100%;position: fixed;margin-top: 0.8rem;">'+
		'<img src="../static/icon/404.png" style="width: 46vw;height: 4.5rem;" alt=""/>'+
		'<h3 style="font-size: 0.36rem;color: #BABABA;">暂无数据</h3>'+
	'</div>';
	var curId = $summer.byId(id);
	$summer.html(curId,html);
}