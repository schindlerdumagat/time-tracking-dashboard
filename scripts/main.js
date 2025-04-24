const dailyButton = document.querySelector("#daily"); // Used to set the default selected tab
const timeFrameButtons = document.querySelectorAll(".report__timeframe-btn");
const timeframeList = document.querySelector(".report__timeframe-list");
const reportGrid = document.querySelector(".report__grid");

let currentTimeFrame = 'daily';
let cachedData;

// Event Listener for buttons
timeframeList.addEventListener("click", (e) => {
    if (cachedData && e.target.tagName === 'BUTTON') {
        currentTimeFrame = e.target.id;
        
        // Remove buttons selected attributes
        timeFrameButtons.forEach(button => {
            button.setAttribute("aria-selected", false);
            button.classList.remove("report__timeframe-btn--active");
        })
    
        // Set selected attributes for the selected tab
        e.target.setAttribute("aria-selected", true);
        e.target.classList.add("report__timeframe-btn--active");
        
        reportGrid.innerHTML = ""; // Resets report grid
        generateReport(cachedData, currentTimeFrame);
    }
});

// This generates the reports for each data
function generateReport (reportData, timeframe) {

    reportData.forEach(data => {
        const { title, timeframes } = data;
        const { current, previous } = timeframes[timeframe];
        const formattedTitle = title.toLowerCase().replaceAll(/ /g, "-");
        let previousInlineText = timeframe === 'daily' ? 'Yesterday' : timeframe === 'weekly' ? 'Last Week' : 'Last Month';

        // Create card element
        const fragment = document.createDocumentFragment();
        const reportCard = document.createElement('div');
        reportCard.setAttribute("id", formattedTitle);
        reportCard.setAttribute("class", `report__card report__card--${formattedTitle}`);

        reportCard.innerHTML = `
            <img class="report__card-logo" src="./images/icon-${formattedTitle}.svg" alt="" />
            <div class="report__card-content">
                <div class="report__card-header">
                <h3 id="report-${formattedTitle}" class="report__card-title">${title}</h3>
                <button class="report__card-btn" aria-labelledby="report-work">
                    <svg width="21" height="5" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M2.5 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm8 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm8 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z"
                        fill-rule="evenodd"
                    />
                    </svg>
                </button>
                </div>
                <div class="report__card-body">
                <time class="report__current" datetime="0d ${current}h 0m 0s">${current}hrs</time>
                <p class="report__previous">${previousInlineText} - <time datetime="0d ${previous}h 0m 0s">${previous}hrs</time></p>
                </div>
            </div>
        `;

        fragment.appendChild(reportCard);
        reportGrid.appendChild(fragment);
    })
}

// Run fetching on page script load
(async () => {

    try {
        const response = await fetch("data.json");
    
        if(!response.ok) {
            throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        cachedData = data;
        
        // Set the daily button as the default selected tab
        dailyButton.setAttribute("aria-selected", true);
        dailyButton.classList.add("report__timeframe-btn--active");

        // Initialize report upon successful data fetching
        generateReport(data, currentTimeFrame);

    } catch (err) {
        console.error(err);

        reportGrid.innerHTML = `
            <p>Failed to fetch data</p>
        `;
    }
})();
