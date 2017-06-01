var aniShow = "pop-in";
var menu = null,
	showMenu = false;
var isInTransition = false;
var _self;
//只有ios支持的功能需要在Android平台隐藏；
if(mui.os.android) {
	var list = document.querySelectorAll('.ios-only');
	if(list) {
		for(var i = 0; i < list.length; i++) {
			list[i].style.display = 'none';
		}
	}
	//Android平台暂时使用slide-in-right动画
	if(parseFloat(mui.os.version) < 4.4) {
		aniShow = "slide-in-right";
	}
}
//初始化，并预加载webview模式的选项卡			
function preload() {

	var menu_style = {
		left: "-70%",
		width: '70%',
		popGesture: "none",
		render:"always"
	};

	if(mui.os.ios) {
		menu_style.zindex = -1;
	}

	//处理侧滑导航，为了避免和子页面初始化等竞争资源，延迟加载侧滑页面；
	menu = mui.openWindow({
		id: 'index-menu',
		url: 'index-menu.html',
		styles: menu_style,
		show: {
			aniShow: 'none'
		},
		waiting: {
			autoShow: false
		}
	});
}
mui.plusReady(function() {
	//读取本地存储，检查是否为首次启动
	var showGuide = plus.storage.getItem("lauchFlag");
	//仅支持竖屏显示
	plus.screen.lockOrientation("portrait-primary");
	if(showGuide) {
		//有值，说明已经显示过了，无需显示；
		//关闭splash页面；
		plus.navigator.closeSplashscreen();
		plus.navigator.setFullscreen(false);
		//预加载
		preload();
	} else {
		//显示启动导航
		mui.openWindow({
			id: 'guide',
			url: 'main/guide.html',
			styles: {
				popGesture: "none"
			},
			show: {
				aniShow: 'none'
			},
			waiting: {
				autoShow: false
			}
		});
		//延迟的原因：优先打开启动导航页面，避免资源争夺
		setTimeout(function() {
			//预加载
			preload();
		}, 200);
	}

	//绘制顶部图标
	_self = plus.webview.currentWebview();
	var titleView = _self.getNavigationbar();

	if(!titleView) {
		titleView = plus.webview.getLaunchWebview().getNavigationbar();
	}

	titleView.drawRect("#cccccc", {
		top: "43px",
		height:"1px",
		left: "0px"
	}); //绘制底部边线

	//开启回弹
	_self.setStyle({
		bounce: "vertical",
		bounceBackground:"#efeff4"
	});

	//绘制左上角menu图标
	var bitmap_menu = new plus.nativeObj.Bitmap("menu");
	bitmap_menu.loadBase64Data("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwBAMAAAClLOS0AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAKlBMVEUAAAAAev8Aev8Aev8Aev8Aev8Aev8Aev8Aev8Aev8Aev8Aev8Aev8AAABINtoqAAAADHRSTlMA/fPQ0M/e3tzs7OjgY5g4AAAAAWJLR0QAiAUdSAAAAAd0SU1FB+EBFwEbOGGUPSIAAAA2SURBVDjLY2AY9oDxDBZwCJ8EswsW4DrQ/hicgPTQZSvHAioG2h+DE5AeupyrsIDVA+0PqgEAu36BkQX5nBQAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTctMDEtMjNUMDE6Mjc6NTYrMDg6MDC8FK1uAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE3LTAxLTIzVDAxOjI3OjU2KzA4OjAwzUkV0gAAAABJRU5ErkJggg==");
	titleView.drawBitmap(bitmap_menu, {}, {
		top: "10px",
		left: "10px",
		width: "24px",
		height: "24px"
	});

	var about_left = window.innerWidth - 34;
	var bitmap = new plus.nativeObj.Bitmap("about");
	bitmap.loadBase64Data("data:image/png;base64,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");
	titleView.drawBitmap(bitmap, {}, {
		top: "10px",
		left: about_left + "px",
		width: "24px",
		height: "24px"
	});

	titleView.interceptTouchEvent(true);
	titleView.addEventListener("click", function(e) {
		var x = e.clientX;
		if(x < 44) { //触发menu菜单
			var _left = parseInt(_self.getStyle().left);
			if(_left > 0) { //处于显示状态
				closeMenu();
			} else {
				openMenu();
			}
		} else if(x > about_left) { //触发关于页面
			var aniShow = mui.os.plus ? "slide-in-right" : "zoom-fade-out";
			mui.openWindow({
				url: "main/share.html",
				id: "share",
				styles: {
					popGesture: "close"
				},
				show: {
					aniShow: aniShow,
					duration: 300
				}
			});
		}
	}, false);

	//启用侧滑拖拽操作，延时的原因是menu页是延时创建的，所以这里需要相应延时
//	setTimeout(function() {
//		_self.drag({
//			direction: "right",
//			moveMode: "followFinger"
//		}, {
//			view: menu,
//			moveMode: "follow"
//		}, function(e) {
//			//console.log(JSON.stringify(e));
//		});
//	}, 350);
	
});

/**
 * 显示侧滑菜单
 */
function openMenu() {
	plus.webview.startAnimation({
			'view': _self,
			'styles': {
				'fromLeft': '0',
				'toLeft': "70%"
			},
			'action': 'show'
		}, {
			'view': menu,
			'styles': {
				'fromLeft': "-70%",
				'toLeft': '0'
			},
			'action': 'show'
		},
		function(e) {
			//console.log(JSON.stringify(e));
			if(e.id == menu.id) { //侧滑菜单打开
			}
		}.bind(this)
	)
};
/**
 * 关闭菜单
 */
function closeMenu() {
	plus.webview.startAnimation({
			'view': _self,
			'styles': {
				'fromLeft': '70%',
				'toLeft': "0"
			},
			'action': 'show'
		}, {
			'view': menu,
			'styles': {
				'fromLeft': "0",
				'toLeft': '-70%'
			},
			'action': 'show'
		},
		function(e) {
//			console.log(JSON.stringify(e));
			if(e.id == _self.id) {}
		}.bind(this)
	)
};
window.addEventListener("menu:close", closeMenu);

var _toast = false;

mui.back = function() {
	if(parseInt(_self.getStyle().left) > 0) {
		closeMenu();
		return;
	}

	if(!_toast || !_toast.isVisible()) {
		_toast = mui.toast('再按一次退出', {
			duration: 'long',
			type: 'div'
		});
	} else {
		plus.runtime.quit();
	}
}

//重写mui.menu方法，Android版本menu按键按下可自动打开、关闭侧滑菜单；
mui.menu = function() {
	if(parseInt(_self.getStyle().left) > 0) {
		closeMenu();
	} else {
		openMenu();
	}
}
