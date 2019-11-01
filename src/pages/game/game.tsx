import Taro, { useState, useEffect } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import classnames from 'classnames';
import Tunnel from '../../lib/tunnel'

// 文案
const WIN_TEXTS = ['很棒', '秒杀', '赢了', 'Winner', '胜利', '不要大意', '无敌啊'];
const LOSE_TEXTS = ['失误', '卧槽', '不可能', 'Loser', '行不行啊', '加油', '大侠再来'];
const EQ_TEXTS = ['平局', '平分秋色', '对方学你', '照镜子', '半斤八两', '换一个', '一样的'];
const pickText = texts => texts[Math.floor(texts.length * Math.random())];

const choiceImgs = {
  1: 'https://oss-public.fangdd.com/prod/static/FoFmMnZj5p-_guwM8EdX_nxsY9uZ.png?imageView2/0/w/640',
  2: 'https://oss-public.fangdd.com/prod/static/Fh3dQeGqu5aV5Fx_L1op4-3V0VKK.png?imageView2/0/w/640',
  3: 'https://oss-public.fangdd.com/prod/static/FqoeRh8GFhiAWAa7sYBUJv-xHvnF.png?imageView2/0/w/640',
}

export default function Game() {
  const [_tunnel, set_tunnel] = useState(null)
  const [connected, setConnected] = useState(false)
  const [userInfo, setUserInfo] = useState({})  // 我的信息
  const [otherInfo, setOtherInfo] = useState({})  // 对方信息
  const [gameInfo, setGameInfo] = useState('')
  const [status, setStatus] = useState({
    finding: false,
    playing: false,
    done: false,
  })
  const [myChoice, setMyChoice] = useState(Math.floor(Math.random() * 10000) % 3 + 1)
  const [yourChoice, setYourChoice] = useState(0)
  const [lastMove, setLastMove] = useState(0)
  const [scoreInfo, setScoreInfo] = useState({
    myScore: 0,
    myStreak: 0,
    yourScore: 0,
    yourStreak: 0,
    win: null
  })
  const [startButtonText, setStartButtonText] = useState('开始')

  let countdownId;

  async function connect() {
    const tunnel = new Tunnel();
    try {
      await tunnel.connect()
    } catch (error) {
      throw new Error('connect error!')
    }
    set_tunnel(tunnel)
    setGameInfo('准备')
    setConnected(true)

    tunnel.on('close', () => {
      setConnected(false)
      setGameInfo('连接已中断')
    });

    tunnel.on('id', ({ uname, uid, uavatar }) => {
      setUserInfo({ uid, uname, uavatar })
    });

    // 游戏开始，初始化对方信息，启动计时器
    tunnel.on('start', packet => {
      const you = packet.players.filter(user => user.uid !== userInfo.uid).pop();
      setStatus(preStaus => ({ ...preStaus, finding: true }))
      setGameInfo('正在寻找玩伴...')

      setTimeout(() => {
        setOtherInfo({
          youHere: true,
          yourName: you.uname,
          yourAvatar: you.uavatar,
        })
        setStatus(preStaus => ({ ...preStaus, finding: false, playing: true }))
        setGameInfo('准备')
      }, 10);

      let gameTime = packet.gameTime;
      clearInterval(countdownId);
      countdownId = setInterval(() => {
        if (gameTime > 0) {
          setGameInfo(--gameTime)
        } else {
          clearInterval(countdownId);
        }
      }, 1000);

      tunnel.emit('choice', { choice: myChoice });
    });

    // 对方有动静的时候，触发提醒
    let movementTimer: any = 0;
    const movementTimeout = 300;
    tunnel.on('movement', packet => {
      setOtherInfo(preOtherInfo => ({ ...preOtherInfo, yourMove: lastMove == 1 ? 2 : 1 }))
      clearTimeout(movementTimer);
      movementTimer = setTimeout(() => {
        setLastMove(otherInfo.yourMove)
        setOtherInfo(preOtherInfo => ({ ...preOtherInfo, yourMove: 0 }))
      }, movementTimeout);
    });

    // 服务器通知结果
    tunnel.on('result', packet => {

      // 清除计时器
      clearInterval(countdownId);

      // 双方结果
      const myResult = packet.result.find(x => x.uid === userInfo.uid);
      const yourResult = packet.result.find(x => x.uid !== userInfo.uid);

      // 本局结果
      let gameInfo, win = 'nobody';

      if (myResult.roundScore == 0 && yourResult.roundScore == 0) {
        gameInfo = pickText(EQ_TEXTS);
      }
      else if (myResult.roundScore > 0) {
        gameInfo = pickText(WIN_TEXTS);
        win = 'me';
      }
      else {
        gameInfo = pickText(LOSE_TEXTS);
        win = 'you'
      }

      setGameInfo(gameInfo)
      setScoreInfo({
        myScore: myResult.totalScore,
        myStreak: myResult.winStreak,
        yourScore: yourResult.totalScore,
        yourStreak: yourResult.winStreak,
        win,
      })
      setYourChoice(yourResult.choice)
      setStartButtonText(win == 'you' ? "不服" : "再来")
      setStatus(preStaus => ({ ...preStaus, done: true }))

      setTimeout(() => setStatus(preStaus => ({ ...preStaus, playing: false })), 1000);
    });
  }

  useEffect(() => {
    const userData = Taro.getStorageSync('userInfo')
    if(!userData) {
      Taro.navigateTo({ url: '/pages/login/login' })
      return
    }
    connect();
  }, [userInfo.uid])

  // 点击手势，更新选择是石头、剪刀还是布
  const switchChoice = () => {
    if (!status.playing) return;
    let choice = myChoice + 1;
    if (choice == 4) {
      choice = 1;
    }
    setMyChoice(choice)
    _tunnel.emit('choice', { choice });
  }

  // 点击开始游戏按钮，发送加入游戏请求
  const startGame = () => {
    if (status.playing) return;
    if (!connected) return;

    // setOtherInfo({})

    setStatus({
      playing: false,
      done: false,
      finding: true,
    })
    setGameInfo('正在寻找玩伴...')
    _tunnel.emit('join');
  }

  const requestComputer = () => {
    if (_tunnel) {
      _tunnel.emit('requestComputer');
    }
  }

  return (
    <View className={classnames('root', {['connected']: connected, ['finding']: status.finding, ['playing']: status.playing, ['done']: status.done})}>
      <View className='my-side'>
        <Image className='avatar' src={userInfo.uavatar} mode='aspectFill' />

        <Image className={classnames('hand', {['win']: scoreInfo.win === 'me'})} src={choiceImgs[myChoice]} onClick={switchChoice}></Image>

        <Text className='score'>
          {userInfo.uname}
          得分 {scoreInfo.myScore}
        </Text>
        <Text className='streak'>
          连胜 {scoreInfo.myStreak}
        </Text>
      </View>
      <View className={classnames('your-side', { ['here']: otherInfo.youHere, [`move-${otherInfo.yourMove}`]: otherInfo.yourMove })}>
        <Image className='avatar' src={otherInfo.yourAvatar} mode='aspectFill' />

        <Image className={classnames('hand', { ['win']: scoreInfo.win == 'you' })} src={choiceImgs[yourChoice]} />

        <Text className='score'>
          {otherInfo.yourName}
          得分 {scoreInfo.yourScore}
        </Text>
        <Text className='streak'>
          连胜 {scoreInfo.yourStreak}
        </Text>
      </View>

      <View className='game-info'>{gameInfo}</View>

      <Button className='start-game' type='primary' onClick={startGame}>{startButtonText}</Button>
      <Button className='request-computer' onClick={requestComputer}>跟机器人玩</Button>
    </View>
  )
}
