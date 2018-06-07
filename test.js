const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const utils = require('./utils')
const testDirs = [
  {
    name: 'plain',
    exec: 'mkdir -p node_modules && echo -e "test-it" >> node_modules/test.txt'
  },
  {
    name: 'with-package',
    exec: 'echo "{}" >> package.json && npm i ./ lodash && rm package-lock.json'
  },
  {
    name: 'with-package-and-lock',
    exec: 'echo "{}" >> package.json && npm i ./ lodash'
  }
]

// generate all test dirs
const generate = async () => {
  testDirs.forEach(async (testDir) => {
    await fs.mkdirSync(`./test/${testDir.name}`)
    let execPath = path.resolve(`./test/${testDir.name}/`)
    await execSync(testDir.exec, { cwd: execPath, stdio: 'ignore' })
  })
}
// generate all test dirs
const clean = async () => {
  await utils.deleteFoldersRecursive([{ path: './test' }])
}

// test
const test = async () => {
  let testDir = './test'
  // create
  await fs.mkdirSync(testDir)
  await generate()
  await execSync(`node ./bin/rm-node-modules ${testDir}`)
  let result = await execSync(`find ${testDir} -name node_modules\*`).toString()
  if (result.length !== 0) {
    throw new Error(`Expected no result from 'find ${testDir} -name node_modules\*' got\n${result}`)
  }
  await clean()

}


const testWrap = () => {
  test().catch((e) => { console.error(e) })
}
module.exports = testWrap()