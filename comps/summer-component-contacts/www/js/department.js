/*********************************** Global Variable&&Constant Define ***********************************/
var G__CACHE_KEY_CONTACTS_DEPARTMENT_LIST = "__CACHE_CONTACTS_DEPARTMENT_LIST";
var G__Cache_Duration = 100000;

/*********************************** Summer Lifecycle Handler Define ***********************************/
summerready = function(){
//登录
realLogin();
	//$summer.fixStatusBar($summer.byId('header'));
	//var dataText = doT.template($("#domTemp").text());
	//$(".addressList").html(dataText(testData));
	//return;
	//getData();
	summer.openFrame({
        "id" : "department_frame",
        "url" : "comps/summer-component-contacts/www/html/department_frame.html",
        "position" : {
            "left" : 0,
            "right" : 0,
            "top" : 83,
            "bottom" : 0
        }
    });	
    
};
// 登录有信 IM
function loginIm(){
    var _userinfo = summer.getStorage("userinfo");
        var userinfo = {
            "usercode": _userinfo.yhtId,
            "userName": _userinfo.userName,
        }
        var params = {
            "method": "YYIM.login",
            "params": {
                "userinfo": userinfo
            }
        }
        cordova.exec(null, null, "XService", "callSync", [params]);
}
function trimStr(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}
 function realLogin() {
    var accountContent = trimStr("youwenhua12@126.com");
    var passwordContent = trimStr("12345678");
    var param = {
        userName: trimStr(accountContent),
        password: trimStr(passwordContent),
    }
    ajaxRequest({
        type: 'post',
        url: '/auth/login',
        param: param
    }, function (res) {
        if (res.flag == 0) {
           // alert('登录成功')
            var userinfo = {
                id: res.data.id,
                yhtId: res.data.yhtId,
                token: res.data.token,
                account: res.data.mobile ? res.data.mobile : res.data.email,
                userName: res.data.userName ? res.data.userName : '',
                avatar: res.data.avatar ? res.data.avatar : '',
                name: res.data.name ? res.data.name : ''
            }
           // var account = {
           //     account: self.state.nameContent
            //}
            summer.setStorage('userinfo', userinfo);
          //   summer.setStorage('account', account)
            summer.setAppStorage('userinfo', userinfo)
            summer.toast({msg: '登录成功'});
            loginIm();
            /*summer.openWin({
                id: 'root',
                url: 'Index/Index.html',
                isKeep: false,

            })*/
        } else {
            var message = res.msg ? res.msg : '登录失败';
            summer.toast({msg: message})
        }
    }, function (err) {
        var message = err.error ? err.error : '登录失败';
        summer.toast({msg: message})
    })
}
/*********************************** Init Method Define ***********************************/
function getData(){
	if(common.cacheManager.getCache(G__CACHE_KEY_CONTACTS_DEPARTMENT_LIST)){
		var _data=common.cacheManager.getCache(G__CACHE_KEY_CONTACTS_DEPARTMENT_LIST);
		var dataText = doT.template($("#domTemp").text());
		$(".addressList").html(dataText(_data));
		bindEvents()
	}else{
		summer.showProgress({
	        "title" : "加载中..."
	    });
	    common.ajaxRequest("addresslist/query/list","get","application/x-www-form-urlencoded",{},function(data){
			if(data.success == true){
				summer.hideProgress();
				common.cacheManager.setCache(G__CACHE_KEY_CONTACTS_DEPARTMENT_LIST,data.result,G__Cache_Duration);
				if(data.result.length==0){
					$('.margin').removeClass('none');
					$('.nothingdiv').removeClass('none');
				}				
				var dataText = doT.template($("#domTemp").text());
				$(".addressList").html(dataText(data.result));
	        }else{
	        	summer.hideProgress();
	            common.toast('稍后再试');
	        }
	    },function(data){
	    	summer.hideProgress();
	        common.toast('稍后再试');
	    });
    }
}

/*********************************** DOM Event Handler Define ***********************************/
function opensearch(){
	summer.openWin({
		id : "search",
		url : "comps/summer-component-contacts/www/html/search.html"
	});
}

function openWin(obj){
	summer.openWin({
		id : "employee",
		url : "comps/summer-component-contacts/www/html/employee.html",
		statusBarStyle:"light",
		pageParam :{
			id:$(obj).attr("data-userid"),
			tenantid:$(obj).attr("data-tenantid")
		}
	});
}
 