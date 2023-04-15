const startDateInput = document.getElementById("start_date");
const endDateInput = document.getElementById("end_date");
const calculateButton = document.querySelector(".calculate");
const monthButton = document.querySelector(".month");
const weekButton = document.querySelector(".week");


startDateInput.addEventListener("input", function () {
  endDateInput.min = startDateInput.value;
});

function setWeek() {
  let startDate = new Date();
  let endDate = new Date();

  endDate.setDate(startDate.getDate() + 7);

  document.getElementById("start_date").valueAsDate = startDate;
  document.getElementById("end_date").valueAsDate = endDate;
  document
    .getElementById("end_date")
    .setAttribute("min", document.getElementById("start_date").value);
}

function setMonth() {
  let startDate = new Date();
  let endDate = new Date();

  endDate.setMonth(startDate.getMonth() + 1);

  document.getElementById("start_date").valueAsDate = startDate;
  document.getElementById("end_date").valueAsDate = endDate;
  document
    .getElementById("end_date")
    .setAttribute("min", document.getElementById("start_date").value);
}

function isWeekend(date) {
  return date.getDay() === 0 || date.getDay() === 6;
}

function getWeekendDays(startDate, endDate) {
  let weekends = 0;
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    if (isWeekend(currentDate)) {
      weekends++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return weekends;
}

function getBusinessDays(startDate, endDate) {
  let businessDays = 0;
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    if (!isWeekend(currentDate)) {
      businessDays++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return businessDays;
}

function saveCalculationResult(calculationResult) {
  let calculations = JSON.parse(localStorage.getItem("calculations")) || [];
  calculations.push(calculationResult);

  if (calculations.length > 10) {
    calculations.shift();
  }

  localStorage.setItem("calculations", JSON.stringify(calculations));
}

function getSavedCalculationResults() {
  return JSON.parse(localStorage.getItem("calculations")) || [];
}

function insertDataIntoTable(startDate, endDate, result, unit) {
  const table = document.getElementById("results_table");
  const newRow = table.insertRow(-1);
  const startDateCell = newRow.insertCell(0);
  const endDateCell = newRow.insertCell(1);
  const resultCell = newRow.insertCell(2);

  startDateCell.textContent = startDate.toLocaleDateString();
  endDateCell.textContent = endDate.toLocaleDateString();
  resultCell.textContent = `${result} ${unit}`;
}

function loadSavedCalculations() {
   const calculations = getSavedCalculationResults();

   for (let i = 0; i < calculations.length; i++) {
     insertDataIntoTable(
     new Date(calculations[i].startDate),
     new Date(calculations[i].endDate),
     calculations[i].result,
     calculations[i].unit);
    }
}

loadSavedCalculations();

function calculate() {
  const startDate = new Date(document.getElementById("start_date").value);
  const endDate = new Date(document.getElementById("end_date").value);
  const dayType = document.getElementById("day_type").value;
  const timeUnit = document.getElementById("time_unit").value;

  if (startDate <= endDate) {
    const diffInMs = endDate - startDate;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    let result = diffInDays;

    if (dayType === "businessdays") {
      result = getBusinessDays(startDate, endDate);
    } else if (dayType === "weekends") {
      result = getWeekendDays(startDate, endDate);
    }

    const DAY_IN_SECONDS = 24 * 60 * 60;
    const DAY_IN_MINS = 24 * 60;
    const DAY_IN_HOURS = 24;
    let unit = "";
    if (timeUnit === "days") {
      unit = "дні";
    } else if (timeUnit === "hours") {
      result *= DAY_IN_HOURS;
      unit = "годин";
    } else if (timeUnit === "minutes") {
      result *= DAY_IN_MINS;
      unit = "хвилин";
    } else if (timeUnit === "seconds") {
      result *= DAY_IN_SECONDS;
      unit = "секунд";
    }

    const calculationResult = {
      startDate: startDate,
      endDate: endDate,
      result: result,
      unit: unit
    };

    saveCalculationResult(calculationResult);

    const resultSpan = document.getElementById("result");
    resultSpan.textContent = `Результат:  ${result} ${unit}`;

    insertDataIntoTable(startDate, endDate, result, unit);

  } else {
    document.getElementById("result").textContent = "Некоректні дати";
  }
}

calculateButton.addEventListener("click", calculate);
weekButton.addEventListener("click", setWeek);
monthButton.addEventListener("click", setMonth);