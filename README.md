# DFP_LineItem_Creation_Project

This project allows users to create DFP line items for header bidding.

Contained within is the web project & the backend project.
The web project is built using react.js & compiled with webpack.

The backend project is built using node.js & communicates w/ the DFP API.

## Getting started:

Determine which port the backend will run. Create a file within web project: ‘services/apiPath.js’.
Enter: ‘export const API_PATH = [PATH TO YOUR BACKEND, INCLUDING PORT]’ in file.

Make sure node is installed.
In the web project, run ‘npm install’, then run ‘PROD_ENV=1 webpack’.
The build files (html, js, & assets) will be contained within the build folder.
Install the build files within your server’s web root.

Install backend project files on your desired port (currently 3000).
Run ‘npm install’. Run ‘node app.js’. Setup a listener to restart the service if fails.

## IMPORTANT TODOS:

Configure api path through build process & based on environment (instead of within file).
Assets folder is contained both at frontend root and within build folder. Determine how to move assets folder from frontend root into build folder at webpack compile time instead of including twice. 
