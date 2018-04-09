// @flow
import React from 'react'
import {View, Text, ImageBackground, Dimensions} from 'react-native'
import { Overlay, Button } from 'react-native-elements'

// More info here: https://facebook.github.io/react-native/docs/flatlist.html

// Styles
import styles from './Styles/LogViewStyle'
import Actions from '../Redux/TextileRedux'
import { connect } from 'react-redux'

class PairingView extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
      limit: 10
    }
  }

  confirmPairing = (peerId, pubKey) => {
    this.props.pairNewDevice(peerId, pubKey)
    this.props.navigation.navigate('TextilePhotos')
  }

  cancelPairing = () => {
    this.props.navigation.navigate('TextilePhotos')
  }

  getParams(url) {
    let query = url.split('?')[1]
    let vars = query.split('&')
    let queryString = {}
    for (let i = 0; i < vars.length; i++) {
      let pair = vars[i].split('=')
      // If first entry with this name
      if (typeof queryString[pair[0]] === 'undefined') {
        queryString[pair[0]] = decodeURIComponent(pair[1])
        // If second entry with this name
      } else if (typeof queryString[pair[0]] === 'string') {
        let arr = [queryString[pair[0]], decodeURIComponent(pair[1])]
        queryString[pair[0]] = arr
        // If third or later entry with this name
      } else {
        queryString[pair[0]].push(decodeURIComponent(pair[1]))
      }
    }
    return queryString
  }
  render () {
    let code = 'WARN'
    let pubKey = null
    let peerId = null
    if (this.props.navigation.state.params.data) {
      let params = this.getParams(this.props.navigation.state.params.data)
      if ('code' in params) {
        code = params['code']
      }
      if ('key' in params) {
        pubKey = params['key']
      }
      if ('peerId' in params) {
        peerId = params['peerId']
      }
    }

    const onConfirm = this.confirmPairing(peerId, pubKey)

    return (
      <ImageBackground
        source={require('../Images/backgrounds/log-background.png')}
        style={styles.backgroundImage}>
        <Overlay
          isVisible='true'
          windowBackgroundColor='rgba(0, 0, 0, .2)'
          width={Dimensions.get('window').width * 0.8}
          height='auto'
        >
          <View style={{alignSelf: 'center'}}>
            <Text style={{alignSelf: 'center'}}>New Device Request</Text>
            <Text style={{fontWeight: 'bold', fontSize: 50, margin: 40}}>{code}</Text>
            <Button buttonStyle={{
              height: 45,
              borderColor: 'transparent',
              borderWidth: 0,
              borderRadius: 5
            }} title='Pair Device' onPress={onConfirm} />
            <Button buttonStyle={{
              backgroundColor: 'rgba(66, 22, 77, 1)',
              height: 45,
              borderColor: 'transparent',
              borderWidth: 0,
              borderRadius: 5,
              marginVertical: 20
            }} title='Not Now' onPress={this.cancelPairing} />
          </View>
        </Overlay>
      </ImageBackground>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    pairNewDevice: (peerId, pubkey) => { dispatch(Actions.pairNewDevice(peerId, pubkey)) }
  }
}

export default connect(mapDispatchToProps)(PairingView)
