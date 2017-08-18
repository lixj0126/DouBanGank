import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Platform,
    TouchableOpacity
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

class NavigationBar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        // leftTitle和leftImage 优先判断leftTitle (即 文本按钮和图片按钮优先显示文本按钮)
    	const { title, leftTitle, leftImage, leftAction, rightTitle, rightImage, rightAction } = this.props;
        return (
            <View style={[styles.barView, this.props.style]}>
            	<View style={ styles.showView }>
            		{
                        leftTitle
                        ?
                        <TouchableOpacity style={styles.leftNav} onPress={ ()=>{leftAction()} }>
                            <View style={{alignItems: 'center'}}>
                                <Text style={styles.barButton}>{leftTitle}</Text>
                            </View>
                        </TouchableOpacity>
                        :
                        (
                            leftImage
                            ?
                            <TouchableOpacity style={styles.leftNav} onPress={ ()=>{leftAction()} }>
                                <View style={{alignItems: 'center'}}>

                                    <Icon
                                        name={leftImage}
                                        size={25}
                                        color='#ffffff'
                                    />
                                </View>
                            </TouchableOpacity>
                            : null
                        )
            		}
		            {
                        title ?
                        <Text style={styles.title}>{title || ''}</Text>
                        : null
		            }
		            {
                        rightTitle ?
                        <TouchableOpacity style={styles.rightNav} onPress={ ()=>{rightAction()} }>
                            <View style={{alignItems: 'center'}}>
                            	<Text style={styles.barButton}>{rightTitle}</Text>
                            </View>
                        </TouchableOpacity>
		            	: (rightImage ?
		            		<TouchableOpacity style={styles.rightNav} onPress={ ()=>{rightAction()} }>
				            	<View style={{alignItems: 'center'}}>
                                    <Icon
                                        name={rightImage}
                                        size={25}
                                        color='#ffffff'
                                    />
				            	</View>
				            </TouchableOpacity>
                            : null
                        )
		            }

		        </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    barView: {
        height: Platform.OS === 'android' ? 44 : 64,
        backgroundColor: '#4E78E7',
    },
    showView: {
    	flex: 1,
    	alignItems: 'center',
    	justifyContent: 'center',
    	flexDirection: 'row',
    	marginTop: Platform.OS === 'android' ? 0 : 20,
    	height: 44,
    },
    title: {
    	color: 'white',
    	fontSize: 18.0,
    },
    leftNav: {
    	position: 'absolute',
    	top: 8,
    	bottom: 8,
    	left: 10,
        width: 26,
    	justifyContent: 'center',
      alignItems: 'center',
    },
    rightNav: {
    	position: 'absolute',
    	right: 10,
    	top: 8,
    	bottom: 8,
      width: 26,
    	justifyContent: 'center',
      alignItems: 'center',
    },
    barButton: {
        color: 'white'
    },
})



export default NavigationBar
