import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Modal,
  InteractionManager,
  CameraRoll,
  Image,
  Dimensions,
} from 'react-native';

import ImageViewers from 'react-native-image-zoom-viewer';
import PanView from './PanView';
import ImagePage from './ImagePage';

const ScreenWidth = Dimensions.get('window').width; //屏幕宽度
const ScreenHeight = Dimensions.get('window').height; //屏幕宽度

export default class ImageViewer extends React.Component {
  handleClick() {
    this.props.navigator.pop();
  }

  // 初始化模拟数据
  constructor(props) {
    super(props);
    this.state = {
      isDone: false,
    }
  }

  componentDidMount() {
    //动画完成后执行
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        isDone: true,
      });
    });
  }

  render() {
    return (
          <ImagePage imgUrl={this.props.imageUrls} index={this.props.index} />
      );
  }
}
const styles = StyleSheet.create({
  flex: {
    width: ScreenWidth,
    height: ScreenHeight,
  },
})
