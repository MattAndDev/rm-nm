#!/usr/bin/env node
const [/* executor */, /* package */, ...args] = process.argv
new (require('../index'))(args).run()
