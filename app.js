var currentSectionIndex = 0;
var book = ePub();
var rendition;
var inputElement = document.getElementById("input");

inputElement.addEventListener("change", function (e) {
  console.log("ONCHANGE TRIGGERED");

  var file = e.target.files[0];
  if (window.FileReader) {
    var reader = new FileReader();
    reader.onload = openBook;
    reader.readAsArrayBuffer(file);
    document.getElementsByClassName("spreads")[0].setAttribute("id", "viewer");
  }
});

function openBook(e) {
  var bookData = e.target.result;
  var title = document.getElementById("title");
  var next = document.getElementById("next");
  var prev = document.getElementById("prev");

  book.open(bookData, "binary");

  rendition = book.renderTo("viewer", {
    width: "100%",
    height: "500px",
    manager: "continuous",
  });

  rendition.display();

  var title = document.getElementById("title");

  var next = document.getElementById("next");
  next.addEventListener(
    "click",
    function (e) {
      rendition.next();
      e.preventDefault();
    },
    false
  );

  var prev = document.getElementById("prev");
  prev.addEventListener(
    "click",
    function (e) {
      rendition.prev();
      e.preventDefault();
    },
    false
  );

  var keyListener = function (e) {
    // Left Key
    if ((e.keyCode || e.which) == 37) {
      rendition.prev();
    }

    // Right Key
    if ((e.keyCode || e.which) == 39) {
      rendition.next();
    }
  };

  rendition.on("keyup", keyListener);
  document.addEventListener("keyup", keyListener, false);

  rendition.on("rendered", function (section) {
    var nextSection = section.next();
    var prevSection = section.prev();
    var current = book.navigation.get(section.href);

    if (nextSection) {
      next.textContent = "›";
    } else {
      next.textContent = "";
    }

    if (prevSection) {
      prev.textContent = "‹";
    } else {
      prev.textContent = "";
    }
  });

  rendition.on("relocated", function (location) {
    console.log(location);
  });
  // Selector for Themes
  document.getElementById("darkTheme").addEventListener("click", function () {
    rendition.themes.register("dark", "./css/themes.css");
    rendition.themes.register("openDyslexic", "./css/openSansFont.css");
    rendition.themes.select("openDyslexic");
    rendition.themes.select("dark");
  });

  document.getElementById("tanTheme").addEventListener("click", function () {
    rendition.themes.register("tan", "./css/themes.css");
    rendition.themes.register("openDyslexic", "./css/openSansFont.css");
    rendition.themes.select("openDyslexic");
    rendition.themes.select("tan");
  });

  document.getElementById("lightTheme").addEventListener("click", function () {
    rendition.themes.register("light", "./css/themes.css");
    rendition.themes.register("openDyslexic", "./css/openSansFont.css");
    rendition.themes.select("openDyslexic");
    rendition.themes.select("light");
  });

  // Selector for Font Type
  document
    .getElementById("fontOpenSans")
    .addEventListener("click", function () {
      rendition.themes.register("openSans", "./css/openSansFont.css");
      rendition.themes.select("openSans");
    });
  document
    .getElementById("fontOpenDyslexic")
    .addEventListener("click", function () {
      rendition.themes.register("openDyslexic", "./css/openSansFont.css");
      rendition.themes.select("openDyslexic");
    });

  // Selectors for Font Size
  document
    .getElementById("fontSizeSmaller")
    .addEventListener("click", function () {
      rendition.themes.register("smaller", "./css/fontSize.css");
      rendition.themes.register("openDyslexic", "./css/openSansFont.css");
      rendition.themes.select("openDyslexic");
      rendition.themes.select("smaller");
    });
  document
    .getElementById("fontSizeMedium")
    .addEventListener("click", function () {
      rendition.themes.register("medium", "./css/fontSize.css");
      rendition.themes.register("openDyslexic", "./css/openSansFont.css");
      rendition.themes.select("openDyslexic");
      rendition.themes.select("medium");
    });
  document
    .getElementById("fontSizeLarger")
    .addEventListener("click", function () {
      rendition.themes.register("larger", "./css/fontSize.css");
      rendition.themes.register("openDyslexic", "./css/openSansFont.css");
      rendition.themes.select("openDyslexic");
      rendition.themes.select("larger");
    });
  rendition.themes.register("openDyslexic", "./css/openSansFont.css");
  rendition.themes.select("openDyslexic");
  // Apply a class to selected text
  rendition.on("selected", function (cfiRange, contents) {
    rendition.annotations.highlight(cfiRange, {}, (e) => {
      console.log("highlight clicked", e.target);
    });
    contents.window.getSelection().removeAllRanges();
  });

  this.rendition.themes.default({
    "::selection": {
      background: "rgba(255,255,0, 0.3)",
    },
    ".epubjs-hl": {
      fill: "yellow",
      "fill-opacity": "0.3",
      "mix-blend-mode": "multiply",
    },
  });

  // Illustration of how to get text from a saved cfiRange
  var highlights = document.getElementById("highlights");

  rendition.on("selected", function (cfiRange) {
    book.getRange(cfiRange).then(function (range) {
      var text;
      var li = document.createElement("li");
      var a = document.createElement("a");
      var remove = document.createElement("a");
      var textNode;

      if (range) {
        text = range.toString();
        textNode = document.createTextNode(text);

        a.textContent = cfiRange;
        a.href = "#" + cfiRange;
        a.onclick = function () {
          rendition.display(cfiRange);
        };

        remove.textContent = "remove";
        remove.href = "#" + cfiRange;
        remove.onclick = function () {
          rendition.annotations.remove(cfiRange);
          return false;
        };

        li.appendChild(a);
        li.appendChild(textNode);
        li.appendChild(remove);
        highlights.appendChild(li);
      }
    });
  });
  rendition.themes.default({
    h2: {
      "font-size": "32px",
      color: "black",
    },
    p: {
      margin: "10px",
    },
    body: {
      "font-family": "opendyslexic",
    },
  });
}
