const fs = require('fs')
const path = require('path')

module.exports = {
  /**
  *  utils.mapArgs
  *  given a raw process.argvs array returns a config object
  *  NOTE: only single dash options are allowes (-rule 'with string value')
  *
  *  @param {Array} args - process.argv type array
  *  @return {Array} array of strings with the found files
  */
  mapArgs (args) {
    let mArgs = args.map((e, i, a) => {
      let opt = (e.indexOf('-') === 0) ? e.substring(1) : false
      if (!opt && i !== 0) return null
      if (!opt && i === 0) return { target: e }
      let hasValue = a[i+1] && a[i+1].indexOf('-') !== 0
      let res = (hasValue) ? { [opt]: a[i+1] } : {[opt]:  true}
      return res
    })
    return Object.assign({}, ...mArgs.filter(a => a))
  }

  ,

  /**
 *  utils.getAllFilesRecursively
 *  given path (relative) and regex returns all amtching files
 *  NOTE: regex tests the whole path
 *  @TODO: better path handling
 *
 *  @param {String} baseDir - relative path to inspect for files
 *  @param {regex} regex - a vali regular expression
 *  @param {Array} results - for iteratee results
 *  @param {Integer} iteration - index for iteratee
 *  @param {String} cwd - current search path for iteratee
 *  @return {Array} array of strings with the found files
 */
 async getNodeDirs (baseDir, results = [], iteration = 0, cwd = baseDir) {
   let contents = await fs.readdirSync(cwd)
   let currentPath = cwd
   for (var i = 0; i < contents.length; i++) {
     let isNodeModules = contents[i] === 'node_modules'
     let hasPackageJson = fs.existsSync(`${cwd}/package.json`)
     let hasPackageJsonLock = fs.existsSync(`${cwd}/package-lock.json`)
     let currentPath =`${cwd}/${contents[i]}`
     if (isNodeModules) {
       results.push({
         path: currentPath,
         packageJson: hasPackageJson,
         packageLockJson: hasPackageJsonLock
       })
     }
     let isDir = fs.statSync(currentPath).isDirectory()
     if (isDir && !isNodeModules) {
       await this.getNodeDirs(baseDir, results, iteration + 1, currentPath)
     }
   }
   return results
 },

 async deleteFolderRecursive (path, size = 0) {
   let contents = await fs.readdirSync(path)
   for (var i = 0; i < contents.length; i++) {
     let currentPath =`${path}/${contents[i]}`
     if(fs.lstatSync(currentPath).isDirectory()) {
       await this.deleteFolderRecursive(currentPath, size);
     }
     else {
       size = size + await fs.statSync(currentPath).size
       fs.unlinkSync(currentPath);
      }
    }
  fs.rmdirSync(path)
  return size
},

 async deleteDirs (dirs) {
   for (var i = 0; i < dirs.length; i++) {
     let deletedSize = await this.deleteFolderRecursive(dirs[i].path)
     dirs[i].size = deletedSize
   }
   return dirs
 }
}