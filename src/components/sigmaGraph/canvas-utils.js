const TEXT_COLOR = '#000000'

/**
 * This function draw in the input canvas 2D context a rectangle.
 * It only deals with tracing the path, and does not fill or stroke.
 */
export function drawRoundRect(
  ctx, // CanvasRenderingContext2D
  x, // number,
  y, //: number,
  width, //: number,
  height, //: number,
  radius //: number
) {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}

/**
 * Custom hover renderer
 */
export function drawHover(
  context, //: CanvasRenderingContext2D,
  data, //: PlainObject,
  settings //: PlainObject
) {
  const size = settings.labelSize
  const font = settings.labelFont
  const weight = settings.labelWeight
  const subLabelSize = size - 2

  const nodeId = data.id
  const nodeName = data.name

  const clusterLabel = data.units ? `${data.units.low} units` : ''

  // Then we draw the label background
  context.beginPath()
  context.fillStyle = '#fff'
  context.shadowOffsetX = 0
  context.shadowOffsetY = 2
  context.shadowBlur = 8
  context.shadowColor = '#000'

  context.font = `${weight} ${size}px ${font}`
  const labelWidth = context.measureText(nodeName).width
  context.font = `${weight} ${subLabelSize}px ${font}`
  const subLabelWidth = nodeId ? context.measureText(nodeId).width : 0
  context.font = `${weight} ${subLabelSize}px ${font}`
  const clusterLabelWidth = clusterLabel
    ? context.measureText(clusterLabel).width
    : 0

  const textWidth = Math.max(labelWidth, subLabelWidth, clusterLabelWidth)

  const x = Math.round(data.x)
  const y = Math.round(data.y)
  const w = Math.round(textWidth + size / 2 + data.size + 3)
  const hLabel = Math.round(size / 2 + 4)
  const hSubLabel = nodeId ? Math.round(subLabelSize / 2 + 9) : 0
  const hClusterLabel = Math.round(subLabelSize / 2 + 9)

  drawRoundRect(
    context,
    x,
    y - hSubLabel - 12,
    w,
    hClusterLabel + hLabel + hSubLabel + 12,
    5
  )
  context.closePath()
  context.fill()

  context.shadowOffsetX = 0
  context.shadowOffsetY = 0
  context.shadowBlur = 0

  // And finally we draw the labels
  context.fillStyle = TEXT_COLOR
  context.font = `${weight} ${size}px ${font}`
  const leftPadding = data.x + data.size
  context.fillText(nodeName, leftPadding, data.y + size / 3)

  if (nodeId) {
    context.fillStyle = TEXT_COLOR
    context.font = `${weight} ${subLabelSize}px ${font}`
    context.fillText(nodeId, leftPadding, data.y - (2 * size) / 3 - 2)
  }

  context.fillStyle = data.color
  context.font = `${weight} ${subLabelSize}px ${font}`
  context.fillText(
    clusterLabel,
    leftPadding,
    data.y + size / 3 + 3 + subLabelSize
  )
}

/**
 * Custom hover renderer
 */
export function drawHoverForProgram(
  context, //: CanvasRenderingContext2D,
  data, //: PlainObject,
  settings //: PlainObject
) {
  const size = settings.labelSize
  const font = settings.labelFont
  const weight = settings.labelWeight
  const subLabelSize = size - 2
  console.log(data)
  if (data.tag === 'Course') {
    const nodeId = data.id
    const nodeName = data.name

    const clusterLabel = data.units ? `${data.units} units` : ''

    // Then we draw the label background
    context.beginPath()
    context.fillStyle = '#fff'
    context.shadowOffsetX = 0
    context.shadowOffsetY = 2
    context.shadowBlur = 8
    context.shadowColor = '#000'

    context.font = `${weight} ${size}px ${font}`
    const labelWidth = context.measureText(nodeName).width
    context.font = `${weight} ${subLabelSize}px ${font}`
    const subLabelWidth = nodeId ? context.measureText(nodeId).width : 0
    context.font = `${weight} ${subLabelSize}px ${font}`
    const clusterLabelWidth = clusterLabel
      ? context.measureText(clusterLabel).width
      : 0

    const textWidth = Math.max(labelWidth, subLabelWidth, clusterLabelWidth)

    const x = Math.round(data.x)
    const y = Math.round(data.y)
    const w = Math.round(textWidth + size / 2 + data.size + 3)
    const hLabel = Math.round(size / 2 + 4)
    const hSubLabel = nodeId ? Math.round(subLabelSize / 2 + 9) : 0
    const hClusterLabel = Math.round(subLabelSize / 2 + 9)

    drawRoundRect(
      context,
      x,
      y - hSubLabel - 12,
      w,
      hClusterLabel + hLabel + hSubLabel + 12,
      5
    )
    context.closePath()
    context.fill()

    context.shadowOffsetX = 0
    context.shadowOffsetY = 0
    context.shadowBlur = 0

    // And finally we draw the labels
    context.fillStyle = TEXT_COLOR
    context.font = `${weight} ${size}px ${font}`
    context.fillText(nodeName, data.x + data.size + 3, data.y + size / 3)

    if (nodeId) {
      context.fillStyle = TEXT_COLOR
      context.font = `${weight} ${subLabelSize}px ${font}`
      context.fillText(
        nodeId,
        data.x + data.size + 3,
        data.y - (2 * size) / 3 - 2
      )
    }

    context.fillStyle = data.color
    context.font = `${weight} ${subLabelSize}px ${font}`
    context.fillText(
      clusterLabel,
      data.x + data.size + 3,
      data.y + size / 3 + 3 + subLabelSize
    )
  } else if (data.tag === 'Program') {
    const nodeName = data.name

    // Then we draw the label background
    context.beginPath()
    context.fillStyle = '#fff'
    context.shadowOffsetX = 0
    context.shadowOffsetY = 2
    context.shadowBlur = 8
    context.shadowColor = '#000'

    context.font = `${weight} ${size}px ${font}`
    const labelWidth = context.measureText(nodeName).width

    const x = Math.round(data.x)
    const y = Math.round(data.y)
    const w = Math.round(labelWidth + size / 2 + data.size + 3)
    const hLabel = Math.round(size / 2 + 4)

    drawRoundRect(context, x, y - 12, w, hLabel + 12, 5)
    context.closePath()
    context.fill()

    context.shadowOffsetX = 0
    context.shadowOffsetY = 0
    context.shadowBlur = 0

    // And finally we draw the labels
    context.fillStyle = TEXT_COLOR
    context.font = `${weight} ${size}px ${font}`
    context.fillText(nodeName, data.x + data.size + 3, data.y + size / 3)
  } else if (data.tag === 'Requirement') {
    const text = data.description

    // Then we draw the label background
    context.beginPath()
    context.fillStyle = '#fff'
    context.shadowOffsetX = 0
    context.shadowOffsetY = 2
    context.shadowBlur = 8
    context.shadowColor = '#000'

    context.font = `${weight} ${size}px ${font}`
    const labelWidth = context.measureText(text).width

    const x = Math.round(data.x)
    const y = Math.round(data.y)
    const w = Math.round(labelWidth + size / 2 + data.size + 3)
    const hLabel = Math.round(size / 2 + 4)

    drawRoundRect(context, x, y - 12, w, hLabel + 12, 5)
    context.closePath()
    context.fill()

    context.shadowOffsetX = 0
    context.shadowOffsetY = 0
    context.shadowBlur = 0

    // And finally we draw the labels
    context.fillStyle = TEXT_COLOR
    context.font = `${weight} ${size}px ${font}`
    context.fillText(text, data.x + data.size + 3, data.y + size / 3)
  }
}

/**
 * Custom label renderer
 */
export default function drawLabel(
  context, //: CanvasRenderingContext2D,
  data, //: PartialButFor<NodeDisplayData, 'x' | 'y' | 'size' | 'label' | 'color'>,
  settings //: Settings
) {
  if (!data.label) return

  const size = settings.labelSize,
    font = settings.labelFont,
    weight = settings.labelWeight

  context.font = `${weight} ${size}px ${font}`
  const width = context.measureText(data.label).width + 8

  context.fillStyle = '#ffffffcc'
  const leftPadding = data.x + data.size
  context.fillRect(leftPadding, data.y + size / 3 - 15, width, 20)

  context.fillStyle = '#000'
  const labelString = data.label.toLocaleString()
  const idx = labelString.indexOf(' ')
  context.fillText(
    labelString.substr(0, idx),
    leftPadding,
    data.y - (2 * size) / 3 - 2
  )
  context.fillText(
    labelString.substr(idx).trim(),
    leftPadding,
    data.y + size / 3
  )
}

export function drawLabelForProgramGraph(
  context, //: CanvasRenderingContext2D,
  data, //: PartialButFor<NodeDisplayData, 'x' | 'y' | 'size' | 'label' | 'color'>,
  settings //: Settings
) {
  const size = settings.labelSize,
    font = settings.labelFont,
    weight = settings.labelWeight
  context.font = `${weight} ${size}px ${font}`
  console.log(data)
  const width = context.measureText(data.label).width + 12
  context.fillStyle = '#ffffffcc'
  context.fillRect(data.x + data.size, data.y + size / 3 - 15, width, 20)
  context.fillStyle = '#000'
  context.fillText(
    data.label.toLocaleString(),
    data.x + data.size + 3,
    data.y + size / 3
  )
}
