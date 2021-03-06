﻿summerready = function () {
    initPage()
}
function addKey(args) {
    if (args.status == "show") {
        if ($summer.os == 'ios') {
            return
        } else {
            setTimeout(function () {
                $('#main').scrollTop(95);
            }, 100)

        }
    }
}

function initPage() {
    summer.setStorage("G-TOKEN-ERROR", "");
    var account = summer.getStorage('account') ? summer.getStorage('account').account : '';
    $('.account-input').val(account);
}

function trimStr(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

var realLogin = function () {
    var accountContent = trimStr($('.account-input').val());
    var passwordContent = trimStr($('.password-input').val());
    var flag = beforeLogin();
    if (!flag) {
        return;
    }
    var param = {
        userName: trimStr(accountContent),
        password: trimStr(passwordContent),
    }
    summer.showProgress()
    ajaxRequest({
        type: 'post',
        url: '/auth/login',
        param: param
    }, function (res) {
        if (res.flag == 0) {
            var userinfo = {
                id: res.data.id,
                yhtId: res.data.yhtId,
                token: res.data.token,
                account: res.data.mobile ? res.data.mobile : res.data.email,
                userName: res.data.userName ? res.data.userName : '',
                avatar: res.data.avatar ? res.data.avatar : '',
                name: res.data.name ? res.data.name : ''
            }
            loginIm(userinfo);
            loginEMM(userinfo, passwordContent)
            summer.setStorage('userinfo', userinfo);
            summer.toast({
                msg: '登录成功'
            })
            summer.hideProgress();
            summer.openWin({
                type: 'tabBar',
                id: 'root',
                create: 'false',
                isKeep: false
            })

        } else {
            var message = res.msg ? res.msg : '登录失败';
            summer.toast({
                msg: message
            })
        }
    }, function (err) {
        var message = err.error ? err.error : '登录失败';
        summer.toast({
            msg: message
        })
    })
}
function loginEMM(_uinfo, password) {
    emm.writeConfig({
        "host": "https://emm.yonyoucloud.com",
        "port": "443"
    });
    /*在EMM上注册设备*/
    emm.registerDevice({
        "username": 'guest', //用户名
        "password": '', //密码
        "companyId": "moli",
        "istenantid": "false",//判断传入的是否是租户id值
    }, "registerS()", "error()")
}
    function demoLogin() {
        summer.toast({msg: '登录成功'})
        summer.openWin({
            type: 'tabBar',
            id: 'root',
            create: 'false',
            isKeep: false
        })
    }

    function registerS() {
    }

    function error() {
    }

    function loginIm(_uinfo) {
        var userinfo = {
            "usercode": _uinfo.yhtId,
            "password": '',
            "userName": _uinfo.userName,
        }

        var params = {
            "method": "YYIM.login",
            "params": {
                "userinfo": userinfo,
            }
        }
        cordova.exec(null, null, "XService", "callSync", [params]);
    }

    function beforeLogin() {
        var accountContent = trimStr($('.account-input').val());
        var passwordContent = trimStr($('.password-input').val());
        if (accountContent == '') {
            summer.toast({
                msg: '账号不能为空'
            });
            return false;
        }
        if (passwordContent == '') {
            summer.toast({
                msg: '密码不能为空'
            });
            return false;
        }
        var rePhone = /^1\d{10}$/;
        var reMail = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
        if (!rePhone.test(accountContent) && !reMail.test(accountContent)) {
            summer.toast({
                msg: '手机或者邮箱格式不正确'
            });
            return false;
        }
        return true;
    }

    function changeInputType(obj) {
        if ($(obj).hasClass('show-password')) {
            $(obj).removeClass('show-password').css('color', '#dddddd');
            $('.password-input').attr('type', 'password')

        } else {
            $(obj).addClass('show-password').css('color', '#999999');
            $('.password-input').attr('type', 'text')
        }
    }

    function clearNameContent() {
        $('.account-input').val('');
    }

