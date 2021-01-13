const express = require("express");
const mongoose = require('mongoose');
const { graphqlHTTP } = require('express-graphql');

const { GraphQLID, GraphQLString, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLNonNull } = require ("graphql");

const app = express();

/* connection of mongodb */
const url = "mongodb://localhost:27017/space_db";
const connect = mongoose.connect(url, { useNewUrlParser: true });
connect.then((db) => {
    console.log('Connected correctly to server!');
}, (err) => {
    console.log(err);
});

/* data model for collection */
const UserModel = mongoose.model("users", {
    first_name: String,
    last_name: String,
    email: String,
    phone_number: String
})

/* graphql object and mapping mongoose data model object  */
const UserType = new GraphQLObjectType({
    name: "User",
    fields: {
        id: { type: GraphQLID },
        first_name: { type: GraphQLString },
        last_name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone_number: { type: GraphQLString }
    }
});

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "Query",
        fields: {
            userList: {
                type: GraphQLList(UserType),
                resolve: (root, args, context, info) => {
                    return UserModel.find().exec();
                }
            },
            userById: {
                type: UserType,
                args: {
                    id: {type: GraphQLNonNull(GraphQLID) }
                },
                resolve: (root, args, context, info) => {
                    return UserModel.findById(args.id).exec();
                }
            },
            deleteUserById: {
                type: UserType,
                args: {
                    id: { type: GraphQLNonNull(GraphQLString) }
                },
                resolve(root, args, context, info) {
                    let remUser = UserModel.findByIdAndRemove(args.id).exec();
                    if (!remUser) {
                        throw new Error('Error')
                    }
                    return remUser
                }
            }
        }
    }),
    mutation: new GraphQLObjectType({
        name: "Create",
        fields: {
            user: {
                type: UserType,
                args: {
                    first_name: { type: GraphQLNonNull(GraphQLString) },
                    last_name: { type: GraphQLNonNull(GraphQLString) },
                    email: { type: GraphQLNonNull(GraphQLString) },
                    phone_number: { type: GraphQLNonNull(GraphQLString) },
                },
                resolve: (root, args, context, info) => {
                    let user = new UserModel(args);
                    return user.save();
                },
                updateUserById: {
                    type: UserType,
                    args: {
                        id: {
                            name: 'id',
                            type: new GraphQLNonNull(GraphQLString)
                        },
                        first_name: { type: new GraphQLNonNull(GraphQLString) },
                        last_name: { type: new GraphQLNonNull(GraphQLString) },
                        email: { type: new GraphQLNonNull(GraphQLString) },
                        phone_number: { type: new GraphQLNonNull(GraphQLString) },
                    },
                    resolve (root, args, context, info) {
                        return UserModel.findByIdAndUpdate(args.id, {
                            first_name: args.first_name,
                            last_name: args.last_name,
                            email: args.email,
                            phone_number: args.phone_number
                        }, function(err) {
                            if (err) return next (err);
                        });
                    }
                }
            }
        }
    })    
})

/* configure express the graphQL */
app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}))

app.listen(3000, () => console.log('🚀 Server ready at http://localhost:4000'));