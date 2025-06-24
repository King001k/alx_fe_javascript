// Initial quotes array
let quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Imagination is more important than knowledge.", category: "Inspiration" },
  { text: "Stay hungry, stay foolish.", category: "Tech" }
];

// Function to show a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  quoteDisplay.innerHTML = `
    <blockquote>
      "${randomQuote.text}"
      <footer>Category: <em>${randomQuote.category}</em></footer>
    </blockquote>
  `;
}

// Function to add a new quote
function addQuote() {
  creatAddQuoteForm();
  const quoteText = document.getElementById("newQuoteText").value.trim();
  const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (quoteText && quoteCategory) {
    const newQuote = {
      text: quoteText,
      category: quoteCategory
    };

    quotes.push(newQuote);
    alert("Quote added successfully!");
    document.getElementById("newQuoteText").value = '';
    document.getElementById("newQuoteCategory").value = '';
  } else {
    alert("Please fill in both fields.");
  }
}

// Function to create the "Add Quote" form dynamically
function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");

  const formHTML = `
    <h2>Add a New Quote</h2>
    <input type="text" id="newQuoteText" placeholder="Enter quote text" />
    <input type="text" id="newQuoteCategory" placeholder="Enter quote category" />
    <button onclick="addQuote()">Add Quote</button>
  `;

  formContainer.innerHTML = formHTML;
}

// Call the function to display the form on page load
createAddQuoteForm();


// Event listener for "Show New Quote" button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Show one quote by default on load
showRandomQuote();
