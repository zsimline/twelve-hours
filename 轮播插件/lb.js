class Lb {
  constructor(options) {
    this.lbContainer = document.getElementById(options.id);
    this.lbItems = this.lbContainer.querySelectorAll('.lb-item');

    // 当前图片索引
    this.curIndex = 0;
    // 轮播盒内图片数量
    this.numItems = this.lbItems.length;
    
    // 轮播速度
    this.speed = options.speed || 3000;
    
    // 轮播方向
    this.direction = options.direction || 'left';

    this.handleEvents();
  }

  start() {
    const slide = this.slide.bind(this);
    this.interval = setInterval(slide, this.speed);
  }

  pause() {
    clearInterval(this.interval);
  }

  // 处理鼠标事件
  handleEvents() {
    // 鼠标移动到轮播盒上时暂停轮播
    this.lbContainer.addEventListener('mouseleave', this.start.bind(this));
    // 鼠标从轮播盒上移开时继续轮播
    this.lbContainer.addEventListener('mouseover', this.pause.bind(this));
  }

  // 完成图片滑动
  slide() {
    const fromIndex = this.curIndex;
    const toIndex = (this.curIndex + 1) % this.numItems;

    if (this.direction == 'left') {
      this.lbItems[toIndex].className = "lb-item next";
      var formClass = 'lb-item active left'
          toClass = 'lb-item next left';
    } else if (this.direction == 'right') {
      this.lbItems[toIndex].className = "lb-item prev";
      var formClass = 'lb-item active right',
          toClass = 'lb-item prev right';
    }
    
    setTimeout((() => {
      this.lbItems[fromIndex].className = formClass;
      this.lbItems[toIndex].className = toClass;
    }).bind(this), 0);
  
    setTimeout((() => {
      this.lbItems[fromIndex].className = 'lb-item';
      this.lbItems[toIndex].className = 'lb-item active';
    }).bind(this), 600);
    
    this.curIndex = toIndex;
  }
}

window.onload = function() {
  // 轮播选项
  const options = {
    id: 'lb-1',
    speed: 3000,
    direction: 'left'
  }

  const lb = new Lb(options);
  lb.start();
}
