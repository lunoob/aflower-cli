import enquirer from 'enquirer'

enquirer
    .prompt([
        {
            type: 'toggle',
            name: 'auto',
            message: '是否需要使用 npm 自动安装以下依赖?',
            enabled: 'Yes',
            disabled: 'No',
            initial: 0
        }
    ])
    .then(res => {
        console.log('then', res)
    })
    .catch(() => {})
