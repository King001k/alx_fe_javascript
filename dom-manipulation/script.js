// script.js

let quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Imagination is more important than knowledge.", category: "Inspiration" },
  { text: "Stay hungry, stay foolish.", category: "Tech" }
];

const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts';

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  quoteDisplay.innerHTML = '';

  const blockquote = document.createElement("blockquote");
  blockquote.textContent = `"${randomQuote.text}"`;

  const footer = document.createElement("footer");
  footer.innerHTML = `Category: <em>${randomQuote.category}</em>`;

  quoteDisplay.appendChild(blockquote);
  quoteDisplay.appendChild(footer);

  sessionStorage.setItem("lastViewedQuote", JSON.stringify(randomQuote));
}

function showLastViewedQuote() {
  const lastQuote = sessionStorage.getItem("lastViewedQuote");
  if (lastQuote) {
    const quote = JSON.parse(lastQuote);
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = '';

    const blockquote = document.createElement("blockquote");
    blockquote.textContent = `"${quote.text}"`;

    const footer = document.createElement("footer");
    footer.innerHTML = `Category: <em>${quote.category}</em>`;

    quoteDisplay.appendChild(blockquote);
    quoteDisplay.appendChild(footer);
  }
}

function addQuote() {
  const quoteText = document.getElementById("newQuoteText").value.trim();
  const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (quoteText && quoteCategory) {
    const newQuote = { text: quoteText, category: quoteCategory };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    filterQuotes();
    alert("Quote added successfully!");
    document.getElementById("newQuoteText").value = '';
    document.getElementById("newQuoteCategory").value = '';
  } else {
    alert("Please fill in both fields.");
  }
}

function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");
  formContainer.innerHTML = '';

  const heading = document.createElement("h2");
  heading.textContent = "Add a New Quote";

  const quoteInput = document.createElement("input");
  quoteInput.type = "text";
  quoteInput.id = "newQuoteText";
  quoteInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.id = "newQuoteCategory";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote);

  formContainer.appendChild(heading);
  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);
}

function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  const uniqueCategories = [...new Set(quotes.map(q => q.category))];

  uniqueCategories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  const savedFilter = localStorage.getItem("selectedCategory");
  if (savedFilter) {
    categoryFilter.value = savedFilter;
    filterQuotes();
  }
}

function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selectedCategory);

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = '';

  const filteredQuotes = selectedCategory === 'all'
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes found for this category.";
    return;
  }

  filteredQuotes.forEach(quote => {
    const blockquote = document.createElement("blockquote");
    blockquote.textContent = `"${quote.text}"`;

    const footer = document.createElement("footer");
    footer.innerHTML = `Category: <em>${quote.category}</em>`;

    quoteDisplay.appendChild(blockquote);
    quoteDisplay.appendChild(footer);
  });
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        filterQuotes();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON structure.");
      }
    } catch {
      alert("Failed to parse JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();
  URL.revokeObjectURL(url);
}

function notifyUser(message) {
  const notice = document.createElement("div");
  notice.textContent = message;
  notice.style = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: #f9c74f;
    color: #000;
    padding: 10px 15px;
    border-radius: 5px;
    box-shadow: 0 0 5px rgba(0,0,0,0.2);
    z-index: 1000;
  `;
  document.body.appendChild(notice);
  setTimeout(() => notice.remove(), 4000);
}

function mergeQuotes(serverQuotes) {
  const serverMap = new Map(serverQuotes.map(q => [q.quote, q]));
  const localMap = new Map(quotes.map(q => [q.text, q]));

  const merged = Array.from(new Set([...serverMap.keys(), ...localMap.keys()])).map(key => {
    const serverQuote = serverMap.get(key);
    const localQuote = localMap.get(key);
    return serverQuote
      ? { text: serverQuote.quote, category: localQuote?.category || 'Server' }
      : localQuote;
  });

  quotes = merged;
  saveQuotes();
}

async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const data = await response.json();

    // Use the 'title' as quote text and 'body' as category for simulation
    const serverQuotes = data.slice(0, 10).map(post => ({
      text: post.title,
      category: post.body.slice(0, 20) || 'Server'
    }));

    mergeQuotes(serverQuotes);
    populateCategories();
    filterQuotes();
    notifyUser('Quotes synced from server using jsonplaceholder.');
  } catch (error) {
    console.error('Error fetching quotes from server:', error);
    notifyUser('Failed to sync with server.');
  }
}
// Init

document.addEventListener("DOMContentLoaded", () => {
  loadQuotes();
  showLastViewedQuote();
  createAddQuoteForm();
  populateCategories();
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  document.getElementById("exportBtn").addEventListener("click", exportToJsonFile);
  document.getElementById("importFile").addEventListener("change", importFromJsonFile);
  document.getElementById("categoryFilter").addEventListener("change", filterQuotes);
  fetchQuotesFromServer();
  setInterval(fetchQuotesFromServer, 5 * 60 * 1000);
});
