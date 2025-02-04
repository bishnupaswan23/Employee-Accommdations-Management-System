let employees = JSON.parse(localStorage.getItem("employees")) || []; // Load from storage
let editingIndex = null; // Track if an employee is being edited

// Login System
function login() {
    if (document.getElementById('username').value === "admin" && document.getElementById('password').value === "admin") {
        localStorage.setItem("loggedIn", "true");
        showDashboard();
    } else {
        alert("Invalid Credentials!");
    }
}

function showDashboard() {
    document.getElementById('loginPage').style.display = "none";
    document.getElementById('dashboardPage').style.display = "block";
    displayEmployees();
}

function logout() {
    localStorage.removeItem("loggedIn");
    document.getElementById('loginPage').style.display = "block";
    document.getElementById('dashboardPage').style.display = "none";
}

// Switch Between Sections
function showSection(section) {
    document.getElementById('addEmployee').style.display = section === 'addEmployee' ? 'block' : 'none';
    document.getElementById('viewEmployees').style.display = section === 'viewEmployees' ? 'block' : 'none';
    if (section === 'viewEmployees') displayEmployees();
}

// Add or Edit Employee
function addEmployee() {
    const number = document.getElementById('empNumber').value.trim();
    const name = document.getElementById('empName').value.trim();
    const position = document.getElementById('empPosition').value.trim();
    const joiningDate = document.getElementById('empJoiningDate').value.trim();
    const accommodation = document.getElementById('empAccommodation').value.trim();
    const campBossName = document.getElementById('empCampBossName').value.trim();
    const roomNumber = document.getElementById('empRoomNumber').value.trim();
    const taskGroup = document.getElementById('empTaskGroup').value.trim();
    const phone = document.getElementById('empPhone').value.trim();
    const qid = document.getElementById('empQid').value.trim();
    const photoInput = document.getElementById('empPhoto').files[0];

    if (!name || !number || (!photoInput && editingIndex === null)) {
        alert("Please enter required fields and upload a photo!");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const newEmployee = {
            photo: photoInput ? e.target.result : employees[editingIndex].photo, // Keep old photo if editing
            name, number, qid, phone, position, joiningDate, accommodation, campBossName, roomNumber, taskGroup
        };

        if (editingIndex !== null) {
            employees[editingIndex] = newEmployee;
            editingIndex = null;
        } else {
            employees.push(newEmployee);
        }

        saveEmployees();
        displayEmployees();
        clearForm();
        showSection('viewEmployees');
    };

    if (photoInput) {
        reader.readAsDataURL(photoInput);
    } else {
        reader.onload();
    }
}

// Display Employee List
function displayEmployees() {
    const table = document.getElementById('employeeTable');
    table.innerHTML = '';

    employees.forEach((emp, index) => {
        table.innerHTML += `
            <tr>
                <td><img src="${emp.photo}" width="50"></td>
                <td>${emp.number}</td>
                <td>${emp.name}</td>
                <td>${emp.position}</td>
                <td>${emp.qid}</td>
                <td>${emp.joiningDate}</td>
                <td>${emp.accommodation}</td>
                <td>${emp.campBossName}</td>
                <td>${emp.roomNumber}</td>
                <td>${emp.phone}</td>
                <td>${emp.taskGroup}</td>
                <td>
                    <button class="btn" style="background: blue;" onclick="editEmployee(${index})">Edit</button>
                    <button class="btn" style="background: red;" onclick="deleteEmployee(${index})">Delete</button>
                </td>
            </tr>
        `;
    });
}

// Delete Employee
function deleteEmployee(index) {
    employees.splice(index, 1);
    saveEmployees();
    displayEmployees();
}

// Edit Employee
function editEmployee(index) {
    const emp = employees[index];
    document.getElementById('empName').value = emp.name;
    document.getElementById('empNumber').value = emp.number;
    document.getElementById('empQid').value = emp.qid;
    document.getElementById('empPhone').value = emp.phone;
    document.getElementById('empPosition').value = emp.position;
    document.getElementById('empJoiningDate').value = emp.joiningDate;
    document.getElementById('empAccommodation').value = emp.accommodation;
    document.getElementById('empCampBossName').value = emp.campBossName;
    document.getElementById('empRoomNumber').value = emp.roomNumber;
    document.getElementById('empTaskGroup').value = emp.taskGroup;

    editingIndex = index;
    showSection('addEmployee');
}

// Search Employees
function searchEmployee() {
    const searchValue = document.getElementById('searchInput').value.toLowerCase();
    const filteredEmployees = employees.filter(emp =>
        emp.name.toLowerCase().includes(searchValue) ||
        emp.number.toLowerCase().includes(searchValue) ||
        emp.phone.toLowerCase().includes(searchValue)
    );

    const table = document.getElementById('employeeTable');
    table.innerHTML = '';
    filteredEmployees.forEach((emp, index) => {
        table.innerHTML += `
            <tr>
                <td><img src="${emp.photo}" width="50"></td>
                <td>${emp.number}</td>
                <td>${emp.name}</td>
                <td>${emp.position}</td>
                <td>${emp.qid}</td>
                <td>${emp.joiningDate}</td>
                <td>${emp.accommodation}</td>
                <td>${emp.campBossName}</td>
                <td>${emp.roomNumber}</td>
                <td>${emp.phone}</td>
                <td>${emp.taskGroup}</td>
                <td>
                    <button class="btn" style="background: blue;" onclick="editEmployee(${index})">Edit</button>
                    <button class="btn" style="background: red;" onclick="deleteEmployee(${index})">Delete</button>
                </td>
            </tr>
        `;
    });
}

// Clear Form
function clearForm() {
    document.getElementById('empName').value = '';
    document.getElementById('empNumber').value = '';
    document.getElementById('empQid').value = '';
    document.getElementById('empPhone').value = '';
    document.getElementById('empPosition').value = '';
    document.getElementById('empJoiningDate').value = '';
    document.getElementById('empAccommodation').value = '';
    document.getElementById('empCampBossName').value = '';
    document.getElementById('empRoomNumber').value = '';
    document.getElementById('empTaskGroup').value = '';
    document.getElementById('empPhoto').value = '';
    editingIndex = null;
}

// Save Employees to Local Storage
function saveEmployees() {
    localStorage.setItem("employees", JSON.stringify(employees));
}

// Check Login Status on Page Load
if (localStorage.getItem("loggedIn") === "true") showDashboard();
