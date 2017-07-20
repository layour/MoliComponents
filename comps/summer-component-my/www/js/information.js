/*********************************** Global Variable&&Constant Define ***********************************/
var userinfo;

/*********************************** Summer Lifecycle Handler Define ***********************************/
summerready = function() {
	userinfo = summer.getStorage("userinfo");
	//$summer.fixStatusBar($summer.byId('header'));
	loadInfo()
};

function edit(obj){
	$('.userName').text(obj.name);
	$('.userMobile').text(obj.mobile);
	$('.userEmail').text(obj.email);
}

/*********************************** Init Method Define ***********************************/ 
function loadInfo() {
	var url = 'usercenter/curuser';
	common.ajaxRequest(url, 'GET', "application/x-www-form-urlencoded", {}, function(res) {
		if (res.status == 'success') {
			if(res.data.userAvator){
				$('.user-header').attr('src',res.data.userAvator);
			}else{
				$('.user-header').attr('src',"../../img/user.png");
			};
			$('.userCode').text(res.data.userCode);
			$('.userName').text(res.data.userName);
			$('.userMobile').text(res.data.userMobile);
			$('.userEmail').text(res.data.userEmail);
			$('.enterprise').text(res.data.enterprise.name);			
		} else {
			common.toast(res.status)
		}
	}, function(res) {
		common.toast("状态：" + res.status + "\n错误：" + res.error);		
	})
}

/*********************************** Private Method Define ***********************************/
//获取用户用户信息
function getAuth() {
	var userinfo = summer.getStorage("userinfo");
	if (!userinfo) {
		return "";
	}
	var u_logints = userinfo.u_logints;
	var u_usercode = userinfo.u_usercode;
	var tenantid = userinfo.tenantid;
	var token = userinfo.token;
	var auth = "u_logints=" + u_logints + ";u_usercode=" + u_usercode + ";token=" + token + ";tenantid=" + tenantid;
	return auth;
};

//创建随机数
var createUUID = (function(uuidRegEx, uuidReplacer) {
	return function() {
		return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(uuidRegEx, uuidReplacer).toUpperCase();
	};
})(/[xy]/g, function(c) {
	var r = Math.random() * 16 | 0,
	    v = c == "x" ? r : (r & 3 | 8);
	return v.toString(16);
});

function camera() {
summer.openCamera({
		//compressionRatio : 0.5,
		callback : function(args) {
			var imgPath = args.compressImgPath;	
			$('.user-header').attr('src',imgPath)	
			//upload(imgPath)
		}
	})
		/*summer.openCamera({
			         "callback" : function(args){
			             alert(args.imgPath)} //图片路径，类型为string 
			     });*/
}

function openPhotoAlbum() {
	summer.openPhotoAlbum({
		compressionRatio : 0.5,
		callback : function(args) {
			var imgPath = args.compressImgPath;
			$('.user-header').attr('src',imgPath)
			//upload(imgPath)
		}
	});
}

//把图片流上传用户中心
function upload(path) {
	var params = {};
	params.filepath = createUUID();
	params.groupname = "attend";
	params.url = "true";
	var auth = getAuth();
	var headers = {
		'Authority' : auth
	};
	var fileURL = path;
	var SERVER = 'http://10.1.78.75:9999/cpu-ma/usercenter/upload';
	summer.upload({
		"fileURL" : fileURL, //需要上传的文件路径
		"type" : "image/jpeg", //上传文件的类型 > 例：图片为"image/jpeg"
		"params" : params, //上传参数
		"SERVER" : SERVER //服务器地址
	}, function(ret) {
		var newData = JSON.parse(ret.response);
		if (newData.status == 1) {
			setimg(newData.fileName);
			userinfo.avator = param.avator;
			summer.setStorage("userinfo", userinfo);
			summer.execScript({
				winId : 'my',
				script : 'getData()'
			});
		} else {
			common.toast(newData.msg);
			return false;
		}
	}, function(err) {
		common.toast("上传失败");
	});
}

//图片回写给有人才后台
function setimg(imgurl) {
	var params = {
		"avator" : imgurl
	};
	common.ajaxRequest("usercenter/updateAvator", "POST", "application/x-www-form-urlencoded", params, function(data) {
		if (data.status == "success") {
			common.toast("头像上传成功");
		}
	});
}

/*********************************** DOM Event Handler Define ***********************************/
function goChangePage(obj, name) {
	summer.openWin({
		id : 'changePage',
		url : 'summer-component-my/www/html/changePage.html',
		pageParam : {
			attr : $(obj).find('.form-control').text(),
			title : $(obj).find('.um-list-item-left').text(),
			flag : name,
			data : {
				name : $('#btn1').text(),
				mobile : $('#btn2').text(),
				email : $('#btn3').text()
			}
		}
	})
}

function changeHeaderImg() {
	UM.actionsheet({
		title : '',
		items : ['从相册中选择', '拍照'],
		callbacks : [openPhotoAlbum, camera]
	});
}


