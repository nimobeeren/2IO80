let cumulativePercent = 0;

const getCoordinatesForPercent = (percent) => {
  const x = Math.cos(2 * Math.PI * percent);
  const y = Math.sin(2 * Math.PI * percent);
  return [x, y];
}

const pie = (pie) => {
    // destructuring assignment sets the two variables at once
    const [startX, startY] = getCoordinatesForPercent(cumulativePercent);

    // each slice starts where the last slice ended, so keep a cumulative percent
    cumulativePercent += pie.percent;

    const [endX, endY] = getCoordinatesForPercent(cumulativePercent);

    // if the slice is more than 50%, take the large arc (the long way around)
    const largeArcFlag = pie.percent > .5 ? 1 : 0;

    // create an array and join it just for code readability
    const pathData = [
      `M ${startX} ${startY}`, // Move
      `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Arc
      `L 0 0`, // Line
    ].join(' ');

    return `<path d="${pathData}" fill="${pie.type.color}"><title>${pie.type.title}</title></path>`;
}

exports.pieChart = function(pieList){
    var html = [];

    html.push('<svg viewBox="-1 -1 2 2" style="transform: rotate(270deg) scaleX(-1)">');
    let cumulativePercent = 0; // reset var
    for (pieData in pieList) {
        html.push(pie(pieList[pieData]))
    }
    html.push('</svg>');

    return html.join('');
}
