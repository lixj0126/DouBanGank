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
  TouchableOpacity,
  TouchableHighlight,
  ToastAndroid,
} from 'react-native';

import DownloadUtil from './utils/DownloadUtil'

const ScreenWidth = Dimensions.get('window').width; //屏幕宽度
const ScreenHeight = Dimensions.get('window').height; //屏幕宽度

let isSlide = false; //是否滑动
let pressTime = 0; //触摸时间
let longPress = false; //长按事件
let touchBegin = false; //触摸开始
let clickNum = 0; //点击次数

let MaxW = 0; //最大宽度
let MaxH = 0; //最大高度

let leftIndex = 0;
let centreIndex = 1;
let rightIndex = 2;
let l_url = 0;
let c_url = 0;
let r_url = 0;

let toggle = true;

// const IMG = 'http://www.qq1234.org/uploads/allimg/150720/11_150720172010_11.jpg';
// const IMG = 'https://facebook.github.io/react/img/logo_og.png';
const IMG = 'http://h.hiphotos.baidu.com/zhidao/pic/item/6d81800a19d8bc3ed69473cb848ba61ea8d34516.jpg';

export default class ImagePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bg: 'white',
      top: [0,0,0],
      left: [0,0,0],
      viewHeight: [0,0,0],
      viewWidth: [ScreenWidth,ScreenWidth,ScreenWidth],
      fadeAnim: new Animated.Value(0),
    };
  }
  componentWillMount() {
    this._toggleIndicate();
    this.slideDone = true;
    c_url = this.props.index;
    l_url = c_url - 1;
    r_url = c_url + 1;
    
    console.log(leftIndex + ",  " + centreIndex + ",  " +rightIndex);
    this._setImageSize(l_url >= 0?this.props.imgUrl[l_url].uri:"", leftIndex);
    this._setImageSize(this.props.imgUrl[c_url].uri, centreIndex);
    this._setImageSize(r_url < this.props.imgUrl.length?this.props.imgUrl[r_url].uri:"", rightIndex);

    this._panResponder = PanResponder.create({
      // 要求成为响应者：
      onStartShouldSetPanResponder: (evt, gestureState) => {
        if(this.slideDone) {
          return true;
        }
        return false;
      },
      onStartShouldSetPanResponderCapture: (evt, gestureState) => {
        if(this.slideDone) {
          return true;
        }
        return false;
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        if(this.slideDone) {
          return true;
        }
        return false;
      },
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        if(this.slideDone) {
          return true;
        }
        return false;
      },
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
              this.slideDone = true;
              this._resetPositionAnimated();
            }
          },
          1200
        );
        }

      },
      onPanResponderMove: (evt, gs) => {
        console.log(gs.numberActiveTouches+"点触摸移动");
        if(gs.numberActiveTouches >= 2) {
          
          if(!longPress && !isSlide) {
            this.isScale = true;
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

              const sw = this.state.viewWidth[centreIndex]+((this._distance2-this._distance));
              const sh = this.state.viewHeight[centreIndex]*sw/this.state.viewWidth[centreIndex];
              //console.log(this._distance2-this._distance);
              this._scale(2,sw,sh,0,0);
              //this._clickTimeout && clearTimeout(this._clickTimeout);
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
            if(this.state.top[centreIndex] <= 0 && this.state.top[centreIndex] + dy > 0) {
              let topsdy = this.state.top;
              topsdy[centreIndex] = 0;
              this.setState({top: topsdy,});
              dy = 0;
            }else if(this.state.top[centreIndex] > 0){
              dy = 0;
            }
          }else {
            if(this.state.viewHeight[centreIndex] <= ScreenHeight - this.state.top[centreIndex]) {
              dy = 0;
            }
          }
          const tops = this.state.top;
          tops[centreIndex] = tops[centreIndex] + dy;
          const lefts = this.state.left;
          lefts[leftIndex] = lefts[leftIndex] + dx;
          lefts[centreIndex] = lefts[centreIndex] + dx;
          lefts[rightIndex] = lefts[rightIndex] + dx;
          this.setState({
            top: tops,
            left: lefts,
          });
      }
    }
      },
      onPanResponderRelease: (evt, gs) => {
        
        if(isSlide) { //是否滑动，在这里判断是否左右切换，或者复原
          if(this.state.left[centreIndex] > ScreenWidth / 5 && c_url > 0) {
            //→
            this.slideRight();
          }else if(ScreenWidth - this.state.left[centreIndex] - this.state.viewWidth[centreIndex] > ScreenWidth / 5 && c_url < this.props.imgUrl.length - 1) {
            this.slideLeft();
          }else {
            this._resetPositionAnimated();
          }
          //
          
        }
        clickNum++;
        if(!isSlide && !longPress && !this.isScale) {
          if(clickNum == 1) {
            this._clickTimeout = setTimeout(
              () => {
                //单击
                //alert("单击");
                clickNum = 0;
                this.slideDone = true;
                this._resetPositionAnimated();
                this._toggleIndicate();
                this._longPressTimeout && clearTimeout(this._longPressTimeout);
              },
              200
            );
          }else if(clickNum == 2){
            //触发双击
            this._scale(1, 0, 0, this._x - ScreenWidth / 2, this._y - (ScreenHeight - 20) / 2);
            this._clickTimeout && clearTimeout(this._clickTimeout);
            this._longPressTimeout && clearTimeout(this._longPressTimeout);
            clickNum = 0;
            this.slideDone = true;
          }
        }else {
          isSlide = false;
          longPress = false;
          this.isScale = false;
          clickNum = 0;
          // this._longPressTimeout && clearTimeout(this._longPressTimeout);
          // this._clickTimeout && clearTimeout(this._clickTimeout);
        }
        
        touchBegin = false;
        this.setState({
          bg: 'white',
        });
        
      }
    });
  }
  //设置图片宽高
  _setImageSize(url, i) {
    Image.getSize(
      url,
      (width, height) => {
        if(i == centreIndex) {
          MaxW = width;
          MaxH = height;
        }
        const vh = (height*ScreenWidth)/width;
        const tops = this.state.top;
        tops[i] = (ScreenHeight - vh - 20) / 2;
        const lefts = this.state.left;
        if(i == leftIndex) {
          lefts[i] = -ScreenWidth;
        }else if(i == centreIndex) {
          lefts[i] = 0;
        }else {
          lefts[i] = ScreenWidth;
        }
        const viewWidths = this.state.viewWidth;
        viewWidths[i] = ScreenWidth;
        const viewHeights = this.state.viewHeight
        viewHeights[i] = vh;
        
        this.setState({
          viewHeight: viewHeights,
          top: tops,
          left: lefts,
          viewWidth: viewWidths,
        });
      },
      (error) => {}
    );
  }

  //左滑动←
  slideLeft() {
    let vx = (this.state.viewWidth[centreIndex] + this.state.left[centreIndex]) / 8;
    this.intervalLeft = setInterval(()=>{
      let done = false;
      this.slideDone = false;
      if(Math.abs(this.state.left[centreIndex]) >= Math.abs(this.state.viewWidth[centreIndex])) {
        //完成滑动
        done = true;
        vx = this.state.left[rightIndex];
        this.intervalLeft && clearInterval(this.intervalLeft);
      }
      let lefts = this.state.left;
      lefts[leftIndex] = lefts[leftIndex] - vx;
      lefts[centreIndex] = lefts[centreIndex] - vx;
      lefts[rightIndex] = lefts[rightIndex] - vx;
      this.setState({
        //top: this.state.top - vy,
        left: lefts,
      });
      if(done) {
        let c = centreIndex;
        centreIndex = rightIndex;
        rightIndex = leftIndex;
        leftIndex = c;
        c_url = c_url + 1;
        l_url = l_url + 1;
        r_url = r_url + 1;
        this._setImageSize(l_url >= 0?this.props.imgUrl[l_url].uri:"", leftIndex);
        this._setImageSize(this.props.imgUrl[c_url].uri, centreIndex);
        this._setImageSize(r_url < this.props.imgUrl.length?this.props.imgUrl[r_url].uri:"", rightIndex);
        this.slideDone = true;
      }
      // alert(this.state.left+',  '+(new Date()-time1));
    }, 10);
  }

  //左滑动←
  slideRight() {
    let vx = (ScreenWidth - this.state.left[centreIndex]) / 8;
    this.intervalRight = setInterval(()=>{
      this.slideDone = false;
      let done = false;
      if(Math.abs(this.state.left[centreIndex]) >= ScreenWidth) {
        //完成滑动
        done = true;
        vx = this.state.left[leftIndex];
        this.intervalRight && clearInterval(this.intervalRight);
      }
      let lefts = this.state.left;
      lefts[leftIndex] = lefts[leftIndex] + vx;
      lefts[centreIndex] = lefts[centreIndex] + vx;
      lefts[rightIndex] = lefts[rightIndex] + vx;
      this.setState({
        //top: this.state.top - vy,
        left: lefts,
      });
      if(done) {
        let c = centreIndex;
        centreIndex = leftIndex;
        leftIndex = rightIndex;
        rightIndex = c;
        c_url = c_url - 1;
        l_url = l_url - 1;
        r_url = r_url - 1;
        this._setImageSize(l_url >= 0?this.props.imgUrl[l_url].uri:"", leftIndex);
        this._setImageSize(this.props.imgUrl[c_url].uri, centreIndex);
        this._setImageSize(r_url < this.props.imgUrl.length?this.props.imgUrl[r_url].uri:"", rightIndex);
        this.slideDone = true;
      }
      // alert(this.state.left+',  '+(new Date()-time1));
    }, 10);
  }

  //回归原位动画
  _resetPositionAnimated() {
    //let vy = this.state.top / (800/60);

    let vx = 0;
    if(this.state.left[centreIndex] < 0) {
      //向右
      if(ScreenWidth - this.state.left[centreIndex] - this.state.viewWidth[centreIndex] < 0)
        return;
      vx = -(ScreenWidth - this.state.left[centreIndex] - this.state.viewWidth[centreIndex]) / 8;
    }else {
      vx = this.state.left[centreIndex] / 8;
    }
    //console.log(this.state.left+', '+vx);
    let i = 1;
    let time1 = new Date();
    this.interval = setInterval(()=>{
      // alert(i+','+(new Date()-time1));
      this.slideDone = false;
      i++;
      if(vx >= 0) {
        if(Math.abs(this.state.left[centreIndex]) <= Math.abs(vx)) {
          //vy = this.state.top;
          vx = this.state.left[centreIndex];
          this.interval && clearInterval(this.interval);
          this.slideDone = true;
        }
      }else {
        if(Math.abs(ScreenWidth - this.state.left[centreIndex] - this.state.viewWidth[centreIndex])<=Math.abs(vx)) {
          vx = -(ScreenWidth - this.state.left[centreIndex] - this.state.viewWidth[centreIndex]);
          this.interval && clearInterval(this.interval);
          this.slideDone = true;
        }
      }
      let lefts = this.state.left;
      lefts[leftIndex] = lefts[leftIndex] - vx;
      lefts[centreIndex] = lefts[centreIndex] - vx;
      lefts[rightIndex] = lefts[rightIndex] - vx;
      this.setState({
        //top: this.state.top - vy,
        left: lefts,
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

    let vw = (sw - this.state.viewWidth[centreIndex])/ (time/60.0);
    let vh = (sh - this.state.viewHeight[centreIndex]) / (time/60.0);
    let vt = (pt - this.state.top[centreIndex]) / (time/60.0);
    let vl = (pl - this.state.left[centreIndex]) / (time/60.0);

    // let time = 0.0;
    let ss =sw+', '+sh+', '+pt+', '+pl;
    this.interval2 = setInterval(()=>{
      // time = time + (time/60.0);
      if(Math.abs(this.state.viewWidth[centreIndex] - sw) < Math.abs(vw)) {
        vw = sw - this.state.viewWidth[centreIndex];
        vh = sh - this.state.viewHeight[centreIndex];
        vt = pt - this.state.top[centreIndex];
        vl = pl - this.state.left[centreIndex];
        this.interval2 && clearInterval(this.interval2);
      }
      // if(time >= 400.0) {
      //   this.interval2 && clearInterval(this.interval2);
      // }
      //console.log(vw+', '+vh+', '+vt+', '+vl);
      let viewWidths = this.state.viewWidth;
      let viewHeights = this.state.viewHeight;
      let tops = this.state.top;
      let lefts = this.state.left;
      viewWidths[centreIndex] = viewWidths[centreIndex] + vw;
      viewHeights[centreIndex] = viewHeights[centreIndex] + vh;
      tops[centreIndex] = tops[centreIndex] + vt;
      lefts[leftIndex] = lefts[leftIndex] + vl;
      lefts[centreIndex] = lefts[centreIndex] + vl;
      lefts[rightIndex] = viewWidths[centreIndex] + lefts[centreIndex];
      console.log(lefts[centreIndex]+ ", "+lefts[rightIndex]);
      this.setState({
        viewWidth: viewWidths,
        viewHeight: viewHeights,
        top: tops,
        left: lefts,
      });
      // alert(this.state.viewWidth+', '+this.state.viewHeight+', '+this.state.top+', '+this.state.left+'==='+ss);
    }, 10);
  }
  //缩放
  _scale(type, w, h, offsetX, offsetY) {
    if (type === 1) {
      let sw = this.state.viewWidth[centreIndex];
      let sh = this.state.viewHeight[centreIndex];
      let pt = 0;
      let pl = 0;
      let offsetH = 0;
      let offsetW = 0;
      if(this.state.viewWidth[centreIndex] <= ScreenWidth) {
        if(this.state.viewWidth[centreIndex] < MaxW) {
          sw = MaxW;
          sh = MaxH;
          offsetH = offsetY*MaxH/this.state.viewHeight[centreIndex];
          offsetW = offsetX*MaxW/this.state.viewWidth[centreIndex];
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
      this.interval && clearInterval(this.interval);
      this._scaleAnimated(sw, sh, pt, pl,400);
      
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
        offsetH = offsetY*sw/this.state.viewHeight[centreIndex];
        offsetW = offsetX*sw/this.state.viewWidth[centreIndex];
        pt = this.state.top[centreIndex] + (this.state.viewWidth[centreIndex] - sw)/2;
        pl = this.state.left[centreIndex] + (this.state.viewHeight[centreIndex] - sh)/2;
      }else if(w >= MaxW) {
        sw = MaxW;
        sh = MaxH;
        pt = this.state.top[centreIndex] + (this.state.viewWidth[centreIndex] - sw)/2;
        pl = this.state.left[centreIndex] + (this.state.viewHeight[centreIndex] - sh)/2;
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

        let viewWidths = this.state.viewWidth;
        let viewHeights = this.state.viewHeight;
        let tops = this.state.top;
        let lefts = this.state.left;
        viewWidths[centreIndex] = sw;
        viewHeights[centreIndex] = sh;
        tops[centreIndex] = pt;
        lefts[leftIndex] = lefts[leftIndex] + pl - lefts[centreIndex];
        lefts[rightIndex] = viewWidths[centreIndex] + pl;
        lefts[centreIndex] = pl;
        console.log(pl+"aaaaaaaaaaaa"+lefts[leftIndex]+", "+lefts[rightIndex]+", "+lefts[centreIndex]);
        this.setState({
          viewWidth: viewWidths,
          viewHeight: viewHeights,
          top: tops,
          left: lefts,
        });
        // this._scaleAnimated(sw, sh, pt, pl,0);
        // this.interval && clearInterval(this.interval);
      
    }
  }

  //图片下载回调
  _callback() {
    //alert("回调了");
    ToastAndroid.show('保存成功', ToastAndroid.SHORT);
  }

  //点击下载图片
  _onDownload() {
    const filename = "meizi"+new Date().getTime()+".jpg"; //保存的图片名
    DownloadUtil.loadImage(this.props.imgUrl[c_url].uri,filename,'.jpg',this._callback);
  }

  //显示或隐藏下面的指示和下载按钮

  _toggleIndicate() {
    if(toggle) {
      Animated.timing(                            // 随时间变化而执行的动画类型
        this.state.fadeAnim,                      // 动画中的变量值
        {
          toValue: 1,                             // 透明度最终变为1，即完全不透明
        }
      ).start();
    }else {
      Animated.timing(                            // 随时间变化而执行的动画类型
      this.state.fadeAnim,                      // 动画中的变量值
      {
        toValue: 0,                             // 透明度最终变为1，即完全不透明
      }
    ).start();
    }
    toggle = !toggle;
  }

  render() {
    return (
      <View style={{flex:1, backgroundColor:'black'}}>
        <Image
          source={this.props.imgUrl[l_url]}
          {...this._panResponder.panHandlers}
          style={[styles.rect, {
            top: this.state.top[leftIndex],
            left: this.state.left[leftIndex],
            height: this.state.viewHeight[leftIndex],
            width: this.state.viewWidth[leftIndex],
          }]}
          />
        <Image
          source={this.props.imgUrl[c_url]}
          {...this._panResponder.panHandlers}
          style={[styles.rect, {
            top: this.state.top[centreIndex],
            left: this.state.left[centreIndex],
            height: this.state.viewHeight[centreIndex],
            width: this.state.viewWidth[centreIndex],
          }]}
          />
        <Image
          source={this.props.imgUrl[r_url]}
          {...this._panResponder.panHandlers}
          style={[styles.rect, {
            top: this.state.top[rightIndex],
            left: this.state.left[rightIndex],
            height: this.state.viewHeight[rightIndex],
            width: this.state.viewWidth[rightIndex],
          }]}
          />
        <View style={{flex: 1,flexDirection: 'column-reverse'}}>
          <Animated.View                            // 可动画化的视图组件
            style={{
              opacity: this.state.fadeAnim,          // 将透明度指定为动画变量值
            }}
          >
            <View style={{paddingBottom: 16,flexDirection: 'row'}}>
              <Text style={styles.indicate}>{c_url+1+'/'+this.props.imgUrl.length}</Text>
              <TouchableHighlight onPress={()=>this._onDownload()}>
                <Text style={styles.download}>下载</Text>
              </TouchableHighlight>
            </View>
          </Animated.View>
        </View>
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
  },
  indicate: {
    flex: 1,
    marginLeft: 16,
    color: '#ffffff'
  },
  download: {
    marginRight: 16,
    color: '#ffffff'
  },
  color: {
    color: '#ffffff'
  }
});
