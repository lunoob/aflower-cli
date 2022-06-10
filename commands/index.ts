export { default as Add } from './add'

/**
 * 执行不存在或错误的命令
 * @returns {any}
 */
export function Fail (command: any | string, args: string) {
  return () => {
    console.log(`${command} option is not exist`)
    console.log('Run "aflower --help" for more info')
  }
}
