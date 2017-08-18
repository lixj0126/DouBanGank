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
  RefreshControl,
  ListView,
  Dimensions,
  TouchableOpacity,
  InteractionManager,
} from 'react-native';

import NavigationBar from './NavigationBar';
import KnowledgeDetailView from './KnowledgeDetailView';
import SearchView from './SearchView';

const ScreenWidth = Dimensions.get('window').width; //屏幕宽度
const ScreenHeight = Dimensions.get('window').height; //屏幕宽度
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
const data = new Array();
const pageNum = 1;

export default class KnowledgeListView extends Component {
  // 初始化模拟数据
  constructor(props) {
    super(props);
    //ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
      isLoading: true,
      isRefreshing: false,

      loaded: false,//控制Request请求是否加载完毕
      foot:-1,// 控制foot， 0：隐藏foot  1：已加载完成   2 ：显示加载中
      error:false,
    };
  }

  handleBrowse(rowData) {
    this.props.navigator.push({
      title:'学习',
      component:KnowledgeDetailView,
      passProps: {
        url: rowData.url,
      },
    });
  }

  _backAction() {
    this.props.navigator.pop();
  }

  _onRefresh() {
    //下拉刷新
    this.setState({isRefreshing: true});
    this.getKnowledgeFromApiAsync(1);
  }

  _renderRow(rowData) {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={()=>this.handleBrowse(rowData)}>
      <View style={styles.item}>
        <Text style={{fontSize: 12}}>
          分享者：{rowData.who?rowData.who:'None'}
        </Text>
        <Text>
          {rowData.desc}
        </Text>
        <Text numberOfLines={2} style={{fontSize: 12, color: '#ccc'}}>
          {rowData.url}
        </Text>
      </View>
    </TouchableOpacity>
    )
  }

  getKnowledgeFromApiAsync(type) {
    if(type === 1) {
      pageNum = 1;
      data = [];
    }else {
      pageNum++;
    }
    const url = 'http://gank.io/api/data/'+this.props.type+'/20/'+pageNum;
    fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        const results = responseJson.results;
        data = data.concat(results);
        this.setState({
          dataSource: ds.cloneWithRows(data),
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

  _searchBtnAction() {
    this.props.navigator.push({
      title:'搜索',
      component:SearchView,
      passProps: {
        type: this.props.type,
      },
    });
  }

  componentDidMount() {
    //动画完成后执行
    InteractionManager.runAfterInteractions(() => {
      this.getKnowledgeFromApiAsync(1);
    });
  }

  render() {
    return (
      <View style={styles.flex}>
        <NavigationBar
          title={this.props.type.toLowerCase()}
          leftImage='ios-arrow-back'
          leftAction={()=>this._backAction()}
          rightImage='ios-search'
          rightAction={() => this._searchBtnAction()}/>
        <ListView
          contentContainerStyle={styles.list}
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
                //上拉刷新
                this.getKnowledgeFromApiAsync(2);
              },500);
          }}
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
      />
      {
        !this.state.isLoading ?
        null
        :
        (<View style={[styles.loading, {position:'absolute', top: 44, left: 0, width: ScreenWidth, height: ScreenHeight - 50}]}>
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
    backgroundColor: '#d9d9d9',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    marginTop: 2,
    marginBottom: 2,
    marginLeft: 8,
    marginRight: 8,
    borderRadius: 4,
    padding: 4,
    backgroundColor: '#fff',
  }
});
