<template>
  <div class="lb-box" id="lb-1"
       v-on:touchstart="touchScreen"
       v-on:touchend="touchScreen">
    <div class="lb-content">
      <div v-for="lbItem in lbItems"
           v-bind:key="lbItem.id" 
           class="lb-item" v-bind:class="lbItem.className">
        <a href="#">
          <img :src=lbItem.imgSrc alt="picture loss" />
          <span>{{ lbItem.desc }}</span>
        </a>
      </div>
    </div>
    <ol class="lb-sign">
      <li v-for="lbSign in lbSigns" 
          v-bind:key="lbSign.id" 
          v-bind:slide-to="lbSign.index"
          v-bind:class="lbSign.className"
          v-on:click="clickSign">
        {{ lbSign.index + 1 }}
      </li>
    </ol>
    <div class="lb-ctrl left"  v-on:click="clickCtrl('left')">＜</div>
    <div class="lb-ctrl right" v-on:click="clickCtrl('right')">＞</div>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      // 当前图片索引
      curIndex: 0,
      // 轮播盒内图片数量
      numItems: 5,

      // 是否可以滑动
      status: true,

      // 轮播速度
      speed: 600,
      // 等待延时
      delay: 3000,

      // 轮播方向
      direction: 'left',

      // 是否监听键盘事件
      moniterKeyEvent: true,
      // 是否监听屏幕滑动事件
      moniterTouchEvent: true,

      lbItems: [
        {
          imgSrc: require("@/assets/images/pic1.jpg"),
          desc: "这里是描述文字",
          className: { active: true }
        },
        {
          imgSrc: require("@/assets/images/pic2.jpg"),
          desc: "这里是描述文字",
          className: {}
        },
        {
          imgSrc: require("@/assets/images/pic3.jpg"),
          desc: "这里是描述文字",
          className: {}
        },
        {
          imgSrc: require("@/assets/images/pic4.jpg"),
          desc: "这里是描述文字",
          className: {}
        },
        {
          imgSrc: require("@/assets/images/pic5.jpg"),
          desc: "这里是描述文字",
          className: {}
        }
      ],
      lbSigns: [
        {
          index: 0,
          className: {active: true}
        },
        {
          index: 1,
          className: {active: false}
        },
        {
          index: 2,
          className: {active: false}
        },
        {
          index: 3,
          className: {active: false}
        },
        {
          index: 4,
          className: {active: false}
        }
      ]
    };
  },

  mounted: function() {
    if (this.moniterKeyEvent) {
      window.addEventListener('keydown', this.keyDown.bind(this));
    }
    this.start();
  },

  methods: {
    // 开始轮播
    start: function() {
      const clickCtrl = this.clickCtrl.bind(this);
      // 每隔一段时间模拟点击控件
      const ctrlDirection = this.direction == 'left' ? 'right' : 'left';
      this.interval = setInterval(clickCtrl, this.delay, ctrlDirection);
    },

    // 暂停轮播
    pause: function() {
      clearInterval(this.interval);
    },

    /**
     * 处理点击控件事件
     * @param {string} ctrlDirection 控件方向
     */
    clickCtrl: function(ctrlDirection) {
      if (!this.status) return;
      this.status = false;
      const fromIndex = this.curIndex;
      const toIndex = ctrlDirection == 'right' ?
                      (this.curIndex + 1) % this.numItems :
                      (this.curIndex + this.numItems - 1) % this.numItems;
      const direction = ctrlDirection == 'right' ? 'left' : 'right';
      this.slide(fromIndex, toIndex, direction);
      this.curIndex = toIndex;
    },

    // 处理点击标志事件
    clickSign: function(event) {
      if (!this.status) return;
      this.status = false;
      const fromIndex = this.curIndex;
      const toIndex = parseInt(event.srcElement.getAttribute("slide-to"));
      const direction = fromIndex < toIndex ? "left" : "right";
      this.slide(fromIndex, toIndex, direction);
      this.curIndex = toIndex;
    },

    // 处理滑动屏幕事件
    touchScreen: function(event) {
      if (!this.moniterTouchEvent) return ;
      if (event.type == "touchstart") {
        this.startX = event.touches[0].pageX;
        this.startY = event.touches[0].pageY;
      } else {
        // touchend
        this.endX = event.changedTouches[0].pageX;
        this.endY = event.changedTouches[0].pageY;

        // 计算滑动方向的角度
        const dx = this.endX - this.startX;
        const dy = this.startY - this.endY;
        const angle = Math.abs((Math.atan2(dy, dx) * 180) / Math.PI);

        // 滑动距离太短
        if (Math.abs(dx) < 10) return;

        if (angle >= 0 && angle <= 45) {
          // 向右侧滑动屏幕，模拟点击左控件
          this.clickCtrl('right');
        } else if (angle >= 135 && angle <= 180) {
          // 向左侧滑动屏幕，模拟点击右控件
          this.clickCtrl('left');
        }
      }
    },

    // 处理键盘按下事件
    keyDown: function(event) {
      console.log(event);
      if (this.moniterKeyEvent) return ;
      if (event && event.keyCode == 37) {
        this.clickCtrl('left');
      } else if (event && event.keyCode == 39) {
        this.clickCtrl('right');
      }
    },

    /**
     * 滑动图片
     * @param {number} fromIndex
     * @param {number} toIndex
     * @param {string} direction
     */
    slide: function(fromIndex, toIndex, direction) {
      if (direction == "left") {
        this.lbItems[toIndex].className = {next: true};
        var fromClass = {active:true, left: true},
            toClass = {next:true, left:true};
      } else {
        this.lbItems[toIndex].className = {prev:true};
        var fromClass = {active:true, right:true},
          toClass = {prev:true, right:true};
      }
      this.lbSigns[fromIndex].className.active = false;
      this.lbSigns[toIndex].className.active = true;

      setTimeout((() => {
          this.lbItems[fromIndex].className = fromClass;
          this.lbItems[toIndex].className = toClass;
      }).bind(this),50);

      setTimeout((() => {
          this.lbItems[fromIndex].className = {};
          this.lbItems[toIndex].className = {active:true};
          this.status = true; // 设置为可以滑动
      }).bind(this), this.speed + 50);
    }
  }
};
</script>

<style scoped>
.lb-box {
  width: 1170px;
  height: 375px;
  margin: 25px auto;
  position: relative;
  overflow: hidden;
  
}

@media (max-width: 568px) {
  .lb-box {
    width: 86%;
    height: 220px;
  }
}

.lb-content {
  width: 100%;
  height: 100%;
}

.lb-item {
  width: 100%;
  height: 100%;
  display: none;
  position: relative;
  transition-property: left;
  transition-timing-function: ease-in-out;
  transition-duration: 600ms;
}

.lb-item > a {
  width: 100%;
  height: 100%;
  display: block;
}

.lb-item > a > img {
  width: 100%;
  height: 100%;
}

.lb-item > a > span {
  width: 100%;
  display: block;
  position: absolute;
  bottom: 0px;
  padding: 15px;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.7);
}
@media (max-width: 568px) {
  .lb-item > a > span {
    padding: 10px;
  }
}

.lb-item.active {
  display: block;
  left: 0%;
}
.lb-item.active.left {
  left: -100%;
}
.lb-item.active.right {
  left: 100%;
}

/*  */
.lb-item.next,
.lb-item.prev {
  display: block;
  position: absolute;
  top: 0px;
}
.lb-item.next {
  left: 100%;
}
.lb-item.prev {
  left: -100%;
}
.lb-item.next.left,
.lb-item.prev.right {
  left: 0%;
}

.lb-sign {
  position: absolute;
  right: 10px;
  top: 0px;
  padding: 5px 3px;
  
  border-radius: 6px;
  list-style: none;
  user-select: none;
  background-color: rgba(0, 0, 0, 0.7);
}

.lb-sign li {
  width: 22px;
  height: 20px;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  text-align: center;
  float: left;
  color: #aaa;
  margin: auto 4px;
  border-radius: 3px;
  cursor: pointer;
}
.lb-sign li:hover {
  color: #fff;
}
.lb-sign li.active {
  color: #000;
  background-color: #ebebeb;
}

.lb-ctrl {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 50px;
  font-weight: 900;
  user-select: none;
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.1s linear;
}
@media (max-width: 568px) {
  .lb-ctrl {
    font-size: 30px;
  }
}
.lb-ctrl.left {
  left: -50px;
}
.lb-ctrl.right {
  right: -50px;
}
.lb-box:hover .lb-ctrl.left {
  left: 10px;
}
.lb-box:hover .lb-ctrl.right {
  right: 10px;
}
.lb-ctrl:hover {
  background-color: #000;
}
</style>
