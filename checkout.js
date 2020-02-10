#!/usr/bin/env node

let args = require('./args.js')
let f = require('./execute.js')

;(async () => {
    f(args.branch, false, args.force)
})()