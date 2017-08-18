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
  ListView,
  Image,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
  Alert,
  ToastAndroid,
} from 'react-native';

import NavigationBar from './NavigationBar';
import ImageViewer from './ImageViewer';
import Icon from 'react-native-vector-icons/Ionicons';

const ScreenWidth = Dimensions.get('window').width; //屏幕宽度
const ScreenHeight = Dimensions.get('window').height; //屏幕宽度
const PictureDir = RNFetchBlob.fs.dirs.PictureDir;

import RNFetchBlob from 'react-native-fetch-blob';

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
var data = new Array();
//页码
var pageNum = 1;
export default class FuliView extends Component {
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
    index = 0;
    const images = [];
    for (let i = 0; i < data.length; i++) {
      if(data[i] === rowData) {
        index = i;
      }
      images.push({uri: data[i].url});
    }
    //images.push({uri: rowData.url});
    this.props.navigator.push({
      title:'浏览',
      component:ImageViewer,
      passProps: {
        imageUrls: images,
        index: index,
      },
    });
  }
  handleLongPress(rowData) {
    Alert.alert(null,
      "正在保存你喜欢的妹子图",
      [
        {text: "取消"},
        {text: "确定", onPress : () => {
          const filename = "meizi"+rowData.desc+".jpg";
          this.getImageAttachment(rowData.url, filename, "jpg");
        }}
      ]);
    // this.getImageAttachment();
  }

  /*保存图片*/
  getImageAttachment(uri_attachment, filename_attachment, mimetype_attachment) {
    return new Promise((RESOLVE, REJECT) => {
      // Fetch attachment
      RNFetchBlob.fetch('GET', uri_attachment)
        .then((response) => {
          let base64Str = response.data;
          let imageLocation = PictureDir+'/'+filename_attachment;
          //Save image
          RNFetchBlob.fs.writeFile(imageLocation, base64Str, 'base64');
          RNFetchBlob.fs.scanFile([ { path : imageLocation, mime : mimetype_attachment } ])
        .then(() => {
          console.log("scan file success")
          ToastAndroid.show('保存成功', ToastAndroid.SHORT);
        })
        .catch((err) => {
          console.log("scan file error")
        })

        }).catch((error) => {
        // error handling
        console.log("Error:", error)
      });
    });
  }


  _renderRow(rowData) {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={()=>this.handleBrowse(rowData)}
        >
      <View style={styles.item}>
        <Image style={styles.image} source={{uri: rowData.url}}/>
      </View>
    </TouchableOpacity>
    )
  }

  _onRefresh() {
    this.setState({isRefreshing: true});
    this.getPicListFromApiAsync(1);
  }

  //获取最新数据,type 1:刷新，2：加载更多
  getPicListFromApiAsync(type) {
    if(type === 1) {
      pageNum = 1;
      data = [];
    }else {
      pageNum++;
    }
    fetch('http://gank.io/api/data/福利/20/'+pageNum)
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

  componentWillMount() {
    this.getPicListFromApiAsync(1);
  }

  render() {
    return (
      <View style={styles.flex}>
        <NavigationBar title='福利站'/>
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
                this.getPicListFromApiAsync(2);
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
  list: {
    justifyContent: 'space-around',
    marginTop:5,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  item: {
    justifyContent: 'center',
    padding: 5,
    margin: 3,
    width: 150,
    height: 150,
    backgroundColor: '#F6F6F6',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#CCC'
  },
  image: {
    width: 148,
    height: 148,
    borderRadius: 5,
    resizeMode: 'cover'
  },

});
