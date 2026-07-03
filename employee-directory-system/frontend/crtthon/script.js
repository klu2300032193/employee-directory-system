const API_BASE = "http://localhost:8080/employees";

const loginPage = document.getElementById("loginPage");
const appPage = document.getElementById("appPage");
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const mainPanel = document.getElementById("mainPanel");
const logoutBtn = document.getElementById("logoutBtn");
const navButtons = document.querySelectorAll(".nav-btn");

let currentAction = "";
let currentEmployeeForDelete = null;

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (username === "admin" && password === "admin@123") {
    loginPage.classList.add("hidden");
    appPage.classList.remove("hidden");
    loginMessage.textContent = "";
    showWelcome();
  } else {
    loginMessage.textContent = "Invalid username or password.";
    loginMessage.className = "message error";
  }
});

logoutBtn.addEventListener("click", () => {
  loginForm.reset();
  clearActiveButtons();
  mainPanel.innerHTML = "";
  appPage.classList.add("hidden");
  loginPage.classList.remove("hidden");
});

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.action;
    setActiveButton(button);

    if (action === "add") showEmployeeForm("add");
    if (action === "display") displayAllEmployees();
    if (action === "search") showIdForm("search");
    if (action === "update") showUpdateLookupForm();
    if (action === "delete") showDeleteLookupForm();
    if (action === "count") showTotalEmployees();
    if (action === "clear") showWelcome();
  });
});

function clearActiveButtons() {
  navButtons.forEach((btn) => btn.classList.remove("active"));
}

function setActiveButton(activeButton) {
  clearActiveButtons();
  activeButton.classList.add("active");
}

function showWelcome() {
  currentAction = "";
  clearActiveButtons();

  mainPanel.innerHTML = `
    <div class="welcome">
      <div>
        <div class="avatar-animation"></div>
        <h1>Employee Directory Dashboard</h1>
        <p>Select an option from the sidebar to manage employee records.</p>
      </div>
    </div>
  `;
}

function showEmployeeForm(action) {
  currentAction = action;
  currentEmployeeForDelete = null;

  const title = action === "add" ? "Add Employee" : "Update Employee";
  const buttonText = action === "add" ? "Execute Add Employee" : "Execute Update Employee";

  mainPanel.innerHTML = `
    <h1>${title}</h1>
    <form id="employeeForm">
      <div class="form-grid">
        <label>ID <input type="number" id="id" required /></label>
        <label>Name <input type="text" id="name" required /></label>
        <label>Department <input type="text" id="department" required /></label>
        <label>Designation <input type="text" id="designation" required /></label>
        <label>Salary <input type="number" id="salary" required /></label>
        <label>Email <input type="email" id="email" required /></label>
        <label>Phone <input type="text" id="phone" required /></label>
      </div>
      <button class="primary-btn" type="submit">${buttonText}</button>
      <div id="formMessage" class="message"></div>
    </form>
  `;

  document.getElementById("employeeForm").addEventListener("submit", handleEmployeeSubmit);
}

function showIdForm(action) {
  currentAction = action;
  currentEmployeeForDelete = null;

  const title = action === "search" ? "Search Employee" : "Delete Employee";
  const buttonText = action === "search" ? "Execute Search Employee" : "Execute Delete Employee";

  mainPanel.innerHTML = `
    <h1>${title}</h1>
    <form id="idForm">
      <div class="form-grid single">
        <label>Employee ID <input type="number" id="employeeId" required /></label>
      </div>
      <button class="primary-btn" type="submit">${buttonText}</button>
      <div id="formMessage" class="message"></div>
    </form>
    <div id="resultArea"></div>
  `;

  document.getElementById("idForm").addEventListener("submit", handleIdSubmit);
}

function showUpdateLookupForm() {
  currentAction = "update";
  currentEmployeeForDelete = null;

  mainPanel.innerHTML = `
    <h1>Update Employee</h1>
    <form id="idForm">
      <div class="form-grid single">
        <label>Employee ID <input type="number" id="employeeId" required /></label>
      </div>
      <button class="primary-btn" type="submit">Find Employee To Update</button>
      <div id="formMessage" class="message"></div>
    </form>
    <div id="resultArea"></div>
  `;

  document.getElementById("idForm").addEventListener("submit", handleUpdateLookupSubmit);
}

function showDeleteLookupForm() {
  currentAction = "delete";
  currentEmployeeForDelete = null;

  mainPanel.innerHTML = `
    <h1>Delete Employee</h1>
    <form id="idForm">
      <div class="form-grid single">
        <label>Employee ID <input type="number" id="employeeId" required /></label>
      </div>
      <button class="primary-btn" type="submit">Find Employee To Delete</button>
      <div id="formMessage" class="message"></div>
    </form>
    <div id="resultArea"></div>
  `;

  document.getElementById("idForm").addEventListener("submit", handleDeleteLookupSubmit);
}

function renderUpdateForm(employee) {
  currentAction = "update";

  mainPanel.innerHTML = `
    <h1>Update Employee</h1>
    <form id="employeeForm">
      <div class="form-grid">
        <label>ID <input type="number" id="id" value="${employee.id}" required readonly /></label>
        <label>Name <input type="text" id="name" value="${employee.name || ""}" required /></label>
        <label>Department <input type="text" id="department" value="${employee.department || ""}" required /></label>
        <label>Designation <input type="text" id="designation" value="${employee.designation || ""}" required /></label>
        <label>Salary <input type="number" id="salary" value="${employee.salary || ""}" required /></label>
        <label>Email <input type="email" id="email" value="${employee.email || ""}" required /></label>
        <label>Phone <input type="text" id="phone" value="${employee.phone || ""}" required /></label>
      </div>
      <button class="primary-btn" type="submit">Execute Update Employee</button>
      <div id="formMessage" class="message"></div>
    </form>
  `;

  document.getElementById("employeeForm").addEventListener("submit", handleEmployeeSubmit);
}

function renderDeletePreview(employee) {
  currentEmployeeForDelete = employee;

  mainPanel.innerHTML = `
    <h1>Delete Employee</h1>
    <div id="formMessage" class="message"></div>
    <div id="resultArea" class="table-wrap">
      <table>
        <thead>
          <tr><th>Field</th><th>Value</th></tr>
        </thead>
        <tbody>
          <tr><td>ID</td><td>${employee.id}</td></tr>
          <tr><td>Name</td><td>${employee.name}</td></tr>
          <tr><td>Department</td><td>${employee.department}</td></tr>
          <tr><td>Designation</td><td>${employee.designation}</td></tr>
          <tr><td>Salary</td><td>${employee.salary}</td></tr>
          <tr><td>Email</td><td>${employee.email}</td></tr>
          <tr><td>Phone</td><td>${employee.phone}</td></tr>
        </tbody>
      </table>
      <div style="margin-top: 1rem; display: flex; gap: 0.75rem;">
        <button id="confirmDeleteBtn" class="primary-btn" type="button">Confirm Delete</button>
        <button id="cancelDeleteBtn" class="primary-btn" type="button">Cancel</button>
      </div>
    </div>
  `;

  document.getElementById("confirmDeleteBtn").addEventListener("click", handleDeleteConfirm);
  document.getElementById("cancelDeleteBtn").addEventListener("click", () => {
    currentEmployeeForDelete = null;
    showWelcome();
  });
}

function getEmployeePayload() {
  return {
    id: Number(document.getElementById("id").value),
    name: document.getElementById("name").value.trim(),
    department: document.getElementById("department").value.trim(),
    designation: document.getElementById("designation").value.trim(),
    salary: Number(document.getElementById("salary").value),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim()
  };
}

function isEmployeePayloadValid(employee) {
  return (
    employee.id &&
    employee.name &&
    employee.department &&
    employee.designation &&
    employee.salary &&
    employee.email &&
    employee.phone
  );
}

async function handleEmployeeSubmit(event) {
  event.preventDefault();

  const message = document.getElementById("formMessage");
  const employee = getEmployeePayload();

  if (!isEmployeePayloadValid(employee)) {
    showMessage(message, "Please fill all fields.", "error");
    return;
  }

  try {
    const url = currentAction === "add" ? API_BASE : `${API_BASE}/${employee.id}`;
    const method = currentAction === "add" ? "POST" : "PUT";

    const responseText = await sendRequest(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(employee)
    });

    showMessage(message, responseText, "success");
    event.target.reset();
  } catch (error) {
    showMessage(message, error.message, "error");
  }
}

async function handleUpdateLookupSubmit(event) {
  event.preventDefault();

  const id = document.getElementById("employeeId").value.trim();
  const message = document.getElementById("formMessage");
  const resultArea = document.getElementById("resultArea");

  if (!id) {
    showMessage(message, "Please enter employee ID.", "error");
    return;
  }

  try {
    const employee = await sendRequest(`${API_BASE}/${id}`, {}, true);
    if (!employee || !employee.id) {
      showMessage(message, "Employee not found.", "error");
      resultArea.innerHTML = "";
      return;
    }

    renderUpdateForm(employee);
  } catch (error) {
    const msg = error.message && error.message.toLowerCase().includes("not found") ? "Employee not found." : error.message;
    showMessage(message, msg, "error");
    resultArea.innerHTML = "";
  }
}

async function handleDeleteLookupSubmit(event) {
  event.preventDefault();

  const id = document.getElementById("employeeId").value.trim();
  const message = document.getElementById("formMessage");
  const resultArea = document.getElementById("resultArea");

  if (!id) {
    showMessage(message, "Please enter employee ID.", "error");
    return;
  }

  try {
    const employee = await sendRequest(`${API_BASE}/${id}`, {}, true);
    if (!employee || !employee.id) {
      showMessage(message, "Employee not found.", "error");
      resultArea.innerHTML = "";
      return;
    }

    renderDeletePreview(employee);
  } catch (error) {
    const msg = error.message && error.message.toLowerCase().includes("not found") ? "Employee not found." : error.message;
    showMessage(message, msg, "error");
    resultArea.innerHTML = "";
  }
}

async function handleDeleteConfirm() {
  if (!currentEmployeeForDelete) {
    return;
  }

  const message = document.getElementById("formMessage");

  try {
    const responseText = await sendRequest(`${API_BASE}/${currentEmployeeForDelete.id}`, {
      method: "DELETE"
    });

    showMessage(message, responseText, "success");
    currentEmployeeForDelete = null;
    document.getElementById("resultArea").innerHTML = "";
  } catch (error) {
    showMessage(message, error.message, "error");
  }
}

async function handleIdSubmit(event) {
  event.preventDefault();

  const id = document.getElementById("employeeId").value.trim();
  const message = document.getElementById("formMessage");
  const resultArea = document.getElementById("resultArea");

  if (!id) {
    showMessage(message, "Please enter employee ID.", "error");
    return;
  }

  try {
    if (currentAction === "search") {
      const employee = await sendRequest(`${API_BASE}/${id}`, {}, true);
      showMessage(message, "Employee found.", "success");
      resultArea.innerHTML = createEmployeeTable([employee]);
    }
  } catch (error) {
    showMessage(message, error.message, "error");
    resultArea.innerHTML = "";
  }
}

async function displayAllEmployees() {
  currentAction = "display";

  mainPanel.innerHTML = `
    <div class="table-header">
      <div>
        <h1>Employee Records</h1>
        <p id="recordCount">Loading...</p>
      </div>
      <div id="tableMessage" class="message"></div>
    </div>
    <div id="tableArea"></div>
  `;

  const tableArea = document.getElementById("tableArea");
  const recordCount = document.getElementById("recordCount");
  const tableMessage = document.getElementById("tableMessage");

  try {
    const employees = await sendRequest(API_BASE, {}, true);
    recordCount.textContent = `${employees.length} records`;
    tableArea.innerHTML = createEmployeeTable(employees);
    showMessage(tableMessage, "Employee records loaded successfully.", "success");
  } catch (error) {
    recordCount.textContent = "0 records";
    tableArea.innerHTML = createEmployeeTable([]);
    showMessage(tableMessage, error.message, "error");
  }
}

async function showTotalEmployees() {
  currentAction = "count";

  mainPanel.innerHTML = `
    <h1>Total Employees</h1>
    <div class="count-card">
      <div id="countValue" class="count-number">...</div>
      <p>Total employee records in database</p>
      <div id="countMessage" class="message"></div>
    </div>
  `;

  const countValue = document.getElementById("countValue");
  const countMessage = document.getElementById("countMessage");

  try {
    const count = await sendRequest(`${API_BASE}/count`, {}, true);
    countValue.textContent = count;
    showMessage(countMessage, "Count loaded successfully.", "success");
  } catch (error) {
    countValue.textContent = "0";
    showMessage(countMessage, error.message, "error");
  }
}

async function sendRequest(url, options = {}, expectJson = false) {
  try {
    const response = await fetch(url, options);
    const text = await response.text();

    if (!response.ok) {
      throw new Error(text || `Request failed with status ${response.status}`);
    }

    if (expectJson) {
      return text ? JSON.parse(text) : null;
    }

    return text || "Operation completed successfully.";
  } catch (error) {
    if (error.message === "Failed to fetch") {
      throw new Error("Failed to connect. Make sure Spring Boot is running on http://localhost:8080");
    }

    throw error;
  }
}

function createEmployeeTable(employees) {
  if (!employees || employees.length === 0) {
    return `
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Salary</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="7" class="empty">No employees loaded yet.</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  }

  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Salary</th>
            <th>Email</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          ${employees.map((employee) => `
            <tr>
              <td>${employee.id}</td>
              <td>${employee.name}</td>
              <td>${employee.department}</td>
              <td>${employee.designation}</td>
              <td>${employee.salary}</td>
              <td>${employee.email}</td>
              <td>${employee.phone}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function showMessage(element, text, type) {
  element.textContent = text;
  element.className = `message ${type}`;
}