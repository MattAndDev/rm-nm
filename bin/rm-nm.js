#!/usr/bin/env node
const [,, ...args] = process.argv
new (require('../index'))(args).run()
