let rocket = {
  shape: [
    {
      topWidth: 0,
      bottomWidth: 40,
      height: 40,
      hollow: false,
      thickness: 0,
    },
    {
      topWidth: 40,
      bottomWidth: 40,
      height: 80,
      hollow: true,
      thickness: 2,
    },
    {
      topWidth: 40,
      bottomWidth: 60,
      height: 30,
      hollow: true,
      thickness: 2,
    },
    {
      topWidth: 60,
      bottomWidth: 60,
      height: 100,
      hollow: true,
      thickness: 2,
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
          let bottomFinWidth = piece.bottomWidth + data.fins.bottomWidth;
          difference = Math.abs(topFinWidth - bottomFinWidth);
          invert = bottomFinWidth < topFinWidth ? "invert" : "";
          pieceElem.innerHTML += `
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
        let difference = Math.abs(piece.bottomWidth-piece.topWidth);
        let invert = piece.bottomWidth < piece.topWidth ? "invert" : "";
        elem.innerHTML += `<div class="piece" style="height: ${piece.height*zoom}mm;">
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
          <input data-id="piece-br-${i}" class="rocket-input bottomright-input" value="${piece.bottomWidth}">
        </div>`
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
      elem.innerHTML += `<div class="cross-fin" style="transform: translateY(-50%) rotate(${i*360/finNumber}deg); width:${data.fins.bottomWidth*zoom}mm; height: ${data.fins.thickness*zoom/10}mm;"></div>`;
    }
  })
}

function renderRocket(data) {
  let zoom1 = document.getElementById("input-body-shape-zoom").value/100;
  renderRocket3D(data); // 3D View
  renderRocketLong(data, zoom1); // Long view, editor, fins
  renderRocketCross(data, zoom1); // Cross-section view, fins
}

// Event listeners

document.getElementById("input-body-shape-zoom").addEventListener("input", function() {
  document.getElementById("input-body-shape-zoom-slider").style.left = this.value+"%";
  document.getElementById("input-body-shape-zoom-slider").style.transform = "translateX(-"+this.value+"%)";
  renderRocketLong(rocket, this.value/100);
  renderRocketCross(rocket, this.value/100);
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
  rocket.fins.thickness = this.value;
  renderRocket(rocket);
});

// Render the rockets

renderRocket(rocket);