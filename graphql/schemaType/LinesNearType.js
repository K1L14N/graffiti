const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLList
} = require("graphql");

// Station near a location within a distance with(out) details (details is useless since it render a different format)
// @example: https://data.metromobilite.fr/api/linesNear/json?x=5.7346176&y=45.1850581&dist=400&details=true
// @graphql:
`{
    linesNear(lon: 5.70893, lat: 45.17557, dist: 400) {
        id
        name
        lon
        lat
        lines
    }
}`;

const LineType = new GraphQLObjectType({
  name: "Line",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    lon: { type: GraphQLFloat },
    lat: { type: GraphQLFloat },
    lines: { type: new GraphQLList(GraphQLString) }
  })
});

module.exports = LineType;
