const dailyButton = document.querySelector("#daily-button");
const weeklyButton = document.querySelector("#weekly-button");
const monthlyButton = document.querySelector("#monthly-button");

const reportCards = document.querySelectorAll(".report__card");
const editableElements = [...reportCards].map(reportCard => {
    const reportTitle = reportCard.querySelector(".report__card-title");
    const reportCurrent = reportCard.querySelector(".report__current");
    const reportPrevious = reportCard.querySelector(".report__previous");

    return {
        reportTitle: reportTitle, 
        reportCurrent: reportCurrent,
        reportPrevious: reportPrevious,
    }
})

let reportData;

dailyButton.addEventListener("click", () => {

    if (reportData && dailyButton.getAttribute("aria-selected") !== "true") {
        console.log('clicked')
        dailyButton.setAttribute("aria-selected", true);
        weeklyButton.setAttribute("aria-selected",false);
        monthlyButton.setAttribute("aria-selected", false);

        dailyButton.classList.add("report__timeframe-btn--active");
        weeklyButton.classList.remove("report__timeframe-btn--active");
        monthlyButton.classList.remove("report__timeframe-btn--active");

        populateReport(reportData, 'Daily');
    }


})
weeklyButton.addEventListener("click", () => {

    if (reportData && weeklyButton.getAttribute("aria-selected") !== "true") {
        weeklyButton.setAttribute("aria-selected",true);
        dailyButton.setAttribute("aria-selected", false);
        monthlyButton.setAttribute("aria-selected", false);
        
        weeklyButton.classList.add("report__timeframe-btn--active");
        dailyButton.classList.remove("report__timeframe-btn--active");
        monthlyButton.classList.remove("report__timeframe-btn--active");

        populateReport(reportData, 'Weekly');
    }
})
monthlyButton.addEventListener("click", () => {

    if (reportData && monthlyButton.getAttribute("aria-selected") !== "true") {
        monthlyButton.setAttribute("aria-selected", true);
        weeklyButton.setAttribute("aria-selected",false);
        dailyButton.setAttribute("aria-selected", false);
        
        monthlyButton.classList.add("report__timeframe-btn--active");
        dailyButton.classList.remove("report__timeframe-btn--active");
        weeklyButton.classList.remove("report__timeframe-btn--active");

        populateReport(reportData, 'Monthly');
    }
    
})

async function fetchData() {
    const response = await fetch("../data.json");
    
    if(!response.ok) {
        throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    return data;
}

function populateReport(fetchedData, timeFrame) {

    editableElements.forEach(element => {
        const data = fetchedData.find(data => element.reportTitle.innerHTML === data.title)

        if (data) {

            const selectedTimeFrame = timeFrame === 'Daily' ? data.timeframes.daily :
                                      timeFrame === 'Weekly' ? data.timeframes.weekly :
                                      data.timeframes.monthly

            const { current, previous } = selectedTimeFrame;

            const previousInlineText = timeFrame === 'Daily' ? 'Yesterday' : timeFrame === 'Weekly' ? 'Last Week' : 'Last Month'
            
            const previousText = document.createTextNode(`${previousInlineText} - `);
            const reportPreviousTime = document.createElement("time");
            
            reportPreviousTime.innerHTML = `${previous}hrs`;
            reportPreviousTime.setAttribute("datatime", `0d ${previous}h 0m 0s`)
            
            element.reportCurrent.innerHTML = `${current}hrs`;

            element.reportPrevious.innerHTML = "";
            element.reportPrevious.appendChild(previousText);
            element.reportPrevious.appendChild(reportPreviousTime);
        }
    
    })

}

function initializeReport(fetchedData) {

    editableElements.forEach(element => {
        const data = fetchedData.find(data => element.reportTitle.innerHTML === data.title);

        if (data) {
            const { current, previous } = data.timeframes.daily;
            
            const previousText = document.createTextNode("Yesterday - ");
            const reportPreviousTime = document.createElement("time");
            
            reportPreviousTime.innerHTML = `${previous}hrs`;
            reportPreviousTime.setAttribute("datatime", `0d ${previous}h 0m 0s`)
            
            element.reportCurrent.innerHTML = `${current}hrs`;
            element.reportPrevious.appendChild(previousText);
            element.reportPrevious.appendChild(reportPreviousTime);
        }
    
    })

}

fetchData()
.then(data => {
    reportData = data;
    initializeReport(data)
})
.catch(err => console.error(err));
