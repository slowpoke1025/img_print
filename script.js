let arr = [];
const NUM = 8;
let paper, hidden_paper;
const papers = document.getElementsByClassName("paper");

const container = document.querySelector(".paper-container");
const hidden_container = document.querySelector("#hidden-paper-container");
const input = document.getElementById("file-upload");
const loader = document.querySelector(".loader");

// const remove = document.querySelector(".remove");
const reset = document.querySelector(".reset");
const restart = document.querySelector(".restart-btn");
const upload = document.querySelector(".upload-btn");
const save = document.querySelector(".save");

reset.addEventListener("click", (e) => {
  container.innerHTML = "";
  save.classList.add("hidden");
  reset.classList.add("hidden");
  arr = [];
});

restart.addEventListener("click", (e) => {
  container.innerHTML = "";
  upload.classList.remove("hidden");
  restart.classList.add("hidden");
  reset.classList.add("hidden");

  arr = [];
});
// Sortable.create(remove, {
//   group: {
//     name: "page",
//     // pull: "clone", // To clone: set pull to 'clone'
//   },
//   filter: ".filter",
//   // ghostClass: "hidden",
//   // disabled: true,
//   // ghostClass: "hidden",
//   sort: false,
//   onAdd(e) {
//     e.item.remove();
//     console.log("add", e);
//   },
// });

// remove.addEventListener("dragenter", (e) => {
//   remove.classList.add("enter");
// });

// remove.addEventListener("dragleave", (e) => {
//   remove.classList.remove("enter");
// });

input.addEventListener("change", function (event) {
  const files = event.target.files;
  if (files.length > 0) {
    save.classList.remove("hidden");
    reset.classList.remove("hidden");
  }
  [...files]
    .sort((a, b) => a.lastModified - b.lastModified)
    .forEach((file, i) => {
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          if (arr.length % NUM === 0) {
            paper = Paper();
            container.append(paper);
            // papers.push(paper);
          }
          arr.push(file);
          const img = Photo(e.target.result);
          const item = Item(img);
          paper.append(item);
        };
        reader.readAsDataURL(file);
      }
    });
  input.value = "";
});

function Photo(src) {
  const img = document.createElement("img");
  img.classList.add("image");
  img.src = src;

  return img;
}

function Item(img) {
  const item = document.createElement("div");
  item.classList.add("item");
  item.append(img);
  return item;
}

function Paper() {
  const div = document.createElement("div");
  div.classList.add("paper");
  sortable(div, "page");
  return div;
}

function convertToImage(element, i) {
  return html2canvas(element, { scale: 1.25 }).then((canvas) => {
    // document.body.appendChild(canvas); // Display the generated image

    // let resizedCanvas = document.createElement("canvas");
    // resizedCanvas.width = 1240;
    // resizedCanvas.height = 1754;
    // let ctx = resizedCanvas.getContext("2d");
    // ctx.drawImage(canvas, 0, 0, 1240, 1754);
    // let imgData = resizedCanvas.toDataURL("image/png");
    // let img = new Image();
    // img.src = imgData;
    // document.body.appendChild(img); // Display resized image

    let link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `${getDate()}-${i}.png`; // File name
    link.click();
    link.remove();
    // container.append(canvas);

    container.append(Photo(link.href));
    loader.classList.add("hidden");

    // canvas.toBlob((blob) => {
    //   let url = URL.createObjectURL(blob); // Create a Blob URL

    //   // Create a download link
    //   let link = document.createElement("a");
    //   link.href = url;
    //   link.download = `${getDate()}-${i}.png`; // File name
    //   document.body.appendChild(link);
    //   link.click();
    //   document.body.removeChild(link);

    //   // Revoke object URL to free memory
    //   URL.revokeObjectURL(url);
    // }, "image/png"); // Format: PNG (change to "image/jpeg" if needed)
    return canvas;
  });
}

save.addEventListener("click", (e) => {
  save.disabled = true;
  upload.classList.add("hidden");
  loader.classList.remove("hidden");
  restart.classList.remove("hidden");
  reset.classList.add("hidden");

  hidden_container.innerHTML = "";
  hidden_container.append(container.cloneNode(true));
  const _pages = hidden_container.querySelectorAll(".paper");
  container.innerHTML = "";
  _pages.forEach((_page, i) => {
    convertToImage(_page, i);
  });
  save.classList.add("hidden");
});

function sortable(element, group, swap = true) {
  Sortable.create(element, {
    group: {
      name: group,
      // pull: "clone",
    }, // 本章節新增 共享區塊
    filter: ".filter",

    animation: 150,
    swap: swap,
    swapClass: "swapClass",
    chosenClass: "chosenClass", // Add swap effect
    ghostClass: "ghostClass",
    dragClass: "dragClass", // Special styling during drag operation

    // ghostClass: "hidden",

    onMove: function (evt) {
      // if (evt.to.id === "trash") {
      //   this.option("swap", false);
      //   remove.classList.add("enter");
      //   return 1;
      // } else {
      //   Sortable.get(evt.to).option("swap", true);
      //   remove.classList.remove("enter");
      // }
    },

    onEnd: (e) => {
      // remove.classList.remove("enter");
      // const paper = e.from;
      // if (paper.children.length === 0) {
      //   paper.remove();
      // }
    },
  });
}

document.addEventListener("contextmenu", (e) => e.preventDefault());

function getDate() {
  const date = new Date();
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getMinutes()}-${date.getSeconds()}`;
}
