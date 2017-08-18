/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  PanResponder,
  Animated,
  Easing,
  Dimensions,
  Image,
  TouchableOpacity
} from 'react-native';

const ScreenWidth = Dimensions.get('window').width; //屏幕宽度
const ScreenHeight = Dimensions.get('window').height; //屏幕宽度

let isSlide = false; //是否滑动
let pressTime = 0; //触摸时间
let longPress = false; //长按事件
let touchBegin = false; //触摸开始
let clickNum = 0; //点击次数

let MaxW = 0;
let MaxH = 0;

// const IMG = 'http://www.qq1234.org/uploads/allimg/150720/11_150720172010_11.jpg';
// const IMG = 'https://facebook.github.io/react/img/logo_og.png';
const IMG = 'http://h.hiphotos.baidu.com/zhidao/pic/item/6d81800a19d8bc3ed69473cb848ba61ea8d34516.jpg';

export default class PanView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bg: 'white',
      top: 0,
      left: 0,
      viewHeight: 0,
      viewWidth: ScreenWidth,
    };
  }
  componentWillMount() {
    Image.getSize(
      this.props.imgUrl[0].uri,
      (width, height) => {
        MaxW = width;
        MaxH = height;
        const vh = (height*ScreenWidth)/width;
        const top = (ScreenHeight - vh - 20) / 2;
        this.setState({
          viewHeight: vh,
          top: top,
        });
      },
      (error) => {}
    );
    this._panResponder = PanResponder.create({
      // 要求成为响应者：
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gs) => {

        this.interval && clearInterval(this.interval);
        this._x = gs.x0;
        this._y = gs.y0;
        console.log(this._x+",   "+this._y);
        this._offsetX = 0;
        this._offsetY = 0;
        this._touches = [{x:0,y:0},{x:0,y:0}];
        this.setState({bg: 'red'});
        touchBegin = true;
        pressTime = new Date();
        if(clickNum == 0 && !isSlide) {
        this._longPressTimeout = setTimeout(
          () => {
            if(touchBegin && !isSlide) {
              alert('长按');
              longPress = true;
              clickNum = 0;
            }
          },
          1200
        );
        }

      },
      onPanResponderMove: (evt, gs) => {
        console.log(gs.numberActiveTouches+"点触摸移动");
        if(gs.numberActiveTouches >= 2) {
          this.isScale = true;
          if(!longPress) {
            this._longPressTimeout && clearTimeout(this._longPressTimeout);
            if(this._touches[0].x <= 0) {
              this._touches[0].x = evt.nativeEvent.changedTouches[0].pageX;
              this._touches[0].y = evt.nativeEvent.changedTouches[0].pageY;
              this._touches[1].x = evt.nativeEvent.changedTouches[1].pageX;
              this._touches[1].y = evt.nativeEvent.changedTouches[1].pageY;
              this._offsetXY = {};
              this._offsetXY.x = (evt.nativeEvent.changedTouches[1].pageX + evt.nativeEvent.changedTouches[0].pageX)/2;
              this._offsetXY.y = (evt.nativeEvent.changedTouches[1].pageY + evt.nativeEvent.changedTouches[0].pageY)/2;
            }else {
              //计算上次两点距离

              const distanceX = Math.abs(this._touches[1].x - this._touches[0].x);
              const distanceY = Math.abs(this._touches[1].y - this._touches[0].y);
              this._distance = Math.sqrt(distanceX*distanceX + distanceY*distanceY);
              //计算本次两点距离
              const distanceX2 = Math.abs(evt.nativeEvent.changedTouches[1].pageX - evt.nativeEvent.changedTouches[0].pageX);
              const distanceY2 = Math.abs(evt.nativeEvent.changedTouches[1].pageY - evt.nativeEvent.changedTouches[0].pageY);
              this._distance2 = Math.sqrt(distanceX2*distanceX2 + distanceY2*distanceY2);
              //缩放两点中心的偏移量
              const offsetXY2 = {};
              offsetXY2.x = (evt.nativeEvent.changedTouches[1].pageX + evt.nativeEvent.changedTouches[0].pageX)/2;
              offsetXY2.y = (evt.nativeEvent.changedTouches[1].pageY + evt.nativeEvent.changedTouches[0].pageY)/2;

              this._touches[0].x = evt.nativeEvent.changedTouches[0].pageX;
              this._touches[0].y = evt.nativeEvent.changedTouches[0].pageY;
              this._touches[1].x = evt.nativeEvent.changedTouches[1].pageX;
              this._touches[1].y = evt.nativeEvent.changedTouches[1].pageY;

              const sw = this.state.viewWidth+((this._distance2-this._distance));
              const sh = this.state.viewHeight*sw/this.state.viewWidth;
              console.log(this._distance2-this._distance);
              this._scale(2,sw,sh,0,0);
              this._clickTimeout && clearTimeout(this._clickTimeout);
              clickNum = 0;
            }
          }

        }else if(!this.isScale){
        if((Math.abs(gs.dx)>5 || Math.abs(gs.dy)>5) && !longPress && !this.isScale) {
          isSlide = true;
          this._clickTimeout && clearTimeout(this._clickTimeout);
          this._longPressTimeout && clearTimeout(this._longPressTimeout);
        }
        if(!longPress) {
        let dy = gs.dy - this._offsetY;
        let dx = gs.dx - this._offsetX;
        this._offsetX = gs.dx;
        this._offsetY = gs.dy;

        if(dy > 0) {
          if(this.state.top <= 0 && this.state.top + dy > 0) {
            this.setState({top: 0,});
            dy = 0;
          }else if(this.state.top > 0){
            dy = 0;
          }
        }else {
          if(this.state.viewHeight <= ScreenHeight - this.state.top) {
            dy = 0;
          }
        }
        this.setState({
          top: this.state.top + dy,
          left: this.state.left + dx,
        });
      }
    }
      },
      onPanResponderRelease: (evt, gs) => {
        if(this.isScale) {
          this.isScale = false;
        }
        clickNum++;
        if(!isSlide && !longPress) {
          if(clickNum == 1) {
            this._clickTimeout = setTimeout(
              () => {
                if(clickNum > 1) {
                  // alert('双击');
                  // this._scale(this._x - ScreenWidth / 2, this._y - (ScreenHeight - 20) / 2);
                }else if(clickNum == 1 && !touchBegin){
                  // alert('单击');
                }
                clickNum = 0;
              },
              200
            );
          }else if(clickNum == 2){
            // alert('双击'+gs.x0);
            this._scale(1, 0, 0, this._x - ScreenWidth / 2, this._y - (ScreenHeight - 20) / 2);
            this._clickTimeout && clearTimeout(this._clickTimeout);
            this._longPressTimeout && clearTimeout(this._longPressTimeout);
            clickNum = 0;
          }
        }else {
          isSlide = false;
          longPress = false;
          clickNum = 0;
          // this._longPressTimeout && clearTimeout(this._longPressTimeout);
          // this._clickTimeout && clearTimeout(this._clickTimeout);
        }
        touchBegin = false;
        this.setState({
          bg: 'white',
        });
        this._resetPositionAnimated();
      }
    });
  }
  //回归原位动画
  _resetPositionAnimated() {
    //let vy = this.state.top / (800/60);

    let vx = 0;
    if(this.state.left < 0) {
      //向右
      if(ScreenWidth - this.state.left - this.state.viewWidth < 0)
        return;
      vx = -(ScreenWidth - this.state.left - this.state.viewWidth) / 8;
    }else {
      vx = this.state.left / 8;
    }
    console.log(this.state.left+', '+vx);
    let i = 1;
    let time1 = new Date();
    this.interval = setInterval(()=>{
      // alert(i+','+(new Date()-time1));
      i++;
      if(vx >= 0) {
        if(Math.abs(this.state.left) <= Math.abs(vx)) {
          //vy = this.state.top;
          vx = this.state.left;
          this.interval && clearInterval(this.interval);
        }
      }else {
        if(Math.abs(ScreenWidth - this.state.left - this.state.viewWidth)<=Math.abs(vx)) {
          vx = -(ScreenWidth - this.state.left - this.state.viewWidth);
          this.interval && clearInterval(this.interval);
        }
      }
      this.setState({
        //top: this.state.top - vy,
        left: this.state.left - vx,
      });
      // alert(this.state.left+',  '+(new Date()-time1));
    }, 10);
  }
  //双击缩放动画
  /**
  sw: 缩放后宽度
  sh: 缩放后高度
  pt: 缩放后top
  pl: 缩放后left
  */
  _scaleAnimated(sw, sh, pt, pl,time) {

    let vw = (sw - this.state.viewWidth)/ (time/60.0);
    let vh = (sh - this.state.viewHeight) / (time/60.0);
    let vt = (pt - this.state.top) / (time/60.0);
    let vl = (pl - this.state.left) / (time/60.0);

    // let time = 0.0;
    let ss =sw+', '+sh+', '+pt+', '+pl;
    this.interval2 = setInterval(()=>{
      // time = time + (time/60.0);
      if(Math.abs(this.state.viewWidth - sw) < Math.abs(vw)) {
        vw = sw - this.state.viewWidth;
        vh = sh - this.state.viewHeight;
        vt = pt - this.state.top;
        vl = pl - this.state.left;
        this.interval2 && clearInterval(this.interval2);
      }
      // if(time >= 400.0) {
      //   this.interval2 && clearInterval(this.interval2);
      // }
      console.log(vw+', '+vh+', '+vt+', '+vl);
      this.setState({
        viewWidth: this.state.viewWidth + vw,
        viewHeight: this.state.viewHeight + vh,
        top: this.state.top + vt,
        left: this.state.left + vl,
      });
      // alert(this.state.viewWidth+', '+this.state.viewHeight+', '+this.state.top+', '+this.state.left+'==='+ss);
    }, 10);
  }
  _scale(type, w, h, offsetX, offsetY) {
    if (type === 1) {
      let sw = this.state.viewWidth;
      let sh = this.state.viewHeight;
      let pt = 0;
      let pl = 0;
      let offsetH = 0;
      let offsetW = 0;
      if(this.state.viewWidth <= ScreenWidth) {
        if(this.state.viewWidth < MaxW) {
          sw = MaxW;
          sh = MaxH;
          offsetH = offsetY*MaxH/this.state.viewHeight;
          offsetW = offsetX*MaxW/this.state.viewWidth;
          pt = (ScreenHeight - sh - 20) / 2 - offsetH;
          pl = (ScreenWidth - sw) / 2 - offsetW;

          if(MaxH < ScreenHeight) {
            pt = (ScreenHeight - sh - 20) / 2;
          }else {
            if(pt > 0) {
              pt = 0;
            }else if(ScreenHeight - pt > sh) {
              pt =ScreenHeight - sh;
            }
          }

          if(pl > 0) {
            pl = 0;
          }else if(ScreenWidth - pl > sw) {
            pl =ScreenWidth - sw;
          }
        }
      }else {
        sw = ScreenWidth;
        sh = (MaxH*ScreenWidth)/MaxW;
        pt = (ScreenHeight - sh - 20) / 2;
        pl = (ScreenWidth - sw) / 2;
      }
      // this.setState({
      //   viewWidth: sw,
      //   viewHeight: sh,
      //   top: pt,
      //   left: pl,
      // });
      // alert(sw+', '+sh+', '+pt+', '+pl);
      this._scaleAnimated(sw, sh, pt, pl,400);
      this.interval && clearInterval(this.interval);
    }else {
      //两手指缩放操作
      let sw = 0;
      let sh = 0;
      let offsetH = 0;
      let offsetW = 0;
      let pt = 0;
      let pl = 0;
      if(w > ScreenWidth && w < MaxW) {
        sw = w;
        sh = h;
        offsetH = offsetY*sw/this.state.viewHeight;
        offsetW = offsetX*sw/this.state.viewWidth;
        pt = this.state.top + (this.state.viewWidth - sw)/2;
        pl = this.state.left + (this.state.viewHeight - sh)/2;
      }else {
        sw = ScreenWidth;
        sh = (MaxH*ScreenWidth)/MaxW;
        pt = (ScreenHeight - sh - 20) / 2;
        pl = 0;
      }

        if(sh < ScreenHeight) {
          pt = (ScreenHeight - sh - 20) / 2;
        }else {
          if(pt > 0) {
            pt = 0;
          }else if(ScreenHeight - pt > sh) {
            pt =ScreenHeight - sh;
          }
        }
        // alert(sw+', '+pl+', '+ScreenWidth+', '+offsetW+', '+offsetX);
        if(pl > 0) {
          pl = 0;

        }else if(ScreenWidth - pl > sw) {
          pl =ScreenWidth - sw;
        }

        this.setState({
          viewWidth: sw,
          viewHeight: sh,
          top: pt,
          left: pl,
        });
        // this._scaleAnimated(sw, sh, pt, pl,0);
        // this.interval && clearInterval(this.interval);
      
    }
  }
  render() {
    return (
      <View style={{flex:1, backgroundColor:'black'}}>
        <Image
          source={this.props.imgUrl[this.props.index]}
          {...this._panResponder.panHandlers}
          style={[styles.rect, {
            backgroundColor: 'green',
            top: this.state.top,
            left: this.state.left,
            height: this.state.viewHeight,
            width: this.state.viewWidth,
          }]}
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  rect: {
    flex: 1,
    position: 'absolute',
  }
});
