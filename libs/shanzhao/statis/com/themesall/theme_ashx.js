//develop by lin.wang@findoout.com
In.add('check', { path: '/statics/js/fd/fd.checkvalue.js', type: 'js', charset: 'utf-8' });

In.add('jquery-ui', { path: '/statics/jquery_ui/1.9/js/jquery-ui-1.9.1.custom.min.js', type: 'js', charset: 'utf-8', rely: ['jquery-ui-css'] });
In.add('jquery-ui-css', { path: '/statics/jquery_ui/1.9/t1/jquery-ui-1.9.1.custom.min.css', type: 'css', charset: 'utf-8' });
In.add('ui-core', { path: '/statics/jquery_ui/js/core.js', type: 'js', charset: 'utf-8', rely: ['ui-css', 'ui-css-fix'] });
In.add('ui-sortable', { path: '/statics/jquery_ui/js/jquery.ui.sortable.min.js', type: 'js', charset: 'utf-8' });
In.add('ui-css', { path: '/statics/jquery_ui/t1/theme.css', type: 'css', charset: 'utf-8' });
In.add('ui-css-fix', { path: '/statics/jquery_ui/uifix.css', type: 'css', charset: 'utf-8' });

//select
In.add('select', { path: '/statics/com/themesall/types/select/select.js', type: 'js', charset: 'utf-8', rely: ['select-css'] });
In.add('select-css', { path: '/statics/com/themesall/types/select/images/select.css', type: 'css', charset: 'utf-8' });

//sorttable
In.add('sorttable', { path: '/statics/com/themesall/types/sorttable/sorttable.js', type: 'js', charset: 'utf-8', rely: ['jquery-ui', 'sorttable-css'] });
In.add('sorttable-css', { path: '/statics/com/themesall/types/sorttable/images/sorttable.css', type: 'css', charset: 'utf-8' });

//slider
In.add('slider', { path: '/statics/com/themesall/types/slider/slider.js', type: 'js', charset: 'utf-8', rely: ['slider-css'] });
In.add('slider-css', { path: '/statics/com/themesall/types/slider/images/slider.css', type: 'css', charset: 'utf-8' });


var themeServer = true;
var themeLoading = true;
var themesVerifyObj;

var themeLanguage = 'ch';
var themeLanguageObj = {
    'requiredText': '必填',
    'loadingText': '存储中',
    'radio': '请选择一项',
    'checkbox': '请至少选择一项',
    'h-radio': '请在每行列表中选择一项',
    'h-checkbox': '请在每行列表中至少选择一项',
    'v-radio': '请在每列列表中选择一项',
    'v-checkbox': '请在每列列表中至少选择一项',
    'text': '请填写正确的信息',
    'h-text': '请填写正确的信息',
    'select': '请从下拉列表项中选择一项',
    'sort': '请至少选择一项至右边列表处',
    'add': '以下选项为必填，请填写内容',
    'checkmax1': '您选择的项数超过了',
    'checkmax2': '项，请重新选择',
    'checkmin1': '您选择的项数少于',
    'checkmin2': '项，请重新选择',
    'checkmust1': '您选择的项数必须为',
    'checkmust2': '项，请重新选择',
    'textmincount1': '以下选项必填数小于',
    'textmincount2': '项，请重新选择',
    'textmustcount1': '以下选项必须填写',
    'textmustcount2': '项，请重新选择',
    'textsum': '总求和数必须等于',
    'default': '以下选项有错误，请重新填写'
}

$(function () {

    loadScripts();

    $('.btn-theme-next').hide();

    var global = $(window);
    var themeContainer = $('.theme-container');
    var themeList = $('.theme-list');
    var btnSave = $('#btnSave').show();

    var requiredText = themeLanguageObj['requiredText'];

    //server
    var themeClickSubmit = false;
    if ($("#hdPageSujectCount").val() == 1 && $("#hdAutoGotoNext").val() == 1 && $('.theme-list.radio')[0]) {
        themeClickSubmit = true;
        themeContainer.addClass('sole');
    }

    //赋值 theme-list data
    themeList.each(function () {
        $(this).data('mode', $(this).attr('class').replace('theme-list ', ''));
        $('.input:checked', themeList).attr('checked', false);
    });

    // 单选题 radio
    $('.theme-list.radio').each(function () {
        var container = $(this);
        var radioId = $(".hdSeleteId", container);
        $('.lists li', this).each(function (i, n) {
            var el = $(n);
            var addText = $('.add-text', el);
            el.bind({
                'mouseenter': function () {
                    el.addClass('hover');
                },
                'mouseleave': function () {
                    el.removeClass('hover');
                },
                'click': function () {
                    //server
                    if (themeServer) {
                        radioId.val($(this).attr('data-opid') + "#" + $(this).attr('data-scoreno'));
                    }
                    el.data('checked', true);

                    if (themesVerifyObj.hasSubmited)
                        themesVerifyObj.reCheckSubmit(container);

                    var index = container.data('cur');

                    if (index != 'undefined') {
                        $('li:eq(' + index + ')', container).removeClass('cur');
                        if ($('li', container).eq(index).hasClass('add')) {
                            $('li:eq(' + index + ') .add-text', container).hide();
                        }
                    }
                    el.addClass('cur');
                    container.data('cur', i);

                    $('input:radio', el)[0].checked = true;

                    if (container.data('add') == 'uncheck') {
                        container.data('add', 'checked');
                        $('.focus', container).removeClass('focus error');
                    }
                    if (el.hasClass('add')) {
                        if ($('.required', el)[0]) {
                            container.data('add', 'uncheck');
                        }
                        addText.show().addClass('focus').focus();
                    }
                    if (themeClickSubmit && !el.is('.add')) {
                        el.addClass('cur');
                        setTimeout(function () { btnSave.trigger('click'); }, 500); //单选自动提交
                    }
                }
            });

        });
    });

    //复选题 checkbox
    $('.theme-list.checkbox').each(function () {

        var container = $(this);
        var radioId = $(".hdSeleteId", container);

        //check count
        var isMaxCount = isMinCount = isMustCount = false;
        if (container.attr('maxcount')) isMaxCount = true;
        if (container.attr('mincount')) isMinCount = true;
        if (container.attr('mustcount')) isMustCount = true;

        $('.lists li', this).each(function (i, n) {

            var el = $(n);
            var checkbox = $('input:checkbox', el);
            var addText = $('.add-text', el);

            checkbox.click(function () {
                el.trigger('click');
            });

            addText.bind({
                click: function () { el.trigger('click'); }
            });

            el.bind({
                'mouseenter': function () {
                    el.addClass('hover');
                },
                'mouseleave': function () {
                    el.removeClass('hover');
                },
                'click': function () {
                    //server
                    if (themeServer) {
                        var thisoptionid = $(this).attr('data-opid') + "#" + $(this).attr('data-scoreno');
                    }

                    if (themesVerifyObj.hasSubmited)
                        themesVerifyObj.reCheckSubmit(container);


                    if (el.hasClass('hasradio')) {

                        $('li', container).filter(function () {
                            return $(this).data('checked') == 1;
                        }).trigger('click');
                        el.data('radiochecked', 1).addClass('cur');
                        $('input:radio', el)[0].checked = true;

                        //server
                        if (themeServer) {
                            radioId.val(thisoptionid);
                        }

                    } else {

                        if (themeServer) {
                            var voptionid = thisoptionid + ",";
                            var haveoption = radioId.val();
                        }

                        if (checkbox[0].checked) {

                            checkbox[0].checked = false;
                            el.data('checked', 0).removeClass('cur');

                            if (el.hasClass('add')) {
                                addText.hide();
                                if ($('.required', el)[0]) {
                                    addText.removeClass('focus error');
                                    if ($('.required.focus', container).length == 0) {
                                        container.data('add', 'checked');
                                    }
                                }
                            }

                            //server
                            if (themeServer) {
                                radioId.val('');
                                $(':checkbox:checked', container).each(function () {
                                    radioId[0].value += $(this).parent().attr('data-opid') + "#" + $(this).parent().attr('data-scoreno') + ',';
                                });
                            }

                        } else {

                            checkbox[0].checked = true;
                            el.data('checked', 1).addClass('cur');

                            if (el.hasClass('add')) {
                                if ($('.required', el)[0]) {
                                    container.data('add', 'uncheck');
                                }
                                addText.show().addClass('focus').focus();
                            }

                            //server
                            if (themeServer) {
                                radioId.val('');
                                $(':checkbox:checked', container).each(function () {
                                    radioId[0].value += $(this).parent().attr('data-opid') + "#" + $(this).parent().attr('data-scoreno') + ',';
                                });
                            }
                        }
                        
                        $('.hasradio', container).filter(function () {
                            var el = $(this);
                            if (el.data('radiochecked') == 1) {
                                $('input:radio', el)[0].checked = false;
                                el.data('radiochecked', 0);
                                return el;
                            }
                        }).removeClass('cur');
                    }

                    /****--check count-start---**/
                    if (isMaxCount || isMinCount || isMustCount) {

                        var countLen = $('.lists li.cur', container).length;

                        container.data('data-count-len', countLen);
                        if (isMaxCount) {
                            setTimeout(function () {
                                if (countLen > container.attr('maxcount')) {
                                    container.data('maxcount', true);
                                } else {
                                    container.data('maxcount', false);
                                }
                            }, 1);
                        }

                        if (isMinCount) {
                            setTimeout(function () {
                                if (countLen < container.attr('mincount')) {
                                    container.data('mincount', true);
                                } else {
                                    container.data('mincount', false);
                                }
                            }, 1);
                        }

                        if (isMustCount) {
                            setTimeout(function () {
                                if (countLen != container.attr('mustcount')) {
                                    container.data('mustcount', true);
                                } else {
                                    container.data('mustcount', false);
                                }
                            }, 1);
                        }
                    }
                    /****--check count-end---**/
                }
            });
        });
    });


    //同选项单选题，题目在左侧
    $('.theme-list.h-radio').each(function () {
        var mainContainer = $(this);
        var containerLen = $('tr', mainContainer).length - 1;
        splitTitle(this);
        $('.lists .opt', this).each(function (i, n) {

            var el = $(n);
            var addText = $('.add-text', el);

            el.bind({
                'mouseenter': function () {
                    el.parent().addClass('hover');
                },
                'mouseleave': function () {
                    el.parent().removeClass('hover');
                },
                'click': function () {

                    var tr = $(this).parent();
                    var checkAction = mainContainer.attr('check-action');

                    if ($(this).data('disabled')) {
                        return false;
                    }

                    if (checkAction == 1 || checkAction == 2) {
                        if ($('.cur', tr)[0]) {
                            var tdIndex = $('.cur', tr).index() - 1;
                            $('tr:not(.list-title)', mainContainer).each(function () {
                                $('.opt', this).eq(tdIndex).data('disabled', false);
                                $('.opt .input', this).eq(tdIndex)[0].disabled = false;
                            });
                        }
                    }

                    //server
                    if (themeServer) {
                        var radioId = $('#hdSeleteId' + $(this).attr('data-currno'));
                        var thisoptionid = $(this).attr('data-opid') + "#" + $(this).attr('data-scoreno');
                        radioId.val(thisoptionid);
                    }

                    var container = $(this).parent();

                    if (themesVerifyObj.hasSubmited) {
                        themesVerifyObj.reCheckSubmit(mainContainer);
                    }

                    $('.cur', tr).removeClass('cur');
                    $('input:radio', el).attr('checked', 1);
                    el.addClass('cur');

                    if (tr.hasClass('errorlist')) {
                        tr.removeClass('errorlist');
                    }

                    if (container.data('add') == 'uncheck') {
                        container.data('add', 'checked');
                        $('.focus', container).removeClass('focus error');
                    }

                    if (el.hasClass('add')) {
                        if ($('.required', el)[0]) {
                            container.data('add', 'uncheck');
                        }
                        addText.addClass('focus').focus();
                    }


                    if (mainContainer.attr('check-type') == 1) {
                        container.data('cur-check-type', true);
                        var containerIndex = container.index() - 1;
                        var elIndex = el.index() - 1;
                        if (checkAction == 0) {
                            var checkType = mainContainer.data('check-type');
                            if (!checkType) {
                                mainContainer.data('check-type', []);
                            }
                            var checkArr = mainContainer.data('check-type');
                            checkArr.length = containerLen;
                            checkArr[containerIndex] = elIndex;
                            mainContainer.data('check-type', checkArr);
                            mainContainer.attr('check-type-1-value', checkArr);
                        } else if (checkAction == 1) {
                            $('tr', mainContainer).filter(function (i) {
                                return i != 0 && !$(this).hasClass('hover');
                            }).each(function () {
                                $('.opt', this).eq(elIndex).data('disabled', true);
                                $('.input', this).eq(elIndex)[0].disabled = true;
                            });
                        } else if (checkAction == 2) {
                            var tr = $(this).parent();
                            tr.nextAll().each(function () {
                                $('.opt', this).eq(elIndex).data('disabled', true);
                                $('.input', this).eq(elIndex)[0].disabled = true;
                            });
                            el.nextAll().each(function () {
                                $(this).data('disabled', true);
                                $('.input', this)[0].disabled = true;
                            });
                        }
                    }

                }

            });

        });

    });
    //同选项单选题，题目在左侧


    //同选项复选题，题目在左侧
    $('.theme-list.h-checkbox').each(function () {
        var mainContainer = $(this);
        splitTitle(this);

        $('.lists .opt', this).each(function (i, n) {

            var el = $(n);
            var tr = el.parent();
            var checkbox = $('input:checkbox', el);
            var addText = $('.add-text', el);

            checkbox.click(function () {
                el.trigger('click');
            });

            el.bind({
                'mouseenter': function () {
                    tr.addClass('hover');
                },
                'mouseleave': function () {
                    tr.removeClass('hover');
                },
                'click': function () {
                    //server
                    if (themeServer) {
                        var radioId = $('#hdSeleteId' + $(this).attr('data-currno'));
                        var thisoptionid = $(this).attr('data-opid') + "#" + $(this).attr('data-scoreno');
                        var voptionid = thisoptionid + ",";
                        var haveoption = radioId.val();
                    }

                    var container = $(this).parent();

                    if (themesVerifyObj.hasSubmited)
                        themesVerifyObj.reCheckSubmit(mainContainer);

                    if (tr.hasClass('errorlist')) {
                        tr.removeClass('errorlist');
                    }

                    //如果此项包含radio
                    if (el.hasClass('hasradio')) {

                        if (themeServer) {
                            radioId.val(thisoptionid);
                        }

                        $('.opt', tr).filter(function () {
                            if ($('.input', this).is(':radio')) $(this).removeClass('cur');
                            return $('.input', this).is(':checkbox') && $('.input', this)[0].checked;
                        }).trigger('click');

                        el.addClass('cur');
                        $('.input', el)[0].checked = true;

                    } else {

                        if (checkbox[0].checked) {
                            //server
                            if (themeServer) {
                                haveoption = haveoption.replace(voptionid, "");
                                radioId.val(haveoption);
                            }

                            checkbox[0].checked = false;
                            el.removeClass('cur');

                            if (el.hasClass('add')) {
                                if ($('.required', el)[0]) {
                                    addText.removeClass('focus error');
                                    if ($('.required.focus', container).length == 0) {
                                        container.data('add', 'checked');
                                    }
                                }
                            }

                        } else {
                            //server
                            if (themeServer) {
                                haveoption = haveoption + voptionid;
                                radioId.val(haveoption);
                            }
                            checkbox[0].checked = true;
                            el.addClass('cur');

                            if (el.hasClass('add')) {
                                if ($('.required', el)[0]) {
                                    container.data('add', 'uncheck');
                                }
                                addText.addClass('focus').focus();
                            }
                        }
                        $('.hasradio', tr).filter(function () {
                            var el = $(this);
                            if ($('.input', el)[0].checked) {
                                $('.input', el)[0].checked = false;
                                return el;
                            }
                        }).removeClass('cur');
                    }
                }
            });
        });
    });
    //同选项复选题，题目在左侧

    //同选项单选题，题目在顶部
    $('.theme-list.v-radio').each(function () {

        var container = $(this);
        var listLen = $('tr', container).length - 1;
        var table = $('.lists:not(.hide)', this);

        $('.opt', table).each(function (i, n) {

            var el = $(n);
            var index = $('table', table).index(el.parents('table'));

            var addText = $('.add-text', el);
            var th = $('table', table).eq(index).find('td:first');
            var td = $('.input[name=' + $('.input', el).attr('name') + ']', container).parent();

            el.bind({
                'mouseenter': function () {
                    th.addClass('hover');
                    td.addClass('hover');
                },
                'mouseleave': function () {
                    th.removeClass('hover');
                    td.removeClass('hover');
                },
                'click': function () {

                    if (themesVerifyObj.hasSubmited)
                        themesVerifyObj.reCheckSubmit(container);
                    //server
                    if (themeServer) {
                        var radioId = $('#RptSubjectSimple_ctl' + $(this).attr('data-currno') + '_rptOptionSubjectTop_ctl' + $(this).attr('data-checkcurrno') + '_hdSeleteId');
                        radioId.val($(this).attr('data-opid'));
                    }


                    td.removeClass('cur');
                    $('.input', el)[0].checked = true;
                    el.addClass('cur');

                    if (th.hasClass('errorlist')) {
                        th.removeClass('errorlist');
                        td.removeClass('errorlist');
                    }

                    if (td.data('add') == 'uncheck') {
                        td.data('add', 'checked');
                        $('.focus', td).removeClass('focus error');
                    }

                    if (el.hasClass('add')) {
                        if ($('.required', el)[0]) {
                            td.data('add', 'uncheck');
                        }
                        addText.addClass('focus').focus();

                    }

                }

            });

        });

    });
    //同选项单选题，题目在顶部


    //同选项复选题，题目在顶部
    $('.theme-list.v-checkbox').each(function () {

        var container = $(this);
        var table = $('.lists:not(.hide)', this);

        $('.opt', table).each(function (i, n) {

            var el = $(n);
            var name = $('.input', el).attr('name');
            var index = $('table', table).index(el.parents('table'));
            var inputs = $('.input[name=' + name + ']', container);
            var th = $('table', table).eq(index).find('td:first');
            var td = inputs.parent();
            var addText = $('.add-text', el);

            var checkbox = $('.input:checkbox', el);

            checkbox.click(function () {
                el.trigger('click');
            });

            el.bind({
                'mouseenter': function () {
                    td.addClass('hover');
                    th.addClass('hover');
                },
                'mouseleave': function () {
                    td.removeClass('hover');
                    th.removeClass('hover');
                },
                'click': function () {

                    if (themesVerifyObj.hasSubmited)
                        themesVerifyObj.reCheckSubmit(container);

                    if (th.hasClass('errorlist')) {
                        th.removeClass('errorlist');
                        td.removeClass('errorlist');
                    }
                    //server
                    if (themeServer) {
                        var radioId = $('#RptSubjectSimple_ctl' + $(this).attr('data-currno') + '_rptOptionSubjectTop_ctl' + $(this).attr('data-checkcurrno') + '_hdSeleteId');
                        var thisoptionid = $(this).attr('data-opid');
                        var voptionid = thisoptionid + ",";
                        var haveoption = radioId.val();
                    }

                    if (el.hasClass('hasradio')) {

                        if (themeServer) {
                            radioId.val(thisoptionid);
                        }

                        inputs.filter(function () {
                            var input = $(this);
                            if (input.is(':radio')) input.parent().removeClass('cur');
                            return input.is(':checkbox') && this.checked;
                        }).parent().trigger('click');

                        el.addClass('cur');
                        $(':radio', el)[0].checked = true;

                    } else {
                        //server
                        if (themeServer) {
                            haveoption = haveoption.replace(voptionid, "");
                            radioId.val(haveoption);
                        }

                        if (checkbox[0].checked) {
                            checkbox[0].checked = false;
                            el.removeClass('cur');

                            if (el.hasClass('add')) {
                                if ($('.required', el)[0]) {
                                    addText.removeClass('focus error');
                                    if ($('.required.focus', td).length == 0) {
                                        td.data('add', 'checked');
                                    }
                                }
                            }

                        } else {
                            //server
                            if (themeServer) {
                                haveoption = haveoption + voptionid;
                                radioId.val(haveoption);
                            }

                            checkbox[0].checked = true;
                            el.addClass('cur');


                            if (el.hasClass('add')) {
                                if ($('.required', el)[0]) {
                                    td.data('add', 'uncheck');
                                }
                                addText.addClass('focus').focus();

                            }


                        }

                        inputs.filter(function () {
                            var radio = $(this).is(':radio');
                            if (radio) this.checked = false;
                            return radio;
                        }).parent().removeClass('cur');

                    }

                }

            });

        });

    });
    //同选项复选题，题目在顶部


    //同选项文本题，题目在左侧
    $('.theme-list.h-text').each(function () {

        var container = $(this);
        var mainContainer = $(this);
        var containerLen = $('tr', mainContainer).length - 1;

        if (themeServer) {
            $('tr:not(.list-title,.sum)', container).each(function (i, n) {
                var val = $('#RptSubjectSimple_ctl' + $('td:eq(1)', n).attr('data-currno') + '_rptOptionSubjectLeft_ctl' + $('td:eq(1)', n).attr('data-checkcurrno') + '_hdSeleteId');
                $('.input', n).change(function () {
                    val.val('');
                    $('.input', n).each(function (i1, n1) {
                        val[0].value += n1.value + ',';
                    });
                });
            });

        }

        $('.lists .opt', this).each(function (i, n) {
            var el = $(n);
            el.bind({
                'mouseenter': function () {
                    el.parent().addClass('hover');
                },
                'mouseleave': function () {
                    el.parent().removeClass('hover');
                }
            });
        });

        if (container.attr('themerequired')) {
            $(':text.input', container).each(function (i, n) {
                $(n).bind({
                    focus: function () {
                        if ($(n).parent().hasClass('errorlist')) {
                            $('.errorlist', $(n).parents('tr')).removeClass('errorlist');
                        }
                    }
                });
            });
        }

        if (container.attr('sum')) {
            $(':text.input', container).each(function (i, n) {
                $(n).bind({
                    focus: function () {
                        if (themesVerifyObj.hasSubmited)
                            themesVerifyObj.reCheckSubmit(container);
                        $('.errorlist', container).removeClass('errorlist');
                    },
                    blur: function () {
                        var val = 0;
                        $(':input[name=' + $(n).attr('name') + ']', container).each(function () {
                            val += this.value == '' ? 0 : parseInt(this.value);
                        });
                        if (!/^(-|\+)?\d+$/.test(val)) {
                            val = '--';
                        }
                        var count = $('span[name=' + $(n).attr('name') + '] em', container);
                        count.text(val);
                        if (val == container.attr('sum')) {
                            count.data('sum', true);
                            count.parent().addClass('correct');
                        } else {
                            count.data('sum', false);
                            count.parent().removeClass('correct');
                        }
                    }
                });
            });
        }

    });
    //同选项文本题，题目在左侧


    //同选项文本题，题目在顶部
    $('.theme-list.v-text').each(function () {
        /*
        var container = $(this);
        var listLen = $('tr',container).length-1;  
        
        $('.lists .opt',this).each(function(i,n) {
          var el = $(n);
          var index =  $('td',el.parent()).index(el);
          var th = $('tr td',container).eq(index);
          var td =  $('.input[name='+ $('.input',el).attr('name') +']',container).parent();
          
          el.bind({
            'mouseenter':function() { 
               th.addClass('hover');
               td.addClass('hover');
            },
            'mouseleave':function() {
               th.removeClass('hover');
               td.removeClass('hover');
            }
          });
        });
        
        if(container.attr('sum')) {
          $(':text.input',container).each(function(i,n) {
             $(this).bind({
                focus:function() {
                  if(themesVerifyObj.hasSubmited)
                    themesVerifyObj.reCheckSubmit(container);  
                  
                   if($(n).parent().hasClass('errorlist')) { 
                      $(':input[name='+n.name+']').parent().removeClass('errorlist');
                   }
                },
                blur:function() {
                  var val = 0;
                  $(':input[name=' + $(n).attr('name') + ']',container).each(function() {
                    val += this.value=='' ? 0 : parseInt(this.value);	
                  });
                  if(!/^(-|\+)?\d+$/.test(val)) {
                    val = '--';
                  }
                  var count = $('span[name=' + $(n).attr('name') + '] em',container);
                  count.text(val);
                  if(val== container.attr('sum')) {
                     count.data('sum',true);
                  }else {
                     count.data('sum',false);	
                  }
                }
             });
          });
        }
        */
    });
    //同选项文本题，题目在顶部

    //单项开放题-单行
    $('.theme-list.text').each(function (i, n) {

        var container = $(this);

        $('.input', this).bind({
            'focus': function () {
                if (themesVerifyObj.hasSubmited) {
                    if (!$(this).data('hasChecked')) {
                        $(this).removeClass('error');
                        $(this).siblings('.msg').text('');
                    }
                    themesVerifyObj.reCheckSubmit(container);
                }
                $(this).addClass('focus');
                $(this).siblings('.msg').text('');
            },
            'blur': function () {
                $(this).removeClass('focus');
                var sum = $('.sum', n);
                var sumVal = $(n).attr('sum');
                if (sumVal) {
                    var val = 0;
                    $('.input', n).each(function () {
                        val += parseInt(this.value == '' ? 0 : this.value);
                    });
                    if (/^(-|\+)?\d+$/.test(val)) {
                        sum.text(val);
                        if (val == sumVal) {
                            sum.addClass('correct');
                        } else {
                            sum.removeClass('correct');
                        }
                    } else {
                        sum.text('--');
                    }
                }

            }

        });

    });


    //下拉列表选择
    if ($('.theme-list.select')[0]) {
        In('select', function () {
            createThemeSelect();
        });
    }

    //排序题
    if ($('.theme-list.sorttable')[0]) {
        In('sorttable', function () {
            createThemeSortTable();
        });
    }

    /*--按钮提交验证--start--*/
    btnSave.click(function (e) {
        themesVerifyObj.hasSubmited = true;
        var checked = true;
        var required = true;
        themeList.each(function () {

            var container = $(this);
            container.data('hasChecked', false);

            /*--单选复选验证--start--*/
            if (container.data('mode') == 'radio' || container.data('mode') == 'checkbox') {

                var checkedChild = true;
                //输入框验证
                checkedChild = checkReqiuredInput(container, checkedChild);

                var inputs = $('.input', container);

                /*是否必填*/
                var themerequired = container.attr('themerequired') != 'true' ? false : true;
                var _required = true;
                if (themerequired && !$('.input:checked', container)[0]) {
                    required = required && false;
                    _required = false;
                }
                /*是否必填*/

                inputs.each(function (i, n) {

                    if (_required && container.data('add') != 'uncheck' && !container.data('maxcount') && !container.data('mincount')) {
                        container.data('hasChecked', true);
                        themesVerifyObj.checkInputSurvey(container, true);
                        return false;

                    } else {

                        if (container.data('add') == 'uncheck') {
                            $('.focus.required', container).filter(function () {
                                return $(this).val() == '' || $(this).val() == requiredText;
                            }).val(requiredText).addClass('error');
                            themesVerifyObj.checkInputSurvey(container, false, 'add');
                            return false;
                        }

                        if (themerequired && i == inputs.length - 1 && !container.data('hasChecked')) {
                            themesVerifyObj.checkInputSurvey(container, false, container.data('mode'));
                            return false;
                        }

                    }

                });

                if (container.data('mode') == 'checkbox') {
                    if (container.data('maxcount')) {
                        themesVerifyObj.checkInputSurvey(container, false, 'checkmax', container.attr('maxcount'));
                        checkedChild = false;
                    }
                    if (container.data('mincount')) {
                        themesVerifyObj.checkInputSurvey(container, false, 'checkmin', container.attr('mincount'));
                        checkedChild = false;
                    }
                    if (container.data('mustcount')) {
                        themesVerifyObj.checkInputSurvey(container, false, 'checkmust', container.attr('mustcount'));
                        checkedChild = false;
                    }
                }

                checked = checked && checkedChild && container.data('hasChecked');

                // .h-radio .h-checkbox
            } else if (container.data('mode') == 'h-radio' || container.data('mode') == 'h-checkbox') {
                var checkedChild = true;
                var table = $('.lists:not(.hide)', container);
                var themerequired = container.attr('themerequired') != 'true' ? false : true;

                $('tr:not(.list-title,.sum)', table).each(function () {

                    var containerChild = $(this);
                    containerChild.data('hasChecked', false);

                    checkChild = checkReqiuredInput(containerChild, checkedChild);

                    /*是否必填*/
                    var _required = true;
                    if (themerequired && !$('.input:checked', containerChild)[0]) {
                        required = required && false;
                        _required = false;
                    }
                    /*是否必填*/

                    var inputs = $('.input', this);
                    inputs.each(function (i, n) {

                        if (_required && containerChild.data('add') != 'uncheck') {
                            containerChild.data('hasChecked', true);
                            return false;
                        } else {

                            if (containerChild.data('add') == 'uncheck') {
                                $('.focus.required', containerChild).filter(function () {
                                    return $(this).val() == '' || $(this).val() == requiredText;
                                }).val(requiredText).addClass('error');
                                themesVerifyObj.checkInputSurvey(container, false, 'add');
                                containerChild.addClass('errorlist');
                                return false;
                            }

                            if (themerequired && i == inputs.length - 1 && !containerChild.data('hasChecked ')) {
                                themesVerifyObj.checkInputSurvey(container, false, container.data('mode'));
                                containerChild.addClass('errorlist');
                                return false;
                            }
                        }

                    });

                    checkedChild = checkedChild && containerChild.data('hasChecked');

                });



                if (checkedChild)
                    themesVerifyObj.checkInputSurvey(container, true);

                checked = checked && checkedChild;


                // .v-radio .v-checkbox		
            } else if (container.data('mode') == 'v-radio' || container.data('mode') == 'v-checkbox') {

                var checkedChild = true;
                var table = $('.lists:not(.hide)', container);
                var themerequired = container.attr('themerequired') != 'true' ? false : true;

                $('tr:eq(1) .opt', table).each(function (i, n) {

                    var containerChild = $('.input[name=' + $('.input', n).attr('name') + ']', container).parent();
                    containerChild.data('hasChecked', false);

                    checkChild = checkReqiuredInput(containerChild, checkedChild);

                    /*是否必填*/
                    var _required = true;
                    if (themerequired && !$('.input:checked', containerChild)[0]) {
                        required = required && false;
                        _required = false;
                    }
                    /*是否必填*/

                    var inputs = $('.input[name=' + $('.input', n).attr('name') + ']');

                    inputs.each(function (i1, n1) {

                        if (_required && containerChild.data('add') != 'uncheck') {
                            containerChild.data('hasChecked', true);
                            return false;
                        } else {

                            if (containerChild.data('add') == 'uncheck') {
                                $('.focus.required', containerChild).filter(function () {
                                    return $(this).val() == '' || $(this).val() == requiredText;
                                }).val(requiredText).addClass('error');
                                themesVerifyObj.checkInputSurvey(container, false, 'add');
                                containerChild.addClass('errorlist');
                                $('.lists tr:eq(0) td', container).eq($(n).index()).addClass('errorlist');
                                return false;
                            }

                            if (themerequired && i1 == inputs.length - 1 && !containerChild.data('hasChecked')) {
                                themesVerifyObj.checkInputSurvey(container, false, container.data('mode'));
                                containerChild.addClass('errorlist');
                                $('.lists tr:eq(0) td', container).eq($(n).index()).addClass('errorlist');
                                return false;
                            }
                        }

                    });

                    checkedChild = checkedChild && containerChild.data('hasChecked');

                });


                if (checkedChild)
                    themesVerifyObj.checkInputSurvey(container, true);

                checked = checked && checkedChild;


            //h-text
            } else if (container.data('mode') == 'h-text') {

                var checkedChild = true;

                var themerequired = container.attr('themerequired') != 'true' ? false : true;

                $('.lists tr:not(.list-title,.sum)', container).each(function () {

                    var containerChild = $(this);

                    /*是否必填*/
                    var _required = true;
                    if (themerequired && $('.input[value=]', containerChild)[0]) {
                        required = required && false;

                        themesVerifyObj.checkInputSurvey(container, false, container.data('mode'));
                        $('.opt', containerChild).addClass('errorlist');
                        checkedChild = false;

                    }
                    /*是否必填*/

                });



                var sum = container.attr('sum');
                var sumChecked = true;
                if (sum && checkedChild) {
                    $('tr:eq(1) .opt', container).each(function (i, n) {
                        var input = $('.input', n);
                        var inputs = $(':text[name=' + input.attr('name') + ']', container);
                        var count = $('span[name=' + input.attr('name') + ']', container);
                        var val = 0;
                        inputs.each(function (i1, n1) {
                            var _val = n1.value == '' ? 0 : n1.value;
                            val += parseInt(_val);
                        });
                        if (val == sum) {

                        } else {
                            sumChecked = sumChecked && false;
                            themesVerifyObj.checkInputSurvey(container, false, 'sum');
                            $('.opt :text[name=' + $(':text', n).attr('name') + ']', container).parent().addClass('errorlist');

                        }
                    });
                }

                checkedChild = checkedChild && sumChecked;

                if (checkedChild)
                    themesVerifyObj.checkInputSurvey(container, true);

                checked = checked && checkedChild;


                //v-text
            } else if (container.data('mode') == 'v-text') {

                // .text
            } else if (container.data('mode') == 'text') {

                var checkedChild = true;

                var inputs = $('.input', container);

                var mustCount = container.attr('mustcount');
                var mustCountAdd = 0;
                var minCount = container.attr('mincount');
                var minCountAdd = 0;
                var sum = container.attr('sum');

                var themerequired = container.attr('themerequired') != 'true' ? false : true;
                var _required = true;

                inputs.each(function (i, n) {

                    var containerChild = $(this);
                    containerChild.data('hasChecked', false);

                    /*****  验证内容 *******/
                    themesVerifyObj.checkInputText(containerChild);

                    if (containerChild.data('hasChecked') == false) {
                        themesVerifyObj.checkInputSurvey(container, false, 'text');
                    }

                    if (themerequired && $.trim(n.value) == '' && !minCount) {
                        required = required && false;
                        _required = false;
                    }

                    if (minCount && containerChild.val() != '') {
                        minCountAdd++;
                    }

                    if (mustCount && containerChild.val() != '') {
                        mustCountAdd++;
                    }

                    if (sum) {
                        if (i == 0) {
                            container.data('sum', 0);
                        }
                        container.data('sum', parseInt(container.data('sum')) + parseInt(n.value));
                    }

                    checkedChild = checkedChild && containerChild.data('hasChecked');
                });


                if (sum) {
                    if (sum != container.data('sum')) {
                        themesVerifyObj.checkInputSurvey(container, false, 'textsum', sum);
                        checkedChild = false;
                    }
                }

                if (minCount && minCountAdd < minCount) {
                    themesVerifyObj.checkInputSurvey(container, false, 'textmincount', minCount);
                    checkedChild = false;
                }

                if (mustCount && mustCountAdd != mustCount) {
                    themesVerifyObj.checkInputSurvey(container, false, 'textmustcount', mustCount);
                    checkedChild = false;
                }

                if (themerequired && !_required) {
                    themesVerifyObj.checkInputSurvey(container, false, container.data('mode'));
                    checkedChild = false;
                }

                if (checkedChild) {
                    themesVerifyObj.checkInputSurvey(container, true);
                }

                checked = checked && checkedChild;

                // .select
            } else if (container.data('mode').indexOf('select-') != -1) {
                checked = checkThemeSelect(container);
            } else if (container.data('mode') == 'sorttable') {
                checked = checkThemeSortTable(container);
            }

        });

        if (checked && required) {
            btnSave.addClass('disabled');
            setTimeout(function () {
                $(e.target).unbind();
                if (themeLoading) {
                    $('body').showLoading({ type: 2, text: themeLanguageObj['loadingText'] + '...' });
                }
            }, 1000);
            return true;
        } else {
            return false;
        }

    });
    /*--按钮提交验证--end--*/

    /*--验证函数-start--*/
    themesVerifyObj = {

        hasSubmited: function () { return false; },

        //重设 .theme-list
        reCheckSubmit: function (container) {
            container.removeClass('verify unverify');
            $('.info-check', container).hide().removeClass('checked unchecked');
        },

        // 验证提示
        checkInput: function (container, checked, type, data) {

            var infoCheck = $('.info-check', container);

            infoCheck.hide().removeClass('checked unchecked');

            if (checked) {
                container.removeClass('unverify').addClass('verify');
                infoCheck.show().addClass('checked').text('');
            } else {
                container.removeClass('verify').addClass('unverify');
                infoCheck.show().addClass('unchecked').html(themesVerifyObj.checkErrorTextInfo(type, data));
            }

        },

        // 出题引擎验证提示
        checkInputSurvey: function (container, checked, type, data) {

            var infoCheck = $('.info-check', container);

            infoCheck.hide().removeClass('checked unchecked');

            if (checked) {
                container.removeClass('unverify').addClass('verify');
                infoCheck.show().addClass('checked').text('');
            } else {
                container.removeClass('verify').addClass('unverify');
                infoCheck.show().addClass('unchecked').html(themesVerifyObj.checkErrorTextInfoSurvey(type, data, container.attr('errinfo-' + type)));
            }

        },

        //验证出题引擎错误文字
        checkErrorTextInfoSurvey: function (type, data, text) {

            switch (type) {
                case 'radio':
                    return text ? text : themeLanguageObj['radio'];
                    break;

                case 'checkbox':
                    return text ? text : themeLanguageObj['checkbox'];
                    break;

                case 'h-radio':
                    return text ? text : themeLanguageObj['h-radio'];
                    break;

                case 'h-checkbox':
                    return text ? text : themeLanguageObj['h-checkbox'];
                    break;

                case 'v-radio':
                    return text ? text : themeLanguageObj['v-radio'];
                    break;

                case 'v-checkbox':
                    return text ? text : themeLanguageObj['v-checkbox'];
                    break;

                case 'text':
                    return text ? text : themeLanguageObj['text'];
                    break;

                case 'h-text':
                    return text ? text : themeLanguageObj['h-text'];
                    break;

                case 'select':
                    return text ? text : themeLanguageObj['select'];
                    break;

                case 'sort':
                    return text ? text : themeLanguageObj['sort'];
                    break;

                case 'add':
                    return text ? text : themeLanguageObj['add'];
                    break;

                case 'checkmax':
                    return themeLanguageObj['checkmax1'] + data + themeLanguageObj['checkmax2'];
                    break;

                case 'checkmin':
                    return themeLanguageObj['checkmin1'] + data + themeLanguageObj['checkmin2'];
                    break;

                case 'checkmust':
                    return themeLanguageObj['checkmust1'] + data + themeLanguageObj['checkmust2'];
                    break;

                case 'textmincount':
                    return themeLanguageObj['textmincount1'] + data + themeLanguageObj['textmincount2'];
                    break;

                case 'textmustcount':
                    return themeLanguageObj['textmustcount1'] + data + themeLanguageObj['textmustcount2'];
                    break;

                case 'textsum':
                    return themeLanguageObj['textsum'] + data;
                    break;

                default:
                    return text;
            }
        },

        //验证错误文字
        checkErrorTextInfo: function (type, data) {

            switch (type) {
                case 'radio':
                    return themeLanguageObj['radio'];
                    break;

                case 'checkbox':
                    return themeLanguageObj['checkbox'];
                    break;

                case 'h-radio':
                    return themeLanguageObj['h-radio'];
                    break;

                case 'h-checkbox':
                    return themeLanguageObj['h-checkbox'];
                    break;

                case 'v-radio':
                    return themeLanguageObj['v-radio'];
                    break;

                case 'v-checkbox':
                    return themeLanguageObj['v-checkbox'];
                    break;

                case 'text':
                    return themeLanguageObj['text'];
                    break;

                case 'h-text':
                    return themeLanguageObj['h-text'];
                    break;

                case 'select':
                    return themeLanguageObj['select'];
                    break;

                case 'sort':
                    return themeLanguageObj['sort'];
                    break;

                case 'add':
                    return themeLanguageObj['add'];
                    break;

                case 'checkmax':
                    return themeLanguageObj['checkmax1'] + data + themeLanguageObj['checkmax2'];
                    break;

                case 'checkmin':
                    return themeLanguageObj['checkmin1'] + data + themeLanguageObj['checkmin2'];
                    break;

                case 'checkmust':
                    return themeLanguageObj['checkmust1'] + data + themeLanguageObj['checkmust2'];
                    break;

                case 'textmincount':
                    return themeLanguageObj['textmincount1'] + data + themeLanguageObj['textmincount2'];
                    break;

                case 'textmustcount':
                    return themeLanguageObj['textmustcount1'] + data + themeLanguageObj['textmustcount2'];
                    break;

                case 'textsum':
                    return themeLanguageObj['textsum'] + data;
                    break;

                default:
                    return themeLanguageObj['default'];
            }
        },
        checkInputText: function (input) {
            input.checkValue({
                match: function () {
                    input.data('hasChecked', true);
                },
                unMatch: function (errText) {
                    input.addClass('error').siblings('.msg').text(errText);
                }
            });
        }
    }
    /*--验证函数--end--*/


    /*--检查必填输入框--start--*/
    /*--题目中的所有的选中项的必填文本输入检查--*/
    function checkReqiuredInput(container, check) {

        var checked = check;
        var inputs = $('.add-text.required.focus', container);
        var len = inputs.length;

        inputs.each(function (i, n) {
            if ($(this).val() == '' || $(this).val() == requiredText) {
                checked = false;
            }
            if (i == len - 1 && checked == true) {
                container.data('add', 'checked');
            } else {
                container.data('add', 'uncheck');
            }
        });
        return checked;
    }
    /*--检查必填输入框--end--*/

    /*--矩阵题超过10行时显示自动插入表头--start--*/
    function splitTitle(table) {
        var trTitle = $('tr', table).eq(0);
        var trLen = $('tr', table).length - 1;
        var trSpace = trLen / Math.ceil(trLen / 10);
        if (trLen > 10) {
            for (var i = 1; i < trLen / trSpace; i++) {
                var pos = i == 1 ? 0 : i - 1;
                $('tr', table).eq(i * trSpace + pos).after(trTitle.clone());
            }
        }
    }
    /*--矩阵题超过10行时显示自动插入表头--end--*/

});

function loadScripts() {
    if ($('.theme-list.text')[0]) { In('check'); }
    if ($('.theme-list.select')[0]) { In('select'); }
    if ($('.theme-list.sorttable')[0]) { In('sorttable'); }
    if ($('.theme-list.slider')[0]) { In('slider'); }
    var inputDate = $('input[texttype=date]');
    if (inputDate[0]) { In('jquery-ui', function () { setDatePickerInit(); inputDate.datepicker({ dateFormat: 'yy-mm-dd' }); }); }
}
