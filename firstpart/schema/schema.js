const graphql = require('graphql')
const axios = require('axios')

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = graphql;

const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: () => ({
        name: { type: GraphQLString },
        id: { type: GraphQLString },
        description: { type: GraphQLString },
        users: {
            type: new GraphQLList(UserType),
            async resolve(parentValue, args) {
                return (await axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)).data
            }
        }
    })
})

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        firstName: { type: GraphQLString },
        id: { type: GraphQLString },
        age: { type: GraphQLInt },
        company: {
            type: CompanyType,
            async resolve(parentValue, args) {
                return (await axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)).data
            }
        }
    }),
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLString } },
            async resolve(parentValue, args) {
                return (await axios.get(`http://localhost:3000/users/${args.id}`)).data
            }
        },
        company: {
            type: CompanyType,
            args: { id: { type: GraphQLString } },
            async resolve(parentValue, args) {
                return (await axios.get(`http://localhost:3000/companies/${args.id}`)).data
            }
        }
    }
});

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: {
            type: UserType,
            args: {
                firstName: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
                companyId: { type: GraphQLString }
            },
            async resolve(parentValue, { firstName, age, companyId }) {
                return (await axios.post('http://localhost:3000/users', { firstName, age, companyId })).data
            }
        },
        deleteUser: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) }
            },
            async resolve(parentValue, args) {
                return (await axios.delete(`http://localhost:3000/users/${args.id}`)).data
            }
        },
        editUser: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
                firstName: { type: GraphQLString },
                age: { type: GraphQLInt },
                companyId: { type: GraphQLString }
            },
            async resolve(parentValue, { id, firstName, age, companyId }) {
                return (await axios.patch(`http://localhost:3000/users/${id}`, { firstName, age, companyId })).data
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
})