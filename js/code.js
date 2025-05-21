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
    return;
}