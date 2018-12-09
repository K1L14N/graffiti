const axios = require("axios");

const TimeSheetType = require("./schemaType/TimeSheetType");
const TimeStopType = require("./schemaType/TimeStopType");
const LineType = require("./schemaType/LinesNearType");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLSchema,
  GraphQLBoolean,
  GraphQLList
} = require("graphql");

// Root Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: () => ({
    linesNear: {
      // @usage: { linesNear(lon: 5.70893, lat: 45.17557, dist: 400) {id name lon lat lines} }
      type: new GraphQLList(LineType),
      args: {
        lon: { type: GraphQLFloat },
        lat: { type: GraphQLFloat },
        dist: { type: GraphQLFloat }
      },
      resolve(parent, args) {
        return axios
          .get(
            `https://data.metromobilite.fr/api/linesNear/json?x=${args.lon}&y=${
              args.lat
            }&dist=${args.dist ? args.dist : 300}&details=true`
          )
          .then(res => res.data)
          .catch(err => {
            console.error(err.response.status, err.response.statusText);
            return null;
          });
      }
    },
    linesNearNoDetails: {
      // @usage: { linesNearNoDetails(lon: 5.70893, lat: 45.17557, dist: 400) }
      type: new GraphQLList(GraphQLString),
      args: {
        lon: { type: GraphQLFloat },
        lat: { type: GraphQLFloat },
        dist: { type: GraphQLFloat }
      },
      resolve(parent, args) {
        return axios
          .get(
            `https://data.metromobilite.fr/api/linesNear/json?x=${args.lon}&y=${
              args.lat
            }&dist=${args.dist ? args.dist : 300}`
          )
          .then(res => res.data)
          .catch(err => {
            console.error(err.response.status, err.response.statusText);
            return null;
          });
      }
    },
    timeSheet: {
      // @usage: { timeSheet(route: "SEM:B") { zero { arrets { stopId trips stopName lat lon parentStation { id code city name lat lon } } prevTime nextTime } one { arrets { stopId trips stopName lat lon parentStation { id code city name lat lon } } prevTime nextTime } } }
      type: TimeSheetType,
      args: {
        route: { type: GraphQLString }, //SEM:B
        time: { type: GraphQLFloat }
      },
      resolve(parent, args) {
        return axios
          .get(
            `https://data.metromobilite.fr/api/ficheHoraires/json?route=${
              args.route
            }${args.time ? "&time=" + args.time : ""}&time=${
              args.time ? args.time : ""
            }`
          )
          .then(res => res.data)
          .catch(err => {
            console.error(err.response.status, err.response.statusText);
            return null;
          });
      }
    },
    timeStopCluster: {
      // @usage: { timeStopCluster(code: "SEM:GENVALMY") { pattern { id desc dir shortDesc } times { stopId stopName scheduledArrival scheduledDeparture realtimeArrival realtimeDeparture arrivalDelay departureDelay timepoint realtime serviceDay tripId } } }
      type: new GraphQLList(TimeStopType),
      args: {
        code: { type: GraphQLString } //SEM:GENVALMY
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
            return null;
          });
      }
    },
    timeStop: {
      // @usage: { timeStop(id: "SEM:2222") { pattern { id desc dir shortDesc } times { stopId stopName scheduledArrival scheduledDeparture realtimeArrival realtimeDeparture arrivalDelay departureDelay timepoint realtime serviceDay tripId } } }
      type: new GraphQLList(TimeStopType),
      args: {
        id: { type: GraphQLString } //SEM:2222
      },
      resolve(parent, args) {
        return axios
          .get(
            `https://data.metromobilite.fr/api/routers/default/index/stops/${
              args.id
            }/stoptimes`
          )
          .then(res => {
            return res.data;
          })
          .catch(err => {
            console.error(err.response.status, err.response.statusText);
            return null;
          });
      }
    }
  })
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
