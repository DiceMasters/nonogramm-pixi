import * as PIXI from 'pixi.js'

export class RowMap {
  container: PIXI.Container

  constructor (map: number[][]) {
    this.container = new PIXI.Container()

    const fontSize = 16
    const spacing = 5
    const lineHeight = 25
    let y = 0
    let x = 0

    for (const col of map) {
      const rowContainer = new PIXI.Container()

      for (const cell of col) {
        const text = new PIXI.Text(cell, { fontSize, lineHeight, fill: 0x000000 })

        text.x = x
        text.y = y

        // Добавляем текстовый объект в контейнер
        rowContainer.addChild(text)

        // Увеличиваем x на ширину текущего текстового объекта плюс отступ
        x += text.width + spacing
      }

      // Увеличиваем y на высоту строки
      y += lineHeight + spacing
      x = 0

      this.container.addChild(rowContainer)
    }

    // Выравниваем контейнеры
    this.container.children.forEach(rowContainer => {
      rowContainer.position.x = this.container.width - (rowContainer as PIXI.Container).width
    })
  }
}
