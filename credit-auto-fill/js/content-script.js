console.log('这是content script!');
const event = document.createEvent('HTMLEvents')
event.initEvent('input', false, true)
// event.initEvent('span', false, true)
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
    //自动填充input框
    if (request.cmd === 'fillCredit') {
        //贸易方式
        // fillSelect("//*[@id=\"div1\"]/div[1]/div[1]/form/div[2]/div/div/div[1]/span[1]", "货物");
        //开证渠道
        // fillSelect("//*[@id=\"div1\"]/div[1]/div[1]/form/div[3]/div/div/div[1]/span[1]", "行内");
        //合同金额
        fillInput("//*[@id=\"div1\"]/div[1]/div[1]/form/div[5]/div/div/input", "7890");
        //合同编号
        fillInput("//*[@id=\"div1\"]/div[1]/div[1]/form/div[4]/div/div[1]/input", "ZT20191210");
        /*申请人信息*/
        //申请人统一社会信用代码
        fillInput("//*[@id=\"div1\"]/div[1]/div[2]/form/div[1]/div/div[1]/input", "330108199307048362");
        //开证申请人账号
        fillInput("//*[@id=\"div1\"]/div[1]/div[2]/form/div[2]/div/div/input", "6222021202038583465");
        //申请人名称
        fillInput("//*[@id=\"div1\"]/div[1]/div[2]/form/div[3]/div/div[1]/input", "杨玉香");
        //开证申请人地址
        fillInput("//*[@id=\"div1\"]/div[1]/div[2]/form/div[4]/div/div[1]/input", "浙江省滨江区西兴街道189号");
        //开证申请人电话
        fillInput("//*[@id=\"div1\"]/div[1]/div[2]/form/div[5]/div/div/input", "13548576344");
        //开证申请人邮编
        fillInput("//*[@id=\"div1\"]/div[1]/div[2]/form/div[6]/div/div/input", "310051");
        //申请人开户行行号
        fillInput("//*[@id=\"div1\"]/div[1]/div[2]/form/div[7]/div/div/input", "102331018039");
        //申请人开户行名称
        fillInput("//*[@id=\"div1\"]/div[1]/div[2]/form/div[8]/div/div/input", "中国工商银行股份有限公司杭州滨盛支行");


        /*受益人信息*/
        //受益人账号
        fillInput("//*[@id=\"div1\"]/div[1]/div[3]/form/div[1]/div/div/input", "6222021202038583466");
        //受益人名称
        fillInput("//*[@id=\"div1\"]/div[1]/div[3]/form/div[2]/div/div[1]/input", "杨玉环");
        //受益人地址
        fillInput("//*[@id=\"div1\"]/div[1]/div[3]/form/div[3]/div/div[1]/input", "浙江省滨江区西兴街道190号");
        //受益人电话
        fillInput("//*[@id=\"div1\"]/div[1]/div[3]/form/div[4]/div/div/input", "13548545644");
        //受益人邮编
        fillInput("//*[@id=\"div1\"]/div[1]/div[3]/form/div[5]/div/div/input", "310051");
        //受益人开户行行号
        fillInput("//*[@id=\"div1\"]/div[1]/div[3]/form/div[6]/div/div/input", "102331018039");
        //受益人开户行名称
        fillInput("//*[@id=\"div1\"]/div[1]/div[3]/form/div[7]/div/div/input", "中国工商银行股份有限公司杭州滨盛支行");
        //信用证金额
        fillInput("//*[@id=\"div1\"]/div[1]/div[4]/form/div[1]/div/div/input", "18000000");
        //上下浮
        fillInput("//*[@id=\"div1\"]/div[1]/div[4]/form/div[3]/div/div/input", "1.0");
        fillInput("//*[@id=\"div1\"]/div[1]/div[4]/form/div[4]/div/div/input", "0.0");

        //信贷关联编号不填

        /*委托行*/
        // 委托行行号
        fillInput("//*[@id=\"div3\"]/div[1]/div/form/div[2]/div/div/input", "103331008567");

        // 委托行名称
        fillInput("//*[@id=\"div3\"]/div[1]/div/form/div[3]/div/div/input", "中国农业银行股份有限公司杭州南阳支行");
        // 委托行地址
        fillInput("//*[@id=\"div3\"]/div[1]/div/form/div[4]/div/div/input", "浙江省滨江区西兴街道189号");
        // 委托行邮编
        fillInput("//*[@id=\"div3\"]/div[1]/div/form/div[5]/div/div/input", "310052");
        // 委托行电话
        fillInput("//*[@id=\"div3\"]/div[1]/div/form/div[6]/div/div/input", "86698465");
        /*通知行*/
        // 通知行行号
        fillInput("//*[@id=\"div3\"]/div[1]/div/form/div[7]/div/div[1]/input", "105331022204");
        // 通知行名称
        fillInput("//*[@id=\"div3\"]/div[1]/div/form/div[8]/div/div[1]/input", "中国建设银行股份有限公司杭州大江东支行");
        // 通知行地址
        fillInput("//*[@id=\"div3\"]/div[1]/div/form/div[9]/div/div/input", "浙江省滨江区西兴街道255号");
        // 通知行邮编
        fillInput("//*[@id=\"div3\"]/div[1]/div/form/div[10]/div/div/input", "310051");
        // 通知行电话
        fillInput("//*[@id=\"div3\"]/div[1]/div/form/div[11]/div/div[1]/input", "8645687766");
        /*议付行*/
        // 议付行行号
        fillInput("//*[@id=\"div3\"]/div[1]/div/form/div[13]/div/div/input", "105331022204");
        // 议付行名称
        fillInput("//*[@id=\"div3\"]/div[1]/div/form/div[14]/div/div/input", "中国建设银行股份有限公司杭州大江东支行");
        // 议付行地址
        fillInput("//*[@id=\"div3\"]/div[1]/div/form/div[15]/div/div/input", "浙江省滨江区西兴街道255号");
        /*转让行*/
        // 转让行行号
        fillInput("//*[@id=\"div3\"]/div[1]/div/form/div[17]/div/div[1]/input", "105331022204");
        // 转让行名称
        fillInput("//*[@id=\"div3\"]/div[1]/div/form/div[18]/div/div[1]/input", "中国建设银行股份有限公司杭州大江东支行");
        // 转让行地址
        fillInput("//*[@id=\"div3\"]/div[1]/div/form/div[19]/div/div[1]/input", "浙江省滨江区西兴街道255号");
        /*保兑行*/
        // 保兑行行号
        fillInput("//*[@id=\"div3\"]/div[1]/div/form/div[21]/div/div[1]/input", "105331022204");
        // 保兑行名称
        fillInput("//*[@id=\"div3\"]/div[1]/div/form/div[22]/div/div[1]/input", "中国建设银行股份有限公司杭州大江东支行");
        // 保兑行地址
        fillInput("//*[@id=\"div3\"]/div[1]/div/form/div[23]/div/div/input", "浙江省滨江区西兴街道255号");
        /*开证行*/
        // 开证行行号
        fillInput("//*[@id=\"div3\"]/div[1]/div/form/div[24]/div/div[1]/input", "102331018039");
        // 开证行行名
        fillInput("//*[@id=\"div3\"]/div[1]/div/form/div[25]/div/div[1]/input", "中国工商银行股份有限公司杭州滨盛支行");
        // 开证行电话
        fillInput("//*[@id=\"div3\"]/div[1]/div/form/div[26]/div/div/input", "86855873");
        // 开证行邮编
        fillInput("//*[@id=\"div3\"]/div[1]/div/form/div[27]/div/div/input", "310051");
        // 开证行地址
        fillInput("//*[@id=\"div3\"]/div[1]/div/form/div[28]/div/div/input", "浙江省滨江区西兴街道267号");
        /*信用证期限与货运*/
        // 有效地点
        fillInput("//*[@id=\"div4\"]/div[1]/div/form/div[2]/div/div/input", "浙江省杭州市");
        // 交单期限
        fillInput("//*[@id=\"div4\"]/div[1]/div/form/div[3]/div/div/input", "60");
        // 货物装运地
        fillInput("//*[@id=\"div4\"]/div[1]/div/form/div[6]/div/div/input", "浙江省宁波市");
        //货物目的地/交货地
        fillInput("//*[@id=\"div4\"]/div[1]/div/form/div[7]/div/div/input", "浙江省杭州市上城区解放路388号世纪大厦B幢16楼1608小黑屋");
        // 服务提供地
        fillInput("//*[@id=\"div4\"]/div[1]/div/form/div[8]/div/div/input", "浙江省杭州市滨江区");
        // 分期装运/分期提供服务具体约定
        fillInput("//*[@id=\"div4\"]/div[1]/div/form/div[12]/div/div/input", "货物提供方在规定时间内应履行xxxx义务");
        // 付款期限
        fillInput("//*[@id=\"div4\"]/div[1]/div/form/div[13]/div/div/input", "3");
        // 货物/服务描述
        fillInput("//*[@id=\"div4\"]/div[1]/div/form/div[16]/div/div/textarea", "这批货物需满足xx天内交付于xx部门xxx");
    }

    else {
        tip(JSON.stringify(request));
        sendResponse('我收到你的消息了：' + JSON.stringify(request));
    }
});

function fillInput(xpath, value) {
    findElementByXPath(xpath).value = value;
    findElementByXPath(xpath).dispatchEvent(event)
}

// 此处两个xpath 第二个即span[2]
function fillSelect(xpath, value) {
    findElementByXPath(xpath).setAttribute("style", "display:none")//贸易方式
    xpath_select = xpath.replace("span[1]", "span[2]");
    findElementByXPath(xpath_select).innerText = value
    findElementByXPath(xpath_select).setAttribute("style", "")

}

function findElementByXPath(xpath) {
    var result = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);
    var iternext = result.iterateNext()
    // console.log(iternext)
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
