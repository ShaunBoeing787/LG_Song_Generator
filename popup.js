document.addEventListener("DOMContentLoaded", () => {
  const autofillButton = document.getElementById("autofillButton");
  const messageElement = document.getElementById("message");

  autofillButton.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      const targetUrl = "https://radiooptimism.lg.com";

      if (currentTab.url.startsWith(targetUrl)) {
        messageElement.textContent = "";

        // Step 1: Inject the content script
        chrome.scripting.executeScript(
          {
            target: { tabId: currentTab.id },
            files: ["contentScript.js"],
          },
          () => {
            // Step 2: Send the message only after the script is injected
            chrome.tabs.sendMessage(currentTab.id, {
              action: "start_autofill",
            });
          }
        );
      } else {
        messageElement.textContent =
          "Sorry, this extension only works on radiooptimism.lg.com.";
      }
    });
  });
});
