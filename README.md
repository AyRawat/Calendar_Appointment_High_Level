
# A simple appointment booking app

A brief description of what this project does and who it's for


## Installation

Backend

```
 Clone the repo using Github CLI--> git clone AyRawat/Calendar_Appointment_High_Level 
 cd Calendar_Appointment_High_Level
 Install the dependencies--> npm i
 Run the Project --> npm start
```

FrontEnd

```
Clone the repo using Github CLI --> gh repo clone AyRawat/Calendar_Appointment_Front-End-HighLevel
cd Calendar_Appointment_Front
npm run serve
```
    
## API Reference

#### Get all slots for the day

```http
  GET /api/slots?date=${date}&timezone=${timezone}
  curl --location --request GET 'https://appointment-high-level.onrender.com/api/slots?date=2020-11-14&timezone=Asia/Calcutta'
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `date` | `string` | **Required**. Date in (YYYY-MM-DD) format |
| `timezone` | `string` | **Required**. e.g "Europe/Berlin" |

#### Create a new event

```http
  POST /api/createEvent

  curl --location --request POST 'https://appointment-high-level.onrender.com/api/createEvent' \
--header 'Content-Type: application/json' \
--data-raw '{
    "startTime": "2023-02-05T11:30:00",
    "slot": "60",
    "date": "2023-02-05",
    "name": "xavier",
    "email": "xavier23@gmail.com"
}'
```

| Body | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `startTime`| `string` |**Required** Timestamp , e.g 2023-02-05T11:30:00 |
| `slot`| `string` | **Required** duration of the slot, e.g 30 |
| `date`| `string` | **Required**  Date in (YYYY-MM-DD) format. e.g 2023-02-04 |
| `name`| `string` |name of the Person, e.g Rocky |
| `email`| `string` | **Required** email of the Person, e.g rocky@gmail.com |



#### Get all events betrween two dates

```http
  GET /api/getEvents?startDate=${startDate}&endDate=${endDate}

  curl --location --request GET 'https://appointment-high-level.onrender.com/api/getEvents?startDate=2023-01-31&endDate=2023-02-04'
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `startDate`| `string` |  Date in (YYYY-MM-DD) format. e.g 2023-01-31 |
| `endDate`| `string` |  Date in (YYYY-MM-DD) format. e.g 2023-02-04 |



## DB Details

I am using only one collection "Appointments" to save all the booked slots. 
 Every document has 
  1. startTime
  2. endTime
  3. duration
  4. name
  5. email
  6. date

  Based on the booked slots for a day I am calculating what all available slots are there in a day.
  This structure makes it easy to monitor the overlapping slot timings. 

