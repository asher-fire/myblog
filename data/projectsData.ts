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
    title: '2The Time Machine',
    description: `Imagine being able to travel back in time or to the future. Simple turn the knob
    to the desired date and press "Go". No more worrying about lost keys or
    forgotten headphones with this simple yet affordable solution.`,
    imgSrc: '/static/images/time-machine.jpg',
    href: '/blog/the-time-machine',
  },
]

export default projectsData
