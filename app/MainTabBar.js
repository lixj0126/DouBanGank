import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const MainTabBar = React.createClass({
  tabIcons: [],

  propTypes: {
    goToPage: React.PropTypes.func,     // 跳转到对应tab的方法
    activeTab: React.PropTypes.number,  // 当前被选中的tab下标
    tabs: React.PropTypes.array,        // 所有tabs集合
    tabText: React.PropTypes.array,     // 保存Tab名称
    tabIcon: React.PropTypes.array,     // 保存Tab图标
  },

  componentDidMount() {
    this._listener = this.props.scrollValue.addListener(this.setAnimationValue);
    this.preTab = this.props.activeTab;
  },

  // tab切换动画
  setAnimationValue({ value, }) {
    if(this.preTab === this.props.activeTab) {
      
    
    this.tabIcons.forEach((icon, i) => {
      const progress = Math.min(1, Math.abs(value - i))
      if(i === this.preTab || i === this.props.activeTab) {
      icon.setNativeProps({
        style: {
          color: this.iconColor(progress),
        },
      });
      this.props.tabText[this.preTab].setNativeProps({
        style: {
          color: this.iconColor(progress),
        },
      });
    }
    });

    }
    if(value == this.props.activeTab) {
      this.preTab = this.props.activeTab;
    }
    
  },

  //color between rgb(59,89,152) and rgb(204,204,204)
  iconColor(progress) {
    const red = 78 + (102 - 78) * progress;
    const green = 120 + (102 - 120) * progress;
    const blue = 231 + (102 - 231) * progress;
    return `rgb(${red}, ${green}, ${blue})`;
  },

  render() {
    return <View style={[styles.tabs, this.props.style, ]}>
      {this.props.tabs.map((tab, i) => {
        const color = this.props.activeTab === i ? 'rgb(78,120,231)' : 'rgb(102,102,102)';
        return <TouchableOpacity activeOpacity={1}  key={tab} onPress={() => this.props.goToPage(i)} style={styles.tab}>
          <Icon
            name={this.props.tabIcon[i]}
            size={20}
            color={color}
            ref={(icon) => { this.tabIcons[i] = icon; }}
          />
          <Text style={{color: color}}
            ref={(text) => { this.props.tabText[i] = text; }}>
            {this.props.tabText[i]}
          </Text>
        </TouchableOpacity>;
      })}
    </View>;
  },
});

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 5,
  },
  tabs: {
    height: 50,
    flexDirection: 'row',
    paddingTop: 5,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
});

export default MainTabBar;