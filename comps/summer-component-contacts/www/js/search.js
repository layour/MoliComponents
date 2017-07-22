/*********************************** Global Variable&&Constant Define ***********************************/
var G__CACHE_KEY_CONTACTS_DEPARTMENT_LIST = "__CACHE_CONTACTS_DEPARTMENT_LIST";
var G__Cache_Duration = 100000;
var g_data;
var _array=[];
/*********************************** Summer Lifecycle Handler Define ***********************************/
summerready = function(){
	$('#header').css('padding-top','10px')
	 setTimeout(function (){	
		//summer.popupKeyboard();
		document.getElementById("search").focus();
	}, 500);
	show();
}
function show(){
	$(".search").on("input propertychange focus",total);
};
// 搜索
var sch=null;
function total(){
	var length = $(this).val().length;
	if(length>0){
		sch=$(this).val();
		console.log(sch);
		var searchdata={
		    "corpword":sch,
			  pageNum:10,
	          hasSelf:1 
		}
     	ajaxRequest({
		        type: 'post',
		        url: '/userlink/searchCorpUser',
		        param: searchdata
		    }, function (res) {
		          var listtext=doT.template($("#listTemp").text());
			$("#main").html(listtext(res.data.content));

		    }, function (err) {
		        alert("获取失败"+JSON.stringify(err));
		    })
	}	
} 	








/*********************************** Init Method Define ***********************************/
function initData(){
	for(var i=0;i<g_data.length;i++){
		for(var j=0;j<g_data[i].list.length;j++){
			_array.push({name:g_data[i].list[j].name,id:g_data[i].list[j].id,groupname:g_data[i].groupname,userid:g_data[i].list[j].userid,tenantid:g_data[i].list[j].tenantid})
		}	
	}	
}

/*********************************** Private Method Define ***********************************/
function getCache(){
	g_data=common.cacheManager.getCache(G__CACHE_KEY_CONTACTS_DEPARTMENT_LIST);
	if(!g_data){
	    common.ajaxRequest("addresslist/query/list","get","application/x-www-form-urlencoded",{},function(data){
			if(data.success == true){
				g_data=common.cacheManager.setCache(G__CACHE_KEY_CONTACTS_DEPARTMENT_LIST,data.result,G__Cache_Duration);
	        }
	    });
    }
    initData();	
}

 

/*********************************** DOM Event Handler Define ***********************************/
function bindEvents(){
	$('.search').on('input propertychange focus',total);
}

function closeWin(){
	summer.closeWin();
}

function clearhis(){
	summer.setStorage('searcharr','');	
	$("#main").html('<div class="empty"></div>');
}

function setLocal(obj){
	var searcharr=[];
	var _searchData={
		"name":$(obj).find("dt").text(),
		"groupname":$(obj).find("dd").text(),
		"id":$(obj).attr("data-id"),
		"userid":$(obj).attr("data-userid")	,
		"tenantid":$(obj).attr("data-tenantid")	
				
	}
	if(summer.getStorage('searcharr')){
		searcharr=summer.getStorage('searcharr');
		for(var l=0;l<searcharr.length;l++){
			if (searcharr[l].id==_searchData.id){
				searcharr.remove(l);
			}
		}
		if(searcharr.length>=6){
			searcharr.shift();
		}
	}	
	searcharr.push(_searchData);
	summer.setStorage('searcharr',searcharr);		
	summer.openWin({
	    id : "employee",
	    url : "comps/summer-component-contacts/www/html/employee.html",
	    statusBarStyle:"light",
	    pageParam:{
	    	id:$(obj).attr("data-userid"),
			tenantid:$(obj).attr("data-tenantid")
	    }
	});		
};
function openWin(type){
	summer.openWin({
		id : "employee",
		url : "comps/summer-component-contacts/www/html/employee.html",
		statusBarStyle:"light",
		pageParam :{
			id:type,
		}
	});
};
