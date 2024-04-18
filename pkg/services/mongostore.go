package services

import (
	"context"
	"fmt"
	"main/api/fueldata"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type MongoStore struct {
	database string
	client   *mongo.Client
}

const (
	collection = "fuel_data"
)

func NewMongoConnection(uri string, db string) (*MongoStore, error) {
	// TODO: sort out contexts
	options := options.Client().ApplyURI(uri)
	client, err := mongo.Connect(context.TODO(), options)
	if err != nil {
		return nil, err
	}

	c := &MongoStore{
		database: db,
		client:   client,
	}

	return c, nil
}

func (m *MongoStore) QueryArea(lat, long float64, distanceMiles int) ([]fueldata.StationItem, error) {
	coll := m.client.Database(m.database).Collection(collection)

	// get data
	// TODO: sort context todo
	filter := makeAggregatePipeline(lat, long, int(milesToMetres(distanceMiles)))
	// filter := makeFilter(lat, long, milesToRadians(float64(distanceMiles)))
	cursor, err := coll.Aggregate(context.TODO(), filter)
	if err != nil {
		return nil, err
	}

	// decode results into array data
	// TODO: is there a mroe effecient way of doing this?
	var results []fueldata.StationItem
	err = cursor.All(context.TODO(), &results)
	if err != nil {
		return nil, err
	}

	return results, nil
}

// TODO: dont write if the values already exist
func (m *MongoStore) Write(data []*fueldata.StationItem) (int, error) {
	docs := make([]interface{}, len(data))
	for i, d := range data {
		docs[i] = &d
	}

	coll := m.client.Database(m.database).Collection(collection)
	res, err := coll.InsertMany(context.TODO(), docs)
	if err != nil {
		return 0, err
	}
	return len(res.InsertedIDs), nil
}

func milesToRadians(miles float64) float64 {
	return miles / 3963.2
}

func milesToMetres(miles int) float64 {
	return float64(miles) * 1609.344
}

func makeFilter(lat, long, distRads float64) bson.D {
	return bson.D{{
		Key: "location", Value: bson.D{{
			Key: "$geoWithin", Value: bson.D{{
				Key: "$centerSphere", Value: bson.A{
					bson.A{long, lat},
					distRads,
				},
			}},
		}},
	}}
}

/*
AGGREGATE DATA

[
	{
		$geoNear: {
			key: 'location',
			near: {
				type: 'Point',
				coordinates: [parseFloat(longitude), parseFloat(latitude)]
			},
			distanceField: 'distance',
			maxDistance: milesToMeters(distance),
			spherical: true
		}
	},
	{ $sort: { createdat: -1 } },
	{
		$group: {
			_id: '$siteid',
			records: { $push: '$$ROOT' }
		}
	},
	{
		$replaceRoot: {
			newRoot: { $first: '$records' }
		}
	}
	],

	{ maxTimeMS: 60000, allowDiskUse: true }
*/

func makeAggregatePipeline(lat, long float64, distMetres int) bson.A {
	fmt.Println(lat, long, distMetres)
	return bson.A{
		bson.D{{
			Key: "$geoNear", Value: bson.D{
				{Key: "key", Value: "location"},
				{Key: "near", Value: bson.D{
					{Key: "type", Value: "Point"},
					{Key: "coordinates", Value: bson.A{long, lat}},
				}},
				{Key: "distanceField", Value: "distance"},
				{Key: "maxDistance", Value: distMetres},
				{Key: "spherical", Value: true},
			},
		}},
		bson.D{{
			Key: "$sort", Value: bson.D{{
				Key: "createdat", Value: -1,
			}},
		}},
		bson.D{{
			Key: "$group", Value: bson.D{
				{Key: "_id", Value: "$siteid"},
				{Key: "records", Value: bson.D{
					{Key: "$push", Value: "$$ROOT"},
				}},
			},
		}},
		bson.D{{
			Key: "$replaceRoot", Value: bson.D{{
				Key: "newRoot", Value: bson.D{{
					Key: "$first", Value: "$records",
				}},
			}},
		}},
	}
}