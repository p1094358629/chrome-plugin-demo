console.log('这是content script!');
// 定时器变量
var circleInter;
// 间隔时间变量
var interValSec;
// 注意，必须设置了run_at=document_start 此段代码才会生效
document.addEventListener('DOMContentLoaded', function () {
    // 注入自定义JS
    injectCustomJs();
    // 给谷歌搜索结果的超链接增加 _target="blank"
    if (location.host == 'www.google.com.tw') {
        var objs = document.querySelectorAll('h3.r a');
        for (var i = 0; i < objs.length; i++) {
            objs[i].setAttribute('_target', 'blank');
        }
        console.log('已处理谷歌超链接！');
    }
    else if (location.host == 'www.baidu.com') {
        function fuckBaiduAD() {
            if (document.getElementById('my_custom_css')) return;
            var temp = document.createElement('style');
            temp.id = 'my_custom_css';
            (document.head || document.body).appendChild(temp);
            var css = `
			/* 移除百度右侧广告 */
			#content_right{display:none;}
			/* 覆盖整个屏幕的相关推荐 */
			.rrecom-btn-parent{display:none;}'
			/* 难看的按钮 */
			.result-op.xpath-log{display:none !important;}`;
            temp.innerHTML = css;
            console.log('已注入自定义CSS！');
            // 屏蔽百度推广信息
            removeAdByJs();
            // 这种必须用JS移除的广告一般会有延迟，干脆每隔一段时间清楚一次
            interval = setInterval(removeAdByJs, 2000);

            // 重新搜索时页面不会刷新，但是被注入的style会被移除，所以需要重新执行
            temp.addEventListener('DOMNodeRemoved', function (e) {
                console.log('自定义CSS被移除，重新注入！');
                if (interval) clearInterval(interval);
                fuckBaiduAD();
            });
        }

        let interval = 0;

        function removeAdByJs() {
            $('[data-tuiguang]').parents('[data-click]').remove();
        }

        fuckBaiduAD();
        initCustomPanel();
        initCustomEventListen();
    }
});

function initCustomPanel() {
    var panel = document.createElement('div');
    panel.className = 'chrome-plugin-demo-panel';
    panel.innerHTML = `
		<h2>injected-script操作content-script演示区：</h2>
		<div class="btn-area">
			<a href="javascript:sendMessageToContentScriptByPostMessage('你好，我是普通页面！')">通过postMessage发送消息给content-script</a><br>
			<a href="javascript:sendMessageToContentScriptByEvent('你好啊！我是通过DOM事件发送的消息！')">通过DOM事件发送消息给content-script</a><br>
			<a href="javascript:invokeContentScript('sendMessageToBackground()')">发送消息到后台或者popup</a><br>
		</div>
		<div id="my_custom_log">
		</div>
	`;
    document.body.appendChild(panel);
}

// 向页面注入JS
function injectCustomJs(jsPath) {
    jsPath = jsPath || 'js/inject.js';
    var temp = document.createElement('script');
    temp.setAttribute('type', 'text/javascript');
    // 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
    temp.src = chrome.extension.getURL(jsPath);
    temp.onload = function () {
        // 放在页面不好看，执行完后移除掉
        this.parentNode.removeChild(this);
    };
    document.body.appendChild(temp);
}

// 接收来自后台的消息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log('收到来自 ' + (sender.tab ? "content-script(" + sender.tab.url + ")" : "popup或者background") + ' 的消息：', request);
    if (request.cmd == 'update_font_size') {
        var ele = document.createElement('style');
        ele.innerHTML = `* {font-size: ${request.size}px !important;}`;
        document.head.appendChild(ele);
    }
    else if (request.cmd == 'autoCall') {
        var req = eval(request)
        phoneNum = req.phoneNum_key;
        interValSec = req.interValSec_key;
        var arrStr = phoneNum.split("");
        doCircle(arrStr);
        circleInter = setInterval(function(){
            doCircle(arrStr);
        }, interValSec*1000);
    }
    else if (request.cmd == 'stopCall') {
        clearInterval(circleInter)
    }
    else {
        tip(JSON.stringify(request));
        sendResponse('我收到你的消息了：' + JSON.stringify(request));
    }
});

function doCircle(arr) {
    //先点击键盘
    findElementByXPath("/html/body/div[1]/div/div[1]/div[2]/div/div[1]/div/div[1]/div[4]/div/div/div/div/button").click()

    //暂只支持11位国内号码
    for (let i = 0; i < arr.length; i++) {
        console.log("分解出的号码iter",arr[i])
        var xpathResult = findXpath(arr[i]);
        findElementByXPath(xpathResult).click();
    }
    // 1s 过后执行拨打电话动作
    setTimeout(doCall, 1000);
}

function findXpath(i) {
    console.log("号码分解",i)
    switch (i) {
        case "0":
            return "/html/body/div[1]/div/div[1]/div[2]/div/div[1]/div[2]/div[3]/div/div/div/div[2]/div/div/div[2]/div[1]/div[4]/button[2]";
        case "1":
            return "/html/body/div[1]/div/div[1]/div[2]/div/div[1]/div[2]/div[3]/div/div/div/div[2]/div/div/div[2]/div[1]/div[1]/button[1]";
        case "2":
            return "/html/body/div[1]/div/div[1]/div[2]/div/div[1]/div[2]/div[3]/div/div/div/div[2]/div/div/div[2]/div[1]/div[1]/button[2]";
        case "3":
            return "/html/body/div[1]/div/div[1]/div[2]/div/div[1]/div[2]/div[3]/div/div/div/div[2]/div/div/div[2]/div[1]/div[1]/button[3]";
        case "4":
            return "/html/body/div[1]/div/div[1]/div[2]/div/div[1]/div[2]/div[3]/div/div/div/div[2]/div/div/div[2]/div[1]/div[2]/button[1]";
        case "5":
            return "/html/body/div[1]/div/div[1]/div[2]/div/div[1]/div[2]/div[3]/div/div/div/div[2]/div/div/div[2]/div[1]/div[2]/button[2]";
        case "6":
            return "/html/body/div[1]/div/div[1]/div[2]/div/div[1]/div[2]/div[3]/div/div/div/div[2]/div/div/div[2]/div[1]/div[2]/button[3]";
        case "7":
            return "/html/body/div[1]/div/div[1]/div[2]/div/div[1]/div[2]/div[3]/div/div/div/div[2]/div/div/div[2]/div[1]/div[3]/button[1]";
        case "8":
            return "/html/body/div[1]/div/div[1]/div[2]/div/div[1]/div[2]/div[3]/div/div/div/div[2]/div/div/div[2]/div[1]/div[3]/button[2]";
        case "9":
            return "/html/body/div[1]/div/div[1]/div[2]/div/div[1]/div[2]/div[3]/div/div/div/div[2]/div/div/div[2]/div[1]/div[3]/button[3]";
        default:
            return ""
    }
}

function doCall() {
    findElementByXPath("/html/body/div[1]/div/div[1]/div[2]/div/div[1]/div[2]/div[3]/div/div/div/div[2]/div/div/div[2]/div[2]/div[2]/div/button").click();
    setTimeout(doDeny, interValSec*1000-3000)
}

function doDeny() {
    findElementByXPath("/html/body/div[1]/div/div[1]/div[2]/div/div/div[1]/div/div[3]/div/div[2]/div[3]/div/button").click();
}

function findElementByXPath(xpath) {
    var result = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);
    var iternext = result.iterateNext()
    console.log(iternext)
    return iternext
}

// 主动发送消息给后台
// 要演示此功能，请打开控制台主动执行sendMessageToBackground()
function sendMessageToBackground(message) {
    chrome.runtime.sendMessage({greeting: message || '你好，我是content-script呀，我主动发消息给后台！'}, function (response) {
        tip('收到来自后台的回复：' + response);
    });
}
window.addEventListener("message", function (e) {
    console.log('收到消息：', e.data);
    if (e.data && e.data.cmd == 'invoke') {
        eval('(' + e.data.code + ')');
    }
    else if (e.data && e.data.cmd == 'message') {
        tip(e.data.data);
    }
}, false);


function initCustomEventListen() {
    var hiddenDiv = document.getElementById('myCustomEventDiv');
    if (!hiddenDiv) {
        hiddenDiv = document.createElement('div');
        hiddenDiv.style.display = 'none';
        hiddenDiv.id = 'myCustomEventDiv';
        document.body.appendChild(hiddenDiv);
    }
    hiddenDiv.addEventListener('myCustomEvent', function () {
        var eventData = document.getElementById('myCustomEventDiv').innerText;
        tip('收到自定义事件：' + eventData);
    });
}

var tipCount = 0;
