const Add = require('./add')

/**
 * 执行不存在或错误的命令
 * @param {any} command 命令
 * @param {any} args    参数
 * @returns {() => void}
 */
function Fail (command, args) {
    return () => {
        console.log(`${command} option is not exist`)
        console.log('Run "aflower --help" for more info')
    }
}

module.exports = {
    Add,
    Fail
}
