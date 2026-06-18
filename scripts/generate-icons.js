#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

// SVG 内容 - 1024x1024 高清版本用于 App 图标
const appIconSVG = `<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1024" height="1024" rx="230" fill="#00DDB3"/>
  <path d="M 668 282 c -140 0 -192 100 -234 180 l -28 52 c -44 86 -76 136 -162 136 a 40 40 0 0 0 -28 12 a 40 40 0 0 0 0 56 a 40 40 0 0 0 28 12 c 140 0 192 -100 234 -180 l 28 -52 c 44 -86 76 -136 162 -136 a 40 40 0 0 0 28 -12 a 40 40 0 0 0 12 -28 a 40 40 0 0 0 -40 -40 z" 
        fill="white"/>
  <g transform="translate(690, 660)">
    <circle cx="100" cy="100" r="90" 
            stroke="white" 
            stroke-width="36" 
            fill="none"/>
    <line x1="164" y1="164" x2="220" y2="220" 
          stroke="white" 
          stroke-width="36" 
          stroke-linecap="round"/>
  </g>
</svg>`

// 16x16 favicon
const favicon16SVG = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="16" height="16" rx="3" fill="#00DDB3"/>
  <path d="M 10.438 4.328 c -2.188 0 -3 1.562 -3.656 2.812 l -.438 .813 c -.688 1.344 -1.188 2.125 -2.531 2.125 a .625 .625 0 0 0 -.438 .188 a .625 .625 0 0 0 0 .875 a .625 .625 0 0 0 .438 .188 c 2.188 0 3 -1.562 3.656 -2.812 l .438 -.813 c .688 -1.344 1.188 -2.125 2.531 -2.125 a .625 .625 0 0 0 .438 -.188 a .625 .625 0 0 0 .188 -.438 a .625 .625 0 0 0 -.625 -.625 z" 
        fill="white"/>
  <g transform="translate(8.922, 8.25)">
    <circle cx="2.5" cy="2.5" r="2" 
            stroke="white" 
            stroke-width="0.9" 
            fill="none"/>
    <line x1="3.8" y1="3.8" x2="5.2" y2="5.2" 
          stroke="white" 
          stroke-width="0.9" 
          stroke-linecap="round"/>
  </g>
</svg>`

// 32x32 favicon
const favicon32SVG = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" rx="7" fill="#00DDB3"/>
  <path d="M 20.875 8.656 c -4.375 0 -6 3.125 -7.312 5.625 l -.875 1.625 c -1.375 2.688 -2.375 4.25 -5.063 4.25 a 1.25 1.25 0 0 0 -.875 .375 a 1.25 1.25 0 0 0 0 1.75 a 1.25 1.25 0 0 0 .875 .375 c 4.375 0 6 -3.125 7.312 -5.625 l .875 -1.625 c 1.375 -2.688 2.375 -4.25 5.063 -4.25 a 1.25 1.25 0 0 0 .875 -.375 a 1.25 1.25 0 0 0 .375 -.875 a 1.25 1.25 0 0 0 -1.25 -1.25 z" 
        fill="white"/>
  <g transform="translate(17.844, 16.5)">
    <circle cx="5" cy="5" r="4" 
            stroke="white" 
            stroke-width="1.5" 
            fill="none"/>
    <line x1="7.5" y1="7.5" x2="10" y2="10" 
          stroke="white" 
          stroke-width="1.5" 
          stroke-linecap="round"/>
  </g>
</svg>`

// 保存文件
const publicDir = path.join(__dirname, '../public')
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true })
}

// 保存 SVG 文件
fs.writeFileSync(path.join(publicDir, 'icon-1024.svg'), appIconSVG)
fs.writeFileSync(path.join(publicDir, 'favicon-16.svg'), favicon16SVG)
fs.writeFileSync(path.join(publicDir, 'favicon-32.svg'), favicon32SVG)

console.log('✅ 图标生成完成！')
console.log('📁 生成的文件：')
console.log('   - public/icon-1024.svg (App 图标)')
console.log('   - public/favicon-16.svg (16x16 favicon)')
console.log('   - public/favicon-32.svg (32x32 favicon)')
console.log('')
console.log('💡 下一步：')
console.log('   1. 将 icon-1024.svg 转换为 PNG 用于 PWA 图标')
console.log('   2. 在 manifest.webmanifest 中引用 PWA 图标')
console.log('   3. 在 index.html 中引用 favicon')
