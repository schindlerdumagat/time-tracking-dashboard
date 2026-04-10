const reportPanel = document.querySelector(".report__cards");
const reportTabsContainer = document.querySelector(".report__tabs");
const reportTabs = document.querySelectorAll(".report__tab");
const dailyTab = document.querySelector("#daily");

let cachedData;

reportTabsContainer.addEventListener("click", (e) => {
    
    // Checks if the clicked element is one of the tabs except the currently selected tab
    if (e.target.tagName === "BUTTON" && !e.target.hasAttribute("aria-selected")) {
        updateReportPanel(e.target);
    }
});

function updateReportPanel(activeTab) {

    clearReportPanel();

    // Generates report card html strings for each report
    const reportStrings = cachedData.map(report => {
        const cardHTML = createCardHTMLString(report, activeTab.id);
        return cardHTML;
    });

    // Creates html elements for each report and inserts it to the DOM
    reportStrings.forEach((report) => {
        const reportFragment = document.createRange().createContextualFragment(report);
        reportPanel.appendChild(reportFragment);
    });

    // Sets the active tab
    activeTab.setAttribute("aria-selected", "true");
    reportPanel.setAttribute("aria-labelledby", activeTab.id);
}

function createCardHTMLString(data, timeframe) {

    const formattedTitle = data.title.trim().toLowerCase().replaceAll(" ", "-");
    const current = data.timeframes[timeframe].current;
    const previous = data.timeframes[timeframe].previous;

    return (`
        <div class="card card--${formattedTitle}">
            <div class="card__details">
                <div class="card__header">
                    <h2 class="card__title">${data.title}</h2>
                    <img src="./assets/images/icon-ellipsis.svg" alt="" width="21" height="5">
                </div>
                <div class="card__body">
                    <time class="card__duration" datetime="0d ${current}h 0m 0s">${current}hrs</time>
                    <p class="card__timeframe">Last Week - <time datetime="0d ${previous}h 0m 0s">${previous}hrs</time></p>
                </div>
            </div>
        </div>
    `);
}

function clearReportPanel() {
    // Clears report panel and unsets the active tab
    reportPanel.innerHTML = "";
    reportTabs.forEach(tab => {
        tab.removeAttribute("aria-selected");
    })
}

function showError() {
    const errorHTML = `<p class="error">Failed to fetch reports.</p>`;
    const errorElem = document.createRange().createContextualFragment(errorHTML);
    reportPanel.appendChild(errorElem);
}

function showLoading() {
    const loadingHTML = `<p>Fetching reports...</p>`;
    const loadingElem = document.createRange().createContextualFragment(loadingHTML);
    reportPanel.appendChild(loadingElem);
}

// Used to enable or disable buttons based on the status of fetching data 
// (Successful or Failed or Ongoing)
function toggleButtonsDisabilty(isDisabled) {

    if (isDisabled) {
        reportTabs.forEach(tab => {
            tab.setAttribute("disabled", "");
        })
    } else {
        reportTabs.forEach(tab => {
            tab.removeAttribute("disabled");
        })
    }
}

// Initializes the page on load
(function() {
    toggleButtonsDisabilty(true);
    showLoading();
    fetch("../data.json")
    .then(response => {
        if(!response.ok) {
            throw Error("Failed to fetch reports");
        }

        return response.json();
    })
    .then(data => {
        cachedData = data;
        updateReportPanel(dailyTab);
        toggleButtonsDisabilty(false);
    })
    .catch(e => {
        clearReportPanel();
        showError();
    }) 
}
)();
