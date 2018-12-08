const axios = require("axios");

const TimeSheetType = require("./schemaType/TimeSheetType");
const TimeStopType = require("./schemaType/TimeStopType");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLSchema,
  GraphQLList
} = require("graphql");

// Root Query

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: () => ({
    timeSheet: {
      type: TimeSheetType,
      args: {
        route: { type: GraphQLString },
        time: { type: GraphQLFloat }
      },
      resolve(parent, args) {
        return axios
          .get(
            `https://data.metromobilite.fr/api/ficheHoraires/json?route=${
              args.route
            }&time=${args.time ? args.time : new Date().getTime()}`
          )
          .then(res => {
            return res.data;
          })
          .catch(err => {
            console.error(err.response.status, err.response.statusText);
            return null;
          });
      }
    },
    timeStop: {
      type: new GraphQLList(TimeStopType),
      args: {
        code: { type: GraphQLString }
      },
      resolve(parent, args) {
        return axios
          .get(
            `https://data.metromobilite.fr/api/routers/default/index/clusters/${
              args.code
            }/stoptimes`
          )
          .then(res => {
            return res.data;
          })
          .catch(err => {
            console.error(err.response.status, err.response.statusText);
            return err;
          });
      }
    }
  })
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
