const reportPanel = document.querySelector(".report__cards");
const reportTabsContainer = document.querySelector(".report__tabs");
const reportTabs = document.querySelectorAll(".report__tab");
const dailyTab = document.querySelector("#tab-daily");

const state = {
    data: null,
}

reportTabsContainer.addEventListener("click", (e) => {
    
    // Checks if the clicked element is one of the tabs except the currently selected tab
    const tab = e.target.closest(".report__tab");

    if (tab && tab.getAttribute("aria-selected") !== "true") {
        updateReportPanel(tab);
    }
});

reportTabs.forEach((tab, index) => {
    tab.addEventListener("keydown", (e) => {
        let newIndex;

        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
            newIndex = (index + 1) % reportTabs.length;
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
            newIndex = (index - 1 + reportTabs.length) % reportTabs.length;
        } else if (e.key === "Home") {
            newIndex = 0;
        } else if (e.key === "End") {
            newIndex = reportTabs.length - 1;
        } else {
            return; // Exits if it's not an arrow key
        }

        // Manages tabindex and focus
        reportTabs[index].setAttribute("tabindex", "-1");
        reportTabs[newIndex].setAttribute("tabindex", "0");
        reportTabs[newIndex].focus();
        e.preventDefault();
    });
})


function updateReportPanel(activeTab) {

    clearReportPanel();

    // Generates report card html strings for each report
    const reportStrings = state.data.map(report => {
        const cardHTML = createCardHTMLString(report, activeTab.dataset.period);
        return cardHTML;
    });

    // Inserts each report HTML strings into the report panel element
    reportStrings.forEach((report) => {
        reportPanel.insertAdjacentHTML("beforeend", report);
    });

    // Sets the active tab
    activeTab.setAttribute("aria-selected", "true");
    activeTab.setAttribute("tabindex", "0");
    reportPanel.setAttribute("aria-labelledby", `tab-${activeTab.dataset.period}`);
}

function createCardHTMLString(data, timeframe) {

    const formattedTitle = data.title.trim().toLowerCase().replaceAll(" ", "-");
    const { current, previous } = data.timeframes[timeframe];
    const previousString = `${getPastTimeString(timeframe)} - <time datetime="0d ${previous}h 0m 0s">${previous}hrs</time>`

    return (`
        <div class="card card--${formattedTitle}" tabindex="0">
            <div class="card__details">
                <div class="card__header">
                    <h2 class="card__title">${data.title}</h2>
                    <img src="./assets/images/icon-ellipsis.svg" alt="" width="21" height="5">
                </div>
                <div class="card__body">
                    <time class="card__duration" datetime="0d ${current}h 0m 0s">${current}hrs</time>
                    <p class="card__timeframe">${previousString}</p>
                </div>
            </div>
        </div>
    `);
}

function getPastTimeString(timeframe) {

    let timeString = "";
    switch (timeframe) {
        case "daily":
            timeString = "Yesterday";
            break;
        case "weekly":
            timeString = "Last Week";
            break;
        case "monthly":
            timeString = "Last Month";
            break;
        default: 
            timeString = "Previously";
    }

    return timeString;
}

function clearReportPanel() {

    // Clears report panel and unsets the active tab
    reportPanel.replaceChildren();
    reportTabs.forEach(tab => {
        tab.setAttribute("aria-selected", "false");
        tab.setAttribute("tabindex", "-1");
    })
}

function showError() {
    const errorHTML = `<p class="error">Failed to fetch reports.</p>`;
    reportPanel.insertAdjacentHTML("beforeend", errorHTML);
}

function showLoading() {
    const loadingHTML = `<p>Fetching reports...</p>`;
    reportPanel.insertAdjacentHTML("beforeend", loadingHTML);
}

// Used to enable or disable buttons based on the status of fetching data 
// (Successful or Failed or Ongoing)
function toggleButtonsDisabled(isDisabled) {

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
async function initializePage() {
    try {
        toggleButtonsDisabled(true);
        showLoading();

        const response = await fetch("data.json");

        if (!response.ok) {
            throw Error("Failed to fetch reports");
        }

        const data = await response.json();
        state.data = data;
        updateReportPanel(dailyTab);
        toggleButtonsDisabled(false);

    } catch (e) {
        console.error(e);
        clearReportPanel();
        showError();
    }
}

document.addEventListener("DOMContentLoaded", initializePage)
