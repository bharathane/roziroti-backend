# Authentication

**user Table**

| Column   | Type    |
| -------- | ------- |
| username | TEXT    |
| name     | TEXT    |
| gender   | TEXT    |
| password | TEXT    |

**userTransactions Table

|Column  | Type  |
|-------   ------|
|username|varchar|
|category| text  |
|type    | text  |
|amount  | int   |
|userTran|       |
|sactions| date  |
|date    |       |


### API 1

#### Path: `/register`

#### Method: `POST`

**Request**

```
{
  "username": "bharath",
  "name": "bharath manda",
  "gender": "male",
  "password": "bharath@123"
}
```

- **Scenario 1**

  - **Description**:

    If the username already exists

  - **Response**
    - **Status code**
      ```
      400
      ```
    - **Status text**
      ```
      User already exists
      ```

- **Scenario 2**

  - **Description**:

    If the registrant provides a password with less than 5 characters

  - **Response**
    - **Status code**
      ```
      400
      ```
    - **Status text**
      ```
      Password is too short
      ```

- **Scenario 3**

  - **Description**:

    Successful registration of the registrant

  - **Response**
      - **Status code**
        ```
        200
        ```
      - **Status text**
       ```
       User created successfully
       ```

### API 2

#### Path: `/login`

#### Method: `POST`

**Request**
```
{
  "username": "bharath",
  "password": "bharath@123"
}
```

- **Scenario 1**

  - **Description**:

    If an unregistered user tries to login

  - **Response**
    - **Status code**
      ```
      400
      ```
    - **Status text**
      ```
      Invalid user
      ```

- **Scenario 2**

  - **Description**:

    If the user provides incorrect password

  - **Response**
    - **Status code**
      ```
      400
      ```
    - **Status text**
      ```
      Invalid password
      ```

- **Scenario 3**

  - **Description**:

    Successful login of the user

  - **Response**
    - **Status code**
      ```
      200
      ```
    - **Status text**
      ```
      Login success!
      ```

### API 3

### path: /postData

**Request**

{
      "category":"EMI",
      "type":"expenses",
      "amount":4500,
      "TransactionDate":"2024-1-5"
  }

### API 4 
### path: /getData
its need headers and send all TransactionData of a specific user

### API 3

#### Path: `/change-password`

#### Method: `PUT`

**Request**

```
{
  "username": "adam_richard",
  "oldPassword": "richard_567",
  "newPassword": "richard@123"
}
```

- **Scenario 1**

  - **Description**:

    If the user provides incorrect current password

  - **Response**
    - **Status code**
      ```
      400
      ```
    - **Status text**
      ```
      Invalid current password
      ```

- **Scenario 2**

  - **Description**:

    If the user provides new password with less than 5 characters

  - **Response**
    - **Status code**
      ```
      400
      ```
    - **Status text**
      ```
      Password is too short
      ```

- **Scenario 3**

  - **Description**:

    Successful password update

  - **Response**
    - **Status code**
      ```
      200
      ```
    - **Status text**
      ```
      Password updated
      ```


<br/>

Use `npm install` to install the packages.

**Export the express instance using the default export syntax.**

**Use Common JS module syntax.**
