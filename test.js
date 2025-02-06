// Sample Data
let employees = [];

// Login Functionality
document.getElementById('loginForm')?.addEventListener('submit', function (e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Basic validation
  if (username === 'admin' && password === 'admin123') {
    window.location.href = 'dashboard.html';
  } else {
    alert('Invalid credentials');
  }
});

// Logout Functionality
document.getElementById('logoutBtn')?.addEventListener('click', function () {
  window.location.href = 'index.html';
});

// Add Employee Modal
const modal = document.getElementById('addEmployeeModal');
const addEmployeeBtn = document.getElementById('addEmployeeBtn');
const closeBtn = document.querySelector('.close');

addEmployeeBtn.addEventListener('click', () => {
  modal.style.display = 'flex';
});

closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

// Add Employee Form
document.getElementById('employeeForm')?.addEventListener('submit', function (e) {
  e.preventDefault();

  const employeePhoto = document.getElementById('photo').files[0];
  if (!employeePhoto) {
    alert("Please upload an employee photo!");
    return;
  }

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
      picture: e.target.result, // Base64 encoded image from FileReader
    };

    employees.push(newEmployee);
    renderTable();
    modal.style.display = 'none';
    document.getElementById('employeeForm').reset();
  };

  reader.readAsDataURL(employeePhoto); // Read file as base64
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
  const newPosition = prompt('Enter new position:', emp.position);
  
  if (newName) emp.name = newName;
  if (newPosition) emp.position = newPosition;

  renderTable();
}

// Delete Employee
function deleteEmployee(index) {
  if (confirm('Are you sure you want to delete this employee?')) {
    employees.splice(index, 1);
    renderTable();
  }
}

// Search Employee
document.getElementById('searchBtn').addEventListener('click', function () {
  const query = document.getElementById('searchEmployee').value.toLowerCase();
  const filteredEmployees = employees.filter(emp => {
    return emp.name.toLowerCase().includes(query) || emp.employeeNumber.includes(query);
  });
  renderTable(filteredEmployees);
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
        picture: emp['Employee Picture'] || 'https://via.placeholder.com/150',
      }));

      renderTable();
    };

    reader.readAsArrayBuffer(file);
  }
});

// Send WhatsApp Message
function sendWhatsAppMessage(contactNumber) {
  const phoneNumber = `+${contactNumber}`;
  const message = "Hello, this is a test message from the Employee Management System!";
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

// Initial render
renderTable();
