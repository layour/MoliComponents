/*********************************** Global Variable&&Constant Define ***********************************/
var g_pathArr = [];

/*********************************** Summer Lifecycle Handler Define ***********************************/
summerready = function() {
	//$summer.fixStatusBar($summer.byId('header'));
	bindEvents()
	setTimeout(function(){
		common.toast('功能暂未开放')
	},400)
	
}
/*********************************** Init Method Define ***********************************/
function bindEvents() {
	$("#question").on("input propertychange", function() {
		var length = $(this).val().length;
		$('#txtShow').text(length + '/200');
	});
	var plus = $("#ibox .con-con .font");
	var phei = plus.parent().width() - 2;
	var pwid = plus.parent().width() - 2;
	plus.css({
		"width" : pwid,
		"height" : phei
	});
}

/*********************************** Private Method Define ***********************************/
function closePic(obj) {
	var src = $(obj).prev("img").attr("src");
	g_pathArr.remove(src);
	$(obj).parent().parent(".con").remove();
	var len = $("#ibox .con").length - 1;
	$('#picShow').text(len + '/4');
	$("#plus").removeClass("none");
}

function camera() {//打开相机
	summer.openCamera({
		compressionRatio : 0.5,
		callback : function(args) {
			var imgPath = args.compressImgPath;
			g_pathArr.push(imgPath);
			var picDiv = '<div class="con">' + '<div class="con-con">' + '<img src="' + imgPath + '">' + '<img src="../../img/close.png" class="close" onClick="closePic(this);">' + '</div></div>';
			$("#plus").before(picDiv);
			var len = $("#ibox .con").length - 1;
			$('#picShow').text(len + '/4');
			if (len == 4) {
				$("#plus").addClass("none");
			}
		}
	})
}

function openPhotoAlbum() {//打开相册
	summer.openPhotoAlbum({
		compressionRatio : 0.5,
		callback : function(args) {
			var imgPath = args.compressImgPath;
			g_pathArr.push(imgPath);
			var picDiv = '<div class="con">' + '<div class="con-con">' + '<img src="' + imgPath + '">' + '<img src="../../img/close.png" class="close" onClick="closePic(this);">' + '</div></div>';
			$("#plus").before(picDiv);
			var len = $("#ibox .con").length - 1;
			$('#picShow').text(len + '/4');
			if (len == 4) {
				$("#plus").addClass("none");
			}
		}
	});
}

function manyfileupload(obj) {//多图文上传方法
	var fileURL = obj.fileURL;
	var options = new FileUploadOptions();
	options.fileKey = "file";
	options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
	options.mimeType = "image/jpeg";
	var headers = {
		'Authority' : obj.auth
	};
	var params = {};
	params.filepath = obj.random;
	params.groupname = "question";
	params.url = "true";
	params.permission = "read";

	options.headers = headers;
	options.params = params;
	options.httpMethod = "POST";
	var ft = new FileTransfer();
	var SERVER = upload_url + "file/upload"
	ft.upload(fileURL, encodeURI(SERVER), function(ret) {
		if (obj.num == obj.i) {
			save(params.filepath);
		}
	}, function(err) {
		summer.hideProgress();
		common.toast("失败" + JSON.stringify(err));
	}, options);
}

function save(filepath) {//保存提问
	var question = $.trim($("#question").val());
	var askJson = {
		"question" : question,
		"filepath" : filepath
	};
	var url = "usercenter/feedback";
	common.ajaxRequest(url, "post", "application/x-www-form-urlencoded", askJson, function(data) {
		if (data.status == 'success') {
			common.toast("提交成功", true);
			setTimeout(function() {
				summer.closeWin();
			}, 2000);
		} else {
			common.toast('暂未开通');
			setTimeout(function() {
				summer.closeWin();
			}, 2000);
		}
		summer.hideProgress();
	});
}

//数组新增remove方法
Array.prototype.indexOf = function(val) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == val)
			return i;
	}
	return -1;
};
Array.prototype.remove = function(val) {
	var index = this.indexOf(val);
	if (index > -1) {
		this.splice(index, 1);
	}
};

/*********************************** DOM Event Handler Define ***********************************/
function showActionsheet() {
	UM.actionsheet({
		title : '选择照片',
		items : ['拍照', '从图库中选择'],
		callbacks : [camera, openPhotoAlbum]
	});
}

//此处为友人才专用upload， 带参数和header的请求,上传图片
function uploadHr() {
	var question = $.trim($("#question").val());
	if (question == "") {
		common.toast("问题不能为空");
		return false;
	}
	summer.showProgress({
		title : '加载中...'
	});
	save("");
	/*if(!g_pathArr||g_pathArr.length<1){//判断是否选取图片，没有选取图片，不用上传
	 save("");
	 }else{
	 //用户验证字段
	 var userinfo = JSON.parse(localStorage.getItem("userinfo"));
	 var u_logints = userinfo.u_logints;
	 var u_usercode = userinfo.u_usercode;
	 var tenantid = userinfo.tenantid;
	 var token = userinfo.token;
	 var auth = "u_logints="+u_logints+";u_usercode="+ u_usercode+";token="+token+";tenantid="+tenantid;
	 var random = createUUID();
	 //多图文上传方法调用,i和num是用来判断是否是最后一个，是否进行内容的保存
	 for(var i=0,length=g_pathArr.length;i<length;i++){
	 manyfileupload({
	 random:random,
	 fileURL:g_pathArr[i],
	 auth:auth,
	 num:length,
	 i:(i+1)
	 });
	 }
	 }*/
}

