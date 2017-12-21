import { Router } from 'express';
import User from '../../models/user';
import { diff } from 'deep-diff';
import _ from 'lodash';
import randomstring from 'randomstring';
import token from '../../middleware/token';
import userSchema from '../../schemas/userSchema';
import schemaValidator from '../../middleware/schemaValidator';


export default () => {
    let api = Router();
    api.post('/login', function (req, res, next) { 
      schemaValidator(req, res, next, userSchema.login);
    }, (req,res) => {
        let username = req.body.username;
        let password = req.body.password;
        User.login(username, password).then((result) => {
          if(result.length != 0) {
            let token = randomstring.generate(15);
            User.update({username: username}, [{token: token}]).then((result) => {
              delete result[0].properties.password;
              res.json({User: result[0].properties});
            }).catch((error) => {
              res.status(500).json({error: 'Unable to create token'});
            });
          } else {
            res.status(404).json({error: 'Unable to login'})
          }
        }).catch((error) => {
            res.status(404).json({error: error});
        });
    });
    api.get('/:username/logout', token, (req, res) => {
      let username = req.params.username;
      let token = req.header('token');
      User.logout(username, token).then((result) => {
        res.json({Success: 'Logged out'});
      }).catch((error) => {
        res.status(500).json({error: error});
      });
    });
    api.post('/', function (req, res, next) { 
      schemaValidator(req, res, next, userSchema.create);
    }, (req,res) => {
        let username = req.body.username;
        let password = req.body.password;
        let firstName = req.body.firstName;
        let lastName = req.body.lastName;
        let phoneNo = req.body.phoneNo;
        let email = req.body.email;
        let address = req.body.address;
        let user = new User(username, password, email, firstName, lastName, phoneNo, address);
        user.create().then((result) => {
            result = {User: result[0].properties};
            res.json(result);
        }).catch((error) => {
            res.status(500).json({error: error});
        });
    });
    api.put('/:username', token, function (req, res, next) { 
      schemaValidator(req, res, next, userSchema.update);
    }, (req,res) => {
        let username = req.params.username;
        let token = req.header('token');
        let updatedProps = [req.body]; //Validate and get variable
        User.update({username: username}, updatedProps).then((result) => {
          res.json({User: result[0].properties});
        }).catch((err) => {
          if(err.toString().substr(48, 57) == 'undefined') {
            res.status(500).json({error: 'User not found'})
          } else {
            res.status(500).json({error: err.toString()});
          }
        });
    });
    api.delete('/:username', token, (req,res) => {
        let username = req.params.username;
        let token = req.header('token');
        User.read(username).then((node) => {
          if(node.length != 0) {
            User.delete(username, token).then((result) => {
              res.status(200).json({success: 'Successfully deleted user'});
            }).catch((error) => {
              res.status(500).json({error: 'Unable to delete user'});
            });
          } else {
            res.status(404).json({error: 'Unable to find user'});
          }
        }).catch((err) => {
          res.status(404).json({error: 'Unable to find user'});
        });
    });
    api.post('/:username/lends', token, (req, res) => {
        let username = req.params.username;
        let name = req.body.name;
        let description = req.body.description;
        let price = req.body.price;
        User.lends(username, name, description, price).then((result) => {
          res.json(result);
        }).catch((err) => {
          res.json(err);
        });
    });
    api.get('/:username/borrows/:productID', token, (req, res) => {
        let username = req.params.username;
        let productID = req.params.productID;
        User.borrows(username, productID).then((result) => {
          res.json({success: "Item borrowed successfully"});
        }).catch((error) => {
          res.json({error: error});
        });
    });
    api.put('/:username/updateItem/:productID', token, (req, res) => {
        let username = req.params.username;
        let productID = req.params.productID;
        let updateProps = [req.body];
        User.updateItem(username, productID, updateProps).then((result) => {
          res.json(result);
        }).catch((error) => {
          res.status(500).json(error);
        });
    });
    api.get('/:username/items', token, (req, res) => {
        let username = req.params.username;
        let token = req.header('token');
        User.getItems(username, token).then((result) => {
          res.json(result);
        }).catch((err) => {
          res.status(500).json(error);
        })
    });
    return api;
}  