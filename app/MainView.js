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
  ScrollView,
  BackAndroid
} from 'react-native';

import MainTabBar from './MainTabBar';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import BookView from './BookView';
import FuliView from './FuliView';
import KnowledgeView from './KnowledgeView';

export default class MainView extends Component {

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', () => this.handleBack());
  }
  componentWillUnmount  () {
    BackAndroid.removeEventListener('hardwareBackPress', () => this.handleBack())
  }
  handleBack(){
    var navigator = this.props.navigator;
    if (navigator && navigator.getCurrentRoutes().length > 1) {
      navigator.pop();
      return true;
    }else{
      return false;
    }
  }

  render() {
    return (
      <ScrollableTabView
        tabBarPosition='bottom'
        initialPage={0}
        locked={true}
        renderTabBar={() => <MainTabBar
                              tabText={['日报', '福利', '知识']}
                              tabIcon={['ios-book','ios-images','ios-film']}/>}
        >

        <BookView tabLabel="book" navigator={this.props.navigator}></BookView>
        <FuliView tabLabel="fuli" navigator={this.props.navigator}></FuliView>
        <KnowledgeView tabLabel="knowledge" navigator={this.props.navigator}></KnowledgeView>
      </ScrollableTabView>
    );
  }
}

const styles = StyleSheet.create({
  tabView: {
    flex: 1,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.01)',
  },
  card: {
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: 'rgba(0,0,0,0.1)',
    margin: 5,
    height: 150,
    padding: 15,
    shadowColor: '#ccc',
    shadowOffset: { width: 2, height: 2, },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
});
