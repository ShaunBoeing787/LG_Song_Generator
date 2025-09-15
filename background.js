chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "link_generated") {
    // Retrieve existing links from storage
    chrome.storage.local.get({ links: [] }, (data) => {
      const links = data.links;

      // Add the new link
      links.push(request.link);

      // Save the updated list of links
      chrome.storage.local.set({ links }, () => {
        console.log("Link saved:", request.link);
      });
    });
  }
});
