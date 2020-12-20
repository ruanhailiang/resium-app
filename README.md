# Satellite Query App
## Features
* Draw Area of Interest (polygon) on map 
* Delete Area of Interest (via right click)
* Display Bounding Box (via right click)
* Query for times at which the satellite is closest to the Area of Interest 

## Setting up
### Installation
1. Install [Node](https://nodejs.org)
1. Install [yarn](https://classic.yarnpkg.com)
1. Install [python](https://www.python.org/). Verified to work with python 3.8.2

### Client Environment
1. Under the `client` directory, run `yarn install` to install the client packages
```
cd client
yarn install
```
2. Start up the web application, accessible at http://localhost:3000
```
craco start
```

### Server Environment
1. Decide on a directory and create a python virtual environment in it
```
cd <directory_to_env>
python -m venv satellite-env
```
2. Activate the virtual environment
```
# On Windows
satellite-env\Scripts\activate.bat

# On Linux
source tutorial-env/bin/activate
```
3. Install the required python packages
```
cd <base_application_directory>
pip install -r requirements.txt
```
4. Run `yarn install` to install the necessary server packages
```
yarn install
```
5. Start up the backend server
```
node server/bin/www
```
