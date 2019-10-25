import Taro, { useEffect } from '@tarojs/taro'
import { View, Image, Button } from '@tarojs/components'
import classnames from 'classnames';
import img1 from '../../images/1.png';
import img2 from '../../images/2.png';
import img3 from '../../images/3.png';

const connected = false;
const finding = false;
const playing = false;
const done = false;
const myAvatar = '';

export default function Game() {
  useEffect(() => {
    console.log(111)
  })
  const switchChoice = () => {

  }
  const startGame = () => {

  }
  const requestComputer = () => {

  }
  startGame
  const myName = '';
  const myScore = '';
  const myStreak = '';
  const youHere = '';
  const yourMove = '';
  let win = '';
  const yourName = '';
  const yourScore = '';
  const yourStreak = '';
  const gameInfo = '';
  const startButtonText = '';
  return (
    <View className={classnames('root', {['connected']: connected, ['finding']: finding, ['playing']: playing, ['done']: done})}>
        <View className='my-side'>
            <Image className='avatar' src={myAvatar} mode='aspectFill' />

            <Image className={classnames('hand', {['win']: win === 'me'})} src={img1} onClick={switchChoice}></Image>

            <text className='score'>
                {myName}
                得分 {myScore}
            </text>
            <text className='streak'>
                连胜 {myStreak}
            </text>
        </View>
        <View className={classnames('your-side', { ['here']: youHere, [`move-${yourMove}`]: yourMove })}>
            <Image className='avatar' src={img2} mode='aspectFill' />

            <Image className={classnames('hand', { ['win']: win == 'you' })} src={img3}></Image>

            <text className='score'>
                {yourName}
                得分 {yourScore}
            </text>
            <text className='streak'>
                连胜 {yourStreak}
            </text>
        </View>

        <View className='game-info'>{gameInfo}</View>

        <Button className='start-game' type='primary' onClick={startGame}>{startButtonText}</Button>
        <Button className='request-computer' onClick={requestComputer}>跟机器人玩</Button>
    </View>
  )
}
