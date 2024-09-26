## API Connector for Engage

This is a reference implementation of using the [Suitable Events API](https://developer.suitable.co/#308592d2-5f76-4cf7-a30f-ed16fc5363d9) to read events from a
Pathway on Suitable and recreating them in an Organization in Engage.

### Pre-requisites

#### Install Node & Dependencies

This reference implementation has been tested with Node 16 but should work for Node 16+. Once node is installed, install packages via:

```bash
npm install
```

#### Setup Execution Environment

Set up an execution environment that declares the following environment variables:

```bash
export SUITABLE_USERNAME="<MY_SUITABLE_USERNAME>"
export SUITABLE_PASSWORD="<MY_SUITABLE_LOCAL_PASS>"
export SUITABLE_PATHWAY_ID="<MY_SUITABLE_PATHWAY_ID>"
export SUITABLE_INSTITUTION_ID="<MY_SUITABLE_INSTITUTION_ID>"
export SUITABLE_BASE_URL="https://app.suitable.co"
export SUITABLE_DATE_CREATED_DAYS_AGO_OR_LESS="1"
export ENGAGE_API_KEY="<MY_ENGAGE_API_KEY>"
export ENGAGE_SUBMITTED_BY_ORGANIZATION_ID="<MY_ENGAGE_ORGANIZATION_ID>"
export ENGAGE_SUBMITTED_BY_ID_CAMPUS_EMAIL="<MY_ENGAGE_CAMPUS_EMAIL>"
```

Once the environment has been set up you can invoke the script via:

```bash
npm start
```

##### Example execution using Powershell

```ps1
# Set the environment variables
$env:SUITABLE_USERNAME = "<MY_SUITABLE_USERNAME>"
$env:SUITABLE_PASSWORD = "<MY_SUITABLE_LOCAL_PASS>"
$env:SUITABLE_PATHWAY_ID = "<MY_SUITABLE_PATHWAY_ID>"
$env:SUITABLE_INSTITUTION_ID = "<MY_SUITABLE_INSTITUTION_ID>"
$env:SUITABLE_BASE_URL = "https://app.suitable.co"
$env:SUITABLE_DATE_CREATED_DAYS_AGO_OR_LESS = "1"
$env:ENGAGE_API_KEY = "<MY_ENGAGE_API_KEY>"
$env:ENGAGE_SUBMITTED_BY_ORGANIZATION_ID = "<MY_ENGAGE_ORGANIZATION_ID>"
$env:ENGAGE_SUBMITTED_BY_ID_CAMPUS_EMAIL = "<MY_ENGAGE_CAMPUS_EMAIL>"

# Navigate to the project directory (if needed)
# Set-Location -Path "C:\path\to\your\project"

# Run the Node.js script
node src/index.js
```
