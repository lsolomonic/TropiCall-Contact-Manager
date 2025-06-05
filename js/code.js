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
    let searchTerm = document.getElementById("search").value;
    let tmp = {userId: userId, search: searchTerm};
    let jsonPayload = JSON.stringify(tmp);

    let xhr = new XMLHttpRequest();
    xhr.open("POST", urlBase + '/Search.' + extension, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    
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

    if (!contacts || contacts.length === 0) {
        let row = tableBody.insertRow();
        let cell = row.insertCell(0);
        cell.colSpan = 5;
        cell.textContent = "No contacts found";
        return;
    }

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

function registerSwap(){
    if (document.getElementById("inner-title").textContent == "Welcome!")
    {
        document.getElementById("inner-title").textContent = "Register:";
        document.getElementById("loginButton").textContent = "Continue";
        document.getElementById("regBoxes").style.display = 'block';
        document.getElementById("reg").style.marginTop = '0%';
        document.getElementById("reg").textContent = "Return to login page.";
    } else
    {
        document.getElementById("inner-title").textContent = "Welcome!";
        document.getElementById("loginButton").textContent = "Log In";
        document.getElementById("regBoxes").style.display = 'none';
        document.getElementById("reg").style.marginTop = '50%';
        document.getElementById("reg").textContent = "Not registered yet? Click here.";
    }
}

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

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login2.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200); 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
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

    if (validate_password(password) != 0)
    {
        document.getElementById("loginResult").innerHTML = "Password must have 8 or more characters and 1 special character.";
        return;
    }

    if (validate_names([newFn, newLn, username]) != 0)
    {
        document.getElementById("loginResult").innerHTML = "First Name, Last Name, and Username must not be empty.";
        return;
    }

    document.getElementById("loginResult").innerHTML = "";

    let tmp = {login:username, password:password, firstName:newFn, lastName:newLn};
    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/Signup.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open(method = "POST", url, async = true);

    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

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

function doLogout()
{
    // Clear all cookies
    document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    document.cookie = "firstName=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    document.cookie = "lastName=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";

	userId = 0;
	firstName = "";
	lastName = "";
	window.location.href = "index.html";
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes * 60 * 1000));	

	document.cookie = `userId=${userId}; expires=${date.toUTCString()}; path=/`;
    document.cookie = `firstName=${firstName}; expires=${date.toUTCString()}; path=/`;
    document.cookie = `lastName=${lastName}; expires=${date.toUTCString()}; path=/`;
}

function isSpecialCharacter(char) {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return specialChars.test(char);
  }

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


function createActionButton(text, onClick) {
    let btn = document.createElement("button");
    btn.classList.add("actionButton");
    if (text == "Delete")
    {
        btn.innerHTML = '<img src="css/img/delete.png" alt="Delete Contact" style="width: 30px; height: 30px;"/>'
        btn.style.marginLeft = "1px";
        btn.setAttribute("alt", "Button to delete this contact.");
    } else
    {
        btn.innerHTML = '<img src="css/img/edit.png" alt="Edit Contact" style="width: 30px; height: 30px;"/>'
        btn.setAttribute("alt", "Button to edit this contact.");
    }
    btn.onclick = onClick;
    return btn;
}

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

function addContact()
{
    let contactFirstName = document.getElementById("contactFirstName").value;
    let contactLastName = document.getElementById("contactLastName").value;
    let phone = document.getElementById("contactPhone").value;
    let email = document.getElementById("contactEmail").value;

    if (validate_names([contactFirstName, contactLastName]) != 0)
    {
        document.getElementById("contactResult").innerHTML = "First and last name can't be empty!";
        return;
    }

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

function saveContact(contactId, firstName, lastName, phone, email, userId) {
    // Simple validation
    if (!firstName || !lastName) {
        document.getElementById("contactResult").innerHTML = "First and last name are required!";
        return;
    }

    let tmp = {
        ID: contactId,
        FirstName: firstName,
        LastName: lastName,
        Phone: phone,
        Email: email,
        UserID: userId
    };

    let jsonPayload = JSON.stringify(tmp);
    let xhr = new XMLHttpRequest();
    xhr.open("POST", urlBase + '/Update.' + extension, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    searchContacts(); // Refresh the list
                } else {
                    document.getElementById("loginResult").innerHTML = "Error updating contact";
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("loginResult").innerHTML = err.message;
    }
}

function editContact(contactId, firstName, lastName, phone, email, userId)
{
    let r = document.getElementById("contactTable").tBodies[0].rows;
    for (let i = 0; i < r.length; i++)
    {
        let cells = r[i].cells;
        if (cells[0].innerHTML == firstName && cells[1].innerHTML == lastName && 
            cells[2].innerHTML == phone && cells[3].innerHTML == email)
        {
            cells[0].innerHTML = '<input type="text" class="editField" value="' + cells[0].textContent + '">';
            cells[1].innerHTML = '<input type="text" class="editField" value="' + cells[1].textContent + '">';
            cells[2].innerHTML = '<input type="text" class="editField" value="' + cells[2].textContent + '">';
            cells[3].innerHTML = '<input type="text" class="editField" value="' + cells[3].textContent + '">';

            // Update action cell
            cells[4].innerHTML = '<button id="saveBtn" class="actionButton"><img src="css/img/confirm.png" alt="Confirm Changes" style="width: 30px; height: 30px;"></button> <button id="cancelBtn" class="actionButton"><img src="css/img/delete.png" alt="Delete Contact" style="width: 30px; height: 30px;"/></button>';
            let cancelBtn = document.getElementById("cancelBtn");
            let saveBtn = document.getElementById("saveBtn")
            cancelBtn.onclick = () => searchContacts();
            saveBtn.onclick = () => saveContact(contactId, firstName, lastName, phone, email, userId);
        }
    }
}

function deleteContact(userId, firstName, lastName) {
    // confirmation
    if (confirm("Are you sure you want to delete the contact for " + firstName + " " + lastName + "?"))
    {
        confirmDelete(userId, firstName, lastName);
    }

}

function confirmDelete(userId, firstName, lastName) {
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

function clearDeleteMessage() {
    document.getElementById("loginResult").innerHTML = "";
}