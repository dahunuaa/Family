/*
 @author:dahu
 * */

//(function(){
	var index =1;
	var size = null;
	var imageIndexIdNum = 0;
	var picture={
		imageList: document.getElementById("image-list"),
//		submitBtn: document.getElementById("submit")
	}
	var url = basepath+"api/v1.0/"
	picture.files=[];
	picture.uploader = null;
	//提交之后，恢复表单
	picture.clearForm = function(){
		picture.imageList.innerHTML="";
		picture.newPlaceholder();
		picture.files=[]
		picture.files = [];
		index = 0;
		size=0;
		imageIndexIdNum=0;
	}
	
	picture.getFileInputArray = function(){
		return [].slice.call(picture.imageList.querySelectorAll('.file'));
	};
	
	picture.addFile = function(path){
		picture.files.push({name:"images"+index,path:path,id:"img-"+index});
		index++;
	};
	//初始化占位符
	picture.newPlaceholder = function() {
		var fileInputArray = picture.getFileInputArray();
		if (fileInputArray &&
			fileInputArray.length > 0 &&
			fileInputArray[fileInputArray.length - 1].parentNode.classList.contains('space')) {
			return;
		};
		imageIndexIdNum++;
		var placeholder = document.createElement('div');
		placeholder.setAttribute('class', 'image-item space');
		var up = document.createElement("div");
		up.setAttribute('class','image-up')
		//删除图片
		var closeButton = document.createElement('div');
		closeButton.setAttribute('class', 'image-close');
		closeButton.innerHTML = 'X';
		closeButton.id = "img-"+index;
		//小X的点击事件
		closeButton.addEventListener('tap', function(event) {
			setTimeout(function() {
				for(var temp=0;temp<picture.files.length;temp++){
					if(picture.files[temp].id==closeButton.id){
						picture.files.splice(temp,1);
					}
				}
				picture.imageList.removeChild(placeholder);
			}, 0);
			return false;
		}, false);
		
		//
		var fileInput = document.createElement('div');
		fileInput.setAttribute('class', 'file');
		fileInput.setAttribute('id', 'image-' + imageIndexIdNum);
		
		//添加照片
		fileInput.addEventListener('tap', function(event) {
				if(mui.os.plus){
					var a = [{
						title: "拍照"
					}, {
						title: "从手机相册选择"
					}];
					plus.nativeUI.actionSheet({
						cancel: "取消",
						buttons: a
					}, function(b) {
						switch (b.index) {
							case 0:
								break;
							case 1:
								getImage()
								break;
							case 2:
								galleryImg();
								break;
							default:
								break
						}
						
					})	
				}
			
			
			
			var self = this;
			var index = (this.id).substr(-1);
			//拍照
			function getImage(){
				var c = plus.camera.getCamera();
				c.captureImage(function(e){
				plus.io.resolveLocalFileSystemURL(e,function(entry){
					var e = entry.toLocalURL()+"?version=" + new Date().getTime();
					var name = e.substr(e.lastIndexOf('/') + 1);
					plus.zip.compressImage({
						src: e,
						dst: '_doc/' + name,
						overwrite: true,
						quality: 50
					}, function(zip) {
						size += zip.size  
//						console.log("filesize:"+zip.size+",totalsize:"+size);
						if (size > (10*1024*1024)) {
							return mui.toast('文件超大,请重新选择~');
						}
						if (!self.parentNode.classList.contains('space')) { //已有图片
							picture.files.splice(index-1,1,{name:"images"+index,path:e});
						} else { //加号
							placeholder.classList.remove('space');
							picture.addFile(zip.target);
							picture.newPlaceholder();
						}
						up.classList.remove('image-up');
						placeholder.style.backgroundImage = 'url(' + zip.target + ')';
					}, function(zipe) {
						mui.toast('压缩失败！')
					});
				})
			},function(s){
				console.log("error"+s);
			});
			}
			
			//从相册中选取
			function galleryImg(){
				plus.gallery.pick(function(e) {
				var name = e.substr(e.lastIndexOf('/') + 1);
					
				plus.zip.compressImage({
					src: e,
					dst: '_doc/' + name,
					overwrite: true,
					quality: 50
				}, function(zip) {
					size += zip.size  
//					console.log("filesize:"+zip.size+",totalsize:"+size);
					if (size > (10*1024*1024)) {
						return mui.toast('文件超大,请重新选择~');
					}
					if (!self.parentNode.classList.contains('space')) { //已有图片
						picture.files.splice(index-1,1,{name:"images"+index,path:e});
					} else { //加号
						placeholder.classList.remove('space');
						picture.addFile(zip.target);
						picture.newPlaceholder();
					}
					up.classList.remove('image-up');
					placeholder.style.backgroundImage = 'url(' + zip.target + ')';
				}, function(zipe) {
					mui.toast('压缩失败！')
				});
			}, function(e) {
				mui.toast(e.message);
			},{});
			}
		}, false);
		
		placeholder.appendChild(closeButton);
		placeholder.appendChild(up);
		placeholder.appendChild(fileInput);
		picture.imageList.appendChild(placeholder);
	};
	picture.newPlaceholder();
	
	
	function getimgbase64(){
		//判断网络连接
		if(plus.networkinfo.getCurrentType()==plus.networkinfo.CONNECTION_NONE){
			return mui.toast("网不太好哎，待会儿再写吧");
		}
		
		picture.send(mui.extend({}, picture.deviceInfo, {
			images: picture.files,
		}))
	}
	
	
	var images_array=new Array();
	picture.send = function(content){
		    	for(var i=0;i<content.images.length;i++){
					var path = content.images[i]["path"];
					var img = new Image();
					img.src=path;
//					img.onload = function(){ 去掉onload，因为onload会在其他代码全部都执行完之后才会执行
						var that = img;
						var w = that.width,
							h = that.height,
							scale = w/h;
							w = 480 ||w;
							h = w/scale;
						var canvas = document.createElement('canvas');
						var ctx = canvas.getContext('2d');
						canvas.width = w;
			    		canvas.height = h;
						ctx.drawImage(that,0,0,w,h);
						var base64 = canvas.toDataURL('image/png',1||0.8);
						images_array.push(base64.split(',')[1])
//					}
				}
		    	
	};
//})();
