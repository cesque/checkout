const commandLineArgs = require('command-line-args')

const optionDefinitions = [
    { name: 'force', alias: 'f', type: Boolean },
    { name: 'merge', alias: 'm', type: Boolean },
    { name: 'branch', type: String, multiple: false, defaultOption: true },
]

const args = commandLineArgs(optionDefinitions)

module.exports = args