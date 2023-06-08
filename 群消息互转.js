import plugin from "../../lib/plugins/plugin.js"
// import { segment } from 'icqq'   // TRSS-Yunzai使用需要注释此行

const group = [
  "86109451662629932-13023414",
  "682801951"
]

const name = {
  "86109451662629932-13023414": {
    name: "闲聊大厅",
    scene: "频道"
  },
  "423486321": {
    name: "本地测试",
    scene: "群"
  }
}

export class forward extends plugin {
  constructor() {
    super({
      name: "消息转发",
      dsc: "群消息互转",
      event: "message.group",
      priority: 5000,
      rule: [
        {
          reg: "^#当前id$",
          fnc: "id"
        },
        {
          reg: "^.*(?!#当前id)$",
          fnc: "forwardmessages",
          log: false
        }
      ]
    })
  }

  async forwardmessages(e) {
    if (!group.includes(`${e.group_id.toString()}`)) return

    let msg = [`${name[e.group_id].scene}消息转发\n来自${name[e.group_id].scene}：${name[e.group_id].name}\n发送者：${e.sender.card || e.sender.nickname}\n消息内容：`]
    msg.push(...e.message)

    // 直接发送e.message回导致动图变成图片，单独处理表情包图片
    const urls = msg
      .filter(item => item.type === 'image')
      .map(item => item.url)

    for (let i = msg.length - 1; i >= 0; i--) {
      if (msg[i].type === 'image') {
        msg.splice(i, 1)
      }
    }

    msg.push(...urls.map(url => segment.image(url)))

    for (let i = 0; i < group.length; i++) {
      if (group[i] === e.group_id.toString()) {
        continue
      }
      await test(Bot.pickGroup(group[i]))
    }

    async function test(e) {
      await e.sendMsg(msg)
    }
  }
  async id(e) {
    e.reply(e.group_id)
  }
}

