const urlBase = 'http://poosdcop4331.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

//load on start
window.onload = function() {
    document.getElementById("userName").textContent = firstName + " " + lastName;
    searchContacts();
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
        actionCell.appendChild(createActionButton("Edit", () => editContact(contact.ID)));
        actionCell.appendChild(createActionButton("Delete", () => deleteContact(contact.ID)));
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


function addContact()
{
    let contactFirstName = document.getElementById("contactFirstName").value;
    let contactLastName = document.getElementById("contactLastName").value;
    let phone = document.getElementById("phoneNumber").value;
    let email = document.getElementById("email").value;

    if (validate_names({contactFirstName, contactLastName}) != 0)
    {
        document.getElementById("loginResult").innerHTML = "First and last name can't be empty!";
        return;
    }

    document.getElementById("loginResult").innerHTML = "";

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
                    document.getElementById("loginResult").innerHTML = "Contact already exists!";
                }

                // if async call finishes (contact doesn't exist)
                else if (this.status == 200)
                {
                    let jsonObject = JSON.parse(xhr.responseText);
                    userId = jsonObject.id;
                    document.getElementById("loginResult").innerHTML = "Contact added!";
                    //save cookie 
                    saveContactCookie(
                        jsonObject.id,
                        contactFirstName,
                        contactLastName,
                        phone,
                        email
                    );
                    
                    // Optional: Clear form after successful addition
                    document.getElementById("contactFirstName").value = "";
                    document.getElementById("contactLastName").value = "";
                    document.getElementById("phoneNumber").value = "";
                    document.getElementById("email").value = "";
                    
                    // Refresh contact list
                    searchContacts();
                }
            }
        };
        xhr.send(jsonPayload);  
    } catch (err)
    {
        document.getElementById("loginResult").innerHTML = err.message;
    }
}

//function to save contact data in a cookie
function saveContactCookie(contactId, firstName, lastName, phone, email) {
    // Set cookie to expire in 30 days
    let expiration = new Date();
    expiration.setDate(expiration.getDate() + 30);
    
    // Save contact data
    document.cookie = `lastAddedContact=${JSON.stringify({
        id: contactId,
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        email: email
    }
)

}; expires=${expiration.toUTCString()}; path=/`;


}

//load contact data from cookie
function loadContactCookie() {
    let cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.startsWith("lastAddedContact=")) {
            return JSON.parse(cookie.substring(17));
        }
    }
    return null;
}