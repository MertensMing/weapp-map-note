const AV = require('../lib/av-weapp-min');

class Collection extends AV.Object {}

AV.Object.register(Collection, 'Collection');

module.exports = Collection;
