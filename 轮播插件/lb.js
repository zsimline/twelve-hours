/**
 * @desc 一个轮播插件 
 * @author 梦醒时夜续 (zsimline@163.com)
 * @version 1.0.0
 */

class Lb {
  constructor(options) {
    this.lbBox = document.getElementById(options.id);
    this.lbItems = this.lbBox.querySelectorAll('.lb-item');
    this.lbSigns = this.lbBox.querySelectorAll('.lb-sign li');
    this.lbCtrlL = this.lbBox.querySelectorAll('.lb-ctrl')[0];
    this.lbCtrlR = this.lbBox.querySelectorAll('.lb-ctrl')[1];
    
    // 当前图片索引
    this.curIndex = 0;
    // 轮播盒内图片数量
    this.numItems = this.lbItems.length;

    // 是否可以滑动
    this.status = true;

    // 轮播速度
    this.speed = options.speed || 600;
    // 等待延时
    this.delay = options.delay || 3000;

    // 轮播方向
    this.direction = options.direction || 'left';

    this.handleEvents();
    this.addStyleRule();
  }

  // 开始轮播
  start() {
    const event = {
      srcElement: this.direction == 'left' ? this.lbCtrlR : this.lbCtrlL
    };
    const clickCtrl = this.clickCtrl.bind(this);
    
    // 每隔一段时间模拟点击控件
    this.interval = setInterval(clickCtrl, this.delay, event);
  }

  // 暂停轮播
  pause() {
    clearInterval(this.interval);
  }

  // 点击控件
  clickCtrl(event) {
    if (!this.status) return ;
    this.status = false;
    if (event.srcElement == this.lbCtrlR) {
      var fromIndex = this.curIndex,
          toIndex = (this.curIndex + 1) % this.numItems,
          direction = 'left';
    } else {
      var fromIndex = this.curIndex;
          toIndex = (this.curIndex + this.numItems - 1) % this.numItems,
          direction = 'right';
    }
    this.slide(fromIndex, toIndex, direction);
    this.curIndex = toIndex;
  }

  // 增加轮播图片的过渡属性
  addStyleRule() {
    const styleElement = document.createElement('style');
    document.head.appendChild(styleElement);
    const styleRule = `.lb-item {transition: left ${this.speed}ms ease-in-out}`
    styleElement.sheet.insertRule(styleRule, 0);
  }

  // 点击标志
  clickSign(event) {
    if (!this.status) return ;
    this.status = false;
    const fromIndex = this.curIndex;
    const toIndex = parseInt(event.srcElement.getAttribute('slide-to'));
    const direction = fromIndex < toIndex ? 'left' : 'right';
    this.slide(fromIndex, toIndex, direction);
    this.curIndex = toIndex;
  }

  // 处理鼠标事件
  handleEvents() {
    // 鼠标移动到轮播盒上时继续轮播
    this.lbBox.addEventListener('mouseleave', this.start.bind(this));
    // 鼠标从轮播盒上移开时暂停轮播
    this.lbBox.addEventListener('mouseover', this.pause.bind(this));
    
    // 点击左侧控件向右滑动图片
    this.lbCtrlL.addEventListener('click', this.clickCtrl.bind(this));
    // 点击右侧控件向左滑动图片
    this.lbCtrlR.addEventListener('click', this.clickCtrl.bind(this));

    // 点击轮播标志后滑动到对应的图片
    for (let i = 0; i < this.lbSigns.length; i++) {
      this.lbSigns[i].setAttribute('slide-to', i);
      this.lbSigns[i].addEventListener('click', this.clickSign.bind(this));
    }
  }

  /**
   * 滑动图片
   * @param {number} fromIndex
   * @param {number} toIndex 
   * @param {string} direction
   */
  slide(fromIndex, toIndex, direction) {
    if (direction == 'left') {
      this.lbItems[toIndex].className = "lb-item next";
      var fromClass = 'lb-item active left',
          toClass = 'lb-item next left';
    } else {
      this.lbItems[toIndex].className = "lb-item prev";
      var fromClass = 'lb-item active right',
          toClass = 'lb-item prev right';
    }
    this.lbSigns[fromIndex].className = "";
    this.lbSigns[toIndex].className = "active";
  
    setTimeout((() => {
      this.lbItems[fromIndex].className = fromClass;
      this.lbItems[toIndex].className = toClass;
    }).bind(this), 0);
  
    setTimeout((() => {
      this.lbItems[fromIndex].className = 'lb-item';
      this.lbItems[toIndex].className = 'lb-item active';
    }).bind(this), this.speed);
    
    // 设置为可滑动
    setTimeout((() => {
      this.status = true;
    }).bind(this), this.speed + 50);
  }
}

window.onload = function() {
  // 轮播选项
  const options = {
    id: 'lb-1',
    speed: 600,
    delay: 3000,
    direction: 'left'
  }

  const lb = new Lb(options);
  lb.start();
}
