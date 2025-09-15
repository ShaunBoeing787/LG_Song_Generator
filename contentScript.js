// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "start_autofill") {
    // 1. Find the form fields and fill them
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const submitBtn = document.getElementById("submit-btn");

    if (nameInput && emailInput && submitBtn) {
      nameInput.value = "My Autofilled Name";
      emailInput.value = "autofill@example.com";

      // 2. Click the submit button
      submitBtn.click();

      // The rest of the logic to get the new link will run after the page redirects
      // or the link appears. This part assumes the link is on a new page.
    } else {
      console.error("Required form elements not found.");
    }
  }
});

// This part runs on every page load, so it can detect the generated link.
// It assumes the link is a new page with a specific element.
window.addEventListener("load", () => {
  const generatedLinkElement = document.getElementById("generated-link");
  if (generatedLinkElement) {
    const generatedLink = generatedLinkElement.href;
    if (generatedLink) {
      // 3. Send the link to the background script to save it
      chrome.runtime.sendMessage({
        action: "link_generated",
        link: generatedLink,
      });
    }
  }
});
