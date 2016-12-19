
/*
	适用于在页面加载完毕时，执行很多个函数。它只有一个参数：在页面加载完毕时执行的函数的名字
	1,把现有的window.onload事件处理函数的值存入变量oldonload;
 	2,如果在这个事件处理函数上还没有绑定任何函数，就像平常一样把新函数添加给他
	3,如果在这个事件处理函数上已经绑定了一些函数，那么就把新函数追加到现有指令的末尾,这将把那些在页面加载完毕时要执行的函数创建了一个队列
*/
function addLoadEvent(func) {
	var oldonload = window.onload;

	if (typeof window.onload != "function") {
		window.onload = func;	
	} else {
		window.onload = function() {
			oldonload();
			func();
		}	
	}	
}

/*
	1，如果传入的节点不是元素节点（可能是文本节点，属性节点，空格符之类）并且存在当前传入节点的下一个同辈节点。那么将下一个节点返回，重新调用函数
	2，如果上面的两个部分都不成立，执行return null,表示不存在该节点的下一个节点，上面两个if按顺序执行，只要有一个执行成功，就不再往下面执行，
	3，如果两个都不成功，那么返回return null;
*/
function getNextElement(node) {

	// 参数node,代表当前节点的下一个节点。如果是元素节点，返回。后面的代码不执行
	if (node.nodeType == 1) {
		return node;		
	}

	// 如果传入的节点不是元素节点,并且存在当前传入节点的下一个同辈节点。那么将下一个节点返回，重新调用函数
	if (node.nextSibling) {
		return getNextElement(node.nextSibling);
	}

	return null;
}

/*
	DOM自身提供了一个insertBefore的方法，但没有提供insertAfter的方法.基本思路是把新元素插入到目标元素的下一个同辈节点的前面.
	两个参数，一个是将被插入的新元素，另一个是目标元素   
*/
function insertAfter(newElement,targetElement) {
	var parent = targetElement.parentNode;

	if (parent.lastChild == targetElement) {
		parent.appendChild(newElement);	
	} else {
		parent.insertBefore(newElement,targetElement.nextSibling);	
	}
}

/*
	stripeTables函数，可以编写一个函数来为文档中的所有表格中的行添加斑马线效果，只要隔行设置样式就行
	flag初始化为false.当j=0,flag初始是flase,第1行（下标从0开始计数）走else语句块，没变色。然后把flag设置为true.第二次循环，j=1,flag为true，走if语句块，
	这时行数是第2行，设置背景色，并把flag的值设置为false。偶数行变色（从1开始计算）
*/
function stripeTables() {

	if (!document.getElementsByTagName) return false;
	var tables = document.getElementsByTagName("table");
	var flag,rows; // 定义变量flag,根据它的布尔值来隔行设置样式

	for (var i = 0; i < tables.length; i++) {
		flag = false;            
		rows = tables[i].getElementsByTagName("tr");

		for (var j = 0; j < rows.length; j++) {

			if (flag == true) {
				addClass(element,value);	
				flag = false;
			} else {
				flag = true;	  
			}	
		}
	}	
}

/*
	1,当鼠标指针悬浮在元素上面，触发mouseover事件，给它添加一个背景颜色
	2,当鼠标指针离开元素后，触发mouseout事件，把它的背景颜色设置为空
*/ 
function highlightRows() {

	if (!document.getElementsByTagName) return false;
	var rows = document.getElementsByTagName("tr");

	for(var i = 0; i < rows.length; i++){
		rows[i].onmouseover = function(){
			addClass(element,value);
		};
		rows[i].onmouseout = function(){
			addClass(element,value);
		};
	}	
} 

/*
	通过className属性设置某个元素的class属性时将替换而不是追加该元素原有的class属性值。但可以用字符串拼接的方式把新的class属性设置值直接赋值给className属性，
	例elem.className += " into";在需要给一个元素追加新的class时，可按以下的步骤：
	1，检查className属性的值是否为null
	2,如果是，把新的class设置值直接赋给className属性
	3,如果不是，把你一个新的空格和新的class设置值追加到className属性上去
*/
function addClass(element,value) {

	if (!element.className) {
		element.className = value;	
	} else {
		var newClassName = element.className;
		newClassName += " ";
		newClassName += value;	
		element.className = newClassName;
	}	
}

/*
	改变某一类元素的下一个元素节点的样式
*/
function styleElementSiblings(tag,theclass) {

	if (!document.getElementsByTagName) return false;
	var elems = document.getElementsByTagName(tag);
	var nextElement;

	for (var i = 0; i < elems.length; i++) {
		nextElement = getNextElement(elems[i].nextSibling);
		addClass(nextElement,theclass);	
	}	
}
addLoadEvent(
	function () {
		styleElementSiblings("h1","intro")
	}
);

/*
	一个通用的moveElement函数，它有四个参数:
	1,打算移动的元素的ID 
	2,该元素的目的地的'左'位置 
	3,该元素的目的地的'上'位置 
	4,两次移动之间的停顿时间
	js允许给元素设置自定义的属性，例如element.property = "foo";
*/
function moveElement(elementID,final_x,final_y,interval) {

	if (!document.getElementById) return false;
	if (!document.getElementById(elementID)) return false;
	var elem = document.getElementById(elementID);

	// 如果要移动的元素存在自定义的movement属性，那么就清空
	if (elem.movement) {
		clearTimeout(elem.movement);	
	}

	// 设置元素的初始位置
	if (!elem.style.left) {
		elem.style.left = "0px";	
	}

	if (!elem.style.top) {
		elem.style.top = "0px";	
	}

	// 提取数值进行后续的计算，dist变量是目的地与当前移动的元素的距离
	var xpos = parseInt(elem.style.left);
	var ypos = parseInt(elem.style.top);
	var dist = 0;            

	// 如果元素到达目的地位置，就退出当前函数
	if (xpos == final_x && ypos == final_y) {
		return true;	
	}

	// 如果元素没有到达目的地位置，就让它离目的地位置近一些。每次移动的距离是总的距离的1/10，并向上取整，保证移动最小值是1px
	if (xpos < final_x) {
		dist = Math.ceil((final_x - xpos) / 10);
		xpos = xpos + dist;	
	}
	if (xpos > final_x) {
		dist = Math.ceil((xpos - final_x) / 10);
		xpos = xpos - dist;	
	}
	if (ypos < final_y) {
		dist = Math.ceil((final_y - ypos) / 10);
		ypos = ypos + dist;
	}
	if (ypos > final_y) {
		dist = Math.ceil((ypos - final_y) / 10);
		ypos = ypos - dist;	
	}
	elem.style.left = xpos + "px";
	elem.style.top  = ypos + "px";
	
	var repeat = function () {
		moveElement(elementID,final_x,final_y,interval);
	};
	// 经过一定时间重新调用函数，并赋值给要移动元素的属性movement
	elem.movement = setTimeout(repeat,interval);
}
	
/*	
	getElementsByClassName(),这个方法是html5中的DOM，可能会产生兼容性，ie8以及以下版本不支持，可使用下面的方法。参数node表示DOM树中的搜索起点，classname表示要搜索的类名
	元素的nodeName属性总是返回一个大写字母的值 例：if(placeholder.nodeName != "IMG") return false; 注意className和nodeName的区别
	indexOf(),这个方法可以返回某个指定的子字符串值在字符串中首次出现的位置。返回-1，表示这个字符串值不存在. 这个函数不适用多个类名
*/
function getElementsByclassname(node,classname) {
 
	if (node.getElementsByClassName) {
		return node.getElementsByClassName(classname);	
	} else { 
		var results = new Array();     	
		var elems = node.getElementsByTagName("*");

		for (var i = 0; i < elems.length; i++) {

			if (elems[i].className.indexOf(classname) != -1) {       
 				results[results.length] = elems[i];  // 数组中最后一个元素的下标是array.length-1.这句代码的意思是将遍历到的元素追加到数组中的最后 			
			}	
		}

		return results;
	}	
}		

/*
	selectFrom,该函数接收两个参数，应该返回的最小值和最大值，而最大值减去最小值，再加上1，就能得到可能的值的总数。Math.random()方法返回一个大于等于0小于1的随机数
	可以利用Math.random()从某个整数范围内随机选择一个值。值 = Math.floor(Math.random() * 可能值的总数 +　第一个可能值)。向下取整，确保取的值是整数
	利用这个函数也能方便的从一个数组中取出任意的值，var list = arrays[selectFrom(0,arrays.length-1)]
*/
function selectFrom(minValue,maxValue) {
 
	// 定义变量choices，得到数值得总数
	var choices = maxValue - minValue + 1;

	return Math.floor(Math.random() * choices + minValue);		
}

var num = selectFrom(1,10);
alert(num);           // 介于1和10之间的任意整数值（包括1,10）
var colors = ["red","green","blue","black","white","orange"];
var color  = colors[selectFrom(0,colors.length - 1)];
alert(color);        //  返回数组中任意一个元素值


// 可使用window.open(url,name,features)来创建新的浏览器窗口。第一个参数是想在新窗口里打开的网页的url地址。第二个参数是这个弹出窗口的名字，第三个参数是新窗口的各种属性
function popUp(winURL) {
	window.open(winURL,"popup","width=600,height=700");
}

/*
	在多个网页中，通过导航栏链接来高亮显示当前页.重点是比较当前页面的url与当前a链接的url的比较，是否一样，当前页面的url是window.location.href
	string.indexOf(substring)，这个方法返回指定的字符串在字符串中第一次出现的位置，如果没有匹配到，就返回-1	
	若当前页面的url和当前a链接的url值匹配，那么就给这个链接添加高亮的类 。而且可以利用这个函数，通过给每个页面的body元素添加id属性，
	可以为每个页面应用不同的样式,如果是大写字母，可以用toLowerCase方法
*/
function highlightPage(){

	if (!document.getElementsByTagName) return false;
	if (!document.getElementById) return false;
	var headers = document.getElementsByTagName("header");

	if (headers.length == 0) return false;
	var navs = headers[0].getElementsByTagName("nav");

	if (navs.length == 0) return false;
	var links = navs[0].getElementsByTagName("a");
	var linkurl;

	for (var i = 0; i < links.length; i++) {
		linkurl = links[i].getAttribute("href");

		// 如果当前页面的url与正在遍历的a链接的href属性相同，就给它添加高亮样式
		if (window.location.href.indexOf(linkurl) != -1) {
			links[i].className = "highlight";
			var link_text = links[i].lastChild.nodeValue.toLowerCase();	

            // 给每个页面的body元素添加id属性，可以为每个页面应用不同的样式
			document.body.setAttribute("id",link_text);
		}	
	}
}

// 根据js，可以选择性地每次只显示其中的一个部分，它能够根据指定的id显示相应的<section>部分，同时隐藏其他部分.用来做内部的导航
function showSection(id) {
	var sections = document.getElementsByTagName("section");

	for (var i = 0; i < sections.length; i++) {

        // 当前遍历的section，获取到的id,如果等于传入的参数id,那么就显示里面的内容，否则隐藏
		if (sections[i].getAttribute("id") != id) {
			sections[i].style.display = "none";	
		} else {
			sections[i].style.display = "block";	
		}	
	}	
}

/*
	导航链接，表示内部链接时候，前面加#号，使用split(separator,howmany);第一个参数表示从指定的地方分隔stringObject。第二个参数可以省略
	变量sectionId是一个局部变量，它只在prepareInternalNav函数执行期间存在，等到了事件处理函数执行时就不存在了。要解决这个问题，可以为每个链接加上一个自定义的属性
*/
function prepareInternalNav() {

	if (!document.getElementsByTagName) return false;
	if (!document.getElementById) return false;
	var articles = document.getElementsByTagName("article");

	if(articles.length == 0) return false;
	var navs = atricles[0].getElementsByTagName("nav");

	if(navs.length == 0) return false;
	var nav = navs[0];
	var links = nav.getElementsByTagName("a");

	for (var i = 0; i < links.length; i++) {

        // 字符串的split()方法，通过分隔符，返回一个字符串数组
		var sectionId = links[i].getAttribute("href").split("#")[1];

		if (!document.getElementById(sectionId)) continue;
		document.getElementById(sectionId).style.display = "none";

        // 把变量sectionId的值赋给了当前链接的destination属性
		links[i].destination = sectionId;
		links[i].onclick = function() {
			showSection(this.destination);

			return false;	
		}	 
	}
			
} 

// 表单中的label标签非常有用，它通过for属性把一小段文本关联到表单的一个字段中去.使用这个js函数，DOM对象中，focus()方法。所有的浏览器都会支持获取焦点功能
function focusLabels(){
 
	if (!document.getElementsByTagName) return false;
	var labels = document.getElementsByTagName("label");

	for(var i = 0; i < labels.length; i++){

		if (!labels[i].getAttribute("for")) continue;
		labels[i].onclick = function() {
			var id = this.getAttribute("for");

			if (!document.getElementById(id)) return false;
			var element = document.getElementsById(id);
			element.focus();	
		}; 	
	}
}

/* 
    数组中自带的sort()方法按升序排列数组项-即最小的值位于最前面，最大的值排在后面，为了实现排序，sort()方法会调用每个数组项的toString()方法，然后比较得到的字符串
    以确定如何排序，即使数组中的每一项都是数值，sort()方法比较的也是字符串。这里，sort()方法可以接收一个比较函数作为参数，以便我们指定哪个值在哪个值的前面
    比较函数接收两个参数---返回一个负数的情况,第一个参数位于第二个参数之前; 如果两个参数相等则返回0; 返回正数的情况：第一个参数应放在第二个参数之后
*/
function compare(value1,value2) {

	if (value1 < value2) {
		return -1;
	} else if (value1 > value2) {
		return 1;	
	} else {
		return 0;	
	}	
}
var value = [0,1,5,10,15];
value.sort(compare);       // 按升序排列，0,1,5,10,15

// 比较函数按降序进行排列，只要交换比较函数的返回的值即可.
function compare1 (value1,value2) {

	if (value1 < value2) {
		return 1;	
	} else if (value1 > value2){
		return -1;	
	} else {
		return 0;	
	}
}

/*
    经典的阶乘函数.在函数内部，有两个特殊的对象：arguments 和this.其中，arguments对象的主要用途是保存传入函数中的所有参数。但这个对象还有一个
    名叫callee的属性，该属性是一个指针，指向拥有这个arguments对象的函数
*/
function factorial(num) {

	if (num <= 1) {
		return 1;	
	} else {
		return num * arguments.callee(num - 1);	
	}	
}

/*
    DOM2级事件处理程序，接收三个参数：1,要处理的事件的名称，不加“on” 2，事件处理程序的函数 3，一个布尔值，如果是false,表示的是在冒泡阶段调用事件处理程序
    addHandler函数，兼容浏览器差异，先测试DOM2级事件处理程序，然后测试ie中的事件处理程序（兼容ie8及以下,接收两个参数：事件处理程序的名称和事件处理程序的
    函数），最后默认的方法是DOM0级事件处理程序
*/
function addHandler(element,type,handler) {

	if (element.addEventHandler) {
		element.addEventHandler(type,handler,false);	
	} else if (element.attachEvent) {
		element.attachEvent("on" + type,handler);	
	} else {
		element["on" + type] = handler;	
	}
}

//使用了事件对象，包含了6个方法
var eventUtil = {
	addHandler: function (element,type,handler) {

		if (element.addEventListener) {
			element.addEventListener(type,handler,false);
		} else if (element.attachEvent) {
			element.attachEvent("on" + type,handler);
		} else {
			element["on" + type] = handler;
		}
	},

	getEvent: function (event) {

        // IE中的事件对象，取决于指定事件处理程序的方法。在使用DOM0级方法添加事件处理程序时，event对象是作为window对象的一个属性存在
        // 如果是使用的attachEvent方法，那么就会有一个event对象被传入到事件处理程序函数中
		return event ? event : window.event;
	},

	getTarget: function (event) {

        // IE中的事件对象，srcElement属性，表示事件的目标
		return event.target || event.srcElement;
	},

	preventDefault: function (event) {

        // IE事件对象中，event对象的属性returnValue默认是true,但将其设置为false就可以取消事件的默认行为
		if (event.preventDefault) {
			event.preventDefault();
		} else {
			event.returnValue = false;
		}
	},

	stopPropagation: function (event) {
 
        // IE事件对象中，event对象的属性cancelBubble默认为false,但将其设置为true就可以取消事件的冒泡
		if (event.stopPropagation) {
			event.stopPropagation();
		} else {
			event.cancelBubble = true;
		}
	},

	removeHandler: function (element,type,handler) {

		if (element.removeEventListener) {
			element.removeEventListener(type,handler,false);
		} else if (element.detachEvent) {
			element.detachEvent("on" + type,handler);
		} else {
			element["on" + type] = null;
		}

	}
};
var btn = document.getElementById("myBtn");
var handler = function () {
	alert("hero");
};

// 把事件处理程序的函数赋值给一个变量handler,确保添加和取消事件处理程序的参数相同
eventUtil.addHandler(btn,"click",handler);
eventUtil.removeHandler(btn,"click",handler);

/*  
    getEvent()方法，它返回对event对象的引用。这一行代码放在事件处理程序的开头，就可以确保随时都能使用event对象，
    而不必担心用户使用的是什么浏览器。使用这个方法时，必须假设有一个事件对象传入到事件处理程序中，而且要把该变量
    传给这个方法。
*/
btn.onclick = function (event) {
	event = eventUtil.getEvent(event);

	// getTarget()方法，它返回事件的目标
	var target = eventUtil.getTarget();
	eventUtil.stopPropagation(event);

};
var link = document.getElementsById("myLink")

    // preventDefault()这个方法用于取消事件的默认行为
link.onclick = function (event) {
	event = eventUtil.getEvent(event);
	eventUtil.preventDefault(event);
};

/*
	get请求，最常用于向服务器查询某些信息，必要时可以将查询字符串参数追加到URL的末尾，以便将信息发送给服务器，位于URL末尾的查询字符串必须经过正确的编码才行
	查询字符串中的每个参数的名称和值都必须使用encodeURIComponent()进行编码，然后才能放到URL的末尾，而且参数之间用&分隔。example.php?name1=value1&name2=value2
	下面这个函数可以向现有的URL的末尾添加查询字符串参数;这个函数接收三个参数：要添加参数的url,参数的名称和参数的值。
	1,首先检查URL是否包含问号（已确定是否已经有参数存在），如果没有，就添 加一个问号，否则，就添加一个和号
	2,然后将参数名称和值进行编码，在添加到URL的末尾 3,最后返回添加了参数的url
*/
function addURLParam(url,name,value) {
	url += (url.index0f("?") == -1 ? "?" : "&");
	url += encodeURIComponent(name) + " = " + encodeURIComponent(value);
	return url;
} 

// 使用这个函数来构建请求URL的示例
var url = "example.php";
url = addURLParam(url,"name","Nicholas");
url = addURLParam(url,"book","Professional js");
// 初始化请求。接收三个参数：请求的类型（get,post),请求的url,是否表示异步发送请求的布尔值（若为true,则异步发送请求）
xhr.open("get",url,true);
/*
	原生的ajax使用
	发送异步请求时候，必须在调用open()之前指定onreadystatechange事件处理程序才能确保跨浏览器兼容性
	使用post请求时，open()和send()之间，要设置一个自定义的请求头部信息。
	xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
*/
//  创建一个原生的xhr对象,IE7+
var xhr = new XMLHttpRequest();

// readyState属性，该属性表示请求/响应过程当前的活动阶段.readyState的值发生改变，会触发readystatechange事件
xhr.onreadystatechange = function () {

    // 当readyState属性为4，表示完成阶段，已经接收到全部响应数据，而且已经能在客户端使用
	if (xhr.readyState == 4) {

        // 状态代码304表示请求的资源并没有被修改，可以直接使用浏览器中缓存的版本，这也意味着响应是有效的
		if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
			alert(xhr.responseText);
		} else {
			alert("Request was unsuccessful：" + xhr.status);
		}
	} 
};
xhr.open("get","example.php",true);
xhr.send(null);



	
