# Routes

The `routes` folder defines the API endpoints exposed by the server.

Store Express routers here. A route file should:

- Declare the endpoint path and HTTP method
- Connect each endpoint to the appropriate controller
- Group related endpoints, such as authentication routes

The router is mounted in [`server.js`](../server.js). For example, the authentication router is mounted under `/api/auth`, so routes declared as `/register`, `/login`, and `/logout` are accessed under that API prefix.

Keep the request-handling logic in `server/controllers/` instead of placing large controller functions in route files.
