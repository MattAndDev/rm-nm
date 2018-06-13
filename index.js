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
    let removeDirFileSizes = []
    for (var i = 0; i < dirsToRemove.length; i++) {
      let removedFileSizes = await utils.deleteFolderRecursive(dirsToRemove[i])
      removeDirFileSizes.push(removedFileSizes)
    }
    // flatten
    let removedFileSizes = removeDirFileSizes.reduce((dir, val) => dir.concat(val), []);
    let totalSizeInBits = removedFileSizes.reduce((a, b) => a + b )
    let size = `${totalSizeInBits} bites`
    if (totalSizeInBits > 1000) {
      size = `${Math.round((totalSizeInBits / 1000) * 100) / 100} KB`
    }
    if (totalSizeInBits > 1000000) {
      size = `${Math.round((totalSizeInBits / 1000000) * 100) / 100} MB`
    }
    console.log(`Deleted ${removeDirFileSizes.length} node_modules folders, freed ${size} of memory`)
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
