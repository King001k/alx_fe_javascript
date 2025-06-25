// Initial quotes array
let quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Imagination is more important than knowledge.", category: "Inspiration" },
  { text: "Stay hungry, stay foolish.", category: "Tech" }
];

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Load quotes from localStorage
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

// Display a random quote
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

  // Save last viewed quote in sessionStorage
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(randomQuote));
}

// Display the last viewed quote from sessionStorage
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

// Populate category dropdown dynamically
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

  // Restore previous filter
  const savedFilter = localStorage.getItem("selectedCategory");
  if (savedFilter) {
    categoryFilter.value = savedFilter;
    filterQuotes();
  }
}

// Filter quotes by selected category
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

// Create the add-quote form dynamically
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

// Add a new quote
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

// Export quotes as JSON file
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

// Import quotes from JSON file
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

const SERVER_URL = 'https://dummyjson.com/quotes?limit=100';

// Merge server quotes into local, preferring server data
function mergeQuotes(serverQuotes) {
  const serverSet = new Map(serverQuotes.map(q => [q.quote, q]));
  const localMap = new Map(quotes.map(q => [q.text, q]));

  // Use server quote object if exists, else local
  const merged = Array.from(new Set([...serverSet.keys(), ...localMap.keys()]))
    .map(key => {
      const svr = serverSet.get(key);
      const loc = localMap.get(key);
      return svr ? { text: svr.quote, category: loc?.category || 'Server' } : loc;
    });

  quotes = merged;
  saveQuotes();
}

// Fetch and sync from server
async function fetchAndSync() {
  try {
    const res = await fetch(SERVER_URL);
    const data = await res.json();
    if (data && Array.isArray(data.quotes)) {
      mergeQuotes(data.quotes);
      populateCategories();
      filterQuotes();
      notifyUser('Data synced from server. Server data is preferred.');
    }
  } catch (e) {
    console.error('Fetch sync failed:', e);
  }
}

// Notify users of conflict resolution
function notifyUser(msg) {
  const n = document.createElement('div');
  n.textContent = msg;
  n.style = 'position:fixed;top:10px;right:10px;background:#ffc;padding:10px;border:1px solid #cc0;';
  document.body.appendChild(n);
  setTimeout(() => n.remove(), 5000);
}


// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  loadQuotes();
  showLastViewedQuote();
  populateCategories();
  createAddQuoteForm();
  document.addEventListener("DOMContentLoaded", () => {
  // existing initialization...
  fetchAndSync();                  // initial sync on load
  setInterval(fetchAndSync, 5 * 60 * 1000); // sync every 5 minutes
});


  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  document.getElementById("exportBtn").addEventListener("click", exportToJsonFile);
  document.getElementById("importFile").addEventListener("change", importFromJsonFile);
});
