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
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';

import NavigationBar from './NavigationBar';
import KnowledgeListView from './KnowledgeListView';
import SearchView from './SearchView';

const ScreenWidth = Dimensions.get('window').width; //屏幕宽度
const ScreenHeight = Dimensions.get('window').height; //屏幕宽度

export default class KnowledgeView extends Component {
  _handleClick(type) {
    this.props.navigator.push({
      title:type,
      component:KnowledgeListView,
      passProps: {
        type:type,
      },
    });
  }

  _searchBtnAction() {
    this.props.navigator.push({
      title:'搜索',
      component:SearchView,
      passProps: {
        type:'all',
      },
    });
  }

  render() {
    return (
      <View style={styles.flex}>
        <NavigationBar title='知识库' rightImage='ios-search' rightAction={() => this._searchBtnAction()}/>
        <TouchableOpacity onPress={()=>this._handleClick('Android')}>
          <Image style={styles.image} source={require('../img/android.jpg')}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>this._handleClick('iOS')}>
          <Image style={styles.image} source={require('../img/ios.jpg')}/>
        </TouchableOpacity>
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
  image: {
    width: ScreenWidth,
    height: (ScreenHeight-114) / 2,
  }
});
