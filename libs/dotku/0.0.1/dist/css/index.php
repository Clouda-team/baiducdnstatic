<?
    define("WEBTILTE", "林氏风格表");
?>
<!DOCTYPE html>
<html>
    <head>
        <title><?=WEBTILTE?></title>
        <link rel="stylesheet" type="text/css" href="http://www.weijinglin.name/css/general.css"/>
        <style type="text/css">
            p{
                max-width: 610px;
            }
            blockquote{
                max-width: 560px;
            }
        </style>
    </head>
    <body>
        <div id="header">
            <div class="mainContainer"><h1><?=WEBTILTE?></h1></div>
        </div>
        <div id="mainbody">
            <div class="mainContainer">
                <h2>简介</h2>
                <p>首先，欢迎您来到本页面，本页面主要向您展示林氏风格表。林氏风格主要是我个人在使用，我的想法是希望形成一个简单易用易修改的标准风格。也希望能分享给大家，一起来使用，不期望超过 bootstrap 那种的欢迎程度，有小范围的推广就好了。</p>
                <h2>使用</h2>
                <p>只需在 head 部分加入以下代码就好了:</p>
                <blockquote>
                    &lt;link rel=&quot;stylesheet&quot; type=&quot;text/css&quot; href=&quot;http://www.weijinglin.name/css/general.css&quot;/&gt;
                </blockquote>
                <p>当然你也下载到你自己的服务器中来使用。</p>
                <h2>结构</h2>
                <p>林氏风格表目前的结构分为 Reset、Layout、Class 这三个部分，具体描述如下：</p>
                <table class="mainTable textTop" width="600px">
                    <tr><th width="100px">结构名称</th><th width="500px">介绍</th></tr>
                    <tr><td>Reset</td><td>Reset 是对 HTML 的重新定义，由于不同浏览器对一些标签风格的显示处理各有不同，比如 HTML、Body 的 margin/padding 在不同浏览器中就一不一样的方式，所以这里有必要对这些标准标签进行统一，实现各个浏览器之间的兼容。</td></tr>
                    <tr><td>Layout</td><td>Layout 基于 id 来处理页面中的各个区间，主要包括 header、mainbody、footer 这几个部分。</td></tr>
                    <tr><td>Class</td><td>目前比较完善的包括 mainContainer 和 mainTable 更多的内容，待更新。</td></tr>
                </table>
                <h2>反馈</h2>
                <p>有任何建议，欢迎联系，我的邮箱: 44219991@qq.com</p>
            </div>
        </div>
        <div id="footer">
            <div class="mainContainer">&copy; 2015 Weijing Lin</div>
        </div>
    </body>
</html>