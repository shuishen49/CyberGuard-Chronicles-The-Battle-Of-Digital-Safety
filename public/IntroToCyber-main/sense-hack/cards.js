// 你可以新增场景，但每个场景必须保证：
// * 仅 1 张黑客卡（hackerCard）
// * 正好 3 张玩家卡（playerCards）

var scenarios = [
  {
    hackerCard : {
      description : "我搭建了一个假冒 Wi-Fi 热点，窃取人们的邮箱并追踪他们的上网行为。",
      power : 4,
    },
    playerCards : [
      {
        description : "我从来不连公共 Wi-Fi。",
        power : 5,
      },
      {
        description : "我会上网浏览，但绝不在公共 Wi-Fi 下处理任何个人事务。",
        power : 3,
      },
      {
        description : "公共场合的 Wi-Fi 我都连。",
        power : 1,
      }
    ]
  },
  {
    hackerCard : {
      description : "我冒充你的银行发了一封伪造邮件，向你索要账户信息。",
      power : 3,
    },
    playerCards : [
      {
        description : "我检查了发件邮箱——这封邮件不是银行发来的。",
        power : 5,
      },
      {
        description : "我从不通过邮件回复任何个人信息。",
        power : 4,
      },
      {
        description : "我把你要的账户信息发过去了，让你帮我查一下。",
        power : 1,
      }
    ]
  },
  {
    hackerCard : {
      description : "我从你在社交媒体上发布的个人信息里，推断出了你的住址。",
      power : 3,
    },
    playerCards : [
      {
        description : "我从不在社交媒体账号里发布个人信息。",
        power : 5,
      },
      {
        description : "我把账号设为私密，只有好友能看到。",
        power : 4,
      },
      {
        description : "我什么都打卡，让朋友们随时知道我在做什么。",
        power : 1,
      }
    ]
  },
  {
    hackerCard : {
      description : "我偷看你输入密码，然后入侵了你的账号。",
      power : 2,
    },
    playerCards : [
      {
        description : "我每个账号都使用不同的密码。",
        power : 4,
      },
      {
        description : "我所有账号的密码都一样，所以我把它们全改了。",
        power : 2,
      },
      {
        description : "我直接删了那个账号，重新注册一个。",
        power : 1,
      }
    ]
  },
  {
    hackerCard : {
      description : "我查看你手机上的浏览历史，了解你都在网上做什么。",
      power : 2,
    },
    playerCards : [
      {
        description : "我一直使用不保存历史记录的隐私浏览器。",
        power : 4,
      },
      {
        description : "我把浏览器设置为每次退出都自动清除历史。",
        power : 3,
      },
      {
        description : "我从不清浏览历史，因为不想再敲长长的网址。",
        power : 1,
      }
    ]
  },

  {
    hackerCard : {
      description : "我入侵了你的系统，你的所有数据已被删除。",
      power : 2,
    },
    playerCards : [
      {
        description : "我遵循 3-2-1 备份原则，本地和异地（云存储）都有备份。",
        power : 4,
      },
      {
        description : "我把数据备份在了本地和外置硬盘上。",
        power : 3,
      },
      {
        description : "我从来没有备份过任何数据。",
        power : 1,
      }
    ]
  },

  {
    hackerCard : {
      description : "我递给你一个 U 盘用来传文件。",
      power : 2,
    },
    playerCards : [
      {
        description : "我用杀毒软件和防火墙保护我的系统。",
        power : 4,
      },
      {
        description : "我没装杀毒软件和防火墙，所以拒绝使用你的 U 盘。",
        power : 3,
      },
      {
        description : "我用了你的 U 盘，反正系统坏了我也不怕。",
        power : 1,
      }
    ]
  },
  {
    hackerCard : {
      description : "我会用勒索软件、恶意软件和数据泄露搞垮你的脆弱系统。",
      power : 2,
    },
    playerCards : [
      {
        description : "你做不到，我已经为操作系统打开了自动更新。",
        power : 4,
      },
      {
        description : "我使用 Chrome 或 Firefox 这类会频繁自动接收安全更新的浏览器。",
        power : 3,
      },
      {
        description : "我既不更新软件，也不下载安全更新。",
        power : 1,
      }
    ]
  }
];
