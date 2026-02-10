#!/bin/bash
echo "Installing dependencies..."
npm install

echo "Setting up database..."
node database.js

echo "Setup complete! You can now run 'npm start' to start the server."
