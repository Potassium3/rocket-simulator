let rocket = {
  shape: [
    {
      topWidth: 0,
      bottomWidth: 40,
      height: 40,
      hollow: false,
      thickness: 0,
      density: 15,
    },
    {
      topWidth: 40,
      bottomWidth: 40,
      height: 80,
      hollow: true,
      thickness: 2,
      density: 15,
    },
    {
      topWidth: 40,
      bottomWidth: 60,
      height: 30,
      hollow: true,
      thickness: 2,
      density: 15,
    },
    {
      topWidth: 60,
      bottomWidth: 60,
      height: 100,
      hollow: true,
      thickness: 2,
      density: 15,
    },
  ],
  fins: {
    number: 4,
    position: 3,
    shape: "triangle",
    thickness: 10,
    bottomWidth: 40,
  },
};

// Interface and graphics

function renderRocketLong(data, zoom=1) {
  document.querySelectorAll(".rocket-long").forEach((elem) => {
    if (elem.classList.contains("fins")) {
      // Just elements that aren't input
      elem.innerHTML = "";
      for (let i=0; i<data.shape.length; i++) {
        const iCopy = i;
        let piece = data.shape[i];
        let difference = Math.abs(piece.bottomWidth-piece.topWidth);
        let invert = piece.bottomWidth < piece.topWidth ? "invert" : "";
        let pieceElem = document.createElement("div");
        pieceElem.className = "piece";
        pieceElem.style = `height: ${piece.height*zoom}mm; cursor: pointer;`;
        
        pieceElem.innerHTML = `
          <div class="top-line" style="width: ${piece.topWidth*zoom}mm"></div>
          <div class="bottom-line" style="width: ${piece.bottomWidth*zoom}mm"></div>
          <div class="left-line ${invert}" style=
          "left: calc(50% - ${Math.max(piece.topWidth, piece.bottomWidth)*zoom/2}mm); width: ${difference*zoom/2}mm; --w: ${difference*zoom/2}mm; --h: ${piece.height*zoom}mm;"
          ><div></div></div>
          <div class="right-line ${invert}" style=
          "left: calc(50% + ${Math.min(piece.topWidth, piece.bottomWidth)*zoom/2}mm); width: ${difference*zoom/2}mm; --w: ${difference*zoom/2}mm; --h: ${piece.height*zoom}mm;"
          ><div></div></div>`;
        if (i == data.fins.position) {
          let topFinWidth = piece.topWidth;
          let bottomFinWidth = piece.bottomWidth + data.fins.bottomWidth*2;
          difference = Math.abs(topFinWidth - bottomFinWidth);
          invert = bottomFinWidth < topFinWidth ? "invert" : "";
          pieceElem.innerHTML += `
          <div class="bottom-line bottom-line-fin" style="width: ${(bottomFinWidth)*zoom}mm"></div>
          <div class="left-line left-line-fin ${invert}" style=
          "left: calc(50% - ${Math.max(topFinWidth, bottomFinWidth)*zoom/2}mm); width: ${difference*zoom/2}mm; --w: ${difference*zoom/2}mm; --h: ${piece.height*zoom}mm;"
          ><div></div></div>
          <div class="right-line right-line-fin ${invert}" style=
          "left: calc(50% + ${Math.min(topFinWidth, bottomFinWidth)*zoom/2}mm); width: ${difference*zoom/2}mm; --w: ${difference*zoom/2}mm; --h: ${piece.height*zoom}mm;"
          ><div></div></div>`;
        }
        pieceElem.addEventListener("click", function () {
          rocket.fins.position = iCopy;
          renderRocket(rocket);
        });
        elem.appendChild(pieceElem);
      }
      
    } else {
      // Create elements
      elem.innerHTML = "";
      let i = 0;
      for (let piece of data.shape) {
        let iCopy = i;
        let difference = Math.abs(piece.bottomWidth-piece.topWidth);
        let invert = piece.bottomWidth < piece.topWidth ? "invert" : "";
        let pieceElem = document.createElement("div");
        pieceElem.className = "piece";
        pieceElem.style = `height: ${piece.height*zoom}mm; cursor: pointer;`;
        pieceElem.innerHTML += `
          <div class="top-line" style="width: ${piece.topWidth*zoom}mm"></div>
          <div class="bottom-line" style="width: ${piece.bottomWidth*zoom}mm"></div>
          <div class="left-line ${invert}" style=
          "left: calc(50% - ${Math.max(piece.topWidth, piece.bottomWidth)*zoom/2}mm); width: ${difference*zoom/2}mm; --w: ${difference*zoom/2}mm; --h: ${piece.height*zoom}mm;"
          ><div></div></div>
          <div class="right-line ${invert}" style=
          "left: calc(50% + ${Math.min(piece.topWidth, piece.bottomWidth)*zoom/2}mm); width: ${difference*zoom/2}mm; --w: ${difference*zoom/2}mm; --h: ${piece.height*zoom}mm;"
          ><div></div></div>
          <input data-id="piece-le-${i}" class="rocket-input left-input" value="${piece.height}">
          <input data-id="piece-tr-${i}" class="rocket-input topright-input" value="${piece.topWidth}">
          <input data-id="piece-br-${i}" class="rocket-input bottomright-input" value="${piece.bottomWidth}">`;
        elem.appendChild(pieceElem);
        i++;
      }
      
      // Add event listeners for input
      document.querySelectorAll(".rocket-input").forEach((elem) => {
        elem.addEventListener("input", function() {
          let sel = elem.selectionStart;
          let zoomLocal = document.getElementById("input-body-shape-zoom").value/100;
          if (elem.dataset.id.substring(6, 8) == "le") {
            rocket.shape[Number(elem.dataset.id.substring(9))].height = elem.value;
          } else if (elem.dataset.id.substring(6, 8) == "tr") {
            rocket.shape[Number(elem.dataset.id.substring(9))].topWidth = elem.value;
          } else if (elem.dataset.id.substring(6, 8) == "br") {
            rocket.shape[Number(elem.dataset.id.substring(9))].bottomWidth = elem.value;
          }
          renderRocketLong(rocket, zoomLocal);
          renderRocket3D(rocket);
          renderRocketCross(rocket, zoomLocal);
          document.querySelector(`[data-id="${elem.dataset.id}"]`).focus();
          document.querySelector(`[data-id="${elem.dataset.id}"]`).selectionStart = sel;
        })
      })
    }
  })
}

function renderRocket3D(data) {
  null;
}

function renderRocketCross(data, zoom=1) {
  document.querySelectorAll(".rocket-cross").forEach((elem) => {
    // Create elements
    elem.innerHTML = "";
    let previousSize = 0;
    for (let piece of data.shape) {
      if (piece.topWidth < previousSize) {
        elem.innerHTML += `<div class="cross-circle" style="width:${piece.topWidth*zoom}mm;"></div>`
      } else {
        elem.innerHTML += `<div class="cross-circle dashed" style="width:${piece.topWidth*zoom}mm;"></div>`
      }
      previousSize = Math.max(previousSize, piece.topWidth, piece.bottomWidth);
      if (piece.topWidth < previousSize) {
        elem.innerHTML += `<div class="cross-circle" style="width:${piece.bottomWidth*zoom}mm;"></div>`
      } else {
        elem.innerHTML += `<div class="cross-circle dashed" style="width:${piece.bottomWidth*zoom}mm;"></div>`
      }
      previousSize = Math.max(previousSize, piece.topWidth, piece.bottomWidth);
    }

    // Create fins
    let finNumber = data.fins.number;
    for (let i=0; i<finNumber; i++) {
      elem.innerHTML += `<div class="cross-fin" style="
        transform: translateY(-50%) rotate(${i*360/finNumber}deg) translateX(${data.shape[data.fins.position].bottomWidth*zoom/2}mm);
        width:${data.fins.bottomWidth*zoom}mm;
        height: ${(data.fins.thickness)*zoom}mm;
      "></div>`;
      elem.innerHTML += `<div class="cross-fin-fade" style="
        transform: translateY(-50%) rotate(${i*360/finNumber}deg) translateX(${data.shape[data.fins.position].topWidth*zoom/2}mm);
        width:${(data.fins.bottomWidth + data.shape[data.fins.position].bottomWidth/2 - data.shape[data.fins.position].topWidth/2)*zoom}mm;
        height: ${(data.fins.thickness)*zoom}mm;
      "></div>`;
    }
  })
}

function renderRocket(data) {
  let zoom1 = document.getElementById("input-body-shape-zoom").value/100;
  renderRocket3D(data); // 3D View
  renderRocketLong(data, zoom1); // Long view, editor, fins
  renderRocketCross(data, zoom1); // Cross-section view, fins
}

function map(old, oldMin, oldMax, newMin, newMax) {
  let proportion = (old - oldMin)/(oldMax - oldMin);
  return newMin + proportion * (newMax - newMin);
}

function scaleInterval(maxValue) {
  // Graph grid line spacing
  let belowPowerOfTen = 10**Math.floor(Math.log10(maxValue));
  let ratio = maxValue / belowPowerOfTen;
  if (ratio < 2) {
    return [belowPowerOfTen/10, belowPowerOfTen/2];
  } else if (ratio < 5) {
    return [belowPowerOfTen/5, belowPowerOfTen/1];
  } else {
    return [belowPowerOfTen/2, belowPowerOfTen/0.5];
  }
}

function plotGraph(xName="X-axis", yName="Y-axis", xList, yList) {
  document.querySelector("#graph-rocket>.x-label").innerHTML = xName;
  document.querySelector("#graph-rocket>.y-label").innerHTML = yName;
  let xMax = 0;
  let yMax = 0;
  for (let i=0; i<xList.length; i++) {
    if (xList[i] > xMax) {
      xMax = xList[i];
    }
    if (yList[i] > yMax) {
      yMax = yList[i];
    }
  }
  let graphBody = document.querySelector("#graph-rocket>.graph-body");
  let graphSVG = document.querySelector("#graph-rocket>svg");
  graphBody.innerHTML = "";
  graphSVG.innerHTML = "";
  const scale = graphBody.clientWidth;
  graphSVG.style.height = scale+"px";
  graphBody.style.height = scale+"px";

  // Draw grid lines
  for (let i=1; i<Math.ceil(yMax/scaleInterval(yMax)[0]); i++) {
    let lineh = document.createElement("div");
    let marker = i%(scaleInterval(yMax)[1]/scaleInterval(yMax)[0])==0;
    lineh.className = "gridline h"+(marker?" marker":"");
    lineh.innerText = marker ? Math.floor(scaleInterval(yMax)[0]*i*10000)/10000 : "";
    lineh.style.top = (1-scaleInterval(yMax)[0]*i/yMax)*scale+"px";
    graphBody.appendChild(lineh);
  }
  for (let i=1; i<Math.ceil(xMax/scaleInterval(xMax)[0]); i++) {
    let linev = document.createElement("div");
    let marker = i%(scaleInterval(xMax)[1]/scaleInterval(xMax)[0])==0;
    linev.className = "gridline v"+(marker?" marker":"");
    linev.innerText = marker ? Math.floor(scaleInterval(xMax)[0]*i*10000)/10000 : "";
    linev.style.left = (scaleInterval(xMax)[0]*i/xMax)*scale+"px";
    graphBody.appendChild(linev);
  }
  console.log("X scale interval: "+scaleInterval(xMax));
  console.log("Y scale interval: "+scaleInterval(yMax));

  for (let i=0; i<xList.length; i++) {
    let y = (1-yList[i]/yMax)*scale;
    let x = (xList[i]/xMax)*scale;

    let point = document.createElement("div");
    point.className = "point";
    point.style.top = y+"px";
    point.style.left = x+"px";

    graphBody.appendChild(point);

    // Draw lines between
    if (i > 0) {
      let y2 = (1-yList[i-1]/yMax)*scale;
      let x2 = (xList[i-1]/xMax)*scale;
      graphSVG.innerHTML += `<path d="M${x},${y} L${x2},${y2}"></path>`;
    }
  }
}

// Simulator

function simulate(data) {
  const timeSteps = 200;
  const timeStep = 0.10; // s
  const speedOfSound = 343; // m s^-1

  let maxRadius = 0;
  for (let piece of data.shape) {
    if (piece.topWidth > maxRadius) {maxRadius = piece.topWidth;}
    if (piece.bottomWidth > maxRadius) {maxRadius = piece.bottomWidth;}
  }
  maxRadius *= 0.0005; // Convert to m and actually be a radius not a diameter
  let referenceArea = Math.PI * maxRadius * maxRadius;

  let dragCoefficient = 0;
  let superDragCoefficient = 0;
  // Calculate drag coefficient
  for (let piece of data.shape) {
    let difference = Math.abs(piece.topWidth - piece.bottomWidth);
    let angleRelativeToCentreLine = Math.atan(difference/2 / piece.height);
    // Drag coefficient calculations
    if (piece.topWidth == 0) {
      // Cone
      superDragCoefficient += 2 * Math.sin(angleRelativeToCentreLine)**2;
      dragCoefficient += 0.15;
      
    } else if (piece.topWidth == piece.bottomWidth) {
      // Cylinder
      let totalSA = Math.PI * piece.topWidth/1000 * piece.height/1000; // A = 2piRL
      const skinFrictionCoefficient = 0.004;
      dragCoefficient += skinFrictionCoefficient * totalSA / referenceArea;
      superDragCoefficient += skinFrictionCoefficient * totalSA / referenceArea;
    } else {
      // Frustum
      if (piece.bottomWidth > piece.topWidth) {
        superDragCoefficient += 2 * Math.sin(angleRelativeToCentreLine)**2;
        dragCoefficient += 0.15;
      } else {
        dragCoefficient -= 0.1
        superDragCoefficient -= 0.1
      }
    }
  }
  // Base drag
  dragCoefficient += 0.029/Math.sqrt(dragCoefficient); // Approx 0.12 or 0.15

  // Simulate the time steps
  let x = 0;
  let y = 0;
  let xVel = 20; // m s^-1 - CHANGE THIS!!!
  let yVel = 20;
  let mass = 0.1; // kg - CHANGE THIS!!!

  // Initial results
  let results = {
    x: [0],
    y: [0],
    xvel: [0],
    yvel: [0],
    dragF: [null],
    time: [0],
    velocity: [0],
  }
  for (let i=0; i<timeSteps; i++) {
    let t = i * timeStep;
    let airDensity = 1.225; // kg m^-3 - will change at each time step
    let velocity = Math.hypot(xVel, yVel);
    let angle = Math.atan(yVel / xVel);
    let dragForce = 0;
    if (velocity < speedOfSound) {
      dragForce = 0.5 * airDensity * velocity**2 * dragCoefficient * referenceArea;
    } else {
      dragForce = 0.5 * airDensity * velocity**2 * superDragCoefficient * referenceArea;
    }
    let resultantForceX = 0;
    let resultantForceY = 0;
    // Thrust
    // Not applicable
    // Drag force
    resultantForceX -= Math.cos(angle)*dragForce;
    resultantForceY -= Math.sin(angle)*dragForce;
    // Gravity
    resultantForceY -= 9.8 * mass;
    xVel += (resultantForceX / mass) * timeStep; // a = F / m
    yVel += (resultantForceY / mass) * timeStep; // a = F / m
    if (y+(yVel*timeStep) < 0) {
      if (i == 0) {
        console.log("Rocket failed to launch.");
      }
      break; // Stop when rocket hits the ground
    }
    x += xVel * timeStep;
    y += yVel * timeStep;
    velocity = Math.hypot(xVel, yVel);
    results.x.push(x);
    results.y.push(y);
    results.xvel.push(xVel);
    results.yvel.push(yVel);
    results.dragF.push(dragForce);
    results.velocity.push(velocity);
    results.time.push(t);
  }
  return results;
}

// Event listeners

document.getElementById("input-body-shape-zoom").addEventListener("input", function() {
  document.getElementById("input-body-shape-zoom-slider").style.left = this.value+"%";
  document.getElementById("input-body-shape-zoom-slider").style.transform = "translateX(-"+this.value+"%)";
  renderRocketLong(rocket, this.value/100);
  renderRocketCross(rocket, this.value/100);
});

document.getElementById("button-thrust-graph-traject").addEventListener("click", function() {
  let results = simulate(rocket);
  plotGraph("Horizontal displacement (m)", "Vertical displacement (m)", results.x, results.y);
});
document.getElementById("button-thrust-graph-drag").addEventListener("click", function() {
  let results = simulate(rocket);
  plotGraph("Time (s)", "Drag force (N)", results.time, results.dragF);
});
document.getElementById("button-thrust-graph-vel").addEventListener("click", function() {
  let results = simulate(rocket);
  plotGraph("Time (s)", "Velocity Magnitude (m s<sup>-1</sup>)", results.time, results.velocity);
});

let elem = document.getElementById("input-body-shape-zoom");
document.getElementById("input-body-shape-zoom-slider").style.left = elem.value+"%";
document.getElementById("input-body-shape-zoom-slider").style.transform = "translateX(-"+elem.value+"%)";

document.getElementById("input-fins-angle-fins").addEventListener("input", function() {
  document.getElementById("input-fins-angle-fins-slider").style.left = (this.value*100/7)+"%";
  document.getElementById("input-fins-angle-fins-slider").style.transform = "translateX(-"+this.value+"%)";
  rocket.fins.number = Number(this.value)+2;
  renderRocket(rocket);
});

document.getElementById("input-fins-angle-thickness").addEventListener("input", function() {
  document.getElementById("input-fins-angle-thickness-slider").style.left = this.value+"%";
  document.getElementById("input-fins-angle-thickness-slider").style.transform = "translateX(-"+this.value+"%)";
  rocket.fins.thickness = Number(this.value);
  renderRocket(rocket);
});

document.getElementById("input-fins-shape-width").addEventListener("input", function() {
  document.getElementById("input-fins-shape-width-slider").style.left = this.value+"%";
  document.getElementById("input-fins-shape-width-slider").style.transform = "translateX(-"+this.value+"%)";
  rocket.fins.bottomWidth = Number(this.value);
  renderRocket(rocket);
});

// Render the rockets

renderRocket(rocket);