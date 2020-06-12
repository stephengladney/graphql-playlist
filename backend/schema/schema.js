const graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList
} = graphql;
const _ = require("lodash");

const books = [
  { id: "1", name: "First Book of Bob", genre: "Reference", authorId: "1" },
  { id: "2", name: "Jane's First Book", genre: "Reference", authorId: "2" },
  {
    id: "3",
    name: "An Introduction to Sam",
    genre: "Reference",
    authorId: "3"
  },
  { id: "4", name: "Second Book of Bob", genre: "Reference", authorId: "1" },
  { id: "5", name: "Jane Does it Again", genre: "Reference", authorId: "2" },
  {
    id: "6",
    name: "Hi, it's me Bob. Again.",
    genre: "Reference",
    authorId: "1"
  }
];

const authors = [
  { name: "Bob Burmeister", age: 32, id: "1" },
  { name: "Jane Lynch", age: 32, id: "2" },
  { name: "Sam Tarly", age: 32, id: "3" }
];

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        return _.find(authors, { id: parent.authorId });
      }
    }
  })
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return _.filter(books, { authorId: parent.id });
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return _.find(books, { id: args.id });
      }
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return _.find(authors, { id: args.id });
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return books;
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        return authors;
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
