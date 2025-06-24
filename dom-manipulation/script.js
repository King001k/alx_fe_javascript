// Initial quotes array
let quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Imagination is more important than knowledge.", category: "Inspiration" },
  { text: "Stay hungry, stay foolish.", category: "Tech" }
];

// Function to display a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  // Clear previous content
  quoteDisplay.innerHTML = '';

  // Create blockquote element
  const blockquote = document.createElement("blockquote");
  blockquote.textContent = `"${randomQuote.text}"`;

  // Create footer with category
  const footer = document.createElement("footer");
  footer.innerHTML = `Category: <em>${randomQuote.category}</em>`;

  // Append to the quote display
  quoteDisplay.appendChild(blockquote);
  quoteDisplay.appendChild(footer);
}

// Function to add a new quote
function addQuote() {
  const quoteText = document.getElementById("newQuoteText").value.trim();
  const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (quoteText && quoteCategory) {
    const newQuote = {
      text: quoteText,
      category: quoteCategory
    };

    quotes.push(newQuote);
    alert("Quote added successfully!");

    // Clear form inputs
    document.getElementById("newQuoteText").value = '';
    document.getElementById("newQuoteCategory").value = '';
  } else {
    alert("Please fill in both fields.");
  }
}

// Function to create the Add Quote form using createElement and appendChild
function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");

  // Clear previous form
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

  // Append elements to the form container
  formContainer.appendChild(heading);
  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);
}

// Initial setup when the page loads
document.addEventListener("DOMContentLoaded", () => {
  showRandomQuote();           // Display a random quote initially
  createAddQuoteForm();        // Generate the add-quote form
  document.getElementById("newQuote").addEventListener("click", showRandomQuote); // Button event
});

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

function addQuote() {
  const quoteText = document.getElementById("newQuoteText").value.trim();
  const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (quoteText && quoteCategory) {
    const newQuote = { text: quoteText, category: quoteCategory };
    quotes.push(newQuote);
    saveQuotes(); // Save to localStorage
    alert("Quote added successfully!");
    document.getElementById("newQuoteText").value = '';
    document.getElementById("newQuoteCategory").value = '';
  } else {
    alert("Please fill in both fields.");
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

  // Save last viewed quote in sessionStorage
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

const importInput = document.createElement("input");
importInput.type = "file";
importInput.accept = ".json";
importInput.id = "importFile";
importInput.addEventListener("change", importFromJsonFile);
formContainer.appendChild(importInput);

const exportButton = document.createElement("button");
exportButton.textContent = "Export Quotes (JSON)";
exportButton.addEventListener("click", exportToJsonFile);
formContainer.appendChild(exportButton);

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
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

document.addEventListener("DOMContentLoaded", () => {
  loadQuotes();                 // Load from localStorage
  showLastViewedQuote();       // Show last viewed from sessionStorage
  createAddQuoteForm();        // Build add form with import/export
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
});
