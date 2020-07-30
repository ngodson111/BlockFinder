let state = {
  boxes: 204,
};
let element = document.querySelector(".Wrapper");
let defend = document.querySelector("#defend");
//CREATING BOXES
function CreateBoxes(boxes) {
  element.innerHTML = "";
  for (let x = 0; x < boxes; x++) {
    element.innerHTML += `<div class="box" value = ${x}></div>`;
  }
}
CreateBoxes(state.boxes);

//CREATING STARTING NODES
//ARROW
let middlePoint = parseInt(element.children.length / 2) - 1;
element.children[middlePoint].classList.add("arrow");
// TARGET
element.children[state.boxes - 1].classList.add("target");

//LISTENING EVENT
let arrow = true;
let arrowPosition = middlePoint;
let target = true;
let targetPosition = state.boxes - 1;
for (let y = 0; y < element.children.length; y++) {
  element.children[y].addEventListener("click", (e) => {
    if (element.children[y].classList.contains("arrow") === true) {
      if (target) {
        element.children[y].classList.remove("arrow");
        arrow = !arrow;
      } else {
        alert("please place target first");
      }
    } else if (element.children[y].classList.contains("target") === true) {
      if (arrow) {
        element.children[y].classList.remove("target");
        target = !target;
      } else {
        alert("please place arrow first");
      }
    } else {
      if (!arrow) {
        if (!element.children[y].classList.contains("wall")) {
          element.children[y].classList.add("arrow");
          arrowPosition = element.children[y].getAttribute("value");
          arrow = !arrow;
        } else {
          alert("Cannot place on wall");
        }
      } else if (!target) {
        if (!element.children[y].classList.contains("wall")) {
          element.children[y].classList.add("target");
          targetPosition = element.children[y].getAttribute("value");
          target = !target;
        } else {
          alert("Cannot place on wall");
        }
      } else {
        if (element.children[y].classList.contains("wall") === true) {
          element.children[y].classList.remove("wall");
        } else {
          element.children[y].classList.add("wall");
        }
      }
    }
  });
}
//BUTTON EVENT
let difference = 0;
let difference1 = 0;
let cancel1 = false;
let cancel2 = false;
let startBtn = document.querySelector(".startBtn");
let stopBtn = document.querySelector(".stopBtn");
startBtn.addEventListener("click", (e) => {
  startBtn.style.display = "none";
  stopBtn.style.display = "";
  let promise1 = new Promise((resolve, reject) => {
    let k = arrowPosition;
    setInterval(() => {
      if (cancel1 === false) {
        if (k < state.boxes) {
          if (element.children[k].classList.contains("wall")) {
            if (defend.value <= 0) {
              cancel1 = true;
            } else {
              defend.value -= 1;
            }
          } else {
            if (element.children[k].classList.contains("target")) {
              difference = targetPosition - arrowPosition - 1;
              cancel1 = true;
              cancel2 = true;
              reject(difference);
            } else {
              if (!element.children[k].classList.contains("arrow")) {
                element.children[k].classList.add("searched");
                element.children[k].classList.add("unclicable");
              }
            }
          }
          ++k;
        } else {
          cancel1 = true;
        }
      }
    }, 60);
  });
  let promise2 = new Promise((resolve, reject) => {
    let k = arrowPosition;
    setInterval(() => {
      if (cancel2 === false) {
        if (k >= 0) {
          if (element.children[k].classList.contains("wall")) {
            if (defend.value <= 0) {
              cancel2 = true;
            } else {
              defend.value -= 1;
            }
          } else {
            if (element.children[k].classList.contains("target")) {
              difference1 = targetPosition - arrowPosition - 1;
              cancel2 = true;
              cancel1 = true;
              reject(difference1);
            } else {
              if (!element.children[k].classList.contains("arrow")) {
                element.children[k].classList.add("searched");
                element.children[k].classList.add("unclicable");
              }
            }
          }
          --k;
        } else {
          cancel2 = true;
        }
      }
    }, 60);
  });
  Promise.all([promise1, promise2]).catch((values) => {
    if (values > 0) {
      alert(`Target is ${Math.abs(values)} blocks after arrow`);
    } else {
      alert(`Target is ${Math.abs(values)} blocks before arrow`);
    }
  });
});
