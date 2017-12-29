import { Router } from 'express';
import item from '../../models/item';
import token from '../../middleware/token';

export default () => {
    let api = Router();
    api.get('/:productID', token, function(req, res) {
        let productID = req.params.productID;
        item.read(productID).then((result) => {
            res.json({Item: result[0].properties});
        }).catch((error) => {
            res.status(500).json(error);
        });
    });
    api.post('/search', function(req, res) {
        let name = req.body.name;
        item.find(name).then((result) => {
            res.json(result);
        }).catch((err) => {
            res.status(500).json(err);
        });
    });
    return api;
}
