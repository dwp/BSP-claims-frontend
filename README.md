# Claim Frontend
Frontend service for Bereavement Support Payment agent system.

# Usage
First, clone the repo.
Then install npm dependencies.

```sh
$ npm update
```

# Config
All config is optional.

`NODE_ENV` - defaults to dev unless `production` specified,
  Setting to `test` will disable logging and Auditing

`PORT` - the port the service runs on defaults to `4000`

`CLAIMS_API` - Specifies the backend url defaults to `http://localhost:8081`

`VERBOSE_LOGGING` - Un-redacts the logging defaults to off unless set to `true`

`AUDIT_SQS_QUEUE` - Sets the AWS SQS URL

`AUDIT_SQS_FLAG` - Toggles the SQS audit to ON unless set to `false`

`KONG_ENABLED` - sets the auth requirement for the service set to `true`
 otherwise it will default to au
 
`SSL_ENABLED` - sets the server into SSL mode.  For running locally you can use self signed SSL certs and 
the crt needs to be imported into the browser known certs. 

`SSL_KEY_PATH` - specifies the location of the key to be used for ssl mode

`SSL_CERT_PATH` - specifies the location of the cert to be used for ssl mode

`SSL_CA_PATH` - specifies the location of the ca to be used for ssl mode
