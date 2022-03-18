# Backend API docs

## About

The backend aims to provide a login/signup solutions to doctors, and appointment scheduling for patients

## Set Up

Fork the github repository, then clone the forked repo in your PC. 
Make sure you have nodejs installed, you can download nodejs from here: https://nodejs.org/en/
Install nodejs in your PC.
after that, go to the project directory, which is basically [parent]/Ayu/ and open a terminal there
type `npm i`
after it is finished, type node index and server will start.

## Available Routes

Note 1: User email and phone number are unique fields, and must be different for every user. Similiarly appointment time also must be unique.

Note 2: The URLs provided in the later sections are only partial URLs, and you have to append the host in front of the URL. Example, if the URL is /api/auth/usersignup, then the correct URL will be {host}/api/auth/usersignup, where {host} is the hostname of the API. In case you are ruunning  it in your local PC, it will be http://localhost:{port}, where {port} is the port number (generally 3000). Combining all that you get the URL as http://localhost:3000/api/auth/usersignup as the endpoint URL.
Similiarly you can get all the URLs .

### Sign Up
POST: /api/auth/usersignup 
For users(patients) to sign into the application. Login not required to use this endpoint

Request format: Set 'Content-Type' to 'application/json' in headers. Inside body, provide the name, passoword, phone number, email, gender, age in standard JSON format. A sample example is:

<pre>
{
    "name": "James",
    "password": "I am James",
    "ph_number": 9836841706,
    "email": "james@gmail.com",
    "gender": "male",
    "age": 24
}
</pre>

The request made in this manner will be accepted by the API and fetch a response from the server.

Response format: The response will JSON object containing all the details given to the server in request, along with a additional authtoken, that is used to verify whether the user is logged in or not. For example, if the request is:

<pre>
{
    "name": "Jane",
    "password": "JaneIsSick",
    "ph_number": 1234567809,
    "email": "jane@gmail.com",
    "gender": "female",
    "age": 19
}
</pre>

Then the response will be:

<pre>
{
  "user": {
    "name": "Jane",
    "password": "$2a$10$x3olh2dCJbLO/TPj467m6.5e.xdMJ2mJduXahU3CUH7JQITu2KCUK",
    "ph_number": 1234567809,
    "email": "jane@gmail.com",
    "gender": "female",
    "age": 19,
    "_id": "623439a2d48007faaf1a3ba1",
    "__v": 0
  },
  "authtoken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMzQzOWEyZDQ4MDA3ZmFhZjFhM2JhMSIsInBoX251bWJlciI6MTIzNDU2NzgwOSwiZW1haWwiOiJqYW5lQGdtYWlsLmNvbSIsImlhdCI6MTY0NzU4OTc5NCwiZXhwIjoxNjQ3NTk2OTk0fQ.C7JyNDwvL-hPZ3VpTSoV6qD6uGgxSFkKDwy4A5JmKfk"
}
</pre>

Note that the password field contains the hash instead of actual password in response, in database actual password is never stored. The user details can be used to display in the profile page, and authtoken must be kept in the client for authentication. On idle state, the authtoken expires after 2 hours.
Authtoken - The authtoken is a digitally signed key made using the user details and a secret string present in the code.

POST: /api/auth/docsignup
This is similar to the previous sign up route, with some extra data in the request json body.
Sample request: 

<pre>
{
    "name": "NoobMedic",
    "password": "Sample password",
    "ph_number": 1234567890,
    "email": "n00b@gmail.com",
    "gender": "male",
    "age": 21,
    "years_of_exp": 2,
    "field_of_specialization": "General",
    "reg_no": "15648A"
}
</pre>

Response to the request:

<pre>
{
  "user": {
    "name": "NoobMedic",
    "password": "$2a$10$uUlv0VWLlZ6lITfqbsP3d./qHgzzP32YENPUNjXzMNgJmrUtXcNjG",
    "ph_number": 1234567890,
    "email": "n00b@gmail.com",
    "gender": "male",
    "age": 21,
    "years_of_exp": 2,
    "field_of_specialization": "General",
    "reg_no": "15648A",
    "_id": "62343f0ad48007faaf1a3ba7",
    "__v": 0
  },
  "authtoken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMzQzZjBhZDQ4MDA3ZmFhZjFhM2JhNyIsInBoX251bWJlciI6MTIzNDU2Nzg5MCwiZW1haWwiOiJuMDBiQGdtYWlsLmNvbSIsImlhdCI6MTY0NzU5MTE3OCwiZXhwIjoxNjQ3NTk4Mzc4fQ.wyoiHnu-qossIY7MwfK2I-x_n-E_a-bVmYme5TKG_5U"
}
</pre>

### Log In

POST: /api/auth/login
Works for both users and doctors.
Request format: Set 'Content-Type' to 'application/json' in headers. Inside body, provide the email, passowordin standard JSON format. A sample example is:

<pre>
{
    "email": "john@gmail.com",
    "password": "iamjohn"
}
</pre>

Response to the request:

<pre>
{
  "user": {
    "_id": "623178b774da9883a7aaf5b4",
    "name": "John Smith",
    "password": "$2a$10$F2PpscNJZnytsyVswAi/Su7FvtB.v4RmnrFq4P00ctLPXM1Ey61oi",
    "ph_number": 9836841706,
    "email": "john@gmail.com",
    "gender": "male",
    "age": 24,
    "__v": 0
  },
  "authtoken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMzE3OGI3NzRkYTk4ODNhN2FhZjViNCIsInBoX251bWJlciI6OTgzNjg0MTcwNiwiZW1haWwiOiJqb2huQGdtYWlsLmNvbSIsImlhdCI6MTY0NzU5MTM2MywiZXhwIjoxNjQ3NTk4NTYzfQ.3BqUMvjrQTPXLQuLdWzKaSFdnN8_biVlYC6K1Vp9WV0"
}
</pre>

display the user data recieved in the profile page, and keep the authtoken to perform actions that require a sign in. 

### Appointments

POST '/api/appointment/schedule'
Schedules an appointment with a specified doctor. Only user can use this endpoint. Like previous cases, set content type to 'application/json' in headers of request.
This route is a protected route, means only someone logged in can access it. So in the header, we also need the authtoken recieved from login/signup. 
An example of that is:

Content-Type: application/json
auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMzE3OGI3NzRkYTk4ODNhN2FhZjViNCIsInBoX251bWJlciI6OTgzNjg0MTcwNiwiZW1haWwiOiJqb2huQGdtYWlsLmNvbSIsImlhdCI6MTY0NzUyMDE2MywiZXhwIjoxNjQ3NTI3MzYzfQ.19-mUpbDPombkeXXG-uC70Nd5c7SKBJ2b46ykrSrlhI

The body will contain the phone number of doctor to be apppointed, date and time(in standard format) for instance, 

<pre>
{
    "ph_doc": 9836841806,
    "date": "2022-03-19",
    "time": "08:00"
}
</pre>

The response of this request will be:

<pre>
{
  "ph_no_patient": 9836841706,
  "ph_no_doctor": 9836841806,
  "date": "2022-03-19T08:00:00.000Z",
  "time": "08:00",
  "_id": "623450aed48007faaf1a3bad",
  "__v": 0
}
</pre>

Note that ph_no_patient is the phone number of the logged in patient(whose authtoken is used to authenticate), and is fetched from the database.

GET '/api/appointment/list'
This request gets the list of all appointments of a doctor/patient, who is logged in.
Request format: As this is a GET request,the body is empty here. Only add the authtoken in the headers.
Response format: succesful response will be the list of appointments of the specified user only.
sample output: 

<pre>
[
  {
    "_id": "623450aed48007faaf1a3bad",
    "ph_no_patient": 9836841706,
    "ph_no_doctor": 9836841806,
    "date": "2022-03-19T08:00:00.000Z",
    "time": "08:00",
    "__v": 0
  },
  {
    "_id": "6234516bd48007faaf1a3bb3",
    "ph_no_patient": 9836841706,
    "ph_no_doctor": 9836841806,
    "date": "2022-03-19T09:00:00.000Z",
    "time": "09:00",
    "__v": 0
  },
  {
    "_id": "62345171d48007faaf1a3bb7",
    "ph_no_patient": 9836841706,
    "ph_no_doctor": 9836841806,
    "date": "2022-03-19T11:00:00.000Z",
    "time": "11:00",
    "__v": 0
  }
]
</pre>

DELETE '/api/appointment/cancelAppointment/:id'
deletes/cancels the appointment associated with the id passed in the URL. Example, if we want to delete the appointment:

<pre>
{
    "_id": "62345171d48007faaf1a3bb7",
    "ph_no_patient": 9836841706,
    "ph_no_doctor": 9836841806,
    "date": "2022-03-19T11:00:00.000Z",
    "time": "11:00",
    "__v": 0
}
</pre>

Then the _id field will be the id. Thus id = 62345171d48007faaf1a3bb7.
Request format: It will be a DELETE request, and the id will be contained in the URL. Example:
/api/appointment/cancelAppointment/62345171d48007faaf1a3bb7
This is a protected route, and only the patient/doctor can cancel the appointment whose phone numbers are there in that appointment data. To verify the user, we only need to pass the authtoken in the header.

Response format: It returns a json file on success

<pre>
{
  "Success": "Your appointment has been cancelled",
  "appointment_data": {
    "_id": "62345171d48007faaf1a3bb7",
    "ph_no_patient": 9836841706,
    "ph_no_doctor": 9836841806,
    "date": "2022-03-19T11:00:00.000Z",
    "time": "11:00",
    "__v": 0
  }
}
</pre>

It contains the success message along with the appointment that was removed.

