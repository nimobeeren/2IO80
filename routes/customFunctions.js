const CONFIG = {PIETYPE: {
    BASIC: {
        color: "#FBA312",
        title: "Basic courses"
    },
    MAJOR: {
        color: "#00A2ED",
        title: "Major courses"
    },
    USE: {
        color: "#24357F",
        title: "USE courses"
    },
    FREE: {
        color: "#BB0000",
        title: "Free courses"
    },
    SPECIALIZATION: {
        color: "#FDEC00",
        title: "Specialization courses"
    }
}};

function ref(obj, str) {
    str = str.split(".");
    for (var i = 0; i < str.length; i++)
        obj = obj[str[i]];
    return obj;
}

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

    return `<path d="${pathData}" fill="${ref(CONFIG, pie.type).color}"><title>${ref(CONFIG, pie.type).title}</title></path>`;
}

var year = 0;
exports.pieChart = function(pieList){
    var html = [];

    html.push('<h6>Year '+ ++year +'</h6>');
    html.push('<svg viewBox="-1 -1 2 2" style="transform: rotate(270deg) scaleX(-1)">');
    let cumulativePercent = 0; // reset var
    for (pieData in pieList) {
        html.push(pie(pieList[pieData]))
    }
    html.push('</svg>');

    return html.join('');
}
