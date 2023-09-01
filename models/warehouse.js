const db = require('../connector/mysql');

class Warehouse {
    constructor(id, name, address, totalAreaVolume) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.totalAreaVolume = totalAreaVolume;
    }

    // CRUD operations will be added here in the future
}

module.exports = Warehouse;
