#!/usr/bin/env node

const select = require('cli-select')
const exec = require('child_process').execSync
const Fuse = require('fuse.js')
const chalk = require('chalk')

const commandLineArgs = require('command-line-args')

const optionDefinitions = [
    { name: 'force', alias: 'f', type: Boolean },
    { name: 'branch', type: String, multiple: false, defaultOption: true },
]

const args = commandLineArgs(optionDefinitions)

async function start(result, args) {
    let options = result
        .trim()
        .split('\n')
        .map(x => x.replace('*','').trim())
        .map(x => {return {branch: x}})
    
    let fuseOpts = {
        shouldSort: true,
        threshold: 0.6,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        includeScore: true,
        keys: [
            "branch"
        ]
    }

    let fuse = new Fuse(options, fuseOpts)
    let searchResults = fuse.search(args.branch)

    searchResults.sort((a,b) => {
        if(a.score == b.score) return a.item.branch.length - b.item.branch.length

        return a.score - b.score
    })

    options = searchResults
        .filter(x => x.score < 0.4)
        .slice(0, 10)
        .map(x => x.item.branch)

    let selected = ''
    if(args.force) {
        selected = options[0]
    } else {     
        let response = await select({
            values: options,
            selected: chalk.yellow('▶'),
            unselected: ' ',
            indentation: 2,
            valueRenderer: (value, selected) => {
                if (selected) {
                    return chalk.yellow(value)
                }
            
                return chalk.white(value)
            },
        })

        selected = response.value
    }

    exec('git checkout ' + selected)
}

let list = exec('git branch').toString()

if(!args.branch) {
    console.error(chalk.red('no branch name provided'))
    process.exit()
}

;(async () => {
    try {
        await start(list, args)
    } catch(e) {
        // if(e) console.error(e)
    }
})()