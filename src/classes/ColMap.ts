import * as PIXI from 'pixi.js'

export class ColMap {
  container: PIXI.Container

  constructor (map: number[][]) {
    this.container = new PIXI.Container()

    const fontSize = 16
    const spacing = 5
    const lineHeight = 25
    let y = 0
    let x = spacing

    for (const col of map) {
      const colContainer = new PIXI.Container()

      for (const cell of col) {
        const text = new PIXI.Text(cell, { fontSize, lineHeight, fill: 0x000000 })

        text.x = x
        text.y = y

        // Добавляем текстовый объект в контейнер
        colContainer.addChild(text)

        // Увеличиваем y на высоту строки
        y += lineHeight - 5
      }

      // Увеличиваем x на ширину текущего текстового объекта плюс отступ
      x += lineHeight + spacing
      y = 0

      this.container.addChild(colContainer)
    }

    // Выравниваем контейнеры
    this.container.children.forEach(colContainer => {
      colContainer.position.y = this.container.height - (colContainer as PIXI.Container).height
    })
  }
}
