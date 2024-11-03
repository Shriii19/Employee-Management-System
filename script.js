document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('employeeForm');
    const employeeList = document.getElementById('employeeList');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const position = document.getElementById('position').value;
        const department = document.getElementById('department').value;
        const salary = document.getElementById('salary').value;

        const response = await fetch('http://localhost:3000/employees', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, position, department, salary })
        });

        if (response.ok) {
            form.reset();
            loadEmployees();
        } else {
            alert('Failed to add employee');
        }
    });

    async function loadEmployees() {
        const response = await fetch('http://localhost:3000/employees');
        const employees = await response.json();

        employeeList.innerHTML = employees.map(emp => `
            <div class="employee-card">
                <p><strong>Name:</strong> ${emp.name}</p>
                <p><strong>Position:</strong> ${emp.position}</p>
                <p><strong>Department:</strong> ${emp.department}</p>
                <p><strong>Salary:</strong> ${emp.salary}</p>
            </div>
        `).join('');
    }

    loadEmployees();
});
