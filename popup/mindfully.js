

/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
function listenForClicks() {
  document.addEventListener("click", (e) => {
    function mindfully(tabs) {
        browser.tabs.sendMessage(tabs[0].id, {
          command: "mindfully",
          beastURL: e.target.textContent
        });
    }

    /**
     * Remove the page-hiding CSS from the active tab,
     * send a "reset" message to the content script in the active tab.
     */
    function reset(tabs) {
      browser.tabs.removeCSS({code: hidePage}).then(() => {
        browser.tabs.sendMessage(tabs[0].id, {
          command: "reset",
        });
      });
    }

    /**
     * Just log the error to the console.
     */


    /**
     * Get the active tab,
     * then call "beastify()" or "reset()" as appropriate.
     */
    if (e.target.classList.contains("beast")) {
      browser.tabs.query({active: true, currentWindow: true})
        .then(beastify)
        .catch(reportError);
    }
    else if (e.target.classList.contains("reset")) {
      browser.tabs.query({active: true, currentWindow: true})
        .then(reset)
        .catch(reportError);
    }
  });
}

/**
 * There was an error executing the script.
 * Display the popup's error message, and hide the normal UI.
 */
function reportExecuteScriptError(error) {
  document.querySelector("#popup-content").classList.add("hidden");
  document.querySelector("#error-content").classList.remove("hidden");
  console.error(`Failed to execute beastify content script: ${error.message}`);
}

async function update_ticker_div() {
    try {
        let gBackground = await browser.runtime.getBackgroundPage(),
            tickerDiv = document.getElementById("tickerDiv");
        tickerDiv.textContent = await gBackground.get_popup_ticker();

    } catch (e) { console.error(e); }
};
update_ticker_div();

/**
 * When the popup loads, inject a content script into the active tab,
 * and add a click handler.
 * If we couldn't inject the script, handle the error.
 */
browser.tabs.executeScript({file: "/content_scripts/beastify.js"})
.then(listenForClicks)
.catch(reportExecuteScriptError);



async function handle_summary_button_click() {
    try {
        let url = browser.extension.getURL("summary/index.html"),
            // we have to query then filter because we can't query for
            // non-standard add-on url directly
            tabs = await browser.tabs.query({}),
            summaryTab = tabs.filter((t) => t.url === url);

        if (summaryTab[0]) {
            // We have to activate the tab first because if the active window
            // changes, the popup closes, taking this code down with it.
            await browser.tabs.update(summaryTab[0].id, {active: true});
            await browser.windows.update(summaryTab[0].windowId, {focused: true});
        } else {
            browser.tabs.create({url: url});
        }
        // Close the popup dropdown, if it is still open and this code is still
        // running.
        window.close();

    } catch (e) { console.error(e); }
};

document.getElementById("summaryButton").addEventListener('click', handle_summary_button_click);

