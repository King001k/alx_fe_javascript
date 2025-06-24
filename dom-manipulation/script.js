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
