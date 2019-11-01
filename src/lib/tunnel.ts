import Taro from '@tarojs/taro'
import Emitter from './emitter'
import config from '../config'

const baseUrl = config.ws[process.env.NODE_ENV];

class Tunnel {
  public emitter: any = {}

  public task: any

  constructor() {
    Emitter.setup(this.emitter);
  }

  async connect() {
    const task = this.task = await Taro.connectSocket({
      url: baseUrl,
      header: {
        token: Taro.getStorageSync('token')
      },
      success: function () {
        console.log('connect success')
      }
    })

    task.onOpen(function () {
      console.log('onOpen')
    })
    task.onMessage(packet => {
      try {
        const { message, data } = JSON.parse(packet.data);
        this.emitter.emit(message, data);
      } catch (e) {
        console.log('Handle packet failed: ' + packet, e);
      }
    })
    task.onError(() => {
      console.log('onError')
    })
    task.onClose(() => this.emitter.emit('close'))
  }

  on(message, handle) {
    this.emitter.on(message, handle);
  }

  emit(message, data) {
    this.task.send({
      data: JSON.stringify({ message, data })
    });
  }
}

export default Tunnel;
