const urlBase = 'http://poosdcop4331.xyz/LAMPAPI';
const extension = 'php';

let userID = 0;
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
    userID = 0;
    firstName = "";
    lastName = "";

    //get inputs for new username and PW
    let username = document.getElementById("userName").value;
    let password = document.getElementById("userPW").value;
    //var hash = md5(password);
    document.getElementById("loginResult").innerHTML = "";

    let tmp = {username:username, password:password};
    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/Register.' + extension;

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
                    let jsonObject = xhr.parse(xhr.responseText);
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


function search()
{
    return;
}

function fill_table()
{
    return;
}