// 对table中的数据进行遍历并且输出成csv格式

function toCSV(tableDom) {
  return getLines(tableDom)
}
function getLines(dom) {
  if (dom.tagName === 'TR') {
    let vals = []
    for (let child of dom.children) {
      vals.push(getCellText(child))
    }
    return vals.join(',')
  } else {
    let lines = []
    for (let child of dom.children) {
      let line = getLines(child)
      if (line !== '') lines.push(line)
    }
    return lines.join('\n')
  }
}
function getCellText(cell) {
  if (cell.children.length === 0) {
    return cell.innerHTML
  }
  let vals = []
  for (let child of cell.children) {
    let cellTxt = getCellText(child)
    if (cellTxt !== '') vals.push(getCellText(child))
  }
  return vals.join(' ')
}
export { toCSV }
