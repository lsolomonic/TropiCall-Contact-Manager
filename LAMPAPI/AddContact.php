<?php
    ini_set('display_errors', 1);
    error_reporting(E_ALL);

$inData = getRequestInfo();

$firstName = $inData["FirstName"];
    $lastName  = $inData["LastName"];
    $phone     = $inData["Phone"];
    $email     = $inData["Email"];

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

if ($conn->connect_error) {
returnWithError($conn->connect_error);
} else {
// Check if login is taken
$sql = "SELECT * FROM contacts WHERE Email=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows == 0) {
// Insert new contact/user
$stmt = $conn->prepare("INSERT INTO contacts (FirstName, LastName, Phone, Email) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $firstName, $lastName, $phone, $email);
$stmt->execute();

$id = $conn->insert_id;
http_response_code(200);
returnWithInfo('{"id": "' . $id . '"}');

$stmt->close();
$conn->close();
} else {
http_response_code(409);
returnWithError("Username taken");
}
}

function getRequestInfo()
{
return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj)
{
header('Content-type: application/json');
echo $obj;
}

function returnWithError($err)
{
$retValue = '{"error":"' . $err . '"}';
sendResultInfoAsJson($retValue);
}

function returnWithInfo($searchResults)
{
$retValue = '{"results":[' . $searchResults . '],"error":""}';
sendResultInfoAsJson($retValue);
}

?>