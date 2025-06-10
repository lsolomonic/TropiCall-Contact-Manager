const urlBase = 'http://poosdcop4331.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

//load on start
window.onload = function() {
    // Check for existing login cookies
    let cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith("userId=")) {
            userId = cookie.substring(7);
        } else if (cookie.startsWith("firstName=")) {
            firstName = cookie.substring(10);
        } else if (cookie.startsWith("lastName=")) {
            lastName = cookie.substring(9);
        }
    }
    searchContacts();
    document.getElementById("welcome").textContent = "Welcome, " + firstName + " " + lastName + "!";
};

//search contacts
function searchContacts() {
    // get value of search term and load it to json payload
    let searchTerm = document.getElementById("search").value;
    let tmp = {userId: userId, search: searchTerm};
    let jsonPayload = JSON.stringify(tmp);

    let xhr = new XMLHttpRequest();
    xhr.open("POST", urlBase + '/Search.' + extension, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    
    // send search term to API
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(xhr.responseText);
            if (response.error) {
                document.getElementById("contactResult").innerHTML = response.error;
            } else {
                updateContactTable(response.results); // Populate table
            }
        }
    };
    xhr.send(jsonPayload);
}

//update contact table dynamically (load)
function updateContactTable(contacts) {
    let tableBody = document.getElementById("contactTableBody");
    tableBody.innerHTML = "";

    // if we don't get any contacts back from our search
    if (!contacts || contacts.length === 0) {
        let row = tableBody.insertRow();
        let cell = row.insertCell(0);
        cell.colSpan = 5;
        cell.textContent = "No contacts found";
        return;
    }

    // if we do get contacts back, make table rows for them 
    for (let i = 0; i < contacts.length; i++) {
        let contact = contacts[i];
        let row = tableBody.insertRow();
        
        // Add contact data cells
        row.insertCell(0).textContent = contact.FirstName;
        row.insertCell(1).textContent = contact.LastName;
        row.insertCell(2).textContent = contact.Phone;
        row.insertCell(3).textContent = contact.Email;
        
        // Add action buttons
        let actionCell = row.insertCell(4);
        actionCell.appendChild(createActionButton("Edit", () => editContact(contact.ID, contact.FirstName, contact.LastName, contact.Phone, contact.Email, contact.UserID)));
        actionCell.appendChild(createActionButton("Delete", () => deleteContact(contact.UserID, contact.FirstName, contact.LastName)));
    }
}

// function to swap between register and login dynamically
function registerSwap(){
    // if we are on login, swap to register
    if (document.getElementById("inner-title").textContent == "Welcome!")
    {
        document.getElementById("inner-title").textContent = "Register:";
        document.getElementById("loginButton").textContent = "Continue";
        document.getElementById("regBoxes").style.display = 'block';
        document.getElementById("reg").style.marginTop = '0%';
        document.getElementById("reg").textContent = "Return to login page.";
    } else //if we are on register, swap to login
    {
        document.getElementById("inner-title").textContent = "Welcome!";
        document.getElementById("loginButton").textContent = "Log In";
        document.getElementById("regBoxes").style.display = 'none';
        document.getElementById("reg").style.marginTop = '50%';
        document.getElementById("reg").textContent = "Not registered yet? Click here.";
    }

    document.getElementById("loginResult").innerHTML = "";
}

// wrapper to make sure we register/login according to page user is on
function log_wrapper()
{
    var status = document.getElementById("inner-title").textContent;
    if (status == "Welcome!")
    {
        doLogin();
    } else 
    {
        doRegister();
    }
}

// method to verify login with database
function doLogin()
{
    userId = 0;
    firstName = "";
    lastName = "";
    
    // get values entered for username and password, load them to JSON payload
    let login = document.getElementById("loginName").value;
    let password = document.getElementById("loginPassword").value;
    
    document.getElementById("loginResult").innerHTML = "";

    let tmp = {login:login,password:password};
    let jsonPayload = JSON.stringify( tmp );
    
    let url = urlBase + '/Login2.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    
    // send JSON payload to API
    try
    {
        xhr.onreadystatechange = function() 
        {
            if (this.readyState == 4 && this.status == 200); 
            {
                let jsonObject = JSON.parse( xhr.responseText );
                userId = jsonObject.id;
                
                //if userID < 1 then they didn't enter a valid login
                if( userId < 1 )
                {       
                    document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
                    return;
                }
                
                // otherwise, save their first and last names for welcome and move to contacts.html
                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;
                saveCookie();
                
                window.location.href = "contacts.html";
                searchContacts();
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("loginResult").innerHTML = err.message;
    }

}

// function to register new user to database
function doRegister()
{
    userId = 0;
    firstName = "";
    lastName = "";

    //get inputs for new username and PW
    let newFn = document.getElementById("firstName").value;
    let newLn = document.getElementById("lastName").value;
    let username = document.getElementById("loginName").value;
    let password = document.getElementById("loginPassword").value;

    // validate their password
    if (validate_password(password) != 0)
    {
        document.getElementById("loginResult").innerHTML = "Password must have 8 or more characters and 1 special character.";
        return;
    }

    // make sure their names aren't empty 
    if (validate_names([newFn, newLn, username]) != 0)
    {
        document.getElementById("loginResult").innerHTML = "First Name, Last Name, and Username must not be empty.";
        return;
    }

    document.getElementById("loginResult").innerHTML = "";

    //make JSON payload to send to API
    let tmp = {login:username, password:password, firstName:newFn, lastName:newLn};
    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/Signup.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open(method = "POST", url, async = true);

    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    // send to API 
    try
    {
        xhr.onreadystatechange = function()
        {
            // if we receive a response from API
            if (this.readyState == 4)
            {
                // if user already exists
                if (this.status == 409)
                {
                    document.getElementById("loginResult").innerHTML = "User already exists!";
                }

                // if async call finishes (user doesn't exist)
                if (this.status == 200)
                {
                    let jsonObject = JSON.parse(xhr.responseText);
                    userId = jsonObject.id;
                    document.getElementById("loginResult").innerHTML = "User added!";
                    saveCookie();
                }
            }
        };
        xhr.send(jsonPayload);  
    } catch (err)
    {
        document.getElementById("loginResult").innerHTML = err.message;
    }

    return;
}

// function to log user out
function doLogout()
{
    // Clear all cookies
    document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    document.cookie = "firstName=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    document.cookie = "lastName=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";

    userId = 0;
    firstName = "";
    lastName = "";
    // send them back to login page
    window.location.href = "index.html";
}

// save cookie (from Dr. Leinecker's LAMP demo)
function saveCookie()
{
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime()+(minutes * 60 * 1000)); 

    document.cookie = `userId=${userId}; expires=${date.toUTCString()}; path=/`;
    document.cookie = `firstName=${firstName}; expires=${date.toUTCString()}; path=/`;
    document.cookie = `lastName=${lastName}; expires=${date.toUTCString()}; path=/`;
}

//regex to check if password contains special character
function isSpecialCharacter(char) {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return specialChars.test(char);
}

//function that validates that password has 8 chars and 1 special character
function validate_password(password)
{
        
    if (password.length < 8)
        {
            // error code 1; password too short
            return 1;
        }

    var sChar = 0;
    for (let i = 0; i < password.length; i++)
    {
        if (isSpecialCharacter(password[i]))
        {
            sChar++;
        }
    }

    if (sChar == 0)
    {
        //password must contain special character
        return 2;
    }
    
    //password valid
    return 0;
}

// simply makes sure names are not empty
function validate_names(names)
{
    for (let i = 0; i < names.length; i++)
    {
        if (names[i].length == 0)
        {
            // names can't be empty
            return 1;
        }
    }

    // otherwise, names are fine
    return 0;
}

// function to create action buttons in table (edit, delete)
function createActionButton(text, onClick) {
    // create new button and give it a class 
    let btn = document.createElement("button");
    btn.classList.add("actionButton");
    // assign delete image (X) and style it
    if (text == "Delete")
    {
        btn.innerHTML = '<img src="css/img/delete.png" alt="Delete Contact" style="width: 30px; height: 30px;"/>'
        btn.style.marginLeft = "1px";
        btn.setAttribute("alt", "Button to delete this contact.");
    } else // assign edit image (pencil) and style it
    {
        btn.innerHTML = '<img src="css/img/edit.png" alt="Edit Contact" style="width: 30px; height: 30px;"/>'
        btn.setAttribute("alt", "Button to edit this contact.");
    }
    // give the button its onclick behavior and return it
    btn.onclick = onClick;
    return btn;
}

// function to show add contact form or hide it 
function showContactForm()
{
    var form = document.getElementById("addContactForm");
    if (form.style.display == 'block')
    {
        form.style.display = 'none';
    } else 
    {
        form.style.display = 'block';
    }
}

// function to add contact to database  
function addContact()
{
    // get info for new contact
    let contactFirstName = document.getElementById("contactFirstName").value;
    let contactLastName = document.getElementById("contactLastName").value;
    let phone = document.getElementById("contactPhone").value;
    let email = document.getElementById("contactEmail").value;

    // get form by id
    let form = document.getElementById("addContactForm");

    // if any field in form is invalid, tell user and return 
    if (!form.checkValidity())
    {
        document.getElementById("contactResult").innerHTML = "Invalid inputs.";
        return;
    }

    // if not, make JSON payload 
    document.getElementById("contactResult").innerHTML = "";
    let tmp = {
        FirstName:contactFirstName, 
        LastName:contactLastName, 
        Phone:phone, 
        Email:email,
        UserID: userId
    };

    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/AddContact.' + extension;

    let xhr = new XMLHttpRequest()
    xhr.open("POST", url, true);

    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    // send to API
    try
    {
        xhr.onreadystatechange = function()
        {
            // if we receive a response from API
            if (this.readyState == 4)
            {
                // if user already exists
                if (this.status == 409)
                {
                    document.getElementById("contactResult").innerHTML = "Contact already exists!";
                }

                // if async call finishes (contact doesn't exist)
                else if (this.status == 200)
                {
                    let jsonObject = JSON.parse(xhr.responseText);
                    document.getElementById("contactResult").innerHTML = "Contact added!";
                
                    // Clear form
                    document.getElementById("contactFirstName").value = "";
                    document.getElementById("contactLastName").value = "";
                    document.getElementById("contactPhone").value = "";
                    document.getElementById("contactEmail").value = "";
                    
                    // Refresh contact list
                    searchContacts();
                }
            }
        };
        xhr.send(jsonPayload);  
    } catch (err)
    {
        document.getElementById("contactResult").innerHTML = err.message;
    }
}

// function to save contact after it's edited
function saveContact(contactId, firstName, lastName, phone, email, userId) {
    // Validate updated input
    if (!firstName || !lastName) {
        document.getElementById("contactResult").innerHTML = "First and last name are required!";
        return;
    }

    // make JSON payload
    const tmp = {
        id: contactId,
        "First Name": firstName,
        "Last Name": lastName,
        Phone: phone,
        Email: email
    };

    const jsonPayload = JSON.stringify(tmp);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", urlBase + '/Update.' + extension, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    // send JSON to API
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    let response = JSON.parse(xhr.responseText);
                    if (response.error === "") {
                        searchContacts(); // Refresh contact list
                    } else {
                        document.getElementById("contactResult").innerHTML = "Update failed: " + response.error;
                    }
                } else {
                    document.getElementById("contactResult").innerHTML = "Server error while saving.";
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("contactResult").innerHTML = "Exception: " + err.message;
    }
}

// function that handles editing contacts inline
function editContact(contactId, firstName, lastName, phone, email, userId) {
    let rows = document.getElementById("contactTable").tBodies[0].rows;

    for (let i = 0; i < rows.length; i++) {
        let cells = rows[i].cells;

        // Safer way: match by contact ID stored in a data attribute (optional future upgrade)
        if (
            cells[0].innerText.trim() === firstName &&
            cells[1].innerText.trim() === lastName &&
            cells[2].innerText.trim() === phone &&
            cells[3].innerText.trim() === email
        ) {
            // Replace cells with editable inputs
            cells[0].innerHTML = `<input type="text" class="editField" value="${firstName}">`;
            cells[1].innerHTML = `<input type="text" class="editField" value="${lastName}">`;
            cells[2].innerHTML = `<input type="text" class="editField" value="${phone}">`;
            cells[3].innerHTML = `<input type="text" class="editField" value="${email}">`;

            // Add Save and Cancel buttons (no duplicate IDs)
            const saveBtn = document.createElement("button");
            saveBtn.className = "actionButton";
            saveBtn.innerHTML = '<img src="css/img/confirm.png" alt="Confirm Changes" style="width: 30px; height: 30px;">';

            const cancelBtn = document.createElement("button");
            cancelBtn.className = "actionButton";
            cancelBtn.innerHTML = '<img src="css/img/delete.png" alt="Cancel Edit" style="width: 30px; height: 30px;">';

            // Assign event handlers
            cancelBtn.onclick = () => searchContacts();

            saveBtn.onclick = () => {
                const inputs = rows[i].querySelectorAll("input.editField");
                const updatedFirst = inputs[0].value.trim();
                const updatedLast = inputs[1].value.trim();
                const updatedPhone = inputs[2].value.trim();
                const updatedEmail = inputs[3].value.trim();

                saveContact(contactId, updatedFirst, updatedLast, updatedPhone, updatedEmail, userId);
            };

            // Replace the button cell with new buttons
            cells[4].innerHTML = "";
            cells[4].appendChild(saveBtn);
            cells[4].appendChild(cancelBtn);

            break;
        }
    }
}

// wrapper that confirms user wants to delete the contact 
function deleteContact(userId, firstName, lastName) {
    // confirmation
    if (confirm("Are you sure you want to delete the contact for " + firstName + " " + lastName + "?"))
    {
        confirmDelete(userId, firstName, lastName);
    }

}

// function that handles actually deleting the contact
function confirmDelete(userId, firstName, lastName) {

    // make JSON payload
    let tmp = {userId: userId, firstName: firstName, lastName: lastName};
    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/Delete.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    //document.getElementById("loginResult").innerHTML = "Contact deleted!";
                    searchContacts(); // Refresh the list
                } else {
                    //document.getElementById("loginResult").innerHTML = "Error deleting contact";
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("loginResult").innerHTML = err.message;
    }
}

// function to clear warning messages on login page
function clearDeleteMessage() {
    document.getElementById("loginResult").innerHTML = "";
}

// window swapper for about us button 
function about()
{
    window.location.href="about.html"
}