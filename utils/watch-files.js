const path = require('path')
const fs = require('fs')
const { compileSass } = require('./compile-sass')
const debug = require('debug')('veteranslist:watch-files')
const ignoreDirs = ['node_modules', '.git', '.vscode', 'stylesheets', 'partials']

// get sass file names and watch for changes to sass files
const readDir = dir => {
  fs.readdir(dir, { withFileTypes: true }, (error, dirents) => {
    if (!error) {
      dirents.forEach(dirent => {
        const pathName = path.join(dir, dirent.name)
        if (dirent.isFile() && dirent.name.endsWith('.sass')) {
          fs.watch(pathName, async event => {
            if (event === 'change') {
              await compileSass()
              global.sendRefresh()
              debug(`${dirent.name} changed, browser refreshed.`)
            }
          })
          debug(`Watching ${dirent.name}`)
        } else if (dirent.isDirectory()) {
          if (!ignoreDirs.includes(dirent.name)) {
            fs.watch(pathName, event => {
              if (event === 'change') {
                global.sendRefresh()
                debug(`${dirent.name} changed, browser refreshed.`)
              }
            })
            debug(`Watching ${pathName}`)
            readDir(pathName)
          }
        }
      })
    } else {
      debug(error)
    }
  })
}

module.exports = readDir
