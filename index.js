const utils = require('./utils')
const path = require('path')
const fs = require('fs')

class RmNodeModules {
  constructor (args) {
    let opt = {
      s: false,
      ss: false
    }
    this.args = Object.assign(opt, utils.mapArgs(args))
    this.args.cwd = (!this.args.target) ? process.cwd() : path.resolve(this.args.target)
  }

  run () {
    // this ensures a catch for any bubbling error
    this.wrap().catch((e) => { console.error(e) })
  }

  async wrap () {
    // if passed folder does not exists
    if (!await fs.existsSync(this.args.cwd)) {
      throw new Error(`Cannot find entry point directory:\n${this.args.cwd}`)
    }
    // get all first level node dirs
    let nodeDirs = await utils.getNodeDirs(this.args.cwd)
    // if none inform and return
    if (!nodeDirs.length) {
      console.log(`No 'node_modules' directories found`)
      return
    }
    let dirsToRemove = await this.applyArgs(nodeDirs)
    if (!dirsToRemove.length) {
      console.log(`No directories found with current options`)
      return
    }
    let dirs = await utils.deleteFoldersRecursive(dirsToRemove)
    let totalSizeInMb = (dirs.reduce((a, b) => +a + b.size, 0) / 1000)
    console.log(`Deleted ${dirs.length} node_modules folders, freed ${totalSizeInMb}KB of memory`)
  }

  async applyArgs (dirs) {
    if (this.args.ss) {
      return dirs.filter(dir => dir.packageJson && dir.packageLockJson)
    }
    if (this.args.s) {
      return dirs.filter(dir => dir.packageJson)
    }
    return dirs
  }
}
module.exports = RmNodeModules
