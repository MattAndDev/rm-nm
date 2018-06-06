const utils = require('./utils')
const path = require('path')

class RmNodeModules {

  constructor (args) {
    let opt = {
      s: false,
      ss: false
    }
    this.args = Object.assign(opt, utils.mapArgs(args))
    this.args.cwd = (!this.args.target) ? process.cwd() : path.resolve(this.args.target)
  }

  async run () {
    let nodeDirs = await utils.getNodeDirs(this.args.cwd)
    if (!nodeDirs.length) {
      console.log('No directories found')
      return
    }
    let dirsToRemove = await this.applyArgs(nodeDirs)
    if (!dirsToRemove.length) {
      console.log(`No directories found with current options`)
      return
    }
    let dirs = await utils.deleteDirs(dirsToRemove)
    let totalSizeInMb = (dirs.reduce((a, b) => +a +b.size, 0) / 1000000)
    console.log(`Deleted ${dirs.length} node_modules folders, freed ${totalSize}MB of memory`)
    return
  }

  async applyArgs (dirs) {
    if (this.args.ss) {
      return dirs.filter(dir => dir.packageJson && !dir.packageLockJson )
    }
    if (this.args.s) {
      return dirs.filter(dir => dir.packageJson )
    }
    return dirs
  }
}
module.exports = RmNodeModules
