const path = require('path')
const fs = require('fs')
// https://github.com/showdownjs/showdown
const showdown = require('showdown')
const xssFilter = require('showdown-xss-filter')
const {classMap} = require('../config')

const resolve = (d, ...p) => path.resolve(d, ...p) // Return to absolute path of file
const converter = new showdown.Converter({
  tables: true,
  extensions: [xssFilter, ...classMap],
  noHeaderId: true, // important to add this, else regex match doesn't work
})

const markdownToHtml = markdown => converter.makeHtml(markdown)

const strToTimeStamp = str => Date.parse(new Date(str.replace(/-/g, '/')))

const getFiles = dir => { // Get all files
  let results = []
  fs.readdirSync(dir).forEach(file => {
    file = resolve(dir, file)
    const stat = fs.statSync(file)
    stat.isFile()
      ? results.push(file)
      : results.concat(getFiles(file)) // Is directory [...results,...readFiles(file)]
  })
  return results
}

const attrSort = (array, attr, rev = 1) => {
  return rev = rev ? 1 : -1, array.sort((a, b) => {
    return [a, b] = [a[attr], b[attr]], a < b ? rev * -1 : a > b ? rev * 1 : 0
  })
}

const getDirectorys = dir => { // Get all first level folders
  let results = []
  fs.readdirSync(dir).forEach(filePath => {
    filePath = resolve(dir, filePath)
    const stat = fs.statSync(filePath)
    stat.isDirectory() && results.push(filePath)
  })
  return results
}

const base64_encode = file => new Buffer(fs.readFileSync(file)).toString(
  'base64')

const format = (str, obj) => { // Mustache
  return str.replace(/\{([^\}]+)\}\}/gm, (all, self) => { // ECMAScript v3
    const key = self.match(/[^(\{|\}|\s)]/gm).join('')
    return obj ? obj[key] : eval(key)
  })
}

const mdToHtml = filePath => markdownToHtml(fs.readFileSync(filePath, 'utf-8'))

const getCommonRecord = ({
                           host,
                           originalUrl: path,
                         }, date = new Date()) => ({
  host,
  path,
  author: '权川',
  keywords: [
    '日志',
    '代码',
    '编程',
    '分享',
    '技术',
    '软件',
    '开发',
    '运维',
    '云计算',
    '网络',
    '互联网'],
  title: '权川的个人网站',
  subtitle: '这里记录着我的进取之道，本站发布的所有文章涵盖但不仅限于技术。',
  description: '权川的个人网站',
  date: date.toUTCString(),
  caption: '', // article title
  copyright: `Copyright © ️<a class="link-color" target="_blank" href="https://github.com/noteScript/new_blog">noteScript</a> - ${date.getFullYear()}`,
})

module.exports = {
  resolve,
  getFiles,
  getDirectorys,
  getCommonRecord,
  format,
  attrSort,
  strToTimeStamp,
  base64_encode,
  mdToHtml,
}