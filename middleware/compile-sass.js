const sass = require('sass')
const path = require('path')
const fs = require('fs/promises')
const { minify } = require('csso')

const pathToStyles = path.join(__dirname, '../public/stylesheets/')

module.exports = async (req, res, next) => {
  // get sass file names
  const files = await fs.readdir(pathToStyles)
  const sassFiles = files.filter((file) => file.endsWith('.sass'))

  // compile to css and write to file
  sassFiles.forEach(async (file) => {
    const filePath = path.join(pathToStyles, file)
    const cssFilePath = filePath.replace('.sass', '.css')
    const mapFilePath = filePath.replace('.sass', '.css.map')
    const mapComment = `/*# sourceMappingURL=${file.replace('.sass', '.css.map')} */`
    try {
      let result = await sass.compile(filePath, { sourceMap: true })
      // console.log(result.sourceMap)
      let minifiedCss = minify(result.css).css
      minifiedCss += mapComment
      await fs.writeFile(cssFilePath, minifiedCss)
      await fs.writeFile(mapFilePath, JSON.stringify(result.sourceMap))
    } catch (error) {
      console.log(error)
    }
  })

  next()
}
