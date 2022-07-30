const path = require('path')
const { minify } = require('csso')
const sass = require('sass')
const fs = require('fs')

const logError = error => {
  if (error) {
    console.log(error)
  }
}

// compile sass to css and write to file
const compileSass = () => {
  const pathToStyles = path.join(__dirname, '../public/stylesheets/')

  fs.readdir(pathToStyles, (error, files) => {
    if (!error) {
      const sassFiles = files.filter(file => file.endsWith('.sass'))

      sassFiles.forEach(async file => {
        const filePath = path.join(pathToStyles, file)
        const cssFilePath = filePath.replace('.sass', '.css')
        const mapFilePath = filePath.replace('.sass', '.css.map')
        const mapComment = `/*# sourceMappingURL=${file.replace('.sass', '.css.map')} */`
        try {
          const result = await sass.compile(filePath, { sourceMap: true })
          let minifiedCss = minify(result.css).css
          minifiedCss += mapComment
          fs.writeFile(cssFilePath, minifiedCss, logError)
          fs.writeFile(mapFilePath, JSON.stringify(result.sourceMap), logError)
        } catch (error) {
          console.log(error)
        }
      })
    }
  })
}

module.exports = { compileSass }
