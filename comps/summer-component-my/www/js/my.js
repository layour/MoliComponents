/*********************************** Global Variable&&Constant Define ***********************************/
var userinfo,version;

/*********************************** Summer Lifecycle Handler Define ***********************************/
summerready = function() {
	getData()
};
function edit(obj) {
	document.getElementsByClassName('name')[0].innerHTML = (obj.name);
}

/*********************************** Init Method Define ***********************************/
function getData() {
	userinfo = summer.getStorage('userinfo');
	version=JSON.parse(summer.getAppVersion());
	if (userinfo.userAvator) {
		document.getElementById('headImg').setAttribute('src', userinfo.avatar);
	} else {
		document.getElementById('headImg').setAttribute('src', '../../img/user.png');
	}
	document.getElementsByClassName('name')[0].innerHTML = (userinfo.userName);
	document.querySelector("#version span").innerHTML = version.versionName;
}

function toNum(a) {
	var b = "";
	var c = a.split('.');
	for (var i = 0; i < c.length; i++) {
		b += c[i];
	} ;
	b = parseInt(b)
	return b;
}

/*********************************** DOM Event Handler Define ***********************************/
function openWin(type) {
	summer.openWin({
		"id" : type,
		"url" : 'comps/summer-component-my/www/html/' + type + '.html'
	});
}

function checkVersion() {
	var url1 = "versioncenter/curversion";
	var param = {
		"appCode" : "yuncai-supplier"
	};
	var num,downloadUrl;
	var os = $summer.os;
	//alert("ios版本信息为"+JSON.stringify(version));
	common.ajaxRequest(url1, 'get', "application/x-www-form-urlencoded", param, function(res) {
		if (res.success == true){
			num = res.result.versionCode;
			downloadUrl = res.result.downloadUrl;
				if(os == "ios"){
					var iosVersionCode=parseInt(version.versionCode.slice(0,3))+1;
					if (parseInt(iosVersionCode) < parseInt(num)) {
					UM.confirm({
						title : '发现新版本，是否更新？',
						btnText : ["取消", "确定"],
						overlay : true,
						ok : function() {
								summer.openWebView({
								     url : "https://itunes.apple.com/cn/app/id1228503235"  
								});
						}
					});
				} else {
						return;
				}
			 }else{
			 	if (parseInt(version.versionCode) < parseInt(num)) {
				UM.confirm({
					title : '发现新版本，是否更新？',
					btnText : ["取消", "确定"],
					overlay : true,
					ok : function() {
							summer.openWebView({
								url : "http://" + downloadUrl
							});
					}
				});
			} else {
					common.toast("当前为最新版本");
			 }
		 }
			
			
		}else{
			if(os == "ios"){
					return;
				}else{
					common.toast("当前为最新版本");
				}
		    }
	}, function(res) {
	    if(os == "ios"){
	    	return
	    }else{
		common.toast(res.errormsg)
		}
	});

}

/*********************************** Private Method Define ***********************************/

