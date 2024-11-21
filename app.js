const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
  for (currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

btn.addEventListener("click", async (evt) => {
  evt.preventDefault();
  let amountInput = document.querySelector(".amount input");
  let amtVal = amountInput.value;
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amountInput.value = "1";
  }

  const fromCurrency = fromCurr.value.toLowerCase();
  const toCurrency = toCurr.value.toLowerCase();

  // Updated URL structure to fetch specific conversion rate
  const URL = `${BASE_URL}/${fromCurrency}/${toCurrency}.json`;

  try {
    const response = await fetch(URL);
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.status}`);
    }

    const data = await response.json();
    console.log("Fetched Data:", data);

    // Check if the conversion rate exists in the response
    const conversionRate = data[toCurrency];
    if (conversionRate) {
      const convertedAmount = (amtVal * conversionRate).toFixed(2);
      msg.textContent = `Converted Amount: ${convertedAmount} ${toCurrency.toUpperCase()}`;
    } else {
      msg.textContent = `Conversion rate for ${toCurrency.toUpperCase()} not found.`;
    }
  } catch (error) {
    console.error("Error:", error);
    msg.textContent = "An error occurred while fetching or processing data.";
  }
});
