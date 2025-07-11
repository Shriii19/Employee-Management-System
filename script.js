        document.addEventListener('DOMContentLoaded', () => {
            // DOM Elements
            const employeeForm = document.getElementById('employeeForm');
            const employeeTableBody = document.getElementById('employeeTableBody');
            const employeeCards = document.getElementById('employeeCards');
            const searchInput = document.getElementById('searchInput');
            const searchBtn = document.getElementById('searchBtn');
            const viewButtons = document.querySelectorAll('.view-btn');
            const tableView = document.getElementById('tableView');
            const cardsView = document.getElementById('cardsView');
            
            // Stats elements
            const employeeCount = document.getElementById('employeeCount');
            const totalSalary = document.getElementById('totalSalary');
            const departmentCount = document.getElementById('departmentCount');
            const highestSalary = document.getElementById('highestSalary');
            const avgSalary = document.getElementById('avgSalary');
            
            // Notification element
            const notification = document.getElementById('notification');
            
            // Employee data
            let employees = JSON.parse(localStorage.getItem('employees')) || [];
            
            // Initialize the app
            function init() {
                renderEmployees();
                updateStats();
                
                // Set default view
                setActiveView('table');
            }
            
            // Save employees to localStorage
            function saveEmployees() {
                localStorage.setItem('employees', JSON.stringify(employees));
            }
            
            // Add new employee
            employeeForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const name = document.getElementById('name').value;
                const position = document.getElementById('position').value;
                const department = document.getElementById('department').value;
                const salary = parseFloat(document.getElementById('salary').value);
                
                if (!name || !position || !department || isNaN(salary)) {
                    showNotification('Please fill all fields correctly', 'error');
                    return;
                }
                
                const newEmployee = {
                    id: Date.now(), // Unique ID
                    name,
                    position,
                    department,
                    salary
                };
                
                employees.push(newEmployee);
                saveEmployees();
                renderEmployees();
                updateStats();
                showNotification('Employee added successfully!', 'success');
                
                // Reset form
                employeeForm.reset();
            });
            
            // Delete employee
            function deleteEmployee(id) {
                employees = employees.filter(emp => emp.id !== id);
                saveEmployees();
                renderEmployees();
                updateStats();
                showNotification('Employee deleted successfully!', 'success');
            }
            
            // Edit employee
            function editEmployee(id) {
                const employee = employees.find(emp => emp.id === id);
                if (!employee) return;
                
                // Populate form with employee data
                document.getElementById('name').value = employee.name;
                document.getElementById('position').value = employee.position;
                document.getElementById('department').value = employee.department;
                document.getElementById('salary').value = employee.salary;
                
                // Remove employee from list
                employees = employees.filter(emp => emp.id !== id);
                saveEmployees();
                renderEmployees();
                updateStats();
                
                showNotification('Editing employee...', 'success');
            }
            
            // Render employees in table and card views
            function renderEmployees(filteredEmployees = null) {
                const data = filteredEmployees || employees;
                
                // Update employee count
                employeeCount.textContent = `₹${data.length} ${data.length === 1 ? 'Employee' : 'Employees'}`;
                
                // Clear existing content
                employeeTableBody.innerHTML = '';
                employeeCards.innerHTML = '';
                
                if (data.length === 0) {
                    employeeTableBody.innerHTML = `
                        <tr>
                            <td colspan="5" style="text-align: center; padding: 30px;">
                                <i class="fas fa-user-slash" style="font-size: 3rem; color: #ddd; margin-bottom: 15px;"></i>
                                <h3>No employees found</h3>
                                <p>Add your first employee using the form</p>
                            </td>
                        </tr>
                    `;
                    
                    employeeCards.innerHTML = `
                        <div class="no-employees" style="text-align: center; grid-column: 1 / -1; padding: 40px;">
                            <i class="fas fa-user-slash" style="font-size: 3rem; color: #ddd; margin-bottom: 15px;"></i>
                            <h3>No employees found</h3>
                            <p>Add your first employee using the form</p>
                        </div>
                    `;
                    return;
                }
                
                // Render table view
                data.forEach(emp => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${emp.name}</td>
                        <td>${emp.position}</td>
                        <td>${emp.department}</td>
                        <td>₹${emp.salary.toLocaleString()}</td>
                        <td class="action-cell">
                            <button class="action-btn btn-edit" onclick="editEmployee(${emp.id})">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="action-btn btn-delete" onclick="deleteEmployee(${emp.id})">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </td>
                    `;
                    employeeTableBody.appendChild(row);
                });
                
                // Render card view
                data.forEach(emp => {
                    const card = document.createElement('div');
                    card.className = 'employee-card';
                    card.innerHTML = `
                        <h3>${emp.name}</h3>
                        <p><strong>Position:</strong> ${emp.position}</p>
                        <p><strong>Department:</strong> ${emp.department}</p>
                        <p><strong>Salary:</strong> ₹${emp.salary.toLocaleString()}</p>
                        <div class="card-actions">
                            <button class="btn btn-edit" onclick="editEmployee(${emp.id})">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="btn btn-delete" onclick="deleteEmployee(${emp.id})">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    `;
                    employeeCards.appendChild(card);
                });
            }
            
            // Update statistics
            function updateStats() {
                if (employees.length === 0) {
                    totalSalary.textContent = '₹0';
                    departmentCount.textContent = '0';
                    highestSalary.textContent = '₹0';
                    avgSalary.textContent = '₹0';
                    return;
                }
                
                // Calculate total salary
                const total = employees.reduce((sum, emp) => sum + emp.salary, 0);
                totalSalary.textContent = `₹${total.toLocaleString()}`;
                
                // Count unique departments
                const departments = new Set(employees.map(emp => emp.department));
                departmentCount.textContent = departments.size;
                
                // Find highest salary
                const maxSalary = Math.max(...employees.map(emp => emp.salary));
                highestSalary.textContent = `₹${maxSalary.toLocaleString()}`;
                
                // Calculate average salary
                const avg = total / employees.length;
                avgSalary.textContent = `₹${avg.toLocaleString(undefined, {maximumFractionDigits: 2})}`;
            }
            
            // Search functionality
            searchBtn.addEventListener('click', () => {
                const searchTerm = searchInput.value.toLowerCase().trim();
                
                if (!searchTerm) {
                    renderEmployees();
                    return;
                }
                
                const filtered = employees.filter(emp => 
                    emp.name.toLowerCase().includes(searchTerm) ||
                    emp.position.toLowerCase().includes(searchTerm) ||
                    emp.department.toLowerCase().includes(searchTerm)
                );
                
                renderEmployees(filtered);
            });
            
            // View toggle functionality
            viewButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const view = btn.dataset.view;
                    setActiveView(view);
                });
            });
            
            function setActiveView(view) {
                viewButtons.forEach(btn => {
                    if (btn.dataset.view === view) {
                        btn.classList.add('active');
                    } else {
                        btn.classList.remove('active');
                    }
                });
                
                if (view === 'table') {
                    tableView.classList.remove('hidden');
                    cardsView.classList.add('hidden');
                } else {
                    tableView.classList.add('hidden');
                    cardsView.classList.remove('hidden');
                }
            }
            
            // Show notification
            function showNotification(message, type) {
                notification.textContent = message;
                notification.className = `notification ₹{type} show`;
                
                setTimeout(() => {
                    notification.classList.remove('show');
                }, 3000);
            }
            
            // Initialize the app
            init();
            
            // Make functions available globally for inline event handlers
            window.deleteEmployee = deleteEmployee;
            window.editEmployee = editEmployee;
        });
