'use strict';

import Database from '../db';

class DevicesStorage extends Database {
  constructor () {
    super('devices');
  }

  findDevice (id) {
    return super.db.findOneAsync({ _id: id });
  }

  insertDevice (options) {
    return super.db.insertAsync({
      _id: options.id,
      state: options.state,
      nodes: options.nodes
    });
  }

  updateDeviceState (options) {
    let changes = {};
    changes[`state.${options.name}`] = options.value; // {`${test}`: true} is not doable
    return super.db.updateAsync({ _id: options.id }, { $set: changes });
  }

  async updateNodeState (options) {
    let doc = await super.findDevice(options.deviceId);
    let nodeIndexInDb;
    doc.nodes.every((iNode, index) => {
      if (iNode.id === options.nodeId) {
        nodeIndexInDb = index;
        return false;
      }
      return true;
    });
    let changes = {};
    changes[`nodes.${nodeIndexInDb}.state.${options.name}`] = options.value;
    return super.db.updateAsync({ _id: options.deviceId }, { $set: changes });
  }
}

export default new DevicesStorage();