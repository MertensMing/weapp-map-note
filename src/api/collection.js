const AV = require('../lib/av-weapp-min');
const Collection = require('../model/Collection');
const _ = require('../lib/underscore-min');

function createCollection(payload) {
  const data = _.pick(payload, 'name', 'remark', 'address', 'locationName', 'phone');
  const where = new AV.GeoPoint(payload.latitude, payload.longitude);
  const user = AV.User.current();
  const collection = new Collection();
  collection.addUnique('subscriber', user);
  collection.set({
    ...data,
    where,
    creator: user
  });
  return collection.save();
}

function updateCollection(payload) {
  const data = _.pick(payload.data, 'name', 'remark', 'address', 'locationName', 'phone');
  const where = new AV.GeoPoint(payload.data.latitude, payload.data.longitude);
  const user = AV.User.current();
  const collection = AV.Object.createWithoutData('Collection', payload.id);
  collection.addUnique('subscriber', user);
  collection.set({
    ...data,
    where,
  });
  return collection.save();
}

function getCollection(payload) {
  const { id } = payload;
  const query = new AV.Query(Collection);
  return query.get(id)
    .then(res => {
      let data = res.toJSON();
      data = {
        ...data,
        ...data.where,
      };
      data = _.omit(data, 'where', 'updatedAt', 'objectId', '__type', 'createdAt');
      return data;
    });
}

function getCollectionList() {
  const query = new AV.Query(Collection);
  const user = AV.User.current();
  query.containsAll('subscriber', [user]);
  return query.find()
    .then(res => {
      return res.map(item => item.toJSON());
    });
}

function unsubscribe(payload) {
  const user = AV.User.current();
  const collection = AV.Object.createWithoutData('Collection', payload.id);
  collection.remove('subscriber', user);
  return collection.save();
}

function subscribe(payload) {
  const user = AV.User.current();
  const collection = AV.Object.createWithoutData('Collection', payload.id);
  collection.addUnique('subscriber', user);
  return collection.save();
}

module.exports = {
  createCollection,
  getCollection,
  updateCollection,
  getCollectionList,
  unsubscribe,
  subscribe,
};
