// contentScript.js
// Wrap the entire script in an IIFE to create a local scope
(() => {
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;

  // A generic function to wait for an element and then perform an action
  function waitForElementAndPerformAction(selector, actionFunction) {
    const observer = new MutationObserver((mutationsList, obs) => {
      const element = document.querySelector(selector);
      if (element) {
        console.log(
          `Element with selector "${selector}" detected. Initiating action.`
        );
        actionFunction(element);
        obs.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

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
    }
    const dedicationInput = document.querySelector('input[name="dedication"]');
    if (dedicationInput) {
      dedicationInput.value = "Jane";
      dedicationInput.dispatchEvent(new Event("input", { bubbles: true }));
      console.log(
        'Autofilled dedication with "Jane" and dispatched input event.'
      );
    }
    const messageInput = document.querySelector('textarea[name="message"]');
    if (messageInput) {
      messageInput.value = "friends";
      messageInput.dispatchEvent(new Event("input", { bubbles: true }));
      console.log(
        'Autofilled message with "friends" and dispatched input event.'
      );
      setTimeout(() => {
        clickNextButton("step_navigation_next_desktop-combined-user-info");
      }, 200);
    }

    waitForElementAndPerformAction(
      'button[data-click-name="step_navigation_randomize_desktop-genre"]',
      clickRandomizeButton
    );

    waitForElementAndPerformAction(
      'button[data-click-name="step_navigation_next_desktop-genre"]',
      clickNextButtonGenre
    );

    waitForElementAndPerformAction(
      'button[data-click-name="step_navigation_randomize_desktop-vibe"]',
      clickRandomizeVibeButton
    );

    waitForElementAndPerformAction(
      'button[data-click-name="step_navigation_next_desktop-vibe"]',
      clickNextVibeButton
    );
  }

  function clickNextButton() {
    const nextButton = document.querySelector(
      'button[data-click-name="step_navigation_next_desktop-combined-user-info"]'
    );
    if (nextButton) {
      nextButton.click();
      console.log('Clicked the "Next" button.');
    } else {
      console.error('Could not find the "Next" button.');
    }
  }

  function clickRandomizeButton(randomizeButton) {
    if (randomizeButton) {
      randomizeButton.click();
      console.log('Clicked the "Randomize" button.');
    } else {
      console.error('Could not find the "Randomize" button.');
    }
  }
  function clickNextButtonGenre(nextButton) {
    if (nextButton) {
      nextButton.click();
      console.log('Clicked the final "Next" button.');
    } else {
      console.error('Could not find the "Next" button for genre.');
    }
  }

  function clickRandomizeVibeButton() {
    const randomizeButton = document.querySelector(
      'button[data-click-name="step_navigation_randomize_desktop-vibe"]'
    );
    if (randomizeButton) {
      randomizeButton.click();
      console.log('Clicked the "Randomize Vibe" button.');
    } else {
      console.error('Could not find the "Randomize Vibe" button.');
    }
  }

  function clickNextVibeButton() {
    const nextButton = document.querySelector(
      'button[data-click-name="step_navigation_next_desktop-vibe"]'
    );
    if (nextButton) {
      nextButton.click();
      console.log('Clicked the "Next" button for vibe selection.');
    } else {
      console.error('Could not find the "Next" button for vibe selection.');
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
