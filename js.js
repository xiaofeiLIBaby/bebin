/**
 * Created by 69568 on 2019/1/5.
 */
window.addEventListener('DOMContentLoaded',function () {
//    //window.onload = function () {
    //获取元素
    var header = document.getElementById('header')
    var arrow = document.querySelector('#header .headerMain .arrow');
    var navUps = document.querySelectorAll('#header .headerMain .nav .navList .navItem .up');
    var navLis = document.querySelectorAll('#header .headerMain .nav .navList .navItem');
    var content = document.getElementById('content');
    var contentLis = document.querySelectorAll('#content .contentList>li');
    var contentList = document.querySelector('#content .contentList');
    var homeNavLis = document.querySelectorAll('#content .contentList .home .homeIcons>li');
    var homeItems = document.querySelectorAll('#content .contentList .home .homeList .homeItem');
    var team3Items = document.querySelectorAll('#content .contentList .team .team3 .team3List .team3Item');
    var team3 = document.querySelector('#content .contentList .team .team3');
    var menuLis = document.querySelectorAll('#content .menuList>li');
    var music = document.querySelector('#header .headerMain .music');
    var myAudio = document.querySelector('#header .headerMain .music>audio');
    var maskLine = document.querySelector('#mask .maskLine');
    var maskUp = document.querySelector('#mask .maskUp');
    var maskDown = document.querySelector('#mask .maskDown');
    var startMask = document.getElementById('mask');
    var index = 0;
    var timeId = null;
    var oldIndex = 0
    var rollTimeId = null;
    var myCanvas = null;
    var time1 = null;
    var time2 = null;

    //响应页面缩放
    window.onresize = function () {
        //1.三角位重新定义----ok
        headerBind()
        //2.主体内容承接区域（橙色区域）
        contentBind()
        //3.每一屏的背景位置居中
        contentMove(index)
    }

    //头部区域逻辑
    headerBind()
    function headerBind() {
        //初始化第一个Up元素
        navUps[index].style.width = '100%';
        //初始化三角位置
        arrow.style.left = navLis[index].getBoundingClientRect().left + navLis[index].offsetWidth/2 + 'px';

        //循环给li加响应事件
        for (var i=0; i<navLis.length; i++ ){
            var item = navLis[i];
            item.index = i
            //给当前的item加点击事件
            item.onclick = function () {
                //让前一屏出场
                animationArr[index].outAnimation();
                //当前屏入场
                animationArr[this.index].inAnimation();
                index = this.index;
                contentMove(this.index);
                menuLis[this.index].className = 'active';
            }
        }
    }

    //主体内容的切换（外加操作up高亮，三角的位置）
    function contentMove(index) {
        //第一步：重置所有up
        for (var j=0; j<navUps.length; j++ ){
            navUps[j].style.width = ''
        }
        //第二步：给当前点击的高亮,给三角重新定位
        navUps[index].style.width = '100%';
        //第三步：重置所有侧边导航的li，去除高亮
        for (var i=0; i<menuLis.length; i++ ){
            menuLis[i].className = '';
        }
        //给滚动到当前的侧边栏li，加高亮
        this.className = 'active'
        arrow.style.left = navLis[index].getBoundingClientRect().left + navLis[index].offsetWidth/2 + 'px';
        contentList.style.top = -(index)*(document.documentElement.clientHeight - header.offsetHeight) + 'px';
    }

    //主体逻辑
    contentBind()
    function contentBind() {
        //给主体content区域设置高度
        content.style.height = document.documentElement.clientHeight - header.offsetHeight + 'px';
        //给content里每一li（每一屏）设置高度
        for (var i=0; i<contentLis.length; i++ ){
            contentLis[i].style.height = document.documentElement.clientHeight - header.offsetHeight + 'px';
        }
    }

    //响应鼠标滚轮
    document.onmousewheel = function (event) {
        clearTimeout(timeId)
        timeId = setTimeout(function () {
            scrollMove(event)
        },200)
    };
    if(document.addEventListener){
        document.addEventListener('DOMMouseScroll',function (event) {
            clearTimeout(timeId)
            timeId = setTimeout(function () {
                scrollMove(event)
            },200)
        });
    }
    function scrollMove(event) {
        event = event || window.event;
        var flag = '';
        if(event.wheelDelta){
            //ie/chrome
            if(event.wheelDelta > 0){
                //上
                flag = 'up';
            }else {
                //下
                flag = 'down'
            }
        }else if(event.detail){
            //firefox
            if(event.detail < 0){
                //上
                flag = 'up';
            }else {
                //下
                flag = 'down'
            }
        }

        switch (flag){
            case 'up':
                //上一屏
                if(index>0){
                    animationArr[index].outAnimation();
                    index--
                    animationArr[index].inAnimation();
                    contentMove(index)
                    menuLis[index].className = 'active'
                }
                break;
            case 'down':
                //下一屏
                if(index<contentLis.length-1){
                    animationArr[index].outAnimation();
                    index++
                    animationArr[index].inAnimation();
                    contentMove(index)
                    menuLis[index].className = 'active'
                }
                break;
        }

        //取消默认行为
        event.preventDefault && event.preventDefault();
        return false;
    }

    //小圆点点击切换
    home3D()
    function home3D() {
        for (var i=0; i<homeNavLis.length; i++ ){
            var item = homeNavLis[i];
            item.index = i;
            //给每一个小圆点加点击事件
            item.onclick = function () {
                clearTimeout(rollTimeId)
                //重置所有小圆点---都不高亮
                for (var j=0; j<homeNavLis.length; j++ ){
                    homeNavLis[j].className = '';
                }
                this.className = 'active';

                //判断当前点击的，相对于之前的，是下一张，还是上一张
                if(oldIndex<this.index){
                    homeItems[oldIndex].className = 'leftHide homeItem';
                    homeItems[this.index].className = 'rightShow homeItem';
                }
                else if(oldIndex>this.index){
                    homeItems[oldIndex].className = 'rightHide homeItem';
                    homeItems[this.index].className = 'leftShow homeItem';
                }
                oldIndex = this.index;
                rollAnimation()
            }
        }
    }

    //自动轮播
    //rollAnimation()
    function rollAnimation() {
        rollTimeId = setInterval(function () {
            //让每一屏切换，左侧隐藏，右侧显示
            homeItems[oldIndex].className = 'homeItem leftHide';
            homeItems[oldIndex+1>3?0:oldIndex+1].className = 'homeItem rightShow';
            //小圆点自动切换
            //1.重置小圆点的样式
            for (var i=0; i<homeNavLis.length; i++ ){
                homeNavLis[i].className = ''
            }
            //2.给当前切换到的这一屏，所对应的小圆点，加上active
            homeNavLis[oldIndex+1>3?0:oldIndex+1].className = 'active';

            if(oldIndex<homeItems.length-1){
                oldIndex++
            }else{
                oldIndex=0;
            }
        },3000)
    }

    //第五屏逻辑
    teamAnimation()
    function teamAnimation() {
        team3.onmouseleave = function () {
            //当鼠标移除team3盒子的时候，重置所有老师图层
            for (var i=0; i<team3Items.length; i++ ){
                team3Items[i].style.opacity = '0.5'
            }
            myCanvas.remove();
            myCanvas = null;
            clearInterval(time1)
            clearInterval(time2)
        }

        //给每一个team3Item加鼠标移入事件
        for (var i=0; i<team3Items.length; i++ ){
            var item = team3Items[i];
            item.onmouseenter = function () {
                //重置所有图层为半透明
                for (var j=0; j<team3Items.length; j++ ){
                    team3Items[j].style.opacity = '0.5'
                }
                //当前的完全显示
                this.style.opacity = '1'

                //创建canvas
                if(!myCanvas){
                    myCanvas = document.createElement('canvas');
                    myCanvas.width = team3Items[0].offsetWidth;
                    myCanvas.height = team3Items[0].offsetHeight;
                    team3.appendChild(myCanvas);
                    addCanvas()
                }
                myCanvas.style.left = this.offsetLeft + 'px';
            }
        }

        //增加canvas层（气泡效果）
        function addCanvas() {
            var painting = myCanvas.getContext('2d');
            var arr = []
            //每隔一定时间打点（绘制圆在画布上）
            time1 = setInterval(function () {
                //清空画布
                painting.clearRect(0,0,myCanvas.width,myCanvas.height);

                //重新加工圆的信息
                for (var j=0; j<arr.length; j++ ){
                    if(arr[j].y<0){
                        arr.splice(j,1);
                    }
                    //气泡运动轨迹
                    arr[j].deg++;
                    arr[j].x = arr[j].startX + (Math.sin(arr[j].deg*Math.PI/180))*arr[j].scale*2;
                    arr[j].y = arr[j].startY - (arr[j].deg*Math.PI/180)*arr[j].scale*1.5;
                }

                //循环拿到每一个圆，输出。
                for (var i=0; i<arr.length; i++ ){
                    painting.beginPath();
                    painting.arc(arr[i].x,arr[i].y,arr[i].r,0,2*Math.PI);
                    painting.fillStyle = 'rgba('+arr[i].red+','+arr[i].green+','+arr[i].blue+','+arr[i].a+')';
                    painting.fill();
                }
            },10)


            //制造圆的工厂，每隔一定时间向arr中增加一个圆
            time2 = setInterval(function () {
                var obj = {};
                obj.r = Math.random()*8 + 2;
                obj.x = Math.floor(Math.random()*myCanvas.width);
                obj.y = myCanvas.height + obj.r;
                obj.red = Math.random()*255;
                obj.green = Math.random()*255;
                obj.blue = Math.random()*255;
                obj.a = 1;

                //做曲线运动需要的属性
                obj.deg = 0;
                obj.startX = obj.x
                obj.startY = obj.y
                obj.scale = Math.random()*30 + 30
                arr.push(obj)
            },50)
        }
    }

    //侧边栏导航逻辑
    for (var j=0; j<menuLis.length; j++ ){
        var item = menuLis[j];
        item.index = j
        //给每一个li加点击事件
        item.onclick = function () {
            animationArr[index].outAnimation();
            index = this.index
            animationArr[this.index].inAnimation();
            contentMove(this.index)
            this.className = 'active'
        }
    }

    //音乐加点击事件
    music.onclick = function () {
        if(myAudio.paused){
            myAudio.play();
            music.style.backgroundImage = 'url("./img/musicon.gif")'
        }else{
            myAudio.pause();
            music.style.backgroundImage = 'url("./img/musicoff.gif")'
        }
    }

    //出入场动画数组
    var animationArr = [
        {
            //第一屏入场动画
            inAnimation:function () {
                var homeList = document.querySelector('#content .contentList .homeList');
                var homeIcons = document.querySelector('#content .contentList .homeIcons');

                homeList.style.transform = 'translate(0,0)';
                homeIcons.style.transform = 'translate(0,0)';
                homeList.style.opacity = '1';
                homeIcons.style.opacity = '1';
            },
            //第一屏出场动画
            outAnimation:function () {
                var homeList = document.querySelector('#content .contentList .homeList');
                var homeIcons = document.querySelector('#content .contentList .homeIcons');

                homeList.style.transform = 'translate(0,-200px)';
                homeIcons.style.transform = 'translate(0,200px)';
                homeList.style.opacity = '0';
                homeIcons.style.opacity = '0';
            }
        },
        {
            //第二屏入场动画
            inAnimation:function () {
                var plane1 = document.querySelector('#content .contentList .course .plane1');
                var plane2 = document.querySelector('#content .contentList .course .plane2');
                var plane3 = document.querySelector('#content .contentList .course .plane3');

                plane1.style.transform = 'translate(0,0)';
                plane2.style.transform = 'translate(0,0)';
                plane3.style.transform = 'translate(0,0)';
            },
            //第二屏出场动画
            outAnimation:function () {
                var plane1 = document.querySelector('#content .contentList .course .plane1');
                var plane2 = document.querySelector('#content .contentList .course .plane2');
                var plane3 = document.querySelector('#content .contentList .course .plane3');

                plane1.style.transform = 'translate(-200px,-200px)';
                plane2.style.transform = 'translate(-200px,200px)';
                plane3.style.transform = 'translate(200px,-200px)';
            }
        },
        {
            //第三屏入场动画
            inAnimation:function () {
                var pencel1 = document.querySelector('#content .contentList .works .pencel1');
                var pencel2 = document.querySelector('#content .contentList .works .pencel2');
                var pencel3 = document.querySelector('#content .contentList .works .pencel3');

                pencel1.style.transform = 'translate(0,0)';
                pencel2.style.transform = 'translate(0,0)';
                pencel3.style.transform = 'translate(0,0)';
            },
            //第三屏出场动画
            outAnimation:function () {
                var pencel1 = document.querySelector('#content .contentList .works .pencel1');
                var pencel2 = document.querySelector('#content .contentList .works .pencel2');
                var pencel3 = document.querySelector('#content .contentList .works .pencel3');

                pencel1.style.transform = 'translate(0,-200px)';
                pencel2.style.transform = 'translate(0,200px)';
                pencel3.style.transform = 'translate(200px,200px)';
            }
        },
        {
            //第四屏入场动画
            inAnimation:function () {
                var team3Items = document.querySelectorAll('#content .contentList .about .about3 .about3Item');
                var team3Item1 = team3Items[0];
                var team3Item2 = team3Items[1];

                team3Item1.style.transform = 'rotate(0)';
                team3Item2.style.transform = 'rotate(0)';
            },
            //第四屏出场动画
            outAnimation:function () {
                var team3Items = document.querySelectorAll('#content .contentList .about .about3 .about3Item');
                var team3Item1 = team3Items[0];
                var team3Item2 = team3Items[1];

                team3Item1.style.transform = 'rotate(30deg)';
                team3Item2.style.transform = 'rotate(-30deg)';
            }
        },
        {
            //第五屏入场动画
            inAnimation:function () {
                var team1 = document.querySelector('#content .contentList .team .team1');
                var team2 = document.querySelector('#content .contentList .team .team2');

                team1.style.transform = 'translate(0,0)';
                team2.style.transform = 'translate(0,0)';
            },
            //第五屏出场动画
            outAnimation:function () {
                var team1 = document.querySelector('#content .contentList .team .team1');
                var team2 = document.querySelector('#content .contentList .team .team2');

                team1.style.transform = 'translate(-200px,0)';
                team2.style.transform = 'translate(200px,0)';
            }
        }
    ];

    for (var i=0; i<animationArr.length; i++ ){
        animationArr[i].outAnimation()
    }

    //开机动画
    var imgArr = ['bg1.jpg','bg2.jpg','bg3.jpg','bg4.jpg','bg5.jpg','about1.jpg','about2.jpg','about3.jpg','about4.jpg','worksimg1.jpg','worksimg2.jpg','worksimg3.jpg','worksimg4.jpg','team.png','greenLine.png'];
    var loaded = 0;
    for (var i=0; i<imgArr.length; i++ ){
        var myImg = new Image();
        myImg.src = './img/'+imgArr[i];
        myImg.onload = function () {
            loaded++
            maskLine.style.width = (loaded/imgArr.length)*100 + '%';
        }
    }

    maskLine.addEventListener('transitionend',function () {
        maskDown.style.height = 0;
        maskUp.style.height = 0;
        maskLine.remove();
        //第一屏入场
        animationArr[0].inAnimation();
        //开启启动轮播
        rollAnimation();
    })

    maskUp.addEventListener('transitionend',function () {
        startMask.remove()
    })




})