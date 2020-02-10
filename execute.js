const select = require('cli-select')
const exec = require('child_process').execSync
const Fuse = require('fuse.js')
const chalk = require('chalk')

module.exports = async (branch, merge, force) => {
    async function start(result, branch, merge, force) {
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
        let searchResults = fuse.search(branch)
    
        searchResults.sort((a,b) => {
            if(a.score == b.score) return a.item.branch.length - b.item.branch.length
    
            return a.score - b.score
        })
    
        options = searchResults
            .filter(x => x.score < 0.4)
            .slice(0, 10)
            .map(x => x.item.branch)
    
        let selected = ''
        if(force) {
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
    
        if(merge) {
            console.log('merging branch: ' + chalk.green(selected))
            exec('git merge ' + selected)
        } else {
            console.log('checking out branch: ' + chalk.green(selected))
            exec('git checkout ' + selected)
        }
    }
    
    let list = exec('git branch').toString()
    
    if(!branch) {
        console.error(chalk.red('no branch name provided'))
        process.exit()
    }
    
    try {
        await start(list, branch, merge, force)
    } catch(e) {
        // if(e) console.error(e)
    }
}