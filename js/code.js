const urlBase = 'http://poosdcop4331.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";


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
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login2.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.state == 200); 
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
				//saveCookie();
	
				window.location.href = "contacts.html";
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

    if (validate_names({newFn, newLn, username}) != 0)
    {
        document.getElementById("loginResult").innerHTML = "First Name, Last Name, and Username must not be empty.";
        return;
    }

    //var hash = md5(password);
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
                    //save cookie (todo)
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
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
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


function addContact() {
    userId = 0;
    firstName = "";
    lastName = "";

    let contactFirstName = document.getElementById("contactFirstName").value;
    let contactLastName = document.getElementById("contactLastName").value;
    let phone = document.getElementById("phoneNumber").value;
    let email = document.getElementById("email").value;

    if (validate_names({contactFirstName, contactLastName}) != 0) {
        document.getElementById("loginResult").innerHTML = "First and last name can't be empty!";
        return; // Add return to stop execution
    }

    document.getElementById("loginResult").innerHTML = "";

    let tmp = {
        FirstName: contactFirstName, 
        LastName: contactLastName, 
        Phone: phone, 
        Email: email,
        UserId: userId // Add UserId to associate contact with user
    };
    
    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/AddContact.' + extension;

    let xhr = new XMLHttpRequest(); // Fixed typo from 'xml' to 'xhr'
    xhr.open("POST", url, true); // Fixed method syntax
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 409) {
                document.getElementById("loginResult").innerHTML = "Contact already exists!";
            } else if (this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                document.getElementById("loginResult").innerHTML = "Contact added!";
                fill_table(); // Refresh the contact list
            }
        }
    };
    xhr.send(jsonPayload);
}

// ===== CONTACT MANAGEMENT FUNCTIONS ===== //

let currentContacts = [];

function showAddContactForm() {
    document.getElementById("contactFormContainer").style.display = "block";
    document.getElementById("contactFirstName").focus();
}

function hideAddContactForm() {
    document.getElementById("contactFormContainer").style.display = "none";
    document.getElementById("contactForm").reset();
}

function searchContacts() {
    const searchTerm = document.getElementById("search").value.toLowerCase();
    const rows = document.querySelectorAll("#contactTable tbody tr");
    
    rows.forEach(row => {
        const name = (row.cells[0].textContent + row.cells[1].textContent).toLowerCase();
        const phone = row.cells[2].textContent.toLowerCase();
        const email = row.cells[3].textContent.toLowerCase();
        
        row.style.display = (name.includes(searchTerm) || phone.includes(searchTerm) || email.includes(searchTerm)) 
            ? "" 
            : "none";
    });
}

function fill_table() {
    const tmp = { UserId: userId };
    const jsonPayload = JSON.stringify(tmp);
    
    const xhr = new XMLHttpRequest();
    xhr.open("POST", urlBase + '/SearchContacts.' + extension, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onload = function() {
        if (this.status === 200) {
            const response = JSON.parse(this.responseText);
            currentContacts = response.results || [];
            renderContacts(currentContacts);
        }
    };
    xhr.send(jsonPayload);
}

function renderContacts(contacts) {
    const tbody = document.querySelector("#contactTable tbody");
    tbody.innerHTML = contacts.map(contact => `
        <tr>
            <td>${contact.FirstName || ''}</td>
            <td>${contact.LastName || ''}</td>
            <td>${contact.PhoneNumber || ''}</td>
            <td>${contact.EmailAddress || ''}</td>
            <td>
                <button class="contact-action" onclick="editContact('${contact.ID}')">Edit</button>
                <button class="contact-action" onclick="deleteContact('${contact.ID}')">Delete</button>
            </td>
        </tr>
    `).join('') || '<tr><td colspan="5">No contacts found</td></tr>';
}

function saveContact() {
    const contactId = document.getElementById("editContactId").value;
    const isEdit = contactId !== "";
    
    const contactData = {
        ContactId: contactId,
        FirstName: document.getElementById("contactFirstName").value,
        LastName: document.getElementById("contactLastName").value,
        PhoneNumber: document.getElementById("phoneNumber").value,
        EmailAddress: document.getElementById("email").value,
        UserId: userId
    };

    if (!contactData.FirstName || !contactData.LastName) {
        alert("First and last name are required");
        return;
    }

    const endpoint = isEdit ? 'EditContact' : 'AddContact';
    const xhr = new XMLHttpRequest();
    xhr.open("POST", urlBase + '/' + endpoint + '.' + extension, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onload = function() {
        if (this.status === 200) {
            hideAddContactForm();
            fill_table();
        } else {
            alert("Error saving contact");
        }
    };
    xhr.send(JSON.stringify(contactData));
}

function editContact(contactId) {
    const contact = currentContacts.find(c => c.ID == contactId);
    if (contact) {
        document.getElementById("contactFirstName").value = contact.FirstName || '';
        document.getElementById("contactLastName").value = contact.LastName || '';
        document.getElementById("phoneNumber").value = contact.PhoneNumber || '';
        document.getElementById("email").value = contact.EmailAddress || '';
        document.getElementById("editContactId").value = contactId;
        showAddContactForm();
    }
}

function deleteContact(contactId) {
    if (confirm("Are you sure you want to delete this contact?")) {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", urlBase + '/DeleteContact.' + extension, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        xhr.send(JSON.stringify({ ContactId: contactId, UserId: userId }));
        xhr.onload = fill_table;
    }
}

// Initialize when contacts.html loads
if (window.location.pathname.endsWith("contacts.html")) {
    document.getElementById("userName").textContent = firstName + " " + lastName;
    fill_table();
}