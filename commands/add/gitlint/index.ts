import packageJson from '../../../package.json'

// 检测 package.json 是否安装了这些依赖
// 如果都安装了才进行脚本命令

// const msgList = [
//     '请先安装一下依赖:',
//     'commitizen husky lint-staged @commitlint/config-conventional',
//     '',
//     '安装完之后再运行命令'
// ]

// msgList.forEach(msg => {
//     console.log(msg)
// })

export default () => {
  console.log(packageJson)
}
