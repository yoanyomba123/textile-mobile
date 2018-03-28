import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView, Image, Button, View } from 'react-native'
import { connect } from 'react-redux'
import HeaderButtons from 'react-navigation-header-buttons'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/OnboardingScreenStyle'
import Ionicon from "react-native-vector-icons/Ionicons";

class OnboardingScreen3 extends Component {

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    return {
      headerTitle: 'Share',
      headerRight: (
        <HeaderButtons IconComponent={Ionicon} iconSize={23} color='blue'>
          <HeaderButtons.Item title='Next' onPress={() => navigation.navigate('OnboardingBetaWelcome')} />
        </HeaderButtons>
      )
    }
  };

  render () {
    const { navigate } = this.props.navigation
    return (
      <View style={{flex:1}}>
        <ScrollView style={styles.container}>
          <KeyboardAvoidingView behavior='position'>
            <Text style={styles.header}>Share with friends and family</Text>
            <View style={styles.imageView}>
              <Image
                style={styles.imageIcon}
                source={require("../Images/Onboarding/cloud-share.png")}
              />
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
        <Button
          onPress={() => navigate('OnboardingBetaWelcome')}
          title="Ok"
          accessibilityLabel="Move on to the next screen"
        />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OnboardingScreen3)
