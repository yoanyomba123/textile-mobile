import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import TextileImage from '../TextileImage'
import Avatar from '../Avatar'
import Icon from '../Icon'
import * as s from '../../Themes/Constants'
import {ContactInfo, ThreadFilesInfo} from '../../NativeModules/Textile'

import styles, { cardImageStyle, ICON_WIDTH, ROW_COLUMN } from './statics/styles'

interface ScreenProps {
  id: string
  name: string
  members: ContactInfo[]
  thumb?: ThreadFilesInfo
  onPress: (groupCardProps: any) => void
}

const GroupCard = (props: ScreenProps) => {
  const { name, members, thumb } = props
  const getCallback = () => {
    return () => {
      props.onPress(props)
    }
  }
  const getThumb = (): JSX.Element => {
    if (thumb) {
      return (
        <View style={styles.imageContainer}>
          <View style={styles.imageStretch}>
            <TextileImage
              target={thumb.target}
              index={0}
              forMinWidth={ICON_WIDTH}
              resizeMode={'cover'}
              style={{height: ROW_COLUMN}}
            />
          </View>
        </View>
      )
    }
    return (
      <Icon
        style={styles.iconStyle}
        name={'image'}
        size={ICON_WIDTH}
        color={s.COLOR_FONT_DARK_ON_LIGHT_LIGHT}
      />
    )
  }
  return (
    <TouchableOpacity
      style={styles.groupCard}
      activeOpacity={0.95}
      // ts-ignore
      onPress={getCallback()}
    >
      <View style={styles.groupLeftColumn}>
          {getThumb()}
      </View>
      <View style={styles.groupMiddleColumn}>
        <Text numberOfLines={1} style={styles.groupName}>{name}</Text>
      </View>
      <View style={styles.groupRightColumn}>
        <View style={styles.avatarContainer}>
          { members.slice(0, 8).map((mem: ContactInfo, i: number) => {
            const imageStyle = cardImageStyle(members.length, i)
            return (<Avatar key={mem.id} style={imageStyle} target={mem.avatar}/>)
          })}
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default GroupCard
