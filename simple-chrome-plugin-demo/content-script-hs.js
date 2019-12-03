(function () {
        console.log('这是 chrome-plugin-demo 的content-script！');
        // document.getElementById("kw").setAttribute("value", "测试植入attr")
        // document.getElementById("form").submit();
        // var asd = x("//*[@id=\"div1\"]/div[1]/div[1]/form/div[5]/div/div/input")
        // console.log(asd);
        // asd.setAttribute("val","121323")

    },
        function findElementByXPath(xpath) {
            var result = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);
            return result.iterateNext()
        }


)();