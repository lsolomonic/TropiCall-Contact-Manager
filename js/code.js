const urlBase = 'http://POOSDcop4331.com/LAMPAPI';
const extension = 'php';

let userID = 0;
let firstName = "";
let lastName = "";


function registerSwap(){
    if (document.getElementById("inner-title").textContent == "Welcome!")
    {
        document.getElementById("inner-title").textContent = "Register:";
        document.getElementById("loginButton").textContent = "Continue";
        document.getElementById("reg").textContent = "Return to login page.";
    } else
    {
        document.getElementById("inner-title").textContent = "Welcome!";
        document.getElementById("loginButton").textContent = "Log In";
        document.getElementById("reg").textContent = "Not registered yet? Click here.";
    }
}

function log_wrapper()
{
    var status = document.getElementById("inner-title");
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
    userID = 0;
    firstName = "";
    lastName = "";

    let login = document.getElementById("userName").value;
    let password = document.getElementById("userPW").value;
    //var hash = md5(password);
    document.getElementById("loginResult").innerHTML = "";

    let tmp = {login:login, password:password};
    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/Login.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open(method = "POST", url, async = true);

    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try
    {
        xhr.onreadystatechange = function()
        {
            if (this.readyState == 4 && this.status == 200)
            {
                let jsonObject = JSON.parse(xhr.responseText);
                userID = jsonObject.Object.id;

                if (userID < 1)
                {
                    document.getElementById("loginResult").innerHTML = "Invalid login info";
                    document.getElementById("userPW").textContent = "";
                    return;
                }

                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;
                
                //saveCookie();

                window.location.href = "contacts.html";
            }
        };
        xhr.send(jsonPayload);
    } catch(err)
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

function logOut()
{
    //delete cookies (todo)

    //redirect to login page
    window.location.href = "index.html";
}

function tempLogIn()
{
    window.location.href = "contacts.html";
}