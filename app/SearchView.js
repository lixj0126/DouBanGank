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
  TextInput,
  TouchableOpacity,
  ListView,
  Dimensions,
  Keyboard,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import KnowledgeDetailView from './KnowledgeDetailView';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
const ScreenWidth = Dimensions.get('window').width; //屏幕宽度
const ScreenHeight = Dimensions.get('window').height; //屏幕宽度

const pageNum = 1;
const data = new Array();
const searchValue = '';

export default class SearchView extends Component {

  // 初始化模拟数据
  constructor(props) {
    super(props);
    this.state = {
      dataSource: ds.cloneWithRows([]),
      isLoading: true,
      isRefreshing: false,

      loaded: false,//控制Request请求是否加载完毕
      foot:-1,// 控制foot， 0：隐藏foot  1：已加载完成   2 ：显示加载中
      error:false,
      value: '',


      loadingText: '搜索',
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

  _handleSearch() {
    Keyboard.dismiss();
    //查询数据
    this.getDataFromApiAsync(1);
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

  getDataFromApiAsync(type) {
    if(!this.state.value) {
      alert('输入不能为空');
      return;
    }
    searchValue = this.state.value;
    this.setState({
      loadingText: '搜索中...',
    });
    if(type === 1) {
      pageNum = 1;
      data = [];
    }else {
      pageNum++;
    }
    const url = 'http://gank.io/api/search/query/'+searchValue+'/category/'+this.props.type+'/count/15/page/'+pageNum;
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

  render() {
    return (
      <View style={styles.flex}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => this._backAction()}>
            <Icon
              name='ios-arrow-back'
              size={25}
              color='#fff'/>
          </TouchableOpacity>
          <TextInput
            style={styles.input} underlineColorAndroid="#00000000"
            returnKeyType='search'
            onSubmitEditing={()=>this._handleSearch()}
            onChangeText={(text)=>{
              this.setState({
                value: text,
              });
            }}/>
          <TouchableOpacity
            onPress={() => this._handleSearch()}>
            <View>
              <Text style={{color: '#fff'}}>
                搜索
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        {
          !this.state.isLoading ?
        (<ListView
          contentContainerStyle={styles.list}
          dataSource={this.state.dataSource}
          renderRow={(rowData) => this._renderRow(rowData)}
          enableEmptySections={true}
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
                this.getDataFromApiAsync(2);
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
      />)
        :
        (<View style={[styles.loading, {position:'absolute', top: 44, left: 0, width: ScreenWidth, height: ScreenHeight - 50}]}>
          <Text>{this.state.loadingText}</Text>
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
  input: {
    height: 30,
    flex: 1,
    padding: 2,
    paddingLeft: 8,
    paddingRight: 8,
    margin: 7,
    marginLeft: 5,
    marginRight: 10,
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#4E78E7',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 20,
  },
  iconBtn: {
    width: 26,
    alignItems: 'center',
    justifyContent: 'center',
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
