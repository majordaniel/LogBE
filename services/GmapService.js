let distance = require('google-distance-matrix');
distance.key(process.env.GMAP_API_KEY);
distance.mode('driving');

exports.getDistance = async function (origin, destination) {
    return new Promise((resolve, reject) => {
        distance.matrix(origin, destination, function (err, distances) {
            if (err) {
                reject(err);
            } else {
                resolve(distances.rows[0].elements[0]);
            }
        });
    });
}