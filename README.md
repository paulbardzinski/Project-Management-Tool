# Dashboard System
Dashboard system that has login with other features, built in Node.js v16 and React.js v18

Skip to [How To Run](#How-to-run) section
## Preview
### Log In Page
![image](https://github.com/user-attachments/assets/7a19386c-1734-450f-8ded-2cc77b611c28)

### Profile Page
![profilePage](https://github.com/user-attachments/assets/57f13ae2-9bf5-4e47-91db-ec684ef1c0a8)
![profilePage2](https://github.com/user-attachments/assets/1f05ff55-79dd-4d3f-8175-e2e52b7f7395)

### Customizing Pages
![customPage](https://github.com/user-attachments/assets/23bbd285-42d1-48fa-8983-1ba3469e5e1a)
![image](https://github.com/user-attachments/assets/2549bfb0-3fa1-46b7-b4b8-3c4e8b44584b)

### Randomized 404 Page
![image](https://github.com/user-attachments/assets/1d915c4b-9ba6-4a49-859c-3c48ccef54b8)


## How to run

### Setting up configuration
- All that needs to be added is the `.env` file, which inherits from the provided `env.template` file. This file must be located in the root directory of your server (`./server/.env`) and looks like this:
```env
# Mysql Database
DATABASE_HOST="127.0.0.1"
DATABASE_USER="root"
DATABASE_PASSWORD="password"
DATABASE_NAME="voidDashboard"

# Server (API) port
SERVER_PORT=9001

# Session settings
SESSION_SECRETS="SECRET_1 SECRET_2 SECRET_3 SECRET_4"
```


### Setting up database
See [THIS](https://github.com/paulbardzinski/Project-Management-Tool/blob/main/database_structure) (database_structure.md) to configure your local database.

### Installation & Run
1. Install the dependencies and start the server:
```bash
cd client && npm install && cd ../server && npm install && node .
```

2. To start the client, open the second console from the root directory and run:
```bash
cd client && npm start
```
