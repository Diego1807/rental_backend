import User from '../models/user';

export default function (req, res, next) {
    let token = req.header('token');
    User.checkToken(token).then((result) => {
        if(result.length == 0) {
            result.status(403).json({error: 'Error in token'});
        } else {
            next();
        }
    }).catch((error) => {
        res.status(500).json({error: 'Error in token'});
    });
}