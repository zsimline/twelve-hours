该插件使用ES6编写，使用时请引入 `lb.js` 与 `lb.css`, 如果你的浏览器不支持ES6, 可以引入 `lb.babel.js` 或 `lb.min.js`.

首先你需要在你的JS中定义一个 `options` （选项），选项中定义了轮播组件的相关属性，之后实例化一个Lb（轮播组件类）对象，同时将 `options` 传递给构造函数，再启动轮播就可以了。

```javascript
// 轮播选项
const options = {
  id: 'lb-1',               // 轮播盒ID
  speed: 600,               // 轮播速度(ms)
  delay: 3000,              // 轮播延迟(ms)
  direction: 'left',        // 图片滑动方向
  moniterKeyEvent: true,    // 是否监听键盘事件
  moniterTouchEvent: true   // 是否监听屏幕滑动事件
}
// 实例化轮播组件类
const lb = new Lb(options);
// 启动轮播
lb.start();
```

非常欢迎你对该插件进行修改或增强，使用过程中遇到任何问题请致信作者邮箱 zsimline@163.com
