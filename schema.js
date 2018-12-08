const axios = require("axios");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLList,
  GraphQLSchema
} = require("graphql");

// Time sheet
// example: https://data.metromobilite.fr/api/ficheHoraires/json?route=SEM:C&time=1544217497886
const ParentStationType = new GraphQLObjectType({
  name: "ParentStation",
  fields: () => ({
    id: { type: GraphQLString },
    code: { type: GraphQLString },
    city: { type: GraphQLString },
    name: { type: GraphQLString },
    lat: { type: GraphQLInt },
    lon: { type: GraphQLInt }
  })
});

const StationType = new GraphQLObjectType({
  name: "Station",
  fields: () => ({
    stopId: { type: GraphQLString },
    trips: { type: new GraphQLList(GraphQLInt) },
    stopName: { type: GraphQLString },
    lat: { type: GraphQLFloat },
    lon: { type: GraphQLFloat },
    parentStation: { type: ParentStationType }
  })
});

const ArretsType = new GraphQLObjectType({
  name: "Arrets",
  fields: () => ({
    arrets: { type: new GraphQLList(StationType) }
  })
});

const TripType = new GraphQLObjectType({
  name: "Trip",
  fields: () => ({
    tripId: { type: GraphQLString },
    pickupType: { type: GraphQLString }
  })
});

const TripsType = new GraphQLObjectType({
  name: "Trips",
  fields: () => ({
    trips: { type: new GraphQLList(TripType) }
  })
});

const SheetType = new GraphQLObjectType({
  name: "Sheet",
  fields: () => ({
    arrets: { type: new GraphQLList(StationType) },
    trips: { type: new GraphQLList(TripType) },
    prevTime: { type: GraphQLFloat },
    nextTime: { type: GraphQLFloat }
  })
});

const TimeSheetType = new GraphQLObjectType({
  name: "TimeSheet",
  fields: () => ({
    0: { type: SheetType },
    1: { type: SheetType }
  })
});

// Root Query
`{
    timeSheet(route: "SEM:C") {
        arrets {
            stopId
            stopName
            lat
            lon
        }
        trips {
            tripId
            pickupType
        }
        prevTime
        nextTime
    }
}`;

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: () => ({
    timeSheet: {
      type: SheetType,
      args: {
        route: { type: GraphQLString }
      },
      resolve(parent, args) {
        return axios
          .get(
            `https://data.metromobilite.fr/api/ficheHoraires/json?route=${
              args.route
            }&time=${new Date().getTime()}`
          )
          .then(res => {
            return res.data[0];
          });
      }
    }
  })
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
