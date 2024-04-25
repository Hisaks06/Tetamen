
document.addEventListener("DOMContentLoaded", function() {
    const adminTab = document.getElementById('adminTab'); // Use getElementById to find the element

    if (adminTab) {
        // Make an API call to fetch the current user's role
        fetch('/currentUser')
            .then(response => response.json())
            .then(data => {
                const userRole = data[2]; // Assuming the role is at index 2 in the response array
                if (userRole !== 'admin') {
                    // Hide the admin tab if the user is not an admin
                    adminTab.style.display = 'none';
                }
            })
            .catch(error => console.error('Error fetching current user:', error));
    } else {
        console.error('Admin tab element not found.');
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const student = document.getElementById('student'); // Use getElementById to find the element

    if (student) {
        // Make an API call to fetch the current user's role
        fetch('/currentUser')
            .then(response => response.json())
            .then(data => {
                const userRole = data[2]; // Assuming the role is at index 2 in the response array
                if (userRole == 'admin') {
                    // Hide the admin tab if the user is not an admin
                    student.style.display = 'none';
                }
            })
            .catch(error => console.error('Error fetching current user:', error));
    } else {
        console.error('student element not found.');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners for showing modals

    let IsHideUser = true;
    document.getElementById('addUserBtn').addEventListener("click", () => {
        if(IsHideUser){
            document.getElementById('addUserForm').style.display = "block";
            IsHideUser = false;
        } else if(!IsHideUser){
            document.getElementById('addUserForm').style.display = "none";
            IsHideUser = true;
        }
    })    

    let IsHideRole = true;
    document.getElementById('addRoleBtn').addEventListener("click", () => {
        if(IsHideRole){
            document.getElementById('addRoleForm').style.display = "block";
            IsHideRole = false;
        } else if(!IsHideRole){
            document.getElementById('addRoleForm').style.display = "none";
            IsHideRole = true;
        }
    }) 

    // Fetch role names from the server and populate the dropdown
    fetchRoles();
});

function createTableRow(data) {
    // Create a new table row
    const row = document.createElement('tr');

    // Create a new table data cell for each property in data
    for (const prop in data) {
        const cell = document.createElement('td');
        cell.textContent = data[prop];
        row.appendChild(cell);
    }

    return row;
}

// Fetch role names from the server and populate the dropdown
async function fetchRoles() {
    try {
        const response = await fetch('/roles');
        const roles = await response.json();
        const roleSelect = document.getElementById('roleSelect');
        roles.forEach(role => {
            const option = document.createElement('option');
            option.value = role.id;
            option.textContent = role.name;
            roleSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Failed to fetch roles:', error);
    }
}

// Function to handle form submission for adding a user
document.getElementById('addUserForm').addEventListener('submit', event => {
    event.preventDefault();
    addUser(event);
});

// Function to handle form submission for adding a role
document.getElementById('addRoleForm').addEventListener('submit', event => {
    event.preventDefault();
    addRole(event);
});

// Function to show add user modal
function showAddUserModal() {
    const modal = document.getElementById('addUserModal');
    modal.style.display = 'block';
}


// Function to show add role modal
function showAddRoleModal() {
    const modal = document.getElementById('addRoleModal');
    modal.style.display = 'block';
}

// Function to hide modal
function hideModal(modal) {
    modal.style.display = 'none';
}

// Fetch data from the server and display it in the table
fetch('/admin/data')
    .then(response => response.json())
    .then(data => {
        const adminDataBody = document.getElementById('adminDataBody');
        data.forEach(user => {
            console.log(user);
            const row = `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.firstname}</td>
                    <td>${user.lastname}</td>
                    <td>${user.email}</td>
                    <td>${user.password}
                    <td>${user.role}</td>
                    <td>
                        <button onclick="editUser(${user.id})">Edit</button>
                        <button onclick="deleteUser(${user.id})">Delete</button>
                    </td>
                </tr>
            `;
            adminDataBody.innerHTML += row;
        });
    })
    .catch(error => console.error('Error fetching admin data:', error));

// Fetch data for the role table
fetch('/roles/data')
    .then(response => response.json())
    .then(data => {
        const roleDataBody = document.getElementById('roleDataBody');
        data.forEach(role => {
            console.log(role);
            const row = `
                <tr>
                    <td>${role.id}</td>
                    <td>${role.name}</td>
                    <td>
                        <button onclick="editRole(${role.id})">Edit</button>
                        <button onclick="deleteRole(${role.id})">Delete</button>
                    </td>
                </tr>
            `;
            roleDataBody.innerHTML += row;
        });
    })
    .catch(error => console.error('Error fetching role data:', error));

// Function to handle opening the edit user modal
function editUser(userId) {
    // Check if userId is defined
    if (userId === undefined) {
        console.error('User ID is undefined');
        return;
    }

    // Fetch the user data by userId
    fetch(`/admin/user/${userId}`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(user => {
        // Populate the form fields with user data
        document.getElementById('usernameInput').value = user.username;
        document.getElementById('firstnameInput').value = user.firstname;
        document.getElementById('lastnameInput').value = user.lastname;
        document.getElementById('emailInput').value = user.email;
        document.getElementById('passwordInput').value = user.password;

        // Set the selected role in the dropdown
        const roleSelect = document.getElementById('roleSelectEdit');
        // Use user.idrole instead of user.role
        roleSelect.value = user.idrole;

        // Populate the role dropdown with options fetched from the server
        fetchRolesForEdit(); // Call fetchRolesForEdit after user data is fetched

        // Set the user ID as a data attribute on the form element
        document.getElementById('editUserForm').dataset.userId = userId;

        // Display the form for editing
        document.getElementById('editUserForm').style.display = 'block';
    })
    .catch(error => console.error('Error fetching user data for editing:', error));
}

// Fetch role names from the server and populate the dropdown in the edit user modal
async function fetchRolesForEdit() {
    try {
        const response = await fetch('/roles');
        const roles = await response.json();
        const roleSelect = document.getElementById('roleSelectEdit');
        roleSelect.innerHTML = ''; // Clear previous options
        roles.forEach(role => {
            const option = document.createElement('option');
            option.value = role.id;
            option.textContent = role.name;
            roleSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Failed to fetch roles for edit:', error);
    }
}

// Function to handle form submission for updating a user
function saveUser() {
    // Get the form element
    const form = document.getElementById('editUserForm');

    // Add an event listener for the submit event
    form.addEventListener('submit', function(event) {
        // Prevent the form from being submitted normally
        event.preventDefault();

        // Get the userId from the form's data-user-id attribute
        const userId = form.dataset.userId;

        // Get the form data
        const formData = new FormData(form);

        // Create an object to hold the form data
        const user = {};

        // Populate the user object with the form data
        for (let [key, value] of formData) {
            user[key] = value;
        }

        // Ensure idrole is included in the user object
        user.idrole = document.getElementById('roleSelectEdit').value;

        // Send a PUT request to update the user
        fetch(`/admin/user/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        })
        .then(response => response.json())
        .then(data => {
            console.log('User updated:', data);
            // Refresh the page after the user is updated
            location.reload();
        })
        .catch(error => console.error('Error updating user:', error));
    });
}

// Function to handle delete user
function deleteUser(userId) {
    console.log('deleteUser called with userId:', userId);
    // Send a DELETE request to delete the user by userId
    fetch(`/admin/user/${userId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            // Remove the user row from the table
            const userRow = document.getElementById(`userRow${userId}`);
            if (userRow) {
                userRow.remove();
                console.log(`User with ID ${userId} deleted successfully.`);
            } else {
                alert(`Sure you want to delete user: ${response.statusText}`);
                location.reload(true);
            }
        } else {
            console.error(`Error deleting user with ID ${userId}.`);
        }
    })
    .catch(error => console.error('Error deleting user:', error));
}

// Function to handle form submission for adding a user
function addUser(event) {
    event.preventDefault();

// Get form data
const formData = new FormData(document.getElementById('addUserForm'));

// Make sure the form data is not empty
if (!formData.has('username') || !formData.has('firstname') || !formData.has('lastname') || !formData.has('password') || !formData.has('email') || !formData.has('role')) {
    console.error('Form data is missing one or more required fields');
    return;
}

let formDataJSON = Object.fromEntries(formData.entries());

console.log('Before:', formDataJSON);

// Rename 'role' field to 'idrole'
if (formDataJSON.role) {
    formDataJSON.idrole = formDataJSON.role;
    delete formDataJSON.role;
}

console.log('After:', formDataJSON);

// Log the data that's being sent to the server
console.log('Data being sent to server:', formDataJSON);

// Send POST request to server with form data
fetch('/admin/user', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(formDataJSON)
})
.then(response => {
    if (!response.ok) {
        throw new Error('Failed to add user');
    }
    return response.json();
})
.then(data => {
    // Close the modal
    document.getElementById('addUserModal').style.display = 'none';
    location.reload(true);

    // Add new row to the table with added user data
    const newRow = createTableRow(data);
    document.getElementById('adminDataBody').appendChild(newRow);
})
.catch(error => console.error('Error:', error));
}

// Function to handle edit role
function editRole(roleId) {
// Assume there's a form for editing roles with an input field for name
// Fetch the role data by roleId
fetch(`/admin/role/${roleId}`)
.then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
})
.then(role => {
    // Populate the form field with role data
    document.getElementById('roleNameInput').value = role.name;

    // Set the data-role-id attribute to the role's id
    document.getElementById('editRoleForm').dataset.roleId = role.id;

    // Display the form for editing
    document.getElementById('editRoleForm').style.display = 'block';
})
.catch(error => console.error('Error fetching role data for editing:', error));
}

function saveChanges() {
// Get the form element
const form = document.getElementById('editRoleForm');

// Add an event listener for the submit event
form.addEventListener('submit', function(event) {
    // Prevent the form from being submitted normally
    event.preventDefault();

    // Get the roleId from the form's data-role-id attribute
    const roleId = form.dataset.roleId;

    // Get the form data
    const formData = new FormData(form);

    // Create an object to hold the form data
    const role = {};

    // Populate the role object with the form data
    for (let [key, value] of formData) {
        if (key === 'rolename') {
            key = 'name';
        }
        role[key] = value;
    }

    //Log the role object
    console.log(role);

    // Send a PUT request to update the role
    fetch(`/admin/roles/${roleId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(role),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Role updated:', data);
        // Refresh the page after the role is updated
        location.reload();
    })
    .catch(error => console.error('Error updating role:', error));
});
}

// Function to handle delete role
function deleteRole(roleId) {
    // Prompt the user for confirmation
    if (!confirm("Are you sure you want to delete this role?")) {
        return; // If the user cancels, do nothing
    }

    // Send a DELETE request to delete the role by roleId
    fetch(`/admin/role/${roleId}`, { // Use backticks for string interpolation
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            // Remove the role row from the table
            document.getElementById(`roleRow${roleId}`).remove();
            console.log(`Role with ID ${roleId} deleted successfully.`);
        } else {
            // Handle server errors
            console.error(`Error deleting role with ID ${roleId}: ${response.statusText}`);
            // Optionally provide user feedback about the error
            alert(`Sure you want to delete role: ${response.statusText}`);
            location.reload(true);
        }
    })
}

// Function to handle form submission for adding a role
function addRole(event) {
    event.preventDefault();

    // Get form data
    const formData = new FormData(document.getElementById('addRoleForm'));
    let formDataJSON = Object.fromEntries(formData.entries());

    // Log the data that's being sent to the server
console.log('Data being sent to server:', formDataJSON);
    // Send POST request to server with form data
    fetch('/admin/role', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formDataJSON)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add role');
        }
        return response.json();
    })
    .then(data => {
        // Close the modal
        document.getElementById('roleDataBody').style.display = 'none';
        location.reload(true);

        // Add new row to the table with added role data
        const newRow = createTableRow(data);
        document.getElementById('roleDataBody').appendChild(newRow);
    })
    .catch(error => console.error('Error adding role:', error));
}