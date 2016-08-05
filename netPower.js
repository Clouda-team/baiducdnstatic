var isSignIn = false;//true;
var tokenStr = '';
var debugDevIP = '';//dvlopment device ip address
var jsonCallback = '';//Cross-domain request callback function

var groups = {};//分组数据全局缓存
var channels = {};//分区数据全局缓存

var isWidescreen = $(window).width() > 768;

$(function () {
    $('#signInPopBtn').click(function () {
        if (isSignIn === false) {
            $('#check_login_lb').text("");//清除提示信息
            $('#popupLogin').popup('open');
        }
        else {
            var apiStr = debugDevIP + 'API/' + tokenStr + '/System/SignOut' + jsonCallback;
            $.getJSON(apiStr, function (data) { });

            isSignIn = false;
            tokenStr = '';
            login_ui_state('logout');
            $('#mainBody').empty();
            displaySignInMesg();
        }
    })

    $('#login-btn').click(function () {
        var nserName = $("#loginName").val();
        var loginPass = $("#loginPW").val();
        if (nserName.length < 2) {
            $("#loginName").focus();
            return;
        }
        if (loginPass.length < 1) {
            $("#loginPW").focus();
            return;
        }
        var apiStr = debugDevIP + 'API/System/LogOn/' + $("#loginName").val() + '/' + $("#loginPW").val() + jsonCallback;//+'.json';
        var ajaxSemaphore = { isNeedKill: true };//声明信号量
        var ajaxCall = $.getJSON(apiStr, function (data) {
            ajaxSemaphore.isNeedKill = false;// set to false
            if ("Status" in data && data["Status"]) {
                $("#loginName").val('');
                $("#loginPW").val('');/////////////////////////////////////////////////////////////////////////////////////////////////
                isSignIn = true;
                tokenStr = data["Token"];//设置令牌

                $('#popupLogin').popup('close');
                login_ui_state('login');
                $('#speakmg').click();//默认打开语音播报
            } else {
                $('#check_login_lb').text("登录失败！");
                // $('#popupLogin').popup('close');
                //alert("登录失败！");
            }
        })
        // .error(function () {
        //     $("#loginName").val('');
        //     $("#loginPW").val('');
        //     $('#popupLogin').popup('close');
        //  showDialog('提示信息', '登录设备系统错误,请检查设备和网络状态。');
        //});
        //启动定时
        ajaxTimeout(ajaxSemaphore, ajaxCall, 2000, function () {
            // $('#popupLogin').popup('close');
            // showDialog('提示信息', '登录设备系统超时,请检查设备和网络状态。');
            $('#check_login_lb').text('登录超时,请检查设备和网络状态。');
        });
    });

    //播放管理 按键方法
    $('#playmg').click(function () {
        $('#mainBody').empty();

        getPlayTaskCount(function (count) {
            getPlayTaskListData('0-' + count, loadTaskListToUI);//获取任务数据，回调函数加载任务数据到功能UI
        });

    });

    //分组输出管理 按键方法
    $('#groupmg').click(function () {
        $('#mainBody').empty();

        getDeviceGroupCount(function (count) {
            getDeviceGroup('0-' + count, loadGroupMgUI);//获取分组数据，回调函数加载分组数据到功能UI
        });

    });

    //语音播报 按键方法
    $('#speakmg').click(function () {
        $('#mainBody').empty();
        getDeviceGroupCount(function (count) {
            getDeviceGroup('0-' + count, loadSpeakUI);//获取分组数据，回调函数加载语音播报功能UI
        });

    });

    //系统配置按键方法
    $('#systemmg').click(function () {
        $('#mainBody').empty();
        loadingSystemSetUI();
    });

    //测试按键 方法
    $('#btn-test3').click(function () {
        var url = debugDevIP + 'API/System/LogOn/admin/123456' + jsonCallback;
        $.post({
            url: url,
            data: { "data": "aaa" },
            success: function (data) {
                alert(data["StatusMessage"]);
            },
            dataType: 'json'
        });
    }
    );
})


//登录出系统后UI 更新方法
function login_ui_state(state) {
    //$('#mainBody').empty();
    if (state == 'login') {
        $('#playmg').removeClass('ui-state-disabled');//$('#playmg').addClass('ui-state-disabled');
        $('#groupmg').removeClass('ui-state-disabled');
        $('#speakmg').removeClass('ui-state-disabled');
        $('#systemmg').removeClass('ui-state-disabled');
        $('#signInPopBtn').text("退出");
    } else {
        $('#playmg').addClass('ui-state-disabled');
        $('#groupmg').addClass('ui-state-disabled');
        $('#speakmg').addClass('ui-state-disabled');
        $('#systemmg').addClass('ui-state-disabled');
        $('#signInPopBtn').text("登录");
    }
}

//显示 提示登录信息
function displaySignInMesg() {
    var str = "";
    str += '<h1>请登录到设备系统</h1>';
    str += '<p>为确保系统功能使用的合法性，使用设备功能前，你需要先登录到设备系统.请点击右上角的 <kbd>登录</kbd> 按键 登录.</p>';
    str += '<p class="alert alert-warning">为确保系统网页显示性能，你操作的管理设备需要具备连接外网.</p>';

    $('#mainBody').append(str);

    setPlayTaskBtnOnClick();
}

//////////////////// 功能的UI


function loadTaskListToUI(taskData) {
    var htmlStr = '<table margin="0"><tbody>';
    for (var i = 0; i < taskData.length; i++) {
        htmlStr += '<tr taskid="' + taskData[i]["TaskID"] + '"><th><h3>' + taskData[i]["TaskName"] + taskData[i]["StartTime"] + '</h3></th>';
        htmlStr += '<td><button class="ui-btn ui-corner-all ui-shadow ui-btn-inline task-start" taskid="' + taskData[i]["GroupID"] + '">启动</button></td>';
        htmlStr += '<td><button class="ui-btn ui-corner-all ui-shadow ui-btn-inline task-edit" taskid="' + taskData[i]["GroupID"] + '">编辑</button></td>';
        htmlStr += '<td><button class="ui-btn ui-corner-all ui-shadow ui-btn-inline task-del" taskid="' + taskData[i]["GroupID"] + '">删除</button></td></tr>';
    }
    htmlStr += '</tbody></table>';
    $('#mainBody').append(htmlStr).trigger("create");
    setPlayTaskBtnOnClick();
}

function setPlayTaskBtnOnClick() {
    $(".task-start").on("click", function () {
        showDialog('提示信息', '评估设备功能未开发！', 1000);
    });

    $(".task-edit").on("click", function () {
        showDialog('提示信息', '评估设备功能未开发！', 1000);
    });

    $(".task-del").on("click", function () {
        showDialog('提示信息', '评估设备功能未开发！', 1000);
    });
}


function loadGroupMgUI(groupData) {
    var htmlStr = getChannelsStateUI("CH", 16);//获取输出分区状态标志栏UI html
    //加载分组数据的功能UI，
    //加载操作功能UI

    htmlStr += '<h3 style="border-bottom: 1px solid #ddd;">已有的喇叭分组：</h3>';
    htmlStr += '<table margin="0"><tbody>';

    for (var i = 0; i < groupData.length; i++) {
        var stateStr = groupData[i]["Status"] ? 'value="Open" style="padding: 0.4em 0.2em 0.4em 2em;">关闭' : 'value="Close" style="padding: 0.4em 0.2em 0.4em 2em;">打开';
        var actionStr = groupData[i]["Status"] ? ' ui-btn-active ui-icon-audio ui-btn-icon-left' : ' ui-icon-forbidden ui-btn-icon-left';
        htmlStr += '<tr groupid="' + groupData[i]["GroupID"] + '"><th><h3>' + groupData[i]["GroupName"] + '</h3></th>';
        htmlStr += '<td><button class="ui-btn ui-corner-all ui-shadow ui-btn-inline group-oper' + actionStr + '" groupid="' + groupData[i]["GroupID"] + '"' + stateStr + '</button></td>' +
            '<td><button class="ui-btn ui-corner-all ui-shadow ui-btn-inline group-edit" groupid="' + groupData[i]["GroupID"] + '">编辑</button></td>' +
            '<td><button class="ui-btn ui-corner-all ui-shadow ui-btn-inline group-del" groupid="' + groupData[i]["GroupID"] + '">删除</button></td></tr>';
    }

    htmlStr += '</tbody></table>';
    htmlStr += '<button class="ui-shadow ui-btn ui-corner-all ui-icon-plus ui-btn-icon-left" id="btn-group-add" style="max-width: 360px;margin:0 auto;">添加一个喇叭分组</button>';

    $('#mainBody').append(htmlStr).trigger("create");//.listview();

    getDeviceChannels("", refreshChannelsState);//刷新输出分区状态

    setGroupBtnOnClick();
}

function setGroupBtnOnClick() {
    $(".btn-CH-State").on("click", function () {
        var channelID = this.id;
        $.Zebra_Dialog("确定要直接操作分区: " + this.id + "吗？", {
            'title': '操作确认', width: 300, 'buttons': ['是(Yes)', '否(No)'], 'onClose': function (caption) {
                if (caption == '是(Yes)') {
                    var channelObject = $("#" + channelID);
                    var oper = "Open";
                    if (channelObject.hasClass("ui-icon-audio")) {
                        oper = "Close";
                        operateGroup(oper, channelID, "CHID", function (channelID, data) {
                            if ("Status" in data && data['Status'] == true) {
                                $("#" + channelID).removeClass("ui-icon-audio").addClass("ui-icon-forbidden");
                            }
                        });
                    } else {
                        operateGroup(oper, channelID, "CHID", function (channelID, data) {
                            if ("Status" in data && data['Status'] == true) {
                                $("#" + channelID).removeClass("ui-icon-forbidden").addClass("ui-icon-audio");
                            }
                        });
                    }
                }
            }
        });
    });

    $(".group-del").on("click", function () {
        var groupId = $(this).attr("groupid");
        var theGroup = groups.filter(function (x) {
            return x["GroupID"] == groupId;
        })[0];
        var groupName = theGroup["GroupName"] != undefined ? theGroup["GroupName"] : "";

        $.Zebra_Dialog("确定要删除选择的 " + groupName + " 分组吗？", {
            'title': '操作确认', width: 300, 'buttons': ['是(Yes)', '否(No)'], 'onClose': function (caption) {
                if (caption == '是(Yes)') {
                    delGroup(groupId, function (groupId, date) {
                        // alert("删除分组" + groupId + "成功！");
                        $("tr[groupid=" + groupId + "]").remove();
                    });
                }
            }
        });
    });

    $('.group-edit').click(function () {
        var groupId = $(this).attr("groupid");
        var theGroup = groups.filter(function (x) {
            return x["GroupID"] == groupId;
        })[0];

        $popup = getGroupEditForm();
        $("#btn-group-save").data("editType", "Edit");
        $("#btn-group-save").data("groupID", groupId);

        $popup.popup({ history: false });
        setGroupDataToUI(theGroup["GroupName"], theGroup["ChannelList"]);
        $popup.popup('open');

    });

    $(".group-oper").on("click", function () {
        var groupId = $(this).attr("groupid");
        if (this.value == "Close") {
            operateGroup("Open", groupId, "GroupID", function (groupId, data) {
                if ("Status" in data && data['Status'] == true) {
                    var btn = $('td button[groupid=' + groupId + '][value]').eq(0);
                    if (btn == undefined)
                        return;
                    $(btn).text("关闭");
                    $(btn).attr("value", "Open");
                    $(btn).addClass('ui-btn-active').removeClass('ui-icon-forbidden').addClass('ui-icon-audio');
                }
            });

        } else {
            operateGroup("Close", groupId, "GroupID", function (groupId, data) {
                if ("Status" in data && data['Status'] == true) {
                    var btn = $('td button[groupid=' + groupId + '][value]').eq(0);
                    if (btn == undefined)
                        return;
                    $(btn).text("打开");
                    $(btn).attr("value", "Close");
                    $(btn).removeClass('ui-btn-active').removeClass('ui-icon-audio').addClass('ui-icon-forbidden');
                }
            });
        };
        getDeviceChannels("", refreshChannelsState);//刷新输出分区状态
    });

    $('#btn-group-add').click(function () {
        $popup = getGroupEditForm();
        $("#btn-group-save").data("editType", "Add");

        $popup.popup({ history: false });
        setGroupDataToUI("", "");
        $popup.popup('open');

    });
}


function setGroupDataToUI(groupName, channelList) {
    $("#text-group-name").val(groupName).textinput();
    var ch = channelList.split("&");
    $('input[name="group-CH-edit"]').each(function () {
        var selectCH = this.id.replace("edit-", "");
        if ($.inArray(selectCH, ch) >= 0) {
            $(this).attr("checked", true);
        } else {
            $(this).attr("checked", false);
        }
    }).checkboxradio("refresh");
}

function getGroupEditForm() {
    var $popup = $("#group-add-form");
    if ($popup.length == 0) {
        // alert(this.textContent);
        var htmlStr = '<div data-role="popup" data-dismissible="false" id="group-add-form" class="ui-content" style="min-width :280px;max-width:600">' +
            '<button class="group-cancel ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right">Close</button>' +
            '<label for="text-3">分组名称：</label>' +
            '<input type="text" data-clear-btn="true" name="text-3" id="text-group-name" value="">' +
            '<label for="text-3">选择输出分区：</label>';
        var block = ['0', 'a', 'b', 'c', 'd']
        var prefix = 'CH';
        var index = 1;
        for (var i = 1; i <= 4; i++) {
            htmlStr += '<div class="ui-grid-c">';
            for (var j = 1; j <= 4; j++) {
                var IndexID = index < 10 ? "0" + index : index;
                var channelID = prefix + IndexID;
                var channelText = $(window).width() < 400 ? IndexID : channelID;

                htmlStr += '<div class="ui-block-' + block[j] + '"><input type="checkbox" name="group-CH-edit" id="edit-' + channelID + '"><label for="edit-' + channelID + '" style="text-overflow:clip">' + channelText + '</label></div>';
                index++;
            };
            htmlStr += '</div>';
        }
        htmlStr += '<fieldset class="ui-grid-a">' +
            '<div class="ui-block-a"><button class="group-cancel ui-shadow ui-btn ui-corner-all ui-icon-back ui-btn-icon-left">取消退出</button></div>' +
            '<div class="ui-block-b"><button class="ui-shadow ui-btn ui-corner-all ui-icon-check ui-btn-icon-left" id="btn-group-save">保存修改</button></div>' +
            '</fieldset>';

        $('#mainBody').append(htmlStr).trigger("create");//.listview();

        $("#btn-group-save").on("click", function () {
            var groupName = $("#text-group-name").val();
            if (groupName == '') {
                $("#text-group-name").focus();
                return;
            }
            if (groupName.length > 10) {
                alert("分组名称太长！");
                return;
            }
            var addOrEdit = $("#btn-group-save").data("editType");
            var selectCH = '';
            $('input[name="group-CH-edit"]:checked ').each(function () {
                //枚举获得选择项
                if (this.checked) {
                    if (selectCH != '') {
                        selectCH += '&';
                    }
                    selectCH += this.id.replace("edit-", "");
                }
            });
            var groupId = addOrEdit === 'Edit' ? $("#btn-group-save").data("groupID") : '0';
            addOrEditGroup(addOrEdit, groupName, selectCH, groupId, function (groupId, data) {
                if ("Status" in data && data['Status'] == true) {
                    $("#groupmg").click();
                }
            });
            //alert(addOrEdit + groupName + selectCH);
            $("#group-add-form").remove();
        });

        $(".group-cancel").on("click", function () {
            $("#group-add-form").remove();
        });

        $popup = $("#group-add-form");
    }
    return $popup;
}

function getChannelsStateUI(prefix, count) {
    var htmlStr = '<div data-role="collapsible" class="ui-alt-icon"><h4>输出分区状态监控</h4>';
    for (var i = 1; i <= count; i++) {
        var channelName = prefix + (i < 10 ? "0" + i : i);
        htmlStr += '<a href="#" class="btn-CH-State ui-btn ui-shadow ui-corner-all ui-icon-forbidden ui-btn-icon-notext ui-btn-inline" title="'
            + channelName + '分区" id="' + channelName + '">' + channelName + '</a>';
    }
    htmlStr += '</div>';
    return htmlStr;
}


function loadSpeakUI() {
    var htmlStr = getChannelsStateUI("CH", 16);//获取输出分区状态标志栏UI html

    htmlStr += isWidescreen ? '<div class="ui-grid-a"><div class="ui-block-a"><div class="zp-ui-bar ui-bar-a">' : '';
    htmlStr += getSpeakGridaUI(isWidescreen);
    htmlStr += isWidescreen ? (' </div>' +
        '</div>' +
        '<div class="ui-block-b">' +
        '<div class="zp-ui-body ui-bar-a">' +
        '<div class="ui-grid-b">' +
        '<legend>选择收听喇叭分组：</legend>' + getChannelGroupCheckbox(groups) + '</div></div></div></div>') : '';

    $('#mainBody').append(htmlStr).trigger("create");//.listview();
    getDeviceChannels("", refreshChannelsState);//刷新输出分区状态

    setSpeakBtnOnClick();
}

function setSpeakBtnOnClick() {
    $("#btn-speak").on("click", function () {
        var content = $("#text-speak-content").val();
        var speed = $("#speak-speed").val();
        var volume = $("#speak-volume").val();
        if (content == '') {
            showDialog('提示信息', '你没有输入播报内容！', 2000);
            return;
        }
        var groupList = '';
        if (!isWidescreen) {
            var selectGroup = $("#select-groupList").val();
            groupList = selectGroup == null ? '' : selectGroup.toString().replace(/,/gm, "&");
        }
        else {
            $('input[name="speakGroupCheckbox"]:checked ').each(function () {
                //枚举获得选择项
                if (this.checked) {
                    if (groupList != '') {
                        groupList += '&';
                    }
                    groupList += this.id.replace("check-group-", "");
                }
            });
        };
        if (groupList == '') {
            showDialog('提示信息', '你没有选择收听喇叭组！', 2000);
            return;
        }
        speakTextContentToGroup(content, volume, groupList, function (data) {
            if ("Status" in data && data['Status'] == true) {
                showDialog('提示信息', '播报提交成功！', 1000);
            } else {
                showDialog('提示信息', '播报提交失败！', 1000);
            }
        });
    });

    $("#btn-speak-fire").on("click", function () {
        showDialog('提示信息', '评估设备功能未开发！', 1000);
    });

    $("#btn-speak-close").on("click", function () {
        var content = '请注意，即将关闭大门';
        speakTextContentToGroup(content, '10', '100', function (data) {
            if ("Status" in data && data['Status'] == true) {
                showDialog('提示信息', '播报提交成功！', 1000);
            } else {
                showDialog('提示信息', '播报提交失败！', 1000);
            }
        });
    });

    $("#btn-speak-time").on("click", function () {
        var myDate = new Date();
        var content = '现在时间' + myDate.getHours() + '点' + myDate.getMinutes() + '分';
        speakTextContentToGroup(content, '10', '100', function (data) {
            if ("Status" in data && data['Status'] == true) {
                showDialog('提示信息', '播报提交成功！', 1000);
            } else {
                showDialog('提示信息', '播报提交失败！', 1000);
            }
        });
    });

    $("#btn-speak-groupBtn1").on("click", function () {
        speakUserNameStr(this);
    });

    $("#btn-speak-groupBtn2").on("click", function () {
        speakUserNameStr(this);
    });
    $(".btn-CH-State").on("click", function () {
        var channelID = this.id;
        $.Zebra_Dialog("确定要直接操作分区: " + this.id + "吗？", {
            'title': '操作确认', width: 300, 'buttons': ['是(Yes)', '否(No)'], 'onClose': function (caption) {
                if (caption == '是(Yes)') {
                    var channelObject = $("#" + channelID);
                    var oper = "Open";
                    if (channelObject.hasClass("ui-icon-audio")) {
                        oper = "Close";
                        operateGroup(oper, channelID, "CHID", function (channelID, data) {
                            if ("Status" in data && data['Status'] == true) {
                                $("#" + channelID).removeClass("ui-icon-audio").addClass("ui-icon-forbidden");
                            }
                        });
                    } else {
                        operateGroup(oper, channelID, "CHID", function (channelID, data) {
                            if ("Status" in data && data['Status'] == true) {
                                $("#" + channelID).removeClass("ui-icon-forbidden").addClass("ui-icon-audio");
                            }
                        });
                    }
                }
            }
        });
    });
}

function speakUserNameStr(theBtn) {
    var content = $("#text-speak-userName").val() + $(theBtn).text();
    var speed = $("#speak-speed").val();
    var volume = $("#speak-volume").val();
    var groupList = '';
    if (!isWidescreen) {
        var selectGroup = $("#select-groupList").val();
        groupList = selectGroup == null ? '' : selectGroup.toString().replace(/,/gm, "&");
    }
    else {
        $('input[name="speakGroupCheckbox"]:checked ').each(function () {
            //枚举获得选择项
            if (this.checked) {
                if (groupList != '') {
                    groupList += '&';
                }
                groupList += this.id.replace("check-group-", "");
            }
        });
    };
    if (groupList == '') {
        showDialog('提示信息', '你没有选择收听喇叭组！', 2000);
        return;
    }
    speakTextContentToGroup(content, volume, groupList, function (data) {
        if ("Status" in data && data['Status'] == true) {
            showDialog('提示信息', '播报提交成功！', 1000);
        } else {
            showDialog('提示信息', '播报提交失败！', 1000);
        }
    });
}

function getSpeakGridaUI(isWidescreen) {
    var htmlStr = '<legend>语音播报内容: </legend>' +
        '<textarea name="speak-content" id="text-speak-content" placeholder="在这里输入要播报的语音内容 -> 选择收听喇叭分组 -> 点击播报按钮"></textarea>' +
        '<label for="slider-1">语速:</label>' +
        '<input type="range" name="slider-1" data-highlight="true" id="speak-speed" min="0" max="5" value="3">' +
        '<label for="slider-2">音量:</label>' +
        '<input type="range" name="slider-2" data-highlight="true" id="speak-volume" min="0" max="16" value="8">' +
        '<div class="ui-field-contain">' +
        '<label for="select-speak-role">选择语音角色:</label>' +
        '<select name="select-speak-role" id="select-speak-role">' +
        '<option value="1">成年女声</option>' +
        '<option value="2" disabled="disabled">成年男声</option>' +
        '<option value="3" disabled="disabled">儿童女声</option>' +
        '<option value="4" disabled="disabled">儿童男声</option>' +
        '</select>'
    '</div>';
    htmlStr += !isWidescreen ? getChannelGroupSlecte(groups) : '</div>';//获取喇叭分组选择UI

    htmlStr += '<button class="ui-btn ui-btn-b ui-corner-all ui-icon-audio ui-btn-icon-left" id="btn-speak">播报输入内容语音</button>' +
        '<div class="ui-corner-all custom-corners">' +
        '<div class="ui-bar ui-bar-a">' +
        '<h3>选择快捷播报：</h3>' +
        '</div>' +
        '<div class="">' +
        '<fieldset class="ui-grid-b" margin="0">' +
        '<div class="ui-block-a"><button class="ui-btn ui-corner-all ui-icon-alert ui-btn-icon-left" id="btn-speak-fire">消防报警</button></div>' +
        '<div class="ui-block-b"><button class="ui-btn ui-corner-all ui-icon-lock ui-btn-icon-left" id="btn-speak-close">即将关门</button></div>' +
        '<div class="ui-block-c"><button class="ui-btn ui-corner-all ui-icon-clock ui-btn-icon-left" id="btn-speak-time">播报时间</button></div>' +
        '</fieldset>' +
        '<div data-role="controlgroup" data-type="horizontal" ' + (!isWidescreen ? ' data-mini="true"' : '') + '>' +
        '<input type="text" id="text-speak-userName" data-wrapper-class="controlgroup-textinput ui-btn" placeholder="在这里输入人名" value="">' +
        '<button id="btn-speak-groupBtn1">请到门口来一下</button>';
    if (isWidescreen)
        htmlStr += '<button id="btn-speak-groupBtn2">请到办公室来一下</button>';
    htmlStr += '</div></div></div>';
    return htmlStr;
}

function getChannelGroupSlecte(groupData) {
    var selectStr = '';
    for (var i = 0; i < groupData.length; i++) {
        selectStr += '<option value="' + groupData[i]["GroupID"] + '">' + groupData[i]["GroupName"] + '</option>';
    }
    var htmlStr = '<div class="ui-field-contain">' +
        '<label for="select-groupList">选择收听喇叭分组:</label>' +
        '<select name="select-groupList" id="select-groupList" data-native-menu="false" multiple="multiple">' +
        '<option>选择喇叭分组</option>' +
        selectStr +
        '</select>' +
        '</div>';

    return htmlStr;
}

function getChannelGroupCheckbox(groupData) {
    var htmlStr = '<fieldset class="ui-grid-b" margin="0">';
    for (var i = 0; i < groupData.length; i++) {
        var checkID = 'check-group-' + groupData[i]["GroupID"];
        htmlStr += '<div class="ui-block-a"><input type="checkbox" name="speakGroupCheckbox" id="' + checkID + '" data-mini="true">' +
            '<label for="' + checkID + '">' + groupData[i]["GroupName"] + '</label></div>';
        if (++i < groupData.length) {
            checkID = 'check-group-' + groupData[i]["GroupID"];
            htmlStr += '<div class="ui-block-b"><input type="checkbox" name="speakGroupCheckbox" id="' + checkID + '" data-mini="true">' +
                '<label for="' + checkID + '">' + groupData[i]["GroupName"] + '</label></div>';
        }
        else {
            htmlStr += '<div class="ui-block-b"></div>';
        }
        if (++i < groupData.length) {
            checkID = 'check-group-' + groupData[i]["GroupID"];
            htmlStr += '<div class="ui-block-c"><input type="checkbox" name="speakGroupCheckbox" id="' + checkID + '" data-mini="true">' +
                '<label for="' + checkID + '">' + groupData[i]["GroupName"] + '</label></div>';
        }
        else {
            htmlStr += '<div class="ui-block-c"></div>';
        }
    }
    htmlStr += '</fieldset>';

    return htmlStr;
}


//显示 系统配置功能的UI
function loadingSystemSetUI() {
    //获取设备配置信息
    //转化汉字名称
    //加载UI
    //注册交互事件方法
    var apiStr = debugDevIP + 'API/' + tokenStr + '/System/GetConfig' + jsonCallback;//.json
    var settingTabStr = '<ul data-role="listview" data-split-icon="edit" data-split-theme="a" data-inset="true" id="ul-main">';
    settingTabStr += getOneSystemReadonlyUI('配置项目名称', '设定值');
    $.getJSON(apiStr, function (data) {
        for (prop in data) {
            //alert("属性名称：" + pop + "属性值：" + data[pop]);
            var inputControlHtml = '';
            if (setConfig[prop] != undefined) {
                switch (setConfig[prop].dataType) {
                    case "R":
                        {
                            settingTabStr += getOneSystemReadonlyUI(setConfig[prop].display, data[prop]);
                            break;
                        }
                    case "IP":
                        {
                            inputControlHtml += getTextInputUI(prop, data[prop]);
                            settingTabStr += getOneSystemSetInputUI(prop, setConfig[prop].display, inputControlHtml);
                            break;
                        }
                    case "NumSlider":
                        {
                            inputControlHtml += getSliderNumberInputUI(prop, data[prop], setConfig[prop].min, setConfig[prop].max, setConfig[prop].step);
                            settingTabStr += getOneSystemSetInputUI(prop, setConfig[prop].display, inputControlHtml);
                            break;
                        }
                    case "Bool":
                        {
                            inputControlHtml += getBoolSelectInputUI(prop, setConfig[prop].on, setConfig[prop].off, setConfig[prop].onCN, setConfig[prop].offCN, data[prop]);
                            settingTabStr += getOneSystemSetInputUI(prop, setConfig[prop].display, inputControlHtml);
                            break;
                        }
                    case "Time":
                        {
                            inputControlHtml += getTimeInputUI(prop, data[prop]);
                            settingTabStr += getOneSystemSetInputUI(prop, setConfig[prop].display, inputControlHtml);
                            break;
                        }
                    case "DateTime":
                        {
                            inputControlHtml += getLocalDateTimeInputUI(prop, data[prop]);
                            settingTabStr += getOneSystemSetInputUI(prop, setConfig[prop].display, inputControlHtml);
                            break;
                        }
                    default:
                        {
                            settingTabStr += getOneSystemReadonlyUI(prop, data[prop]);
                            break;
                        }
                }
            }
        };

        settingTabStr += '</ul>';
        // $popup.popup();
        $(settingTabStr).appendTo("#mainBody").trigger("create").listview(); //$('#mainBody').append(settingTabStr);
        // $("#ul-main").listview();
        // $('input[type=text]').textinput();
        $(".set-edit-popup").on("click", function () {
            var listitem = $(this).parent("li");
            // confirmAndDelete(listitem);
            editSetConfirm(listitem);
        });

    }).error(function () {
        showmsg("提示信息", "获取配置信息失败，请确定设备是否正常开启并连接到网络。", "", 5000, 'danger');
    });

}

function editSetConfirm(listitem) {
    var setData = listitem.find(".setCN").eq(0);
    var oldVal = listitem.find(".setVal").eq(0).text();
    var setName = setData.attr("setName");

    var tagStr = setData.text();
    $.Zebra_Dialog('确认更改配置, <strong>' + tagStr + '</strong>的设定值?', {
        'type': 'warning',
        'title': '确认更改？',
        'buttons': [{
            caption: '是(Yes)', callback: function () {
                // alert('"Yes" was clicked');
                showmsg("提示信息", '评估板，功能尚未开放。', "", 2000, 'info');
            }
        }, '否(No)'],
        'width': 280
    });
}

var setConfig = {
    DeviceSN: { display: "设备序号:", setPath: "", dataType: "R" },
    DevIPV4: { display: "IP地址:", setPath: "", dataType: "IP" },
    TokenTimeOut: { display: "令牌过期:", setPath: "", dataType: "Bool", on: "Yes", off: "no", onCN: "是", offCN: "否" },
    LoginOnCount: { display: "登录用户数:", setPath: "", dataType: "R" },
    OpenDevTime: { display: "开机时间:", setPath: "", dataType: "Time" },
    CloseDevTime: { display: "关机时间:", setPath: "", dataType: "Time" },
    SpeakOutputModel: { display: "语音模式:", setPath: "", dataType: "Bool", on: "Exclusive", off: "Shared", onCN: "独占", offCN: "共享" },
    SpeakQueueLength: { display: "语音队列长:", setPath: "", dataType: "NumSlider", min: 5, max: 40, step: 5 },
    SpeakContentLength: { display: "语音限长:", setPath: "", dataType: "NumSlider", min: 5, max: 30, step: 5 },
    DevDateTime: { display: "设备日期时间:", setPath: "", dataType: "DateTime" },
    DevRunTime: { display: "已运行时间:", setPath: "", dataType: "R" },
    StorageDev: { display: "存储设备:", setPath: "", dataType: "R" },
    StorageSize: { display: "存储空间:", setPath: "", dataType: "R" },
    StorageFreeSize: { display: "存储剩余空间:", setPath: "", dataType: "R" }
}

//////////////////// 功能原子方法

function getPlayTaskCount(callback) {
    var apiStr = debugDevIP + 'API/' + tokenStr + '/Task/GetTaskCount' + jsonCallback;//+'.json';
    var ajaxSemaphore = { isNeedKill: true };//声明信号量
    var ajaxCall = $.getJSON(apiStr, function (data) {
        ajaxSemaphore.isNeedKill = false;// set to false
        if (callback != undefined && typeof callback == 'function') {
            if ("TaskCount" in data) {
                callback(data["TaskCount"]);
            } else {
                callback();
            }
        }
    });
    ajaxTimeout(ajaxSemaphore, ajaxCall, 2000, function () {
        showDialog('提示信息', '获取信息超时,请检查设备和网络状态。');
        return -1;
    });
}

function getPlayTaskListData(indexSpanStr, callback) {
    var apiStr = debugDevIP + 'API/' + tokenStr + '/Task/GetTaskList/' + indexSpanStr + jsonCallback;//+'.json';
    var ajaxSemaphore = { isNeedKill: true };//声明信号量
    var ajaxCall = $.getJSON(apiStr, function (data) {
        ajaxSemaphore.isNeedKill = false;// set to false
        channels = data;//存储到全局缓存对象
        if (callback != undefined && typeof callback == 'function')
            callback(data);
    });
    ajaxTimeout(ajaxSemaphore, ajaxCall, 3000, function () {
        showDialog('提示信息', '获取信息超时,请检查设备和网络状态。');
    });
}

function speakTextContentToGroup(content, volume, groupIdList, callback) {

    var contentUTF = encodeURIComponent(content, 'UTF-8');
    var apiStr = debugDevIP + 'API/' + tokenStr + '/Speak/Speak_TTS/' + contentUTF + '/GroupID=' + groupIdList + '/' + volume + '/4/woman' + jsonCallback;//+'.json';
    var ajaxSemaphore = { isNeedKill: true };//声明信号量
    var ajaxCall = $.getJSON(apiStr, function (data) {
        ajaxSemaphore.isNeedKill = false;// set to false
        if (callback != undefined && typeof callback == 'function')
            callback(data);
    });
    ajaxTimeout(ajaxSemaphore, ajaxCall, 3000, function () {
        showDialog('提示信息', '获取操作成果信息超时,请检查设备和网络状态。');
    });
}

function addOrEditGroup(editType, groupName, channelList, groupId, callback) {
    var groipIdStr = editType === 'Edit' ? groupId + '/' : '';
    var nameUTF = encodeURIComponent(groupName, 'UTF-8');
    var apiStr = debugDevIP + 'API/' + tokenStr + '/Group/' + editType + 'ChannelGroup/' + groipIdStr + nameUTF + '/' + channelList + jsonCallback;//+'.json';
    var ajaxSemaphore = { isNeedKill: true };//声明信号量
    var ajaxCall = $.getJSON(apiStr, function (data) {
        ajaxSemaphore.isNeedKill = false;// set to false
        if (callback != undefined && typeof callback == 'function')
            callback(groupId, data);
    });
    ajaxTimeout(ajaxSemaphore, ajaxCall, 3000, function () {
        showDialog('提示信息', '获取操作信息超时,请检查设备和网络状态。');
    });
}

function delGroup(groupId, callback) {
    var apiStr = debugDevIP + 'API/' + tokenStr + '/Group/DelChannelGroup/' + groupId + jsonCallback;//+'.json';
    var ajaxSemaphore = { isNeedKill: true };//声明信号量
    var ajaxCall = $.getJSON(apiStr, function (data) {
        ajaxSemaphore.isNeedKill = false;// set to false
        if (callback != undefined && typeof callback == 'function')
            callback(groupId, data);
    });
    ajaxTimeout(ajaxSemaphore, ajaxCall, 3000, function () {
        showDialog('提示信息', '获取操作信息超时,请检查设备和网络状态。');
    });
}


function operateGroup(operType, groupId, channelOrGroup, callback) {
    var apiStr = debugDevIP + 'API/' + tokenStr + '/Group/' + operType + '/' + channelOrGroup + '=' + groupId + jsonCallback;//+'.json';
    var ajaxSemaphore = { isNeedKill: true };//声明信号量
    var ajaxCall = $.getJSON(apiStr, function (data) {
        ajaxSemaphore.isNeedKill = false;// set to false
        if (callback != undefined && typeof callback == 'function')
            callback(groupId, data);
    });
    ajaxTimeout(ajaxSemaphore, ajaxCall, 3000, function () {
        showDialog('提示信息', '获取操作信息超时,请检查设备和网络状态。');
    });
}


function refreshChannelsState(prefix, channelsData) {
    for (var i = 0; i < channelsData.length; i++) {
        var chid = prefix + channelsData[i]["CHID"];
        if (channelsData[i]["Status"]) {
            $("#" + chid).removeClass("ui-icon-forbidden").addClass("ui-icon-audio");
        } else {
            $("#" + chid).removeClass("ui-icon-audio").addClass("ui-icon-forbidden");
        }
    }
}


function getDeviceChannels(prefix, callback) {
    var apiStr = debugDevIP + 'API/' + tokenStr + '/Group/GetChannels' + jsonCallback;//+'.json';
    var ajaxSemaphore = { isNeedKill: true };//声明信号量
    var ajaxCall = $.getJSON(apiStr, function (data) {
        ajaxSemaphore.isNeedKill = false;// set to false
        channels = data;//存储到全局缓存对象
        if (callback != undefined && typeof callback == 'function')
            callback(prefix, data);
    });
    ajaxTimeout(ajaxSemaphore, ajaxCall, 3000, function () {
        showDialog('提示信息', '获取信息超时,请检查设备和网络状态。');
    });
}

function getDeviceGroup(indexSpanStr, callback) {
    var apiStr = debugDevIP + 'API/' + tokenStr + '/Group/GetCHGroups/' + indexSpanStr + jsonCallback;//+'.json';
    var ajaxSemaphore = { isNeedKill: true };//声明信号量
    var ajaxCall = $.getJSON(apiStr, function (data) {
        ajaxSemaphore.isNeedKill = false;// set to false
        groups = data;//存储到全局缓存对象
        if (callback != undefined && typeof callback == 'function')
            callback(data);
    });
    ajaxTimeout(ajaxSemaphore, ajaxCall, 2000, function () {
        showDialog('提示信息', '获取信息超时,请检查设备和网络状态。');
    });
}

function getDeviceGroupCount(callback) {
    var apiStr = debugDevIP + 'API/' + tokenStr + '/Group/GetCHGroupsCount' + jsonCallback;//+'.json';
    var ajaxSemaphore = { isNeedKill: true };//声明信号量
    var ajaxCall = $.getJSON(apiStr, function (data) {
        ajaxSemaphore.isNeedKill = false;// set to false
        if (callback != undefined && typeof callback == 'function') {
            if ("GroupCount" in data) {
                callback(data["GroupCount"]);
            } else {
                callback();
            }
        }
    });
    ajaxTimeout(ajaxSemaphore, ajaxCall, 2000, function () {
        showDialog('提示信息', '获取信息超时,请检查设备和网络状态。');
        return -1;
    });
}


function getOneSystemSetInputUI(setName, setDisplay, inputhtml) {
    var htmlStr = ' <li><a href="" class="ui-mini"><div class="ui-grid-a"><div class="ui-block-b"><div class="setCN ui-btn ui-mini" setName="' + setName + '">'
        + setDisplay + '</div></div><div class="ui-block-b">'
        + inputhtml + '</div></div></a><a class="set-edit-popup" data-rel="popup" data-position-to="window" data-transition="pop">修改设定</a></li>';
    return htmlStr;
}

function getTextInputUI(setName, setVal) {
    var htmlStr = '<input type="text" data-clear-btn="true" data-mini="true" name="text-5" id="textIn-' +
        setName + '" value=' + setVal + '>'
    return htmlStr;
}
function getSliderNumberInputUI(setName, setVal, min, max, step) {
    var htmlStr = '<input type="range" name="slider-fill" id="sliderIn-' + setName + '" value="' + setVal + '" min="' + min + '" max="' + max + '" step="' + step + '" data-highlight="true">';
    return htmlStr;
}

function getTimeInputUI(setName, setVal) {
    var htmlStr = ' <input type="time" name="time" id="timeIn-' + setName + '" value="' + setVal + '" placeholder="Time" data-theme="a">';
    return htmlStr;
}

function getLocalDateTimeInputUI(setName, setVal) {
    var htmlStr = '<input type="datetime-local" data-clear-btn="true" name="datetime-4" id="datetimeIn-' + setName + '" value="' + setVal + '">';
    return htmlStr;
}

function getBoolSelectInputUI(setName, onName, offName, onCN, offCN, setVal) {
    var offSelect = setVal == offName ? ' selected=""' : '';
    var onSelect = setVal == onName ? ' selected=""' : '';
    var htmlStr = '<select name="slider-flip-m" id="slider-flip-' + setName + '" data-role="slider" data-mini="true"><option value=' + offName + offSelect + '>' + offCN +
        ' </option><option value=' + onName + onSelect + '> ' + onCN + '</option></select>';
    return htmlStr;
}

function getOneSystemReadonlyUI(setDisplay, setVal) {
    var htmlStr = '<li class="ui-mini" ><div class="ui-grid-a"><div class="ui-block-a"><div class="ui-bar ui-bar-a" style="text-align: center;">' +
        setDisplay + '</div></div><div class="ui-block-b"><div class="ui-bar ui-bar-a">' + setVal + '</div></div></div></li>';
    return htmlStr;
}

//////////////////// 基础通用方法

function isIP(ip) {
    var re = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
    return re.test(ip);
}

//YYYY-MM-DD
function checkDate(dateValue) {
    var result = dateValue.match(/((^((1[8-9]\d{2})|([2-9]\d{3}))(-)(10|12|0?[13578])(-)(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))(-)(11|0?[469])(-)(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))(-)(0?2)(-)(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)(-)(0?2)(-)(29)$)|(^([3579][26]00)(-)(0?2)(-)(29)$)|(^([1][89][0][48])(-)(0?2)(-)(29)$)|(^([2-9][0-9][0][48])(-)(0?2)(-)(29)$)|(^([1][89][2468][048])(-)(0?2)(-)(29)$)|(^([2-9][0-9][2468][048])(-)(0?2)(-)(29)$)|(^([1][89][13579][26])(-)(0?2)(-)(29)$)|(^([2-9][0-9][13579][26])(-)(0?2)(-)(29)$))/);
    return result != null;
}

//yyyy-MM-dd HH:mm:ss
function checkDateTime(date) {
    var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
    var r = date.match(reg);
    if (r == null) {
        return false;
    } else {
        return true;
    }
}


function ajaxTimeout(semaphore, ajaxCall, timeMs, timeoutCallback) {
    if (timeMs == undefined || typeof timeMs != 'number' || timeMs < 10) {
        timeMs = 2000;//default timeout 2 seconds
    }
    setTimeout(function (isneedtoKillAjax) {
        if (semaphore.isNeedKill && ajaxCall != undefined) {
            ajaxCall.abort();
            if (timeoutCallback !== undefined) {
                timeoutCallback();
            }
            // alert('killing the ajax call');                 
        } else {
            //  alert('no need to kill ajax');
        }
    }, timeMs);
}

function showDialog(title, content, times, infotype) {
    $.Zebra_Dialog(content, {
        'type': infotype,
        'title': title,
        'buttons': ['是(Yes)'],
        'width': 280,
        'auto_close': times
    });
}

//显示弹窗 （定时，跳转）
//infotype :warning danger info success
function showmsg(title, content, link, times, infotype) {
    var typeStr = ' alert-' + infotype;
    if ($("#showmsg").length == 0) {
        var showmsgdiv = '<div  data-role="popup" id="showmsg" data-theme="a" class="ui-content"  style="padding:10px 20px;"> <a href="#" data-rel="back" class="ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right">Close</a> <div data-role="header" class="formtital ' + typeStr + '" id="showtitle"> <h3>' + title + '</h3></div><div class="ui-content" id="showcontent">' + content + '</div></div>';
        var $popup = $(showmsgdiv);
    } else {
        var $popup = $("#showmsg");
        $("#showtitle").html(title).removeClass('alert-success alert-info alert-warning alert-danger').addClass(typeStr);
        $("#showcontent").html(content);
    }
    $popup.popup({ history: false });
    // $popup.popup();
    $popup.popup('open');
    if (typeof (times) == "number" && times > 0) {
        var msgshow = setTimeout(function () {
            $popup.popup('close');
            if (typeof (link) != 'undefined' && link != '') {
                self.location = link;
            }
        }, times);
    }
}
