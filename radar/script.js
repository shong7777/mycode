let radar = document.getElementById('radar'),
  diameter = 350, //直徑
  radius = diameter / 2, //圓角
  padding = 14,
  ctx = Sketch.create({
    container: radar, //目標div id
    fullscreen: false, //是否全螢幕
    width: diameter,
    height: diameter
  }),
  //270 *3.14 /180
  dToR = function (degrees) {
    return degrees * (Math.PI / 180);
  },
  sweepAngle = 270, //掃描開始角度
  sweepSize = 2, //掃描寬度
  sweepSpeed = 1.8, //掃描速度
  rings = 4, //雷達圖圓型環數
  hueStart = 120, //漸層開始色
  hueEnd = 170, //漸層結束色
  hueDiff = Math.abs(hueEnd - hueStart),
  saturation = 50,
  lightness = 40,
  lineWidth = 2, //雷達圖圓形線條寬度
  gradient = ctx.createLinearGradient(radius, 0, 0, 0);

//設定div寬高
$('#radar_container').css({
  width: diameter + padding * 2,
  height: diameter + padding * 2,
  position: 'relative'
})

//設定樣式跟漸層
radar.style.marginLeft = radar.style.marginTop = (-diameter / 2) - padding + 'px'; //位置
gradient.addColorStop(0, 'hsla( ' + hueStart + ', ' + saturation + '%, ' + lightness + '%, 1 )'); //繪製漸層
gradient.addColorStop(1, 'hsla( ' + hueEnd + ', ' + saturation + '%, ' + lightness + '%, 0.1 )');

//繪製雷達圈
var renderRings = function () {
  var i;
  for (i = 0; i < rings; i++) {
    ctx.beginPath();
    ctx.arc(radius, radius, ((radius - (lineWidth / 2)) / rings) * (i + 1), 0, TWO_PI, false);
    ctx.strokeStyle = 'hsla(' + (hueEnd - (i * (hueDiff / rings))) + ', ' + saturation + '%, ' + lightness + '%, 0.1)';
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  };
};

//繪製十字線
var renderGrid = function () {
  ctx.beginPath();
  ctx.moveTo(radius - lineWidth / 2, lineWidth);
  ctx.lineTo(radius - lineWidth / 2, diameter - lineWidth);
  ctx.moveTo(lineWidth, radius - lineWidth / 2);
  ctx.lineTo(diameter - lineWidth, radius - lineWidth / 2);
  ctx.strokeStyle = 'hsla( ' + ((hueStart + hueEnd) / 2) + ', ' + saturation + '%, ' + lightness + '%, .03 )';
  ctx.stroke();
};
//繪製指針
var renderSweep = function () {
  ctx.save();
  ctx.translate(radius, radius);
  ctx.rotate(dToR(sweepAngle));
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, radius, dToR(-sweepSize), dToR(sweepSize), false);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.restore();
};

var renderScanLines = function () {
  var i;
  ctx.beginPath();
  for (i = 0; i < diameter; i += 2) {
    ctx.moveTo(0, i + .5);
    ctx.lineTo(diameter, i + .5);
  };
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'hsla( 0, 0%, 0%, .02 )';
  ctx.globalCompositeOperation = 'source-over';
  ctx.stroke();
};

ctx.clear = function () {
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = 'hsla( 0, 0%, 0%, 0.1 )';
  ctx.fillRect(0, 0, diameter, diameter);
};

ctx.update = function () {
  sweepAngle += sweepSpeed;
};
//增加目標點
//設定假的點
let aa = {
    x: 100,
    y: 80,
    pointSize: 7
  },
  bb = {
    x: 150,
    y: 180,
    pointSize: 5
  },
  cc = {
    x: 250,
    y: 300,
    pointSize: 1
  },
  dd = {
    x: 280,
    y: 87,
    pointSize: 3
  },
  points = [aa, bb, cc, dd];
//增加點
function addPoint(points) {
  for (let i in points) {
    let newDiv = document.createElement('div'),
      riskPoint = document.createElement('div');
    radar.appendChild(newDiv);
    newDiv.setAttribute("class", 'radarPoint');
    newDiv.setAttribute('style', `left:${points[i].x}px;top:${points[i].y}px;width:${points[i].pointSize}px;height:${points[i].pointSize}px;font-size:${points[i].pointSize+10}px`);
    newDiv.setAttribute('id', `point_${i}`);
    riskPoint = document.createElement('div');
    riskPoint.setAttribute("class", 'risk-point');
    newDiv.appendChild(riskPoint);
  };
}
//計算搜尋點角度
function getpointAngle(point) {
  let centerpoint = (diameter + padding * 2) / 2,
    a = Math.pow(point.x - centerpoint, 2) + Math.pow(point.y - centerpoint, 2),
    b = Math.pow(centerpoint, 2),
    c = Math.pow(point.x - centerpoint * 2, 2) + Math.pow(point.y - centerpoint, 2),
    Angle;
  if (point.y <= centerpoint) { //大於180度的圓內角
    Angle = Math.abs(Math.acos((a + b - c) / (Math.sqrt(a) * Math.sqrt(b) * 2)) / (Math.PI / 180) - 360);
  } else if (point.y > centerpoint) { //小於180度的圓內角
    Angle = (Math.acos((a + b - c) / (Math.sqrt(a) * Math.sqrt(b) * 2)) / (Math.PI / 180));
  }
  return Angle;
}




function flashing(sweepAngle, points) {

  for (let i in points) {
    let point = points[i],
      pointAngle = getpointAngle(point);
    let thispoint = document.getElementsByClassName('radarPoint');
    if (sweepAngle % 360 > (pointAngle - 30 % 360) && sweepAngle % 360 < (pointAngle + 30)) {
      thispoint[i].setAttribute("class", 'radarPoint flashing');
      setTimeout(function () {
        thispoint[i].setAttribute("class", 'radarPoint');
      }, 2000)
    } else {

    }
  }

}
//繪製點
addPoint(points);

//繪製雷達圖
ctx.draw = function () {
  ctx.globalCompositeOperation = 'lighter';
  renderRings();
  renderGrid();
  renderSweep();
  renderScanLines();
  flashing(sweepAngle, points)

};