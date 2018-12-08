const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLList
} = require("graphql");

// @description: The different departure and arrival time according to a stop station
// @example: https://data.metromobilite.fr/api/routers/default/index/clusters/SEM:GENVALMY/stoptimes
// @param code: {SEM, C38}:{X} (TAG or TransIsère):(GEN...)
// @graphql:
`{
    timeStop(code: "SEM:GENVALMY") {
        
    }
}`;

const PatterType = new GraphQLObjectType({
  name: "Pattern",
  fields: () => ({
    id: { type: GraphQLString },
    desc: { type: GraphQLString },
    dir: { type: GraphQLInt }, //1 or 2
    shortDesc: { type: GraphQLString }
  })
});

const Time = new GraphQLObjectType({
  name: "Time",
  fields: () => ({
    stopId: { type: GraphQLString },
    stopName: { type: GraphQLString },
    scheduledArrival: { type: GraphQLFloat },
    scheduledDeparture: { type: GraphQLFloat },
    realtimeArrival: { type: GraphQLFloat },
    realtimeDeparture: { type: GraphQLFloat },
    arrivalDelay: { type: GraphQLFloat },
    departureDelay: { type: GraphQLFloat },
    timepoint: { type: GraphQLBoolean },
    realtime: { type: GraphQLBoolean },
    serviceDay: { type: GraphQLFloat },
    tripId: { type: GraphQLFloat }
  })
});

const TimeStopType = new GraphQLObjectType({
  name: "TimeStop",
  fields: () => ({
    pattern: { type: PatterType },
    times: { type: new GraphQLList(Time) }
  })
});

module.exports = TimeStopType;
