interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: '富婆排行榜',
    description: `一个玩梗类的微信小程序，当有人说不想努力的时候，抛出该小程序，赚取可怜的微信广告费用。`,
    imgSrc: '/static/images/projects/rich-woman/code.jpg',
    href: 'blog/projects/rich-woman',
  },
  {
    title: '旧版blog',
    description: `之前在csdn写的blog，已于2023年停更。`,
    imgSrc: '/static/images/projects/old-blog/02.jpg',
    href: 'https://blog.csdn.net/weixin_44050791',
  },
]

export default projectsData
