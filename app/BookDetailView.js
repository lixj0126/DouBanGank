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
  Dimensions,
  Image,
  ScrollView,
  BackAndroid,
  WebView,
  InteractionManager,
} from 'react-native';
import NavigationBar from './NavigationBar';

const ScreenWidth = Dimensions.get('window').width; //屏幕宽度
const ScreenHeight = Dimensions.get('window').height; //屏幕宽度

export default class BookDetailView extends Component {
  // 初始化模拟数据
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,  //是否在载入内容
      imageUrl: null,   //新闻图片url
      imageSource: '',  //新闻图片来源
      title:'',         //新闻标题
      htmlStr: '',      //新闻内容，html文本
      webHeight: 0,
      isWebHeight: false,
    };
  }
  _backAction() {
    this.props.navigator.pop();
  }

  //获取最新信息
  getNewsFromApiAsync() {
    const url = 'http://news-at.zhihu.com/api/4/news/'+this.props.id;

    fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        const body = responseJson.body;
        const html = '<html><head><link rel="stylesheet" type="text/css" href="'+responseJson.css[0]+'" /></head><body>'+body+'<script>window.onload=function(){window.location.hash = 1;document.title =document.body.scrollHeight;}</script></body></html>';
        this.setState({
          imageUrl: responseJson.image,
          imageSource: responseJson.image_source,
          title: responseJson.title,
          htmlStr: html,
        });
      })
      .catch((error) => {
        console.error(error);
      })
      .done(() => {
        this.setState({
          isLoading: false,
          isWebHeight: true
        });
      });
  }

  componentDidMount() {
    //动画完成后执行
    InteractionManager.runAfterInteractions(() => {
      this.getNewsFromApiAsync();
    });
  }

  _commentsAction() {
    alert('看评论,待完善');
  }

  render() {
    return (
      <View style={styles.flex} >
      
        <NavigationBar
          title='文章阅读'
          leftImage='ios-arrow-back'
          leftAction={()=>this._backAction()}
          rightImage='md-text'
          rightAction={()=>this._commentsAction()}
          />
        <ScrollView style={styles.flex}>
        
        <WebView
          automaticallyAdjustContentInsets={false}
          style={[styles.webView, styles.flex, {height: this.state.webHeight}]}
          source={{html:this.state.htmlStr}}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          decelerationRate="normal"
          startInLoadingState={true}
          onNavigationStateChange={(title)=>{
          if(!isNaN(title.title)) {
            this.setState({
              webHeight:(parseInt(title.title)),

            });
          }
          }}
          />
          {
            !this.state.isWebHeight ?
              null :
              (
                <View style={styles.image}>
                  <Image
                    style={styles.image}
                    source={{uri: this.state.imageUrl}}/>
                  <Text
                    style={styles.title}>
                    {this.state.title}
                  </Text>
                  <Text
                    style={styles.imageSource}>
                    {this.state.imageSource}
                  </Text>
                </View>
              )
          }


        {
          !this.state.isLoading ?
          null
          :
          (<View ref='loading' style={[styles.loading, {position:'absolute', top: 44, left: 0, width: ScreenWidth, height: ScreenHeight - 50}]}>
            <Text>加载中...</Text>
          </View>)
        }
      </ScrollView>
      
      </View>
    );
  }
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    position: 'absolute',
    top: 0,
    width: ScreenWidth,
    height: 200,
    backgroundColor: '#000',
    opacity: 0.8
  },
  title: {
    paddingLeft: 16,
    paddingRight: 16,
    fontSize: 20,
    fontWeight: 'bold',
    position: 'absolute',
    color: '#ffffff',
    bottom: 20,
  },
  imageSource: {
    paddingLeft: 16,
    paddingRight: 16,
    fontSize: 12,
    position: 'absolute',
    color: '#ffffff',
    bottom: 4,
    right: 0,
  },
  webView: {

    position: 'relative',
    top: 0,
  }
});
