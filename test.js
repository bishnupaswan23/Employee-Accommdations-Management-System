// Check if the user is logged in
function checkLogin() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  if (!isLoggedIn && window.location.pathname.endsWith('dashboard.html')) {
    // Redirect to login page if not logged in
    window.location.href = 'index.html';
  } else if (isLoggedIn && window.location.pathname.endsWith('index.html')) {
    // Redirect to dashboard if already logged in
    window.location.href = 'dashboard.html';
  }
}

// Call checkLogin on page load
checkLogin();

// Login Functionality
document.getElementById('loginForm')?.addEventListener('submit', function (e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Basic validation
  if (username === 'admin' && password === 'admin123') {
    // Set login state in local storage
    localStorage.setItem('isLoggedIn', true);
    window.location.href = 'dashboard.html';
  } else {
    alert('Invalid credentials');
  }
});

// Logout Functionality
document.getElementById('logoutBtn')?.addEventListener('click', function () {
  // Clear login state from local storage
  localStorage.removeItem('isLoggedIn');
  window.location.href = 'index.html';
});

// Sample Data
let employees = JSON.parse(localStorage.getItem('employees')) || [];
let currentEditIndex = null; // Track the employee being edited

// Save employees to local storage
function saveEmployees() {
  localStorage.setItem('employees', JSON.stringify(employees));
}

// Load employees from local storage
function loadEmployees() {
  const storedEmployees = localStorage.getItem('employees');
  if (storedEmployees) {
    employees = JSON.parse(storedEmployees);
    renderTable();
  }
}

// Call loadEmployees on page load
loadEmployees();

// Add Employee Modal
const addModal = document.getElementById('addEmployeeModal');
const addEmployeeBtn = document.getElementById('addEmployeeBtn');
const closeAddBtn = document.querySelector('.close');

addEmployeeBtn.addEventListener('click', () => {
  addModal.style.display = 'flex';
});

closeAddBtn.addEventListener('click', () => {
  addModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === addModal) {
    addModal.style.display = 'none';
  }
});

// Add Employee Form
document.getElementById('employeeForm')?.addEventListener('submit', function (e) {
  e.preventDefault();

  // Get the uploaded photo file
  const photoFile = document.getElementById('employeePhoto').files[0];
  if (!photoFile) {
    alert('Please upload an employee photo.');
    return;
  }

  // Convert the photo to a Base64 string
  const reader = new FileReader();
  reader.onload = function (e) {
    const newEmployee = {
      sn: employees.length + 1,
      employeeNumber: document.getElementById('employeeNumber').value,
      name: document.getElementById('name').value,
      nationality: document.getElementById('nationality').value,
      qid: document.getElementById('qid').value,
      contactNumber: document.getElementById('contactNumber').value,
      roomDetails: document.getElementById('roomDetails').value,
      status: document.getElementById('status').value,
      accommodation: document.getElementById('accommodation').value,
      position: document.getElementById('position').value,
      workPlace: document.getElementById('workPlace').value,
      campBoss: document.getElementById('campBoss').value,
      joiningDate: document.getElementById('joiningDate').value,
      siteName: document.getElementById('siteName').value,
      picture: e.target.result, // Store the Base64 string
    };
    employees.push(newEmployee);
    saveEmployees(); // Save to local storage
    renderTable();
    addModal.style.display = 'none';
    document.getElementById('employeeForm').reset();
  };
  reader.readAsDataURL(photoFile);
});

// Edit Employee Modal
const editModal = document.getElementById('editEmployeeModal');
const closeEditBtn = document.querySelector('.close-edit');

closeEditBtn.addEventListener('click', () => {
  editModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === editModal) {
    editModal.style.display = 'none';
  }
});

// Edit Employee Function
function editEmployee(index) {
  currentEditIndex = index;
  const emp = employees[index];

  // Populate the edit modal with employee data
  document.getElementById('editEmployeeNumber').value = emp.employeeNumber;
  document.getElementById('editName').value = emp.name;
  document.getElementById('editNationality').value = emp.nationality;
  document.getElementById('editQid').value = emp.qid;
  document.getElementById('editContactNumber').value = emp.contactNumber;
  document.getElementById('editRoomDetails').value = emp.roomDetails;
  document.getElementById('editStatus').value = emp.status;
  document.getElementById('editAccommodation').value = emp.accommodation;
  document.getElementById('editPosition').value = emp.position;
  document.getElementById('editWorkPlace').value = emp.workPlace;
  document.getElementById('editCampBoss').value = emp.campBoss;
  document.getElementById('editJoiningDate').value = emp.joiningDate;
  document.getElementById('editSiteName').value = emp.siteName;

  // Display the edit modal
  editModal.style.display = 'flex';
}

// Save Edited Employee
document.getElementById('editEmployeeForm')?.addEventListener('submit', function (e) {
  e.preventDefault();

  const emp = employees[currentEditIndex];

  // Update employee details
  emp.employeeNumber = document.getElementById('editEmployeeNumber').value;
  emp.name = document.getElementById('editName').value;
  emp.nationality = document.getElementById('editNationality').value;
  emp.qid = document.getElementById('editQid').value;
  emp.contactNumber = document.getElementById('editContactNumber').value;
  emp.roomDetails = document.getElementById('editRoomDetails').value;
  emp.status = document.getElementById('editStatus').value;
  emp.accommodation = document.getElementById('editAccommodation').value;
  emp.position = document.getElementById('editPosition').value;
  emp.workPlace = document.getElementById('editWorkPlace').value;
  emp.campBoss = document.getElementById('editCampBoss').value;
  emp.joiningDate = document.getElementById('editJoiningDate').value;
  emp.siteName = document.getElementById('editSiteName').value;

  // Update photo if a new one is uploaded
  const photoFile = document.getElementById('editEmployeePhoto').files[0];
  if (photoFile) {
    const reader = new FileReader();
    reader.onload = function (e) {
      emp.picture = e.target.result;
      saveEmployees(); // Save to local storage
      renderTable();
    };
    reader.readAsDataURL(photoFile);
  } else {
    saveEmployees(); // Save to local storage
    renderTable();
  }

  // Close the edit modal
  editModal.style.display = 'none';
});

// Search Function
document.getElementById('searchBtn')?.addEventListener('click', function () {
  const searchTerm = document.getElementById('searchEmployee').value.toLowerCase();
  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm) ||
    emp.employeeNumber.toLowerCase().includes(searchTerm)
  );
  renderTable(filteredEmployees);
});

// Render Table
function renderTable(filteredEmployees = employees) {
  const tbody = document.querySelector('#employeeTable tbody');
  tbody.innerHTML = '';
  filteredEmployees.forEach((emp, index) => {
    const row = `
      <tr>
        <td>${emp.sn}</td>
        <td>${emp.employeeNumber}</td>
        <td>${emp.name}</td>
        <td>${emp.nationality}</td>
        <td>${emp.qid}</td>
        <td>${emp.contactNumber}</td>
        <td>${emp.roomDetails}</td>
        <td>${emp.status}</td>
        <td>${emp.accommodation}</td>
        <td>${emp.position}</td>
        <td>${emp.workPlace}</td>
        <td>${emp.campBoss}</td>
        <td>${emp.joiningDate}</td>
        <td>${emp.siteName}</td>
        <td><img src="${emp.picture}" alt="Employee Picture" width="50" height="50" style="border-radius: 50%;"></td>
        <td>
          <button onclick="editEmployee(${index})">Edit</button>
          <button onclick="deleteEmployee(${index})">Delete</button>
          <button class="whatsapp-btn" onclick="sendWhatsAppMessage('${emp.contactNumber}')">Send WhatsApp</button>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

// Delete Employee
function deleteEmployee(index) {
  if (confirm('Are you sure you want to delete this employee?')) {
    employees.splice(index, 1);
    saveEmployees(); // Save to local storage
    renderTable();
  }
}

// Send WhatsApp Message
function sendWhatsAppMessage(contactNumber) {
  const message = prompt('Enter message to send:');
  if (message && contactNumber !== 'N/A') {
    const url = `https://wa.me/${contactNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  } else {
    alert('Invalid contact number or message.');
  }
}

// Download CSV
document.getElementById('downloadCSVBtn')?.addEventListener('click', function () {
  const csvContent = "data:text/csv;charset=utf-8," +
    employees.map(emp => Object.values(emp).join(',')).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'employees.csv');
  document.body.appendChild(link);
  link.click();
});

// Upload Excel File
document.getElementById('uploadExcel')?.addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet);

      // Map Excel data to employee fields
      employees = json.map((emp, index) => ({
        sn: index + 1,
        employeeNumber: emp['Employee Number'] || 'N/A',
        name: emp['Name'] || 'N/A',
        nationality: emp['Nationality'] || 'N/A',
        qid: emp['QID'] || 'N/A',
        contactNumber: emp['Contact Number'] || 'N/A',
        roomDetails: emp['Room Details'] || 'N/A',
        status: emp['Status'] || 'Active',
        accommodation: emp['Accommodation'] || 'N/A',
        position: emp['Position'] || 'N/A',
        workPlace: emp['Work Place'] || 'N/A',
        campBoss: emp['Camp Boss'] || 'N/A',
        joiningDate: emp['Joining Date'] || new Date().toLocaleDateString(),
        siteName: emp['Site Name'] || 'N/A',
        picture: 'https://via.placeholder.com/50', // Default photo for Excel uploads
      }));

      saveEmployees(); // Save to local storage
      renderTable();
    };
    reader.readAsArrayBuffer(file);
  }
});

// Fetch Weather Data for Doha
async function fetchWeather() {
  const apiKey = 'YOUR_API_KEY'; // Replace with your OpenWeatherMap API key
  const city = 'Doha'; // Set city to Doha
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const weather = data.weather[0].description;
    const temp = data.main.temp;
    const icon = data.weather[0].icon; // Weather icon code
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`; // Icon URL

    // Display weather with icon
    document.getElementById('weatherText').innerHTML = `
      <img src="${iconUrl}" alt="${weather}" width="30" height="30">
      <span>Weather in ${city}: ${weather}, ${temp}°C</span>
    `;
  } catch (error) {
    console.error('Error fetching weather:', error);
    document.getElementById('weatherText').innerText = 'Weather data unavailable';
  }
}

// Call the weather function on page load
fetchWeather();
