const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLList
} = require("graphql");

// Time sheet
// @example: https://data.metromobilite.fr/api/ficheHoraires/json?route=SEM:C&time=1544217497886
// @graphql:
`{
  timeSheet(route: "SEM:B") {
    zero {
      arrets {
          stopId
          trips
          stopName
          lat
          lon
          parentStation {
            id
            code
            city
            name
            lat
            lon
          }
      }
      prevTime
      nextTime
    }
  }
}`;

const ParentStationType = new GraphQLObjectType({
  name: "ParentStation",
  fields: () => ({
    id: { type: GraphQLString },
    code: { type: GraphQLString },
    city: { type: GraphQLString },
    name: { type: GraphQLString },
    lat: { type: GraphQLFloat },
    lon: { type: GraphQLFloat }
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

const TripType = new GraphQLObjectType({
  name: "Trip",
  fields: () => ({
    tripId: { type: GraphQLString },
    pickupType: { type: GraphQLString }
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
    zero: {
      type: SheetType,
      resolve: parent => parent["0"]
    },
    one: {
      type: SheetType,
      resolve: parent => parent["1"]
    }
  })
});

module.exports = TimeSheetType;
