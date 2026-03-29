
let lastSelection = "";

document.addEventListener("mouseup", (event) => {
  const selection = window.getSelection().toString().trim();

  // Prevent duplicate popup for same selection
  if (selection.length > 0 && selection !== lastSelection) {
    lastSelection = selection;
    showSavePopup(event.pageX, event.pageY, selection);
  }
});

function showSavePopup(x, y, text) {
  let popup = document.getElementById("highlight-popup");
  if (popup) popup.remove();

  popup = document.createElement("div");
  popup.id = "highlight-popup";

  popup.innerHTML = `
    <span>Save highlight?</span>
    <button class="yes-btn">Yes</button>
    <button class="no-btn">No</button>
  `;

  // Position slightly below selection
  popup.style.top = y + 10 + "px";
  popup.style.left = x + "px";

  // YES → save
popup.querySelector(".yes-btn").onclick = () => {
  chrome.runtime.sendMessage({
    type: "SAVE_HIGHLIGHT",
    payload: {
      text,
      url: window.location.href,
      timestamp: new Date().toISOString()
    }
  });

  popup.remove();
  lastSelection = ""; // ✅ reset
};

  // NO → just close
  popup.querySelector(".no-btn").onclick = () => {
    popup.remove();
    lastSelection = ""; // ✅ reset
};

  document.body.appendChild(popup);
}