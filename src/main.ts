import './style.css'
import * as PIXI  from 'pixi.js'
import { Level }  from './classes/Level'
import cellParams from './data/cell_params'
import level      from './data/level'
import { RowMap } from './classes/RowMap'
import { ColMap } from './classes/ColMap'

const app = new PIXI.Application<HTMLCanvasElement>({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0x2c3e50,
  antialias: true
})

document.body.appendChild(app.view)

const levelGrid = new Level(level)
const gridData = levelGrid.grid

// Создаем контейнер для хранения квадратов
const container = new PIXI.Container()

// Карты строк и столбцов
const rowMap: number[][] = []
const cellMap: number[][] = level[0].map(_ => [])

// Проходимся по всем элементам массива и создаем соответствующие квадраты
gridData.forEach((row, ri) => {
  const currentRow = []
  let currentRowWeight = 0

  row.forEach((cell, ci, _arr) => {
    /**
     * Рендер карты
     */
    const currentColCellEmpty = !cellMap[ci].length
    const currentColCellLast = ri === _arr.length - 1

    // Блок для карты строк
    if (cell.state) {
      currentRowWeight++
    } else if (currentRow.length && currentRowWeight) {
      currentRow.push(currentRowWeight)
      currentRowWeight = 0
    } else if (currentRowWeight) {
      currentRow.push(currentRowWeight)
      currentRowWeight = 0
    }

    // Блок для карты колонок
    if (currentColCellEmpty) {
      cellMap[ci].push(cell.state)
    } else if (cell.state) {
      cellMap[ci][cellMap[ci].length - 1]++
    } else if (!currentColCellLast && cellMap[ci][cellMap[ci].length - 1] !== 0) {
      // Если не последний индекс и предыдущий последний
      cellMap[ci].push(cell.state)
    } else if (currentColCellLast && cellMap[ci][cellMap[ci].length - 1] === 0) {
      // Если последний индекс и последняя результирующая ячейка 0
      // Удаляем лишний 0
      cellMap[ci].pop()
    }

    /**
     * Рендер сетки
     */

    // Создаем контейнер для состояний ячейки
    const cellContainer = new PIXI.Container()

    // Создаем стандартную ячейку
    const square = new PIXI.Graphics()

    square.cursor = 'pointer'
    square.lineStyle(cellParams.squareStrokeWidth, cellParams.squareStrokeColor, 1, 0)
    square.beginFill(cellParams.sqaureFillColor, cellParams.squareFillOpacity)
    square.drawRoundedRect(0, 0, cellParams.squareSize, cellParams.squareSize, cellParams.squareRadius)
    square.endFill()
    square.interactive = true

    // Создаем ячейку для состояния SUCCESS
    const successSquare = new PIXI.Graphics()

    successSquare.lineStyle(cellParams.squareStrokeWidth, cellParams.squareStrokeColor, 1, 0)
    successSquare.beginFill(cellParams.squareFillSuccess, cellParams.squareFillSuccessOpacity)
    successSquare.drawRoundedRect(0, 0, cellParams.squareSize, cellParams.squareSize, cellParams.squareRadius)
    successSquare.endFill()
    successSquare.visible = false

    // Создаем ячейку для состояния ERROR
    const errorSquare = new PIXI.Graphics()

    errorSquare.lineStyle(cellParams.squareStrokeWidth, cellParams.squareStrokeColor, 1, 0)
    errorSquare.beginFill(cellParams.squareFillError, cellParams.squareFillErrorOpacity)
    errorSquare.drawRoundedRect(0, 0, cellParams.squareSize, cellParams.squareSize, cellParams.squareRadius)
    errorSquare.endFill()
    errorSquare.visible = false

    // События для дефолтной ячейки
    square.on('pointerdown', function () {
      const _square = cell
      const _state = _square.state

      if (_square.active) {
        return
      }

      _square.point()

      if (_state) {
        _square.setSuccess()
        successSquare.visible = true
      } else {
        _square.setError()
        errorSquare.visible = true
      }
    })
    square.on('pointerover', () => {
      square.tint = 0xE0E0E0
    })
    square.on('pointerout', () => {
      square.tint = 0xFFFFFF
    })

    // Помещаем все состояния в контейнер
    cellContainer.addChildAt(square, 0)
    cellContainer.addChildAt(successSquare, 1)
    cellContainer.addChildAt(errorSquare, 2)
    cellContainer.position.set(ci * (cellParams.squareSize + cellParams.squareOffset), ri * (cellParams.squareSize + cellParams.squareOffset))

    // Добавляем квадрат в контейнер
    container.addChild(cellContainer)
  })

  if (currentRowWeight) {
    currentRow.push(currentRowWeight)
  }

  rowMap.push(currentRow)
})

// Карта строк
const rMap = new RowMap(rowMap)
const rowMapContainer = rMap.container
const cMap = new ColMap(cellMap)
const colMapContainer = cMap.container

// Устанавливаем позицию контейнера
container.position.set((app.screen.width - container.width) / 2, (app.screen.height - container.height) / 2)

// Устанавливаем позицию карты строк
rowMapContainer.position.set(container.position._x - rowMapContainer.width - 10, container.position._y)
colMapContainer.position.set(container.position._x, container.position._y - colMapContainer.height - 2)

// Добавляем контейнер на сцену
app.stage.addChild(container)
app.stage.addChild(rowMapContainer)
app.stage.addChild(colMapContainer)
