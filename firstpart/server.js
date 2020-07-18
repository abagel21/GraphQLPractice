const express = require('express')
const expressGraphQL = require('express-graphql')
const axios = require('axios')

const schema = require('./schema/schema')

const app = express();

app.use('/graphql', expressGraphQL({
    schema,
    graphiql: true
}))

app.listen(80, () => {
    console.log('listening on port 80')
})