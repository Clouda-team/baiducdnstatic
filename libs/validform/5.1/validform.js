/*
    通用表单验证方法
    Validform version 5.1
	By sean during April 7, 2010 - July 31, 2012
	For more information, please visit http://validform.rjboy.cn
	Validform is available under the terms of the MIT license.
	
	Demo:
	$(".demoform").Validform({//$(".demoform")指明是哪一表单需要验证,名称需加在form表单上;
		btnSubmit:"#btn_sub", //#btn_sub是该表单下要绑定点击提交表单事件的按钮;如果form内含有submit按钮该参数可省略;
		btnReset:".btn_reset",//可选项 .btn_reset是该表单下要绑定点击重置表单事件的按钮;
		tiptype:1, //可选项 1=>pop box,2=>side tip，默认为1，也可以传入一个function函数，自定义提示信息的显示方式（可以实现你想要的任何效果，具体参见demo页）;
		ignoreHidden:false,//可选项 true | false 默认为false，当为true时对:hidden的表单元素将不做验证;
		dragonfly:false,//可选项 true | false 默认false，当为true时，值为空时不做验证；
		tipSweep:true,//可选项 true | false 默认为false，当true时提示信息将只会在表单提交时触发显示，各表单元素blur时不会被触发显示;
		showAllError:false,//可选项 true | false，true：提交表单时所有错误提示信息都会显示，false：一碰到验证不通过的就停止检测后面的元素，只显示该元素的错误信息;
		postonce:true, //可选项 是否开启网速慢时的二次提交防御，true开启，不填则默认关闭;
		ajaxPost:true, //使用ajax方式提交表单数据，默认false，提交地址就是action指定地址;
		datatype:{//传入自定义datatype类型，可以是正则，也可以是函数（函数内会传入一个参数）;
			"*6-20": /^[^\s]{6,20}$/,
			"z2-4" : /^[\u4E00-\u9FA5\uf900-\ufa2d]{2,4}$/,
			"username":function(gets,obj,curform,regxp){
				//参数gets是获取到的表单元素值，obj为当前表单元素，curform为当前验证的表单，regxp为内置的一些正则表达式的引用;
				var reg1=/^[\w\.]{4,16}$/,
					reg2=/^[\u4E00-\u9FA5\uf900-\ufa2d]{2,8}$/;
				
				if(reg1.test(gets)){return true;}
				if(reg2.test(gets)){return true;}
				return false;
				
				//注意return可以返回true 或 false 或 字符串文字，true表示验证通过，返回字符串表示验证失败，字符串作为错误提示显示，返回false则用errmsg或默认的错误提示;
			},
			"phone":function(){
				// 5.0 版本之后，要实现二选一的验证效果，datatype 的名称 不 需要以 "option_" 开头;	
			}
		},
		usePlugin:{
			swfupload:{},
			datepicker:{},
			passwordstrength:{},
			jqtransform:{
				selector:"select,input"
			}
		},
		beforeCheck:function(curform){
			//在表单提交执行验证之前执行的函数，curform参数是当前表单对象。
			//这里明确return false的话将不会继续执行验证操作;	
		},
		beforeSubmit:function(curform){
			//在验证成功后，表单提交前执行的函数，curform参数是当前表单对象。
			//这里明确return false的话表单将不会提交;	
		},
		callback:function(data){
			//返回数据data是json格式，{"info":"demo info","status":"y"}
			//info: 输出提示信息;
			//status: 返回提交数据的状态,是否提交成功。如可以用"y"表示提交成功，"n"表示提交失败，在ajax_post.php文件返回数据里自定字符，主要用在callback函数里根据该值执行相应的回调操作;
			//你也可以在ajax_post.php文件返回更多信息在这里获取，进行相应操作；
			
			//这里执行回调操作;
			//注意：如果不是ajax方式提交表单，传入callback，这时data参数是当前表单对象，回调函数会在表单验证全部通过后执行，然后判断是否提交表单，如果callback里明确return false，则表单不会提交，如果return true或没有return，则会提交表单。
		}
	});
	
	Validform对象的方法和属性：
	tipmsg：自定义提示信息，通过修改Validform对象的这个属性值来让同一个页面的不同表单使用不同的提示文字；
	dataType：获取内置的一些正则；
	eq(n)：获取Validform对象的第n个元素;
	ajaxPost(flag,sync)：以ajax方式提交表单。flag为true时，跳过验证直接提交，sync为true时将以同步的方式进行ajax提交；
	abort()：终止ajax的提交；
	submitForm(flag)：以参数里设置的方式提交表单，flag为true时，跳过验证直接提交；
	resetForm()：重置表单；
	resetStatus()：重置表单的提交状态。传入了postonce参数的话，表单成功提交后状态会设置为"posted"，重置提交状态可以让表单继续可以提交；
	getStatus()：获取表单的提交状态，normal：未提交，posting：正在提交，posted：已成功提交过；
	setStatus(status)：设置表单的提交状态，可以设置normal，posting，posted三种状态，不传参则设置状态为posting，这个状态表单可以验证，但不能提交；
	ignore(selector)：忽略对所选择对象的验证；
	unignore(selector)：将ignore方法所忽略验证的对象重新获取验证效果；
	addRule(rule)：可以通过Validform对象的这个方法来给表单元素绑定验证规则；
*/

(function($,win,undef){
	var errorobj=null,//指示当前验证失败的表单元素;
		msgobj=null,//pop box object 
		msghidden=true; //msgbox hidden?

	var tipmsg={//默认提示文字;
		tit:"提示信息",
		w:"请输入正确信息！",
		r:"通过信息验证！",
		c:"正在检测信息…",
		s:"请填入信息！",
		v:"所填信息没有经过验证，请稍后…",
		p:"正在提交数据…",
		err:"出错了！请检查提交地址或返回数据格式是否正确！",
		abort:"Ajax操作被取消！"
	}
	$.Tipmsg=tipmsg;
		
	var Validform=function(forms,settings,inited){
		var settings=$.extend({},Validform.defaults,settings);
		settings.datatype && $.extend(Validform.util.dataType,settings.datatype);
		
		var brothers=this;
		brothers.tipmsg={};
		brothers.settings=settings;
		brothers.forms=forms;
		brothers.objects=[];
		
		//创建子对象时不再绑定事件;
		if(inited===true){
			return false;	
		}
		
		forms.each(function(n){
			var $this=$(this);
			
			//防止表单按钮双击提交两次;
			this.status="normal"; //normal | posting | posted;
			
			//让每个Validform对象都能自定义tipmsg;	
			$this.data("tipmsg",brothers.tipmsg);

			//bind the blur event;
			$this.find("[datatype]").live("blur",function(){
				//判断是否是在提交表单操作时触发的验证请求；
				var subpost=arguments[1];
				var inputval=Validform.util.getValue.call($this,$(this));
				
				//绑定了dataIgnore属性的对象也忽略验证;
				//dragonfly=true时，值为空不做验证;
				if($(this).data("dataIgnore")==="dataIgnore" || settings.dragonfly && !$(this).data("cked") && Validform.util.isEmpty.call($(this),inputval) ){
					return false;
				}
				
				var flag=true,
					_this;
				errorobj=_this=$(this);

				flag=Validform.util.regcheck.call($this,$(this).attr("datatype"),inputval,$(this));
				if(!flag.passed){
					//取消正在进行的ajax验证;
					Validform.util.abort.call(_this[0]);
					_this.addClass("Validform_error");
					Validform.util.showmsg.call($this,flag.info,settings.tiptype,{obj:$(this),type:flag.type,sweep:settings.tipSweep},"hide"); //当tiptype=1的情况下，传入"hide"则让提示框不弹出,tiptype=2的情况下附加参数"hide"不起作用;
				}else{
					if($(this).attr("ajaxurl")){
						var inputobj=$(this);
						if(inputobj[0].valid==="posting"){return false;}
						
						inputobj[0].valid="posting";
						Validform.util.showmsg.call($this,brothers.tipmsg.c||tipmsg.c,settings.tiptype,{obj:inputobj,type:1,sweep:settings.tipSweep},"hide");
						
						Validform.util.abort.call(_this[0]);
						_this[0].ajax=$.ajax({
							type: "POST",
							cache:false,
							url: inputobj.attr("ajaxurl"),
							data: "param="+inputval+"&name="+$(this).attr("name"),
							dataType: "text",
							success: function(s){
								if($.trim(s)=="y"){
									inputobj[0].valid="true";
									Validform.util.showmsg.call($this,brothers.tipmsg.r||tipmsg.r,settings.tiptype,{obj:inputobj,type:2,sweep:settings.tipSweep},"hide");
									_this.removeClass("Validform_error");
									errorobj=null;
									if(subpost==="postform"){
										$this.trigger("submit");
									}
								}else{
									inputobj[0].valid=s;
									_this.addClass("Validform_error");
									Validform.util.showmsg.call($this,s,settings.tiptype,{obj:inputobj,type:3,sweep:settings.tipSweep});
								}
								_this[0].ajax=null;
							},
							error: function(){
								inputobj[0].valid=brothers.tipmsg.err || tipmsg.err;
								_this.addClass("Validform_error");
								_this[0].ajax=null;
								Validform.util.showmsg.call($this,brothers.tipmsg.err||tipmsg.err,settings.tiptype,{obj:inputobj,type:3,sweep:settings.tipSweep});	
							}
						});
					}else{
						Validform.util.showmsg.call($this,flag.info,settings.tiptype,{obj:$(this),type:flag.type,sweep:settings.tipSweep},"hide");
						_this.removeClass("Validform_error");
						errorobj=null;
					}
				}

			});
			
			//点击表单元素，默认文字消失效果;
			Validform.util.hasDefaultText.call($this);
			
			//表单元素值比较时的信息提示增强;
			Validform.util.recheckEnhance.call($this);
			
			//plugins here to start;
			if(settings.usePlugin){
				Validform.util.usePlugin.call($this,settings.usePlugin,settings.tiptype,settings.tipSweep,n);
			}
			
			//enhance info feedback for checkbox & radio;
			$this.find(":checkbox[datatype],:radio[datatype]").each(function(){
				var _this=$(this);
				var name=_this.attr("name");
				$this.find("[name='"+name+"']").filter(":checkbox,:radio").bind("click",function(){
					//避免多个事件绑定时的取值滞后问题;
					setTimeout(function(){
						_this.trigger("blur");
					},0);
				});
				
			});
			
			settings.btnSubmit && $this.find(settings.btnSubmit).bind("click",function(){
				var subflag=Validform.util.submitForm.call($this,settings);
				subflag === undef && (subflag=true);
				if(subflag===true){
					$this[0].submit();
				}
			});
						
			$this.submit(function(){
				var subflag=Validform.util.submitForm.call($this,settings);
				subflag === undef && (subflag=true);
				return subflag;
			});
			
			$this.find("[type='reset']").add($this.find(settings.btnReset)).bind("click",function(){
				Validform.util.resetForm.call($this);
			});
			
		});
		
		//预创建pop box;
		if( settings.tiptype==1 || (settings.tiptype==2 && settings.ajaxPost) ){		
			creatMsgbox();
		}
	}
	
	Validform.defaults={
		tiptype:1,
		tipSweep:false,
		showAllError:false,
		postonce:false,
		ajaxPost:false
	}
	
	Validform.util={
		dataType:{
			"match":/^(.+?)(\d+)-(\d+)$/,
			"*":/[\w\W]+/,
			"*6-16":/^[\w\W]{6,16}$/,
			"n":/^\d+$/,
			"n6-16":/^\d{6,16}$/,
			"s":/^[\u4E00-\u9FA5\uf900-\ufa2d\w\.\s]+$/,
			"s6-18":/^[\u4E00-\u9FA5\uf900-\ufa2d\w\.\s]{6,18}$/,
			"p":/^[0-9]{6}$/,
			"m":/^13[0-9]{9}$|15[0-9]{9}$|18[0-9]{9}$/,
			"e":/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
			"url":/^(\w+:\/\/)?\w+(\.\w+)+.*$/
		},
		
		toString:Object.prototype.toString,
		
		getValue:function(obj){
			var inputval,
				curform=this;
				
			if(obj.is(":radio")){
				inputval=curform.find(":radio[name='"+obj.attr("name")+"']:checked").val();
				inputval= inputval===undef ? "" : inputval;
			}else if(obj.is(":checkbox")){
				inputval=curform.find(":checkbox[name='"+obj.attr("name")+"']:checked").val();
				inputval= inputval===undef ? "" : inputval;
			}else{
				inputval=obj.val();
			}
			return $.trim(inputval);
		},
		
		isEmpty:function(val){
			return val==="" || val===$.trim(this.attr("tip"));
		},
		
		recheckEnhance:function(){
			var curform=this;
			curform.find("input[recheck]").each(function(){
				var _this=$(this);
				var recheckinput=curform.find("input[name='"+$(this).attr("recheck")+"']");
				recheckinput.bind("keyup",function(){
					if(recheckinput.val()==_this.val() && recheckinput.val() != ""){
						if(recheckinput.attr("tip")){
							if(recheckinput.attr("tip") == recheckinput.val()){return false;}
						}
						_this.trigger("blur");
					}
				}).bind("blur",function(){
					if(recheckinput.val()!=_this.val() && _this.val()!=""){
						if(_this.attr("tip")){
							if(_this.attr("tip") == _this.val()){return false;}	
						}
						_this.trigger("blur");
					}
				});
			});
		},
		
		hasDefaultText:function(){
			this.find("[tip]").each(function(){//tip是表单元素的默认提示信息,这是点击清空效果;
				var defaultvalue=$(this).attr("tip");
				var altercss=$(this).attr("altercss");
				$(this).focus(function(){
					if($(this).val()==defaultvalue){
						$(this).val('');
						if(altercss){$(this).removeClass(altercss);}
					}
				}).blur(function(){
					if($.trim($(this).val())===''){
						$(this).val(defaultvalue);
						if(altercss){$(this).addClass(altercss);}
					}
				});
			});
		},
		
		usePlugin:function(plugin,tiptype,tipSweep,n){
			/*
				plugin:settings.usePlugin;
				tiptype:settings.tiptype;
				tipSweep:settings.tipSweep;
				n:当前表单的索引;
			*/
			
			var curform=this;
			//swfupload;
			if(plugin.swfupload){
				var swfuploadinput=curform.find("input[plugin='swfupload']").val(""),
					custom={
						custom_settings:{
							form:curform,
							showmsg:function(msg,type){
								Validform.util.showmsg.call(curform,msg,tiptype,{obj:swfuploadinput,type:type,sweep:tipSweep});	
							}	
						}	
					};

				custom=$.extend(true,{},plugin.swfupload,custom);
				if(typeof(swfuploadhandler) != "undefined"){swfuploadhandler.init(custom,n);}
				
			}
			
			//datepicker;
			if(plugin.datepicker){
				if(plugin.datepicker.format){
					Date.format=plugin.datepicker.format; 
					delete plugin.datepicker.format;
				}
				if(plugin.datepicker.firstDayOfWeek){
					Date.firstDayOfWeek=plugin.datepicker.firstDayOfWeek; 
					delete plugin.datepicker.firstDayOfWeek;
				}
				
				var datepickerinput=curform.find("input[plugin='datepicker']");
				plugin.datepicker.callback && datepickerinput.bind("dateSelected",function(){
					var d=new Date( $.event._dpCache[this._dpId].getSelected()[0] ).asString(Date.format);
					plugin.datepicker.callback(d,this);
				});
				
				datepickerinput.datePicker(plugin.datepicker);
			}
			
			//passwordstrength;
			if(plugin.passwordstrength){
				plugin.passwordstrength.showmsg=function(obj,msg,type){
					Validform.util.showmsg.call(curform,msg,tiptype,{obj:obj,type:type,sweep:tipSweep},"hide");
				};
				curform.find("input[plugin*='passwordStrength']").passwordStrength(plugin.passwordstrength);
			}
			
			//jqtransform;
			if(plugin.jqtransform){
				var jqTransformHideSelect = function(oTarget){
					var ulVisible = $('.jqTransformSelectWrapper ul:visible');
					ulVisible.each(function(){
						var oSelect = $(this).parents(".jqTransformSelectWrapper:first").find("select").get(0);
						//do not hide if click on the label object associated to the select
						if( !(oTarget && oSelect.oLabel && oSelect.oLabel.get(0) == oTarget.get(0)) ){$(this).hide();}
					});
				};
				
				/* Check for an external click */
				var jqTransformCheckExternalClick = function(event) {
					if ($(event.target).parents('.jqTransformSelectWrapper').length === 0) { jqTransformHideSelect($(event.target)); }
				};
				
				var jqTransformAddDocumentListener = function (){
					$(document).mousedown(jqTransformCheckExternalClick);
				};
				
				if(plugin.jqtransform.selector){
					curform.find(plugin.jqtransform.selector).filter('input:submit, input:reset, input[type="button"]').jqTransInputButton();
					curform.find(plugin.jqtransform.selector).filter('input:text, input:password').jqTransInputText();			
					curform.find(plugin.jqtransform.selector).filter('input:checkbox').jqTransCheckBox();
					curform.find(plugin.jqtransform.selector).filter('input:radio').jqTransRadio();
					curform.find(plugin.jqtransform.selector).filter('textarea').jqTransTextarea();
					if(curform.find(plugin.jqtransform.selector).filter("select").length > 0 ){
						 curform.find(plugin.jqtransform.selector).filter("select").jqTransSelect();
						 jqTransformAddDocumentListener();
					}
					
				}else{
					curform.jqTransform();
				}
				
				curform.find(".jqTransformSelectWrapper").find("li a").click(function(){
					curform.find("select").trigger("blur");	
				});
			}

		},

		regcheck:function(datatype,gets,obj){
			/*
				datatype:datatype;
				gets:inputvalue;
				obj:input object;
			*/
			var curform=this,
				info=null,
				passed=false,
				type=3;//default set to wrong type, 2,3,4;
				
			//ignore;
			if(obj.attr("ignore")==="ignore" && Validform.util.isEmpty.call(obj,gets)){				
				if(obj.data("cked")){
					info="";	
				}
				
				return {
					passed:true,
					type:4,
					info:info
				};
			}

			obj.data("cked","cked");//do nothing if is the first time validation triggered;

			//default value;
			if($.trim(obj.attr("tip")) && gets===$.trim(obj.attr("tip")) ){
				return {
					passed:false,
					type:3,
					info:obj.attr("nullmsg") || curform.data("tipmsg").s || tipmsg.s
				};
			}
			
			if(Validform.util.toString.call(Validform.util.dataType[datatype])=="[object Function]"){
				passed=Validform.util.dataType[datatype](gets,obj,curform,Validform.util.dataType);
				if(passed === true){
					type=2;
					info=curform.data("tipmsg").r||tipmsg.r;
					
					if(obj.attr("recheck")){
						var theother=curform.find("input[name='"+obj.attr("recheck")+"']:first");
						if(gets!=theother.val()){
							passed=false;
							type=3;
							info=obj.attr("errormsg")  || curform.data("tipmsg").w || tipmsg.w;
						}
					}
					
				}else{
					info= passed || obj.attr("errormsg") || curform.data("tipmsg").w || tipmsg.w;
					passed=false;
					if(gets===""){//验证不通过且为空时;
						return {
							passed:false,
							type:3,
							info:obj.attr("nullmsg") || curform.data("tipmsg").s || tipmsg.s
						};
					}
				}
				
				return {
					passed:passed,
					type:type,
					info:info
				};
				
			}

			if(!(datatype in Validform.util.dataType)){
				var mac=datatype.match(Validform.util.dataType["match"]),
					temp;
					
				if(!mac){
					return false;
				}

				for(var name in Validform.util.dataType){
					temp=name.match(Validform.util.dataType["match"]);
					if(!temp){continue;}
					if(mac[1]===temp[1]){
						var str=Validform.util.dataType[name].toString(),
							param=str.match(/\/[mgi]*/g)[1].replace("\/",""),
							regxp=new RegExp("\\{"+temp[2]+","+temp[3]+"\\}","g");
    			        str=str.replace(/\/[mgi]*/g,"\/").replace(regxp,"{"+mac[2]+","+mac[3]+"}").replace(/^\//,"").replace(/\/$/,"");
				        Validform.util.dataType[datatype]=new RegExp(str,param);
						break;
					}	
				}
			}

			if(Validform.util.toString.call(Validform.util.dataType[datatype])=="[object RegExp]"){
				passed=Validform.util.dataType[datatype].test(gets);
				if(passed){
					type=2;
					info=curform.data("tipmsg").r||tipmsg.r;
					
					if(obj.attr("recheck")){
						var theother=curform.find("input[name='"+obj.attr("recheck")+"']:first");
						if(gets!=theother.val()){
							passed=false;
							type=3;
							info=obj.attr("errormsg") || curform.data("tipmsg").w || tipmsg.w;
						}
					}
					
				}else{
					info=obj.attr("errormsg") || curform.data("tipmsg").w || tipmsg.w;
					
					if(gets===""){
						return {
							passed:false,
							type:3,
							info:obj.attr("nullmsg") || curform.data("tipmsg").s || tipmsg.s
						};
					}
				}

				return {
					passed:passed,
					type:type,
					info:info
				};
			}

			return{
					passed:false,
					type:3,
					info:curform.data("tipmsg").w || tipmsg.w
			};
			
		},

		showmsg:function(msg,type,o,show){
			/*
				msg:提示文字;
				type:提示信息显示方式;
				o:{obj:当前对象, type:1=>正在检测 | 2=>通过}, 
				show:在blur或提交表单触发的验证中，有些情况不需要显示提示文字，如自定义弹出提示框的显示方式，不需要每次blur时就马上弹出提示;
			*/
			
			//如果msg为null，那么就没必要执行后面的操作，ignore有可能会出现这情况;
			if(msg===null){return false;}
			//if(msg===null || o.sweep && show=="hide"){return false;}

			$.extend(o,{curform:this});
				
			if(typeof type == "function"){
				if(!(o.sweep && show=="hide")){
					type(msg,o,Validform.util.cssctl);
				}
				return false;
			}
			if(type==1 || show=="alwaysshow"){
				msgobj.find(".Validform_info").html(msg);
			}

			if(type==1 && show!="hide" || show=="alwaysshow"){
				msghidden=false;
				msgobj.find(".iframe").css("height",msgobj.outerHeight());
				msgobj.show();
				setCenter(msgobj,100);
			}

			if(type==2 && o.obj){
				o.obj.parent().next().find(".Validform_checktip").html(msg);
				Validform.util.cssctl(o.obj.parent().next().find(".Validform_checktip"),o.type);
			}

		},

		cssctl:function(obj,status){
			switch(status){
				case 1:
					obj.removeClass("Validform_right Validform_wrong").addClass("Validform_checktip Validform_loading");//checking;
					break;
				case 2:
					obj.removeClass("Validform_wrong Validform_loading").addClass("Validform_checktip Validform_right");//passed;
					break;
				case 4:
					obj.removeClass("Validform_right Validform_wrong Validform_loading").addClass("Validform_checktip");//for ignore;
					break;
				default:
					obj.removeClass("Validform_right Validform_loading").addClass("Validform_checktip Validform_wrong");//wrong;
			}
		},
		
		submitForm:function(settings,flg,ajaxPost,sync){
			/*
				flg===true时跳过验证直接提交;
				ajaxPost==="ajaxPost"指示当前表单以ajax方式提交;
			*/
			var curform=this;
			
			//表单正在提交时点击提交按钮不做反应;
			if(curform[0].status==="posting"){return false;}
			
			//要求只能提交一次时;
			if(settings.postonce && curform[0].status==="posted"){return false;}
			
			var sync= sync===true ? false:true;
			var beforeCheck=settings.beforeCheck && settings.beforeCheck(curform);
			if(beforeCheck===false){return false;}
			
			var flag=true,
				inflag;

			curform.find("[datatype]").each(function(){
				//跳过验证;
				if(flg){
					return false;	
				}

				//隐藏或绑定dataIgnore的表单对象不做验证;
				if(settings.ignoreHidden && $(this).is(":hidden") || $(this).data("dataIgnore")==="dataIgnore"){
					return true;
				}
				
				var inputval=Validform.util.getValue.call(curform,$(this)),
					_this;
				errorobj=_this=$(this);
				
				inflag=Validform.util.regcheck.call(curform,$(this).attr("datatype"),inputval,$(this));

				if(!inflag.passed){
					_this.addClass("Validform_error");
					Validform.util.showmsg.call(curform,inflag.info,settings.tiptype,{obj:$(this),type:inflag.type,sweep:settings.tipSweep});
					
					if(!settings.showAllError){
						_this.focus();
						flag=false;
						return false;
					}
					
					flag && (flag=false);
					return true;
				}

				if($(this).attr("ajaxurl")){
					if(this.valid!=="true"){
						var thisobj=$(this);
						_this.addClass("Validform_error");
						Validform.util.showmsg.call(curform,curform.data("tipmsg").v||tipmsg.v,settings.tiptype,{obj:thisobj,type:3,sweep:settings.tipSweep});
						if(!msghidden || settings.tiptype!=1){
							setTimeout(function(){
								thisobj.trigger("blur",["postform"]);//continue the form post;
							},1500);
						}
						
						if(!settings.showAllError){
							flag=false;
							return false;
						}
						
						flag && (flag=false);
						return true;
					}
				}

				Validform.util.showmsg.call(curform,inflag.info,settings.tiptype,{obj:$(this),type:inflag.type,sweep:settings.tipSweep},"hide");
				_this.removeClass("Validform_error");
				errorobj=null;
			});
			
			if(settings.showAllError){
				curform.find(".Validform_error:first").focus();
			}

			if(flag){
				
				var beforeSubmit=settings.beforeSubmit && settings.beforeSubmit(curform);
				if(beforeSubmit===false){return false;}
				
				curform[0].status="posting";
				
				if(settings.ajaxPost || ajaxPost==="ajaxPost"){
					Validform.util.showmsg.call(curform,curform.data("tipmsg").p||tipmsg.p,settings.tiptype,{obj:curform,type:1,sweep:settings.tipSweep},"alwaysshow");//传入"alwaysshow"则让提示框不管当前tiptye为1还是2都弹出;
					curform[0].ajax=$.ajax({
						type: "POST",
						dataType:"json",
						async:sync,
						url: curform.attr("action"),
						//data: decodeURIComponent(curform.serialize(),true),
						data: curform.serializeArray(),
						success: function(data){
							if(data.status==="y"){
								Validform.util.showmsg.call(curform,data.info,settings.tiptype,{obj:curform,type:2,sweep:settings.tipSweep},"alwaysshow");
							}else{
								curform[0].posting=false;
								Validform.util.showmsg.call(curform,data.info,settings.tiptype,{obj:curform,type:3,sweep:settings.tipSweep},"alwaysshow");
							}
							
							settings.callback && settings.callback(data);
							
							curform[0].status="posted";
							curform[0].ajax=null;
						},
						error: function(data){
							var msg=data.statusText==="abort" ? 
									curform.data("tipmsg").abort||tipmsg.abort : 
									curform.data("tipmsg").err||tipmsg.err;
									
							curform[0].posting=false;
							Validform.util.showmsg.call(curform,msg,settings.tiptype,{obj:curform,type:3,sweep:settings.tipSweep},"alwaysshow");
							curform[0].status="normal";
							curform[0].ajax=null;
						}
					});
					
				}else{
					if(!settings.postonce){
						curform[0].status="normal";
					}
					return settings.callback && settings.callback(curform);
				}
			}
			
			return false;
			
		},
		
		resetForm:function(){
			var brothers=this;
			brothers.each(function(){
				this.reset();
				this.status="normal";
			});
			
			brothers.find(".Validform_right").text("");
			brothers.find(".passwordStrength").children().removeClass("bgStrength");
			brothers.find(".Validform_checktip").removeClass("Validform_wrong Validform_right Validform_loading");
			brothers.find(".Validform_error").removeClass("Validform_error");
			brothers.find("[datatype]").removeData("cked").removeData("dataIgnore");
			brothers.eq(0).find("input:first").focus();
		},
		
		abort:function(){
			if(this.ajax){
				this.ajax.abort();	
			}
		}
		
	}
	
	$.Datatype=Validform.util.dataType;
	
	Validform.prototype={
		dataType:Validform.util.dataType,
		
		eq:function(n){
			var obj=this;
			
			if(n>=obj.forms.length){
				return null;	
			}
			
			if(!(n in obj.objects)){
				obj.objects[n]=new Validform($(obj.forms[n]).get(),obj.settings,true);
			}
			
			return obj.objects[n];

		},
		
		resetStatus:function(){
			var obj=this;
			$(obj.forms).each(function(){
				this.status="normal";	
			});
			
			return this;
		},
		
		setStatus:function(status){
			var obj=this;
			$(obj.forms).each(function(){
				this.status=status || "posting";	
			});
		},
		
		getStatus:function(){
			var obj=this;
			var status=$(obj.forms)[0].status;
			return status;
		},
		
		ignore:function(selector){
			var obj=this;
			$(obj.forms).find(selector).each(function(){
				$(this).data("dataIgnore","dataIgnore").removeClass("Validform_error");
			});
		},
		
		unignore:function(selector){
			var obj=this;
			$(obj.forms).find(selector).each(function(){
				$(this).removeData("dataIgnore");
			});
		},
		
		addRule:function(rule){
			/*
				rule => [{
					ele:"#id",
					datatype:"*",
					errormsg:"出错提示文字！",
					nullmsg:"为空时的提示文字！",
					tip:"默认显示的提示文字",
					altercss:"gray",
					ignore:"ignore",
					ajaxurl:"valid.php",
					recheck:"password",
					plugin:"passwordStrength"
				},{},{},...]
			*/
			var obj=this;
			var rule=rule || [];

			for(var index in rule){
				var o=$(obj.forms).find(rule[index].ele);
				for(var attr in rule[index]){
					attr !=="ele" && o.attr(attr,rule[index][attr]);
				}
			}
			
		},
		
		ajaxPost:function(flag,sync){
			var obj=this;
			
			//创建pop box;
			if( obj.settings.tiptype==1 || obj.settings.tiptype==2 ){
				creatMsgbox();
			}
			
			Validform.util.submitForm.call($(obj.forms[0]),obj.settings,flag,"ajaxPost",sync);
		},
		
		submitForm:function(flag){
			/*flag===true时不做验证直接提交*/
			
			var obj=this;
			
			//让该对象的第一个表单提交;
			var subflag=Validform.util.submitForm.call($(obj.forms[0]),obj.settings,flag);
			subflag === undef && (subflag=true);
			if(subflag===true){
				obj.forms[0].submit();
			}
		},
		
		resetForm:function(){
			var obj=this;
			Validform.util.resetForm.call($(obj.forms));
		},
		
		abort:function(){
			var obj=this;
			$(obj.forms).each(function(){
				Validform.util.abort.call(this);
			});	
		}
	}

	$.fn.Validform=function(settings){
		return new Validform(this,settings);
	};
	
	function setCenter(obj,time){
		var left=($(window).width()-obj.outerWidth())/2,
			top=($(window).height()-obj.outerHeight())/2,
			
		top=(document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop)+(top>0?top:0);

		obj.css({
			left:left	
		}).animate({
			top : top
		},{ duration:time , queue:false });	
	}
	
	function creatMsgbox(){
		if($("#Validform_msg").length!==0){return false;}
		msgobj=$('<div id="Validform_msg"><div class="Validform_title">'+tipmsg.tit+'<a class="Validform_close" href="javascript:void(0);">&chi;</a></div><div class="Validform_info"></div><div class="iframe"><iframe frameborder="0" scrolling="no" height="100%" width="100%"></iframe></div></div>').appendTo("body");//提示信息框;
		msgobj.find("a.Validform_close").click(function(){
			msgobj.hide();
			msghidden=true;
			if(errorobj){
				errorobj.focus().addClass("Validform_error");
			}
			return false;
		}).focus(function(){this.blur();});

		$(window).bind("scroll resize",function(){
			!msghidden && setCenter(msgobj,400);
		});
	};
	
	//公用方法显示&关闭信息提示框;
	$.Showmsg=function(msg){
		creatMsgbox();
		Validform.util.showmsg.call(win,msg,1,{});
	};
	
	$.Hidemsg=function(){
		msgobj.hide();
		msghidden=true;
	};
	
})(jQuery,window);