// Sample Data
let employees = [];
let employeeCounter = 1; // Counter for auto-generating employee numbers

// Login Functionality
document.getElementById('loginForm')?.addEventListener('submit', function (e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Basic validation
  if (username === 'admin' && password === '1234') {
    window.location.href = 'dashboard.html';
  } else {
    alert('Invalid credentials');
  }
});

// Logout Functionality
document.getElementById('logoutBtn')?.addEventListener('click', function () {
  window.location.href = 'index.html';
});

// Add Employee
document.getElementById('addEmployeeBtn')?.addEventListener('click', function () {
  const newEmployee = {
    sn: employees.length + 1,
    employeeNumber: `EMP-${employeeCounter.toString().padStart(3, '0')}`, // Auto-generated number
    name: prompt('Enter employee name:') || 'New Employee',
    nationality: prompt('Enter nationality:') || 'N/A',
    qid: prompt('Enter QID:') || 'N/A',
    contactNumber: prompt('Enter contact number:') || 'N/A',
    roomDetails: prompt('Enter room details:') || 'N/A',
    status: 'Active',
    accommodation: prompt('Enter accommodation:') || 'N/A',
    position: prompt('Enter position:') || 'N/A',
    workPlace: prompt('Enter work place:') || 'N/A',
    campBoss: prompt('Enter camp boss:') || 'N/A',
    joiningDate: new Date().toLocaleDateString(),
    siteName: prompt('Enter site name:') || 'N/A',
    picture: 'https://via.placeholder.com/50',
  };
  employees.push(newEmployee);
  employeeCounter++; // Increment counter for the next employee
  renderTable();
});

// Render Table
function renderTable() {
  const tbody = document.querySelector('#employeeTable tbody');
  tbody.innerHTML = '';
  employees.forEach((emp, index) => {
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
        <td><img src="${emp.picture}" alt="Employee Picture" width="50"></td>
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

// Edit Employee
function editEmployee(index) {
  const emp = employees[index];
  const newName = prompt('Enter new name:', emp.name);
  if (newName) {
    emp.name = newName;
    renderTable();
  }
}

// Delete Employee
function deleteEmployee(index) {
  if (confirm('Are you sure you want to delete this employee?')) {
    employees.splice(index, 1);
    renderTable();
  }
}

// Search Employee
document.getElementById('searchBtn')?.addEventListener('click', function () {
  const searchTerm = document.getElementById('searchEmployee').value.toLowerCase();
  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm) ||
    emp.employeeNumber.toLowerCase().includes(searchTerm)
  );
  renderTable(filteredEmployees);
});

// Render Table with Filtered Employees
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
        <td><img src="${emp.picture}" alt="Employee Picture" width="50"></td>
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

// Upload Excel
document.getElementById('uploadExcel')?.addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (file) {
    alert('Excel file uploaded. Processing...');
    // Add logic to parse Excel file using a library like SheetJS
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
