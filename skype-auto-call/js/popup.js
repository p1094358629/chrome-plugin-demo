$(function() {

	// 加载设置
	var defaultConfig = {color: 'white'}; // 默认配置
	chrome.storage.sync.get(defaultConfig, function(items) {
		document.body.style.backgroundColor = items.color;
	});

	// 初始化国际化
	$('#test_i18n').html(chrome.i18n.getMessage("helloWorld"));


});

// 调用后台JS
$('#autoCall').click(e => {
	var phoneNum = document.getElementById("phoneNum").value;
	var interValSec = document.getElementById("interValSec").value;
	console.log(phoneNum,interValSec)
    sendMessageToContentScript({cmd:'autoCall', phoneNum_key: phoneNum,interValSec_key:interValSec}, function(response){});

});
// 调用后台JS
$('#stopCall').click(e => {
    sendMessageToContentScript({cmd:'stopCall', value: ""}, function(response){});

});

// 向content-script主动发送消息
function sendMessageToContentScript(message, callback)
{
    getCurrentTabId((tabId) =>
    {
        chrome.tabs.sendMessage(tabId, message, function(response)
        {
            if(callback) callback(response);
        });
    });
}

// 获取当前选项卡ID
function getCurrentTabId(callback)
{
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
    {
        if(callback) callback(tabs.length ? tabs[0].id: null);
    });
}
// 监听来自content-script的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
	console.log('收到来自content-script的消息：');
	console.log(request, sender, sendResponse);
	sendResponse('我是popup，我已收到你的消息：' + JSON.stringify(request));
});
