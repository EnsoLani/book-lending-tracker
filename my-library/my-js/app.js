
/* =========================
   LIBRARY LOAN TRACKER
========================= */

// Load saved loans from browser storage
let loans = [];

try {
    loans = JSON.parse(localStorage.getItem("libraryLoans")) || [];
} catch (error) {
    loans = [];
}

// Get today's date in local time
function getToday() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

// Save loans
function saveLoans() {
    localStorage.setItem("libraryLoans", JSON.stringify(loans));
}

// Check if a loan is overdue
function isOverdue(dueDate) {
    return dueDate < getToday();
}

// Update summary numbers
function updateSummary() {
    const total = loans.length;

    const overdue = loans.filter(loan =>
        isOverdue(loan.dueDate)
    ).length;

    document.getElementById("totalLoans").textContent = total;

    document.getElementById("overdueLoans").textContent = overdue;
}

// Display all loans
function displayLoans() {

    const tableBody = document.getElementById("loanTableBody");
    const emptyMessage = document.getElementById("emptyMessage");

    tableBody.replaceChildren();

    emptyMessage.hidden = loans.length > 0;

    loans.forEach(loan => {

        const row = document.createElement("tr");

        // Book information
        const values = [
            loan.title,
            loan.author,
            loan.borrower,
            loan.dueDate,
            loan.genre
        ];

        values.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        // Status
        const statusCell = document.createElement("td");
        const status = document.createElement("span");

        if (isOverdue(loan.dueDate)) {
            status.textContent = "Overdue";
            status.className = "status status-overdue";
        } else {
            status.textContent = "On Time";
            status.className = "status status-normal";
        }

        statusCell.appendChild(status);
        row.appendChild(statusCell);

        // Return button
        const actionCell = document.createElement("td");
        const returnButton = document.createElement("button");

        returnButton.textContent = "Returned";
        returnButton.className = "btn btn-danger";
        returnButton.dataset.id = loan.id;

        actionCell.appendChild(returnButton);
        row.appendChild(actionCell);

        tableBody.appendChild(row);
    });

    updateSummary();
}

// Add a new loan
function addLoan(event) {

    event.preventDefault();

    const loan = {
        id: Date.now().toString(),

        title: document.getElementById("title").value.trim(),

        author: document.getElementById("author").value.trim(),

        borrower: document.getElementById("borrower").value.trim(),

        dueDate: document.getElementById("dueDate").value,

        genre: document.getElementById("genre").value.trim()
    };

    // Check that all fields are filled
    if (
        !loan.title ||
        !loan.author ||
        !loan.borrower ||
        !loan.dueDate ||
        !loan.genre
    ) {
        alert("Please complete all fields.");
        return;
    }

    loans.push(loan);

    saveLoans();
    displayLoans();

    document.getElementById("loanForm").reset();
}

// Mark a book as returned
function returnLoan(id) {

    loans = loans.filter(loan => loan.id !== id);

    saveLoans();
    displayLoans();
}

// Event listeners
document.getElementById("loanForm").addEventListener("submit", addLoan);

document.getElementById("loanTableBody").addEventListener("click", function(event) {

    if (event.target.matches("button[data-id]")) {
        returnLoan(event.target.dataset.id);
    }

});

// Display saved loans when the page opens
displayLoans();
