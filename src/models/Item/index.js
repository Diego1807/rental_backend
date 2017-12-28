import db from '../../db';
import { Query } from 'neo4j-query-builder';
import randomstring from 'randomstring';


export default class item {
  constructor(name, description, price) {
    this.productID = randomstring.generate({length: 10});
    this.name = name;
    this.description = description;
    this.price = price;
  }
  create(lender) {
    let query = new Query(db.getInstance());
    const label = 'Item';
    const properties = {productID: this.productID, name: this.name, description: this.description, price: this.price};
    const label1 = 'User';
    const properties1 = {username: lender};
    query.callReturn(query.createNode(label, properties));
    return query.runQuery().then((res) => {
      let query1 = new Query(db.getInstance());
      query1.callReturn(query1.createRelationships(query1.matchNodes([label, label1], [properties, properties1]), ['lends'], ['<']));
      return query1.runQuery().then((res) => {
        return res;
      }).catch((err) => {
        return err;
      });
    }).catch((err) => {
      return err;
    });
  }
  static update(props, updatedProp) {
    let query = new Query(db.getInstance());
    const label = 'Item';
    query.callReturn(query.update(query.matchNode(label, props), updatedProp));
    return query.runQuery().then(function (res) {
      return res;
    }).catch(function(err) {
      return err;
    });
  }
  static read(productID) {
    let query = new Query(db.getInstance());
    const label = 'Item';
    const properties = {productID: productID};
    query.callReturn(query.matchNode(label, properties));
    return query.runQuery().then(function (res) {
      return res;
    }).catch(function(err) {
      return err;
    });
  }
  static delete(productID) {
    let query = new Query(db.getInstance());
    const label = 'Item';
    const properties = {productID: productID};
    query.deleteNodes(query.matchNode(label, properties));
    return query.runQuery().then(function (res) {
      return res;
    }).catch(function(err) {
      return err;
    });
  }
  static borrow(username, productID) {
    let query = new Query(db.getInstance());
    const labels = ['User', 'Item'];
    const propertiesList = [{username: username}, {productID: productID}];
    query.createRelationships(query.matchNodes(labels, propertiesList), ['borrows'],['>'])
    return query.runQuery().then((res) => {      
      return res;
    }).catch((err) => {
      return err;
    });
  }
  static find(name) {
    let query = new Query(db.getInstance());
    const labels = ['Item'];
    const propertiesList = [{name: '.*' + name + '.*'}];
    query.callReturn(query.matchWhere(labels, propertiesList, ['=~'])); //Condition extender list must match the sub string to all names;
    return query.runQuery().then((res) => {
      let result = [];
      for(var i=0;i<res.length;i++) {
        result.push({Item: res[i].properties});
      }
      return result;
    }).catch((err) => {
      return err;
    });
  }
}