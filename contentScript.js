// contentScript.js
// Wrap the entire script in an IIFE to create a local scope
(() => {
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;

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

  function checkAllCheckboxes() {
    const checkboxIds = ["terms-of-use", "privacy-policy", "data-processing"];
    let index = 0;

    function clickNextCheckbox() {
      if (index < checkboxIds.length) {
        checkCheckbox(checkboxIds[index]);
        index++;
        setTimeout(clickNextCheckbox, 200);
      } else {
        console.log("All checkboxes clicked. Now waiting for form fields.");
        // After checkboxes are clicked, wait for the form fields to appear
        waitForAuthorInputAndFill();
      }
    }
    clickNextCheckbox();
  }

  // New function to wait for the author input field
  function waitForAuthorInputAndFill() {
    const observer = new MutationObserver((mutationsList, obs) => {
      const authorInput = document.querySelector('input[name="author"]');
      if (authorInput) {
        console.log("Author input field detected. Initiating autofill.");
        fillFormFields();
        obs.disconnect(); // Disconnect after finding the element
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  function fillFormFields() {
    const authorInput = document.querySelector('input[name="author"]');
    if (authorInput) {
      authorInput.value = "John";

      // Dispatch an input event to force the framework to recognize the change
      authorInput.dispatchEvent(new Event("input", { bubbles: true }));

      console.log('Autofilled author with "John" and dispatched input event.');

      // Add a delay of 200 milliseconds before clicking the next button
      setTimeout(() => {
        clickNextButton();
      }, 200);
    } else {
      console.error("Could not find author input field.");
    }
  }

  function clickNextButton() {
    const nextButton = document.querySelector(
      'button[data-click-name="step_navigation_next_mobile-author"]'
    );
    if (nextButton) {
      nextButton.click();
      console.log('Clicked the "Next" button.');
    } else {
      console.error('Could not find the "Next" button.');
    }
  }

  // --- Main Logic ---
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "start_autofill") {
      console.log("Received message to start autofill.");
      const startButton = document.getElementById("create-cta");
      if (startButton) {
        startButton.click();
        console.log('Clicked "Let\'s Make a Song" button.');
        let observer = new MutationObserver((mutationsList, obs) => {
          const termsCheckbox = document.getElementById("terms-of-use");
          if (termsCheckbox) {
            console.log("New checkboxes detected. Initiating autofill.");
            checkAllCheckboxes();
            obs.disconnect();
          }
        });
        observer.observe(document.body, { childList: true, subtree: true });
      } else {
        console.error('Could not find "Let\'s Make a Song" button.');
      }
    }
  });
})();
