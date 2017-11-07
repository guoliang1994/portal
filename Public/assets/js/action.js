	var $id = function(id){return document.getElementById(id)};
	var ac_addr = "http://220.197.182.78:8088";
	var $tips = $id('login-tips'),
        $user = $id('txt_user_name'),
        $pwd = $id('txt_password'),
        $button = $id('log-button');
		
	var portalName;
	var logonType;
	var authtype;
	var USER_NAME='';
	var PASS_WORD='';
	var MOBILECK='';
	var logonTip = 0;
	var session_id;
	var onlineTime;
	var expireTime;
	var remoteGoUrl;
	var webAuthSuccUrl;
	var webAuthFailUrl;
	var freetime;
	var countdown=60;
	var u = navigator.userAgent;
	var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

function SetRedirectUrl()
{
	  var urlStr = top.location.href;
	  var searchStr = "RedirectUrl=";
	  var strIndex = urlStr.indexOf(searchStr);
	  var strLen = 0;
    //ÕÒ²»µ½ indexÎª-1
	  if(strIndex >= 0)
	  {
	     var tempStr = urlStr.substr ((strIndex+12),200);
	     var NewStrIndex = tempStr.length;
	     strLen = 200;
	     if((NewStrIndex < 200) && (NewStrIndex >= 0))
	     {
	     	  strLen = NewStrIndex;
	     }
	     
	     var RedirectUrl = tempStr.substr(0,strLen);
	     document.LoginForm.RedirectUrl.value = RedirectUrl;

	  }

}





function CheckSubmit()
{
    var subWin ;
    if(document.LoginForm.username.value.length >65)
    {
        alert("username is too long")
        return false;
    }
	
    if( document.LoginForm.password.value.length > 16 )
    {
        alert("password is too long")
        return false;
    }
	
    SetRedirectUrl();
	
    var time = new Date();
    var second = time.getTime();
    document.LoginForm.submittime.value = second;

    return ;
}

function onReset(){
    document.LoginForm.username.value = '';
    document.LoginForm.password.value = '';
    return false;
}
function getCookieVal(offset)
{
    var endstr=document.cookie.indexOf(";",offset);
    if(endstr==-1)
    endstr=document.cookie.length;
    return unescape(document.cookie.substring(offset,endstr));
}

function GetCookie(name)
{ 
    var arg=name+"=";
    var alen=arg.length;
    var clen=document.cookie.length;
    var i=0;
    while(i<clen)
    {
        var j=i+alen;
        if(document.cookie.substring(i,j)==arg)
        return getCookieVal(j);
        i=document.cookie.indexOf(" ",i)+1;
        if(i==0) break;
    }
    return "";
}

function ChangeAction()
{
	  var urlStr = top.location.href;
	  var searchStr = "RedirectUrl=";
	  var strIndex = urlStr.indexOf(searchStr);
	  var strLen = 0;
    //ÕÒ²»µ½ indexÎª-1
	  if(strIndex >= 0)
	  {
	     var tempStr = urlStr.substr ((strIndex+12),200);
	     var NewStrIndex = tempStr.length;
	     strLen = 200;
	     if((NewStrIndex < 200) && (NewStrIndex >= 0))
	     {
	     	  strLen = NewStrIndex;
	     }
	     
	     var RedirectUrl = tempStr.substr(0,strLen);
	     urlStr = document.getElementById("LoginForm").action;
	     document.getElementById("LoginForm").action = urlStr + "?RedirectUrl=" + RedirectUrl;

	  }
}


function ChangeButtonDisable()
{
    if(document.LoginForm.checkbox.checked)
    {
        document.LoginForm.Login.disabled=false;
    }
    else
    {
        document.LoginForm.Login.disabled=true;
    }
}

	function GetQueryString(name){
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
		var r = window.location.search.substr(1).match(reg); 
		if (r != null) return unescape(r[2]); return null;
	}
	
	function checkLogin(){
		staMac = GetQueryString('usermac');
		$.ajax({
				type : 'get',
				url : '/auto_login.php?staMac='+staMac,
				dataType : "json",
				success : function(data) {
						
					if(data.code==100){
							
						USER_NAME = usermac;
						PASS_WORD = data.check;
					}

				},
				error : function(e) {

				}
			});
	}
	
	
	function checkLogin_hw(){
		staMac = GetQueryString('usermac');
		$.ajax({
				type : 'get',
				url : '/auto_login_hw.php?staMac='+staMac,
				dataType : "json",
				success : function(data) {
						
					if(data.code==100){
							
						USER_NAME = data.check;
						
						PASS_WORD = data.check;
						
						
						if(isiOS){
							var websuserip = $("#websuserip").val();
							var username = GetQueryString("usermac");
							var subtime = new Date().getTime();

							document.getElementById("iframe1").src = "http://10.20.0.6:8000/login?username="+username+"&password="+PASS_WORD+"&submittime="+subtime+"&websuserip="+websuserip+"&Login=Login&checkbox=on&anonymous=DISABLE&RedirectUrl=baidu.com";

						}
						

						
					}

				},
				error : function(e) {

				}
			});
			

	}
	
	ip_first = GetQueryString('staIp').split('.');
	if(ip_first[0]=='10'){
		ac_addr='http://10.110.112.2:8088';
	}
	
	var serverUrl = ac_addr + '/portal/auth';

	
	var logonErrInfo = new Array(
		"",
		"正在登录，请稍候···",
		"用户名或者密码错误！",
		"登录超时，请重新登录！",
		"该用户名已被禁用！",
		"用户已过期！",
		"该时间段禁止认证，请稍候重试！",
		"该用户名已达认证用户上限！",
		"请求服务器失败，请稍后再试",
		"登录成功",
		"退出登录成功，请重新登录",
		"您没有权限使用该用户名进行认证！",
		"认证方式错误",
		"正在连接外部认证服务器",
		"远程Portal页面指定的AC地址错误！",
		0,0);
	var INFO_TIP_INIT        =    0;
	var INFO_TIP_REFRESH     =    1;
	var INFO_TIP_ERRCODE     =    2;
	var INFO_TIP_TIMEOUT     =    3;
	var INFO_TIP_BLACKUSER   =    4;
	var INFO_TIP_USEREXPIRE  =    5;
	var INFO_TIP_INVALIDTIME =    6;
	var INFO_TIP_USERFULL    =    7;
	var INFO_TIP_SERVERERR   =    8;
	var INFO_TIP_SUCCESS     =    9;
	var INFO_TIP_LOGOUT      =    10;
	var INFO_TIP_MAC_CONFLICT =   11;
	var INFO_TIP_AUTHMODE_ERROR = 12;
	var INFO_TIP_REMOTE_GOURL =   13;
	var AUTHSTATUS_REMOTE_ADDR_ERR =   14;
	
			
	function doGet(url, data, success, failed)
	{
        var param = "";
        for (var key in data)
		{
            param += key+"="+encodeURIComponent(data[key]) + '&';
        }
        url += "?"+param.substr(0, param.length-1);


        var locationStr = window.location.search;
        var urlPara = locationStr.substr(locationStr.indexOf('?')+1);
        url += "&" + urlPara;
		
        var xmlHttp = window.XMLHttpRequest ? (new XMLHttpRequest()) : (new ActiveXObject("Microsoft.XMLHTTP"));
        xmlHttp.open("GET", url);
        xmlHttp.setRequestHeader("Accept","text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
        xmlHttp.send(null);
		
        xmlHttp.onreadystatechange = function() 
		{
            if ((xmlHttp.readyState == 4)) 
			{
                if (xmlHttp.status == 200)
				{
                    if (typeof success == 'function')
					{
                        success.call(null, xmlHttp.responseText);
                    }
                }
                else
				{
                    if (typeof failed == 'function')
					{
                        failed.call(null, xmlHttp.responseText);
                    }
                }
            } 
			else 
			{
            }
        }
    }
	
	function asctochar(high, low)
	{
		var connect = 0;
		if ( high >= '0' && high <= '9' )
		{
			high = high.charCodeAt() - 48; 
		}
		if ( high >= 'A' && high <= 'F' )
		{
			high = high.charCodeAt() - 55;
		}
		if ( low >= '0' && low <= '9' )
		{
			low = low.charCodeAt() - 48; 
		}
		if ( low >= 'A' && low <= 'F' )
		{
			low = low.charCodeAt() - 55;
		}
		connect = high*16+low;
		return connect;
	}

	function strASCdecode(sourceId)
	{
		var tempstr = sourceId;
		var index = 0;
		var ptr = 0;
		var tempDecode = '';
		var high, low, high1,low1,high2,low2,inter1, inter2, inter;
		var charcode = 0;
		
		for ( index = 0; index <  tempstr.length; )
		{
			high = tempstr.slice(index,index+1);
			low  = tempstr.slice(index+1,index+2);
			inter = asctochar(high,low);
			if ( 0 <= inter && inter <= 0x007f )
			{
				tempDecode += String.fromCharCode(inter);
				index += 2;
				continue;
			}
			if ( 192 <= inter && inter <= 223 )
			{
				high1 = tempstr.slice(index+2,index+3);
				low1 = tempstr.slice(index+3,index+4);
				inter1 = asctochar(high1,low1);
				charcode = ((inter-192)<<6) + (inter1-128);
				tempDecode += String.fromCharCode(charcode);
				index += 4;
				continue;
			}
			if ( 224<= inter && inter <= 239 )
			{
				high1 = tempstr.slice(index+2,index+3);
				low1 = tempstr.slice(index+3,index+4);
				high2 = tempstr.slice(index+4,index+5);
				low2 = tempstr.slice(index+5,index+6);
				inter1 = asctochar(high1,low1);
				inter2 = asctochar(high2,low2);
				charcode = ((inter-224)<<12)+((inter1-128)<<6)+(inter2-128);
				tempDecode += String.fromCharCode(charcode);
				index += 6;
				continue;
			}
			else
			{
				tempDecode = sourceId;
				break;
			}
		}
		return tempDecode;
	}
	
	function pageConfigParse()
	{
        if (INFO_TIP_ERRCODE == logonTip ||
               INFO_TIP_TIMEOUT == logonTip ||
               INFO_TIP_BLACKUSER == logonTip ||
               INFO_TIP_USEREXPIRE == logonTip ||
               INFO_TIP_INVALIDTIME == logonTip ||
               INFO_TIP_USERFULL == logonTip ||
               INFO_TIP_MAC_CONFLICT == logonTip ||
			   AUTHSTATUS_REMOTE_ADDR_ERR == logonTip)
        {
			if (undefined != webAuthFailUrl && "" != webAuthFailUrl)
			{
				window.location.href = webAuthFailUrl;
				return;
			}
			else
			{
				$("#log_msg").innerHTML = logonErrInfo[logonTip];
				$("#mobile").value = '';
				$("#check").value = '';
			}
		}
		else if (INFO_TIP_SUCCESS == logonTip)
		{
			if (undefined != webAuthSuccUrl && "" != webAuthSuccUrl)
			{
				window.location.href = webAuthSuccUrl;
				return;
			}
			else
			{
				var locationStr = window.location.search;
				var urlPara = locationStr.substr(locationStr.indexOf('?')+1);

				var goUrl = serverUrl + "?" +  urlPara
				window.location.href = goUrl;
				return;
			}
        }
        
    }
	
	function onSuccess(oriString)
	{
		var arrHead = "new Array(";
		var startIndex = oriString.indexOf(arrHead);
		var endIndex = oriString.indexOf("0,0)\;");
		var configString = oriString.substring(startIndex+arrHead.length,endIndex);
			configString = configString.replace(/\"/g,"");
        var config = configString.split(',');
		
        if (config.length < 1)
		{
            onFailed();
        }
		else if (config.length == 4)
		{
			var locationStr = window.location.search;
			var urlPara = locationStr.substr(locationStr.indexOf('?')+1);

			var goUrl = serverUrl + "?" +  urlPara
            window.location.href = goUrl;
            return;
		}
        else if (config.length >= 20)
		{
			portalName		= config[2];
			logonType		= parseInt(config[3],10);
			authtype		= parseInt(config[12],10);
			logonTip		= parseInt(config[13],10);
			session_id		= strASCdecode(config[14]);
			onlineTime		= parseInt(config[15],10);
			expireTime		= config[16];
			remoteGoUrl		= config[17];
			webAuthSuccUrl	= config[18];
			webAuthFailUrl	= config[19];
            freetime        = onlineTime;
			
			if (INFO_TIP_REFRESH == logonTip)
			{
				setTimeout(doRefresh, 1000);
			}
			else
			{
				pageConfigParse();
			}
        }
		else
		{
			window.location.reload();
		}
    }
	
	function onFailed()
	{
		$("#log_msg").innerHTML = logonErrInfo[INFO_TIP_SERVERERR];
    }
	
	function doRefresh()
	{
        doGet(serverUrl, {"refresh":"true","authtype":"5","session_id":session_id}, onSuccess, onFailed);
    }
	
	function handleSubmit(){
		
		var mobile=$('#mobile').val();
		var websuserip=$('#websuserip').val();
		var submittime=$('#submittime').val();
		var RedirectUrl=$('#RedirectUrl').val();
		var anonymous=$('#anonymous').val();
		var pwd = $('#check').val();
		if(mobile == '' || pwd == ''){
			alert("请检查手机号码及验证码是否输入");
			return;
		}
				
		doGet(serverUrl, {"Submit":"Logon","authtype":"3", "username":mobile, "password":pwd}, onSuccess, onFailed); //
		
    }

	
	
			 
		function settime(obj) {
			
			if (countdown == 0) { 
				obj.removeAttribute("disabled");
				obj.innerHTML="获取验证码";
				countdown = 60; 
				return;
			} else { 
				obj.setAttribute("disabled", true); 
				obj.innerHTML="重新发送(" + countdown + ")"; 
				console.log(countdown);
				countdown--;
				if(countdown == 60){
					
				}
			} 
			setTimeout(function() { 
				settime(obj) }
				,1000) 
		}
		
		function ask_check(obj){
			var mobile = $('#mobile').val();
			if(!judge_mobile(mobile)){
				alert("手机号码有误，请重新输入");
			}else{
				$.ajax({
					type : 'get',
					url : '/register.php?mobile='+mobile,
					dataType : 'json',
					success : function(data) {
						
						if(data.code==100){
							settime(obj);
							MOBILECK=data.check;
							$("#password").val(mac);
						}

					},
					error : function(e) {
						alert(e);
					}
				});
			}
		
		}
		
		
		
		
		
		function ask_check_hw(obj){
			var mobile = $('#mobile').val();
			var mac = GetQueryString("usermac").replace(/:/g, '');
			if(!judge_mobile(mobile)){
				alert("手机号码有误，请重新输入");
			}else{
				$.ajax({
					type : 'get',
					url : 'http://10.20.1.64/register_msghw.php?mobile='+mobile+"&type=1&mac="+mac,
					dataType : 'json',
					success : function(data) {
						console.log(data.code);
						if(data.code==100){
							settime(obj);
							MOBILECK=data.check;
							$("#password").val(mac);
						}

					},
					error : function(e) {
						alert(e);
					}
				});
			}
		
		}
		
		
		
		
		
		
		function msg_login(){
			var getcheck = $("#check").val();
			if(getcheck==MOBILECK){
				
				if(isiOS){
					document.LoginForm.action="http://10.20.1.64/register_ios.php?mac="+GetQueryString("usermac");
					document.LoginForm.submit();
				}else{
					
					$("#mobile").val(GetQueryString("usermac").replace(/:/g, ''));
					$("#check").val(GetQueryString("usermac").replace(/:/g, ''));
					document.LoginForm.submit();
				}
				
			}else{
				alert("请检查您的验证码是否正确");
			}
			
		
		}
		
		function h3_msg_login(){
			var getcheck = $("#check").val();
			if(getcheck==MOBILECK){
				
				if(isiOS){
					document.LoginForm.action="http://10.20.1.64/register_ios.php?mac="+GetQueryString("usermac");
					document.LoginForm.submit();
				}else{
					
					document.LoginForm.submit();
				}
				
			}else{
				alert("请检查您的验证码是否正确");
			}
			
		
		}
		
		
		function judge_mobile(mobile_num){
			
			var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/; 
			if(!myreg.test(mobile_num)) 
			{ 
				return false; 
			}else{
				return true;
			}
		
		}
		

	
	function register_once(){
			var locationStr = location.search;		
		$.ajax({
				type : 'get',
				url : '/register_once.php?'+locationStr.substr(locationStr.indexOf('?')+1),
				dataType : "json",
				success : function(data) {

					if(data.code==100){
						callWechatBrowser();
					}

				},
				error : function(e) {

					console.log(e);
				}
			});
	
	
	}
	
	
	
	function register_once_hw(){
		var websuserip = $("#websuserip").val();
		var username = GetQueryString("usermac").replace(/:/g, '');
		var subtime = new Date().getTime();
		if(isiOS){
		
			callWechatBrowser();
			return;
		
		}
		$.ajax({
				type : 'post',
				url : 'http://10.20.0.6:8000/login',
				dataType: "html",
				data : {"username":username,"password":PASS_WORD,"submittime":subtime,"websuserip":websuserip,"Login":"Login","checkbox":'on',"anonymous":"DISABLE","RedirectUrl":"http://baidu.com"},
				success : function(data) {
						callWechatBrowser();
				},
				error : function(e) {
					callWechatBrowser();
				}
			});	
	}
	function checkLogin_h3(){
		staMac = GetQueryString('wlanusermac');
		$.ajax({
				type : 'get',
				url : '/auto_login_h3.php?staMac='+staMac,
				dataType : "json",
				success : function(data) {	
					if(data.code==100){
						USER_NAME = staMac;
						PASS_WORD = data.check;
						
					}
				},
				error : function(e) {
				}
			});
	}
	function register_once_h3(){
		/*var username = GetQueryString("wlanusermac");
		var pwd = GetQueryString("wlanusermac");
		var ptuser = document.getElementById("mobile");
		ptuser.value = username;
		var ptpwd = document.getElementById("check");
		ptpwd.value = pwd;
		document.LoginForm.action = document.LoginForm.action + location.search;
		document.LoginForm.submit();*/
		/*document.getElementById("iframe1").src = "http://10.20.0.8/portal/logon.cgi"+location.search+"&PtUser="+USER_NAME+"&PtPwd="+PASS_WORD+"&PtButton=Logon";
		callWechatBrowser();
		*/
		/*if(isiOS){
			callWechatBrowser();
			return;
		}*/
		$.ajax({
				type : 'post',
				url : 'http://10.20.0.8/portal/logon.cgi'+location.search,
				dataType: "html",
				data : {"PtUser":USER_NAME,"PtPwd":PASS_WORD,"PtButton":"Logon"},
				success : function(data) {
						console.log(data);
						callWechatBrowser();
				},
				error : function(e) {
					console.log(e);
					callWechatBrowser();
				}
			});
	}
	
	
	
		
    function bigWifi(){
    	mac = GetQueryString("staMac");
	bmac = GetQueryString("apMac");
	url = "http://res.v5fans.com/fykj/start.html?bid=1222&mac="+mac+"&bmac="+bmac;
	window.location.href = url;
    }
    
	function errorJump()
		 {
			 var now = new Date().getTime();
			 if((now - callUpTimestamp) > 4*1000){
				 return;
			 }
			 alert('该浏览器不支持自动跳转微信请手动打开微信\n如果已跳转请忽略此提示');
		 }
	function save_pv_index(){
		var user_mac = GetQueryString("wlanusermac");
		var ad_name = "index";
		$.ajax({
				type : 'get',
				url : 'http://10.20.1.64:8080/FanyaAuth/saveData.do?op=pv&user_mac='+user_mac+'&ad_name='+ad_name,
				success : function() {
						
				},
				error : function(e) {
					console.log(e);
				}
			});
	}
	function save_cv_index(){
		var user_mac = GetQueryString("wlanusermac");
		var ad_name = "index";
		$.ajax({
				type : 'get',
				url : 'http://10.20.1.64:8080/FanyaAuth/saveData.do?op=cv&user_mac='+user_mac+'&ad_name='+ad_name,
				success : function() {
						
				},
				error : function(e) {
					console.log(e);
				}
			});
	}
	function save_pv_login(){
		var user_mac = GetQueryString("wlanusermac");
		var ad_name = "login";
		$.ajax({
				type : 'get',
				url : 'http://10.20.1.64:8080/FanyaAuth/saveData.do?op=pv&user_mac='+user_mac+'&ad_name='+ad_name,
				success : function() {
						
				},
				error : function(e) {
					console.log(e);
				}
			});
	}
	function save_cv_login(){
		var user_mac = GetQueryString("wlanusermac");
		var ad_name = "login";
		$.ajax({
				type : 'get',
				url : 'http://10.20.1.64:8080/FanyaAuth/saveData.do?op=cv&user_mac='+user_mac+'&ad_name='+ad_name,
				success : function() {
						
				},
				error : function(e) {
					console.log(e);
				}
			});
	}
	
