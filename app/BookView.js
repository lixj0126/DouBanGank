/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
'use strict';
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  Dimensions,
  Image,
  PixelRatio,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';

import ViewPager from 'react-native-viewpager';

import NavigationBar from './NavigationBar';
import Icon from 'react-native-vector-icons/Ionicons';
import BookDetailView from './BookDetailView';

const ScreenWidth = Dimensions.get('window').width; //屏幕宽度
const ScreenHeight = Dimensions.get('window').height; //屏幕宽度

const dataSource2 = new ViewPager.DataSource({
      pageHasChanged: (p1, p2) => p1 !== p2,
});

    let moreText = "加载完毕";    //foot显示的文案
    //页码
    let pageNum = 1;
    //每页显示数据的条数
    let pageSize = 10;
    //页面总数据数
    let pageCount = 0;
    //页面List总数据
    let totalList = new Array();

    // let foot：  0 隐藏  1  已加载完成   2  显示加载中

    var IMGS = [];

export default class BookView extends Component {
  storiesData: {} //文章数据
  sectionName: {} //组标题
  page: 0 //请求页数
  // 初始化模拟数据
  constructor(props) {
    super(props);
    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
      dataSource2: dataSource2.cloneWithPages(IMGS),

      isLoading: true,
      isRefreshing: false,

      loaded: false,//控制Request请求是否加载完毕
      foot:0,// 控制foot， 0：隐藏foot  1：已加载完成   2 ：显示加载中
      error:false,
      img: null,
    };
  }

  _searchBtn() {
    return (
      <Icon
        name='ios-search'
        size={22}
        color='#ffffff'
      />
    );
  }

  _searchBtnAction() {
    // alert('搜索');
  }

  _toDetails(newsId) {
    this.props.navigator.push({
      title:'详情',
      component:BookDetailView,
      passProps: {
        id: newsId
      },
    })
  }

  //列表
  _renderRow(rowData) {
    return (
      <TouchableOpacity
        style={{flex: 1}}
        onPress={() => this._toDetails(rowData.id)}>
      <View style={styles.itemContainer} >
        <Image
          style={styles.itemImage}
          source={{uri: rowData.images[0]}} />

        <Text
          numberOfLines={3}
          style={styles.itemText}
          >
          {rowData.title}
        </Text>
      </View>
      </TouchableOpacity>
    );
  }

  _renderPage2(data: Object, pageID: number | string,) {
    return (
      <TouchableOpacity
        style={{flex: 1}}
        onPress={() => this._toDetails(data.id)}>
      <View style={styles.page}>
        <Image
          source={{uri: data.image}}
          style={styles.pageImg} />
        <View style={styles.pageHide}></View>
        <Text style={styles.pageTitle}>
          {data.title}
        </Text>
      </View>
    </TouchableOpacity>
    );
  }

  _onRefresh() {
    this.setState({isRefreshing: true});
    this.getNewsListFromApiAsync();
  }


  //获取最新文章
  getNewsListFromApiAsync() {
    pageNum = 1;
    this.storiesData = {};
    this.sectionName = {};
    fetch('http://news-at.zhihu.com/api/4/news/latest')
      .then((response) => response.json())
      .then((responseJson) => {
        const stories = responseJson.stories;
        this.storiesData[pageNum] = stories;
        this.sectionName[pageNum] = '今日热文';
        let ds = new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2,
          sectionHeaderHasChanged: (s1, s2) => s1 !== s2});
        IMGS = responseJson.top_stories;
        this.setState({
          dataSource: ds.cloneWithRowsAndSections(this.storiesData),
          dataSource2: dataSource2.cloneWithPages(IMGS),
        });

      })
      .catch((error) => {
        console.error(error);
      })
      .done(() => {
        this.setState({
          isLoading: false,
          isRefreshing: false,
          foot: 0,
        });
      });
  }

  //获取历史文章
  getHistoryNewsListAsync() {
    const date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth()+1;
    let day = parseInt(date.getDate()) - pageNum + 2;
    if(day === 0) {
      month -= 1;
      if(month === 0) {
        year -= 1;
        month = 12;
      }
      day = 31;
      if(month !== 12) {
        const days = new Date(year,month,0);
        day = days.getDate();
      }
    }
    const time = date.getFullYear()+''+(month<10?'0'+month:month)+(day<10?'0'+day:day);
    fetch('http://news.at.zhihu.com/api/4/news/before/'+time)
      .then((response) => response.json())
      .then((responseJson) => {
        const stories = responseJson.stories;
        this.storiesData[pageNum] = stories;
        this.sectionName[pageNum] = responseJson.date;
        let ds = new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2,
          sectionHeaderHasChanged: (s1, s2) => s1 !== s2});
        this.setState({
          dataSource: ds.cloneWithRowsAndSections(this.storiesData),
        });
      })
      .catch((error) => {
        console.error(error);
      })
      .done(() => {
        this.setState({
          // isLoading: false,
          // isRefreshing: false,
          foot: 0,
        });
      });
  }

  componentDidMount() {
      this.getNewsListFromApiAsync();
  }

  // componentWillMount() {
  //   this.getNewsListFromApiAsync();
  // }

  render() {
    return (
      <View style={styles.container} pointerEvents='box-none'>
        <NavigationBar title='知乎日报'/>
      {
        !this.state.isLoading ?
        (
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) => this._renderRow(rowData)}
          enableEmptySections={true}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={() => this._onRefresh()}
              tintColor="#ff0000"
              title="Loading..."
              titleColor="#00ff00"
              colors={['#ff0000', '#00ff00', '#0000ff']}
              progressBackgroundColor="#ffff00"
            />}
            renderSectionHeader={(sectionData, sectionId) => {
              return (<Text style={{paddingLeft: 8,paddingTop: 8}}>{sectionId==='s1'?'':this.sectionName[sectionId]}</Text>)
            }}
            onEndReachedThreshold={1}
            onEndReached={()=>{
              if(this.state.foot != 0 ){
                this.setState({
                  foot:0,
                });
                return ;
              }
              this.setState({
                foot:2,
              });

              this.timer = setTimeout(
                () => {
                  pageNum++;
                  this.getHistoryNewsListAsync();
                },500);
            }}
            renderHeader= {() => {
              return (
                <ViewPager
                  style={this.props.style}
                  dataSource={this.state.dataSource2}
                  renderPage={(data, pageID) => this._renderPage2(data, pageID)}
                  isLoop={true}/>
              );
            }

            }
            renderFooter={() => {
              if(this.state.foot === 1 || this.state.foot === 0){//加载完毕
                return (
                  <View style={{height:40,alignItems:'center',justifyContent:'flex-start',}}>
                      <Text style={{fontSize:12,marginTop:10}}>
                          加载完毕
                      </Text>
                  </View>);
              }else if(this.state.foot === 2) {//加载中
                return (
                  <View style={{height:40,alignItems:'center',justifyContent:'flex-start',}}>
                    <Text style={{fontSize:12,marginTop:10}}>加载中</Text>
                  </View>);
              }
            }}

            />)
          :
          (<View ref='loading' style={[styles.loading, {position:'absolute', top: 44, left: 0, width: ScreenWidth, height: ScreenHeight - 50}]}>
            <Text>数据加载中...</Text>
          </View>)
        }

      </View>
    );
  }
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#d9d9d9',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: '#d9d9d9',
    padding: 8,
    margin: 8,
    marginBottom: 0,
    backgroundColor: '#ffffff',
    borderRadius: 4,
    elevation: 5
  },
  itemImage: {
    width: 80,
    height: 60,
  },
  itemText: {
    flex: 1,
    paddingLeft: 8,
    paddingRight: 8,
  },
  page: {
    width: ScreenWidth,
    height: 200,
  },
  pageImg: {
    width: ScreenWidth,
    height: 200,
  },
  pageHide: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: ScreenWidth,
    height: 200,
    backgroundColor: '#000',
    opacity: 0.3,
  },
  pageTitle: {
    fontSize: 18,
    position: 'absolute',
    bottom: 20,
    color: '#fff',
    paddingLeft: 16,
    paddingRight: 16
  }
});
