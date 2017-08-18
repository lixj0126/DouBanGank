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
  WebView,
} from 'react-native';

import NavigationBar from './NavigationBar';

export default class KnowledgeDetailView extends Component {

  _backAction() {
    this.props.navigator.pop();
  }
  render() {
    return (
      <View style={styles.flex}>
        <NavigationBar title="" leftImage='ios-arrow-back' leftAction={()=>this._backAction()}/>
        <WebView
          automaticallyAdjustContentInsets={false}
          style={styles.flex}
          source={{uri:this.props.url}}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          decelerationRate="normal"
          startInLoadingState={true}
          />
    </View>
    );
  }
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
