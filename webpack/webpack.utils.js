import cheerio from 'cheerio'
import path from 'path'
import * as fs from 'fs'
import { Buffer } from 'buffer'

export default {
  svgHelper: class SvgHelper {
    constructor(options = []) {
      this.options = options
      this.plugin = { name: 'CustomeSvgHelper' }
    }

    async apply(compiler) {
      this.options.forEach((file) => this.handleConfigFile(file))

      compiler.hooks.emit.tapAsync(this.plugin.name, async (compilation, callback) => {
        this.options.forEach((file) => this.handleConfigFile(file))

        callback()
      })

      compiler.hooks.assetEmitted.tap(this.plugin, async (src) => {
        const file = this.options.find((o) => o.src === src)

        if (file) this.handleConfigFile(file)
      })
    }

    async handleConfigFile({ src, dest, mode = 'svg' }) {
      const data = await this.readFile(`./${src}`)
      if (!data) return
      const buffer = Buffer.from(data)
      if (buffer) await this.createSvg(dest, mode, buffer)
    }

    async createSvg(dest, mode, buffer) {
      const $ = cheerio.load(buffer, {
        normalizeWhitespace: true,
        xmlMode: true,
      })

      if (mode === 'json') {
        var output = []
        $('symbol').each(function () {
          var $this = $(this)
          var title = $this.find('title').html()
          output.push({ name: title, file: title + '.svg' })
        })

        const readFile = await this.readFile(dest)
        if (readFile && readFile.trim() === JSON.stringify(output).trim()) return

        try {
          await fs.promises.writeFile(dest, JSON.stringify(output))
        } catch (error) {
          /* eslint-disable-next-line no-console */
          console.log(`Somthing went wrong with writing ${dest}`)
        }
      } else {
        var output = []
        $('symbol').each(function () {
          var $this = $(this)
          var $title = $this.find('title')
          var title = '$icon-' + $title.html() + ': '
          $title.remove()
          var $output = cheerio.load('<svg>' + $this.html() + '</svg>', {
            xmlMode: true,
          })
          var $tag = $output('svg')
            .first()
            .attr('xmlns', 'http://www.w3.org/2000/svg')
            .attr('viewBox', this.attribs.viewBox)
          output.push(title + "'" + $output.html() + "';")
        })

        const readFile = await this.readFile(dest)
        if (readFile && readFile.trim() === output.join('\n').trim()) return

        try {
          await fs.promises.writeFile(dest, output.join('\n'))
        } catch (error) {
          /* eslint-disable-next-line no-console */
          console.log(`Somthing went wrong with writing ${dest}`)
        }
      }
    }

    async readFile(dest) {
      try {
        return await fs.promises.readFile(dest, 'utf8')
      } catch (e) {
        return null
      }
    }
  },

  getSites(dir, files_ = []) {
    const files = fs.readdirSync(dir)
    for (let file of files) {

      const filePath = `${dir}/${file}`
      if(path.extname(file) === '.ejs') {
        files_.push(filePath)
      }

      if (fs.statSync(filePath).isDirectory()) {
        this.getSites(filePath, files_)
      }
    }
    return files_
  },
}
