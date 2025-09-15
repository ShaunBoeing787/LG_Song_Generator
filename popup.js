document.getElementById("autofillButton").addEventListener("click", () => {
  // Get the active tab and send a message to its content script
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "start_autofill" });
  });
});

// Load and display saved links when the popup is opened
chrome.storage.local.get({ links: [] }, (data) => {
  const linkList = document.getElementById("linkList");
  data.links.forEach((link) => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="${link}" target="_blank">${link}</a>`;
    linkList.appendChild(li);
  });
});
