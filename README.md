
# A simple appointment booking app


## API Reference

#### Get all slots for the day

```http
  GET /api/slots?date=${date}&timezone=${timezone}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `date` | `string` | **Required**. Date in (YYYY-MM-DD) format |
| `timezone` | `string` | **Required**. e.g "Europe/Berlin" |

#### Get all events betrween two dates

```http
  GET /api/getEvents?startDate=${startDate}&endDate=${endDate}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `startDate`| `string` |  Date in (YYYY-MM-DD) format. e.g 2023-01-31 |
| `endDate`| `string` |  Date in (YYYY-MM-DD) format. e.g 2023-02-04 |

#### Create a new event


```http
  POST /api/createEvent
```

| Body | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `startTime`| `string` |**Required** Timestamp , e.g 2023-02-05T11:30:00 |
| `slot`| `string` | **Required** duration of the slot, e.g 30 |
| `date`| `string` | **Required**  Date in (YYYY-MM-DD) format. e.g 2023-02-04 |
| `name`| `string` |name of the Person, e.g Rocky |
| `email`| `string` | **Required** email of the Person, e.g rocky@gmail.com |

