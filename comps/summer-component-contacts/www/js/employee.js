/*********************************** Global Variable&&Constant Define ***********************************/

/*********************************** Summer Lifecycle Handler Define ***********************************/
summerready = function() {
	//$summer.fixStatusBar($summer.byId('header'));
	differ()	
	getData();
}

/*********************************** Init Method Define ***********************************/

/*function getData() {//获取列表
	var tenantid = summer.pageParam.id;
	var id = summer.pageParam.id;
	var url="addresslist/query/user/"+tenantid+"/"+id;
	common.ajaxRequest( url, "get", "application/x-www-form-urlencoded",{}, function(data) {
		if (data.success == true) {
			var person = data.result;
			var color = getColor(person.name);
			var photoTxt = person.avatar ? "<img class='um-circle' src='" + person.avatar + "'>" : person.name.slice(-2);
			$("#headImg").css("background", color).html(photoTxt);
			$("#name").html(person.name);
			$("#topheader").html(person.name);
			$("#mobile").html(person.mobile);
			$("#email").html(person.email);
			$("#tel").prop("href", "tel:" + person.mobile);
			$(".hiddenId").val(person.usercode);
		} else {
			common.toast(data.resultMessage);
		}
	});	
}*/
function getData(){
	var userid = summer.pageParam.id;
var param={
	 userid:userid,
	 pageNum:10
}
	ajaxRequest({
        type: 'get',
        url: '/userlink/getMyCorpUserByUserId',
        param: param
    }, function (res) {
    	console.log(res);
       // var dataText = doT.template($("#domTemp").text());
		//$(".addressList").html(dataText(res.data.content));
		var person =res.data;
			var color = getColor(person.name);
			var photoTxt = person.avatar ? "<img class='um-circle' src='" + person.avatar + "'>" : person.name.slice(-2);
			$("#headImg").css("background", color).html(photoTxt);
			$("#name").html(person.userName);
			$("#topheader").html(person.userName);
			$("#mobile").html(person.mobile);
			$("#email").html(person.email);
			$("#tel").prop("href", "tel:" + person.mobile);
			//$(".hiddenId").val(person.usercode);
		
		
    }, function (err) {
        alert("获取失败"+JSON.stringify(err));
    })
}

function differ(){
	var differ=$('.um-content').height()-$('.headerbgc').height()-$('.middlecontent').height();
	$(".bottomcontent").height($('.headerbgc').height()-44+differ);
}
/*********************************** Private Method Define ***********************************/


function getColor(name) {
	var color = ['#eead10', '#f99a2b', '#f38134', '#6495ed', '#3ab1aa', '#0abfb5', '#06aae1', '#00bfff', '#96bc53', '#00ced1', '#89a8e0'];
	var newName = encodeURI(name).replace(/%/g, "");
	var lastName,
	    hexadecimal,
	    tenBinary;
	if (newName.length >= 6) {
		lastName = newName.substr(lastName, 6);
		hexadecimal = parseInt(lastName, 16);
		tenBinary = hexadecimal % 10;
		return color[tenBinary];
	} else {
		return color[10]
	}
}

function gradual() {
	var h1 = $(this).scrollTop();
	var differ=$('.um-content').height()-$('.headerbgc').height()-$('.middlecontent').height();
	var h2=$(".bottomcontent").height()-differ;
	num = h1/h2;
	$('.um-header-fixed h3').css('opacity', num);
	$("#headImg").css("opacity", 1 - num);
	$("#name").css("opacity", 1 - num);
}
/*********************************** DOM Event Handler Define ***********************************/ 
function closeWin() {
	summer.closeWin();
}

function openChat() {
	var tenantid = common.G_CurUserInfo.tenantid;
	var id = $(".hiddenId").val();
	var command = {
		"method" : "YYIM.chat",
		"params" : {
			"chatID" : id, // 从消息列表获取
			"extend" : JSON.stringify({"sendfrom":"app","tenantid":tenantid})
		}
	}
	
	//YYIM.chat(command,null,null)
	cordova.exec(null, null, "XService", "callSync", [command]);

}

$('.um-content').on('scroll', gradual);
