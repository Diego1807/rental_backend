import db from '../../db';
import { Query } from 'neo4j-query-builder';
import item from '../Item';


export default class User{
  constructor(username, password, email, firstName, lastName, phoneNo, address) {
    this.username = username;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phoneNo = phoneNo;
    this.address = address;
  }
  create() {
    let query = new Query(db.getInstance());
    const label = 'User';
    const properties = { username: this.username, password: this.password, firstName: this.firstName, lastName: this.lastName, email: this.email , phoneNo: this.phoneNo, address: this.address};
    query.callReturn(query.createNode(label, properties));
    return query.runQuery().then(function (res) {
      return res;
    }).catch(function(err) {
      return err;
    });
  }
  static update(props, updatedProp) {
    let query = new Query(db.getInstance());
    const label = 'User';
    query.callReturn(query.update(query.matchNode(label, props), updatedProp));
    return query.runQuery().then(function (res) {
      return res;
    }).catch(function(err) {
      return err;
    });
  }
  //Add functionality of deleting services as well.
  static delete(username, token) {
    let query = new Query(db.getInstance());
    const label = 'User';
    const properties = {username: username, token: token};
    query.deleteNodes(query.matchNode(label, properties));
    return query.runQuery().then(function (res) {
      return res;
    }).catch(function(err) {
      return err;
    });
  }
  static read(username) {
    let query = new Query(db.getInstance());
    const label = 'User';
    const properties = {username: username};
    query.callReturn(query.matchNode(label, properties));
    return query.runQuery().then(function (res) {
      return res;
    }).catch(function(err) {
      return err;
    });
  }
  static login(username, password) {
    let query = new Query(db.getInstance());
    const label = 'User';
    const properties = {username: username, password: password};
    query.callReturn(query.matchNode(label, properties));
    return query.runQuery().then(function (res) {
      return res;
    }).catch(function(err) {
      return err;
    });
  }
  static logout(username, token) {
    let query = new Query(db.getInstance());
    const label = 'User';
    const properties = { username: username, token: token };
    query.callReturn(query.removeProperties(query.matchNode(label, properties), [['token']]));
    console.log(query.getQuery());
    return query.runQuery().then((res) => {
      return res;
    }).catch((err) => {
      return err;
    });
  }
  static checkToken(token) {
    let query = new Query(db.getInstance());
    const label = 'User';
    const properties = {token: token};
    query.callReturn(query.matchNode(label, properties));
    return query.runQuery().then((res) => {
      return res;
    }).catch((err) => {
      return false;
    });
  }
  static lends(username, name, description, price) {
    let Item = new item(name, description, price);
    return Item.create(username).then((res) => {
      return {success: 'Item lended successfully'};
    }).catch((err) => {
      return err;
    });      
  }
  static borrows(username, productID) {
    return item.borrow(username, productID).then((res) => {
      return res;
    }).catch((error) => {
      return error;
    });
  }
  static returnItem(username, productID) {
    let query = new Query(db.getInstance());
    const label = 'User';
    const properties = {username: username};
    query.callReturn(query.getRelatedNodes(query.matchNode(label, properties), ['lends']));
    return query.runQuery().then((res) => {
      let items = [];
      for(var i=0;i<res.length;i++) {
        items.push(res[i].properties.productID);
      }
      if(items.indexOf(productID) > -1) {
        item.delete(productID).then((res) => {
          return 'Item returned successfully';
        }).catch((err) => {
          return err;
        });
      } else {
        return 'Unable to find item';
      }
    }).catch((err) => {
      return err;
    });
  }
  static updateItem(username, productID, updatedProps) {
    let query = new Query(db.getInstance());
    let labels = ['User', 'Item'];
    let propertiesList = [{username: username}, {productID: productID}];
    query.callReturn(query.matchRelationships(query.matchNodes(labels, propertiesList), ['lends'], ['>']));
    return query.runQuery().then((res) => {
      let User = res[0].properties;
      let Item = res[1].properties;
      return item.update(Item, updatedProps).then((res) => {
        return {Item: res[0].properties};
      }).catch((err) => {
        return 'Not Found';
      });
    }).catch((error) => {
      return error;
    })
  }
  static getItems(username, token) {
    let query = new Query(db.getInstance());
    const label = 'User';
    const properties = {username: username, token: token};
    query.callReturn(query.getRelatedNodes(query.matchNode(label, properties), ['lends']));
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