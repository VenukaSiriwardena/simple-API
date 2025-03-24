const http = require('http');
const url = require('url');

const users = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com' },
];

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const method = req.method;

  // Set response headers
  res.setHeader('Content-Type', 'application/json');

  // Parse JSON body if the request is a POST or PUT
  let body = '';
  req.on('data', chunk => {
    body += chunk;
  });

  req.on('end', () => {
    if (method === 'GET' && parsedUrl.pathname === '/api/users') {
      // Get all users
      res.writeHead(200);
      res.end(JSON.stringify(users));
    } else if (method === 'GET' && parsedUrl.pathname.startsWith('/api/users/')) {
      // Get a specific user by ID
      const userId = parseInt(parsedUrl.pathname.split('/')[3]);
      const user = users.find(u => u.id === userId);
      if (user) {
        res.writeHead(200);
        res.end(JSON.stringify(user));
      } else {
        res.writeHead(404);
        res.end(JSON.stringify({ message: 'User not found' }));
      }
    } else if (method === 'POST' && parsedUrl.pathname === '/api/users') {
      // Create a new user
      const { name, email } = JSON.parse(body);
      const newUser = {
        id: users.length + 1,
        name,
        email,
      };
      users.push(newUser);
      res.writeHead(201);
      res.end(JSON.stringify(newUser));
    } else if (method === 'PUT' && parsedUrl.pathname.startsWith('/api/users/')) {
      // Update an existing user
      const userId = parseInt(parsedUrl.pathname.split('/')[3]);
      const { name, email } = JSON.parse(body);
      const user = users.find(u => u.id === userId);
      if (user) {
        user.name = name;
        user.email = email;
        res.writeHead(200);
        res.end(JSON.stringify(user));
      } else {
        res.writeHead(404);
        res.end(JSON.stringify({ message: 'User not found' }));
      }
    } else if (method === 'DELETE' && parsedUrl.pathname.startsWith('/api/users/')) {
      // Delete a user
      const userId = parseInt(parsedUrl.pathname.split('/')[3]);
      const userIndex = users.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        users.splice(userIndex, 1);
        res.writeHead(204);
        res.end();
      } else {
        res.writeHead(404);
        res.end(JSON.stringify({ message: 'User not found' }));
      }
    } else {
      // Handle invalid routes
      res.writeHead(404);
      res.end(JSON.stringify({ message: 'Not Found' }));
    }
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = server;