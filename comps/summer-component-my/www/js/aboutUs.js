/*********************************** Summer Lifecycle Handler Define ***********************************/
summerready = function() {
	//$summer.fixStatusBar($summer.byId('header'));
	init();
	var versionN=JSON.parse(summer.getAppVersion()).versionName;
	$(".version-container").html(versionN);
}
/*********************************** Init Method Define ***********************************/
function init(){
	var userinfo = summer.getStorage('userinfo');
	if (userinfo.userAvator) {
		document.querySelector(".um-circle").setAttribute('src', userinfo.userAvator);
	} else {
		document.querySelector(".um-circle").setAttribute('src', '../../img/user.png');
	}
}
/*********************************** DOM Event Handler Define ***********************************/ 
function openWin(type) {
	summer.openWin({
		"id" : type,
		"url" : 'summer-component-my/www/html/' + type + '.html',
	});
}

function clearCache() {
	common.toast('功能暂未开放')
}