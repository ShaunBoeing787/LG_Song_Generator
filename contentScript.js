// contentScript.js
// Wrap the entire script in an IIFE to create a local scope
(() => {
  // Check if the script has already run on this page
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;

  // Function to handle checking a single checkbox by its ID
  function checkCheckbox(elementId) {
    const checkbox = document.getElementById(elementId);
    if (checkbox) {
      checkbox.setAttribute("aria-checked", "true");
      checkbox.setAttribute("data-state", "checked");

      const mouseEvent = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
      });
      checkbox.dispatchEvent(mouseEvent);

      console.log(`Checked the "${elementId}" checkbox.`);
    } else {
      console.error(`Could not find the "${elementId}" checkbox.`);
    }
  }

  // A separate function to handle checking all checkboxes with a delay
  function checkAllCheckboxes() {
    const checkboxIds = ["terms-of-use", "privacy-policy", "data-processing"];
    let index = 0;

    function clickNextCheckbox() {
      if (index < checkboxIds.length) {
        checkCheckbox(checkboxIds[index]);
        index++;
        // Add a small delay (e.g., 200ms) before clicking the next one
        setTimeout(clickNextCheckbox, 200);
      }
    }

    clickNextCheckbox();
  }

  // --- Main Logic ---

  // Listen for messages from the popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "start_autofill") {
      console.log("Received message to start autofill.");

      const startButton = document.getElementById("create-cta");
      if (startButton) {
        startButton.click();
        console.log('Clicked "Let\'s Make a Song" button.');

        // After clicking the button, we can now start observing for the new checkboxes
        let observer = new MutationObserver((mutationsList, obs) => {
          const termsCheckbox = document.getElementById("terms-of-use");
          if (termsCheckbox) {
            console.log("New checkboxes detected. Initiating autofill.");
            checkAllCheckboxes();

            // Disconnect the observer to prevent an infinite loop
            obs.disconnect();

            // Optional: Add the next steps in your automation here, like filling the form
            // const nameInput = document.getElementById('name');
            // if (nameInput) {
            //   nameInput.value = 'My Name';
            // }
          }
        });

        // Start observing the body for child list changes
        observer.observe(document.body, { childList: true, subtree: true });
      } else {
        console.error('Could not find "Let\'s Make a Song" button.');
      }
    }
  });
})();
