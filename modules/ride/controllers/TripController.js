const TripRepository = require('../repositories/TripRepository');
const LocationRepository = require('../repositories/LocationRepository');
const NotificationRepository = require('../../auth/repositories/NotificationRepository');
const TransactionRepository = require('../../transaction/repositories/transactionRepository');
const CardRepository = require('../../transaction/repositories/cardRepository');
const paystackService = require('../../../services/PaystackService');

const { successResponse,
    generateToken,
    errorResponse
} = require('../../../utils/helpers');
const { toLower } = require('lodash');


exports.tripRequest = async function(req, res) {
    let data = req.body;
    const {id} = req.user;
    const { image } = req.files;
    data.image = image;
    try {
        data.origin = JSON.parse(JSON.stringify(data.origin));
        data.destination = JSON.parse(JSON.stringify(data.destination));

        if (data.origin.saveAddress) {
            await LocationRepository.addLocation(data.origin, id);
        }
        if (data.destination.saveAddress) {
            await LocationRepository.addLocation(data.destination, id);
        }
        const trip = await TripRepository.tripRequest(data, id);
        const socketIO = req.app.get('socketIo');

        socketIO.emit('trip_'+trip.id, trip.status);
        socketIO.emit('new_trip_'+trip.rider_id, trip);

        NotificationRepository.notify({
            title: 'New Ride Request',
            description: 'You have a new delivery request',
            user_id: data.rider_id
        });
        await NotificationRepository.tripNotification(req.user.id, trip.id, 
            'new trip request', 'You have a trip request');

        return successResponse(res, 201, 'successfully sent trip request', trip);
    } catch (error) {
        return errorResponse(res, 400, error.message, error);
    }
}

exports.getPastTrips = async (req, res) => {
    let {id} = req.user;
    const {perPage, page, status} = req.query;
    try {
        let data = {'user_id':id};
        if(status) {
            data = {...data, 'status': status}
        }
        const trips = await TripRepository.getTrips(data, page, perPage);
        return successResponse(res, 200, 'user trips', trips)
    } catch (error) {
        return errorResponse(res, 400, error.message, error);
    }
}

exports.userTrips = async function(req, res) {
    let {id} = req.params;
    const {perPage, page, status} = req.query;
    try {
        let data = {'user_id':id};
        if(status) {
            data = {...data, 'status': status}
        }
        const trips = await TripRepository.getTrips(data, page, perPage);
        return successResponse(res, 200, 'user trips', trips)
    } catch (error) {
        return errorResponse(res, 400, error.message, error);
    }
}

exports.getCompanyTrips = async function (req, res) {
    let {id} = req.params;
    const {perPage, page, status} = req.query;
    try {
        let data = {company_id:id};
        if(status) {
            data = {...data, status: status}
        }
        const trips = await TripRepository.getTrips(data, page, perPage);
        return successResponse(res, 200, 'company trips', trips)
    } catch (error) {
        return errorResponse(res, 400, error.message, error);
    }
}

exports.getTrip = async function (req, res) {
    let {id} = req.params;

    try {
        const trip = await TripRepository.getTrip(id);
        return successResponse(res, 200, 'company trips', trip)
    } catch (error) {
        return errorResponse(res, 400, error.message, error);
    }
}


exports.getTripByInvoice = async function (req, res) {
    let {id} = req.params;

    try {
        const trip = await TripRepository.getTripByInvoice(id);
        return successResponse(res, 200, 'company trips', trip)
    } catch (error) {
        return errorResponse(res, 400, error.message, error);
    }
}

exports.updateTrip = async function (req, res) {
    let {id} = req.params;
    let data = req.body;
    try {
        const trip = await TripRepository.updateTrip(data, id)
        if(!trip){
            throw new Error('Error updating trip');
        }
        
        if(data.status) {
            let title, message;
            switch (toLower(data.status)) {
                case 'accepted':
                    title = 'Trip Accepted';
                    message = 'Your Trip request has been accepted by a rider';
                    break;
                case 'rejected':
                    title = 'Trip Rejected';
                    message = 'Your Trip request has been rejected by rider';
                    break;

                case 'cancelled':
                    title = 'Trip Cancelled';
                    message = 'Trip has been cancelled';
                    break;
                case 'in_transit':
                    title = 'Rider In Transit';
                    message = 'Rider in Transit';
                    break;
                case 'en_route':
                    title = 'Rider is Enroute';
                    message = 'Rider is on the way to pick up package';
                    break;
                case 'delivered':
                    title = 'Package Delivered';
                    message = 'Rider has arrived at destination and package delivered';
                    break;
                case 'completed':
                    title = 'Trip Completed';
                    message = 'Trip Completed';
                    break;
                default:
                    break;
            }

            const socketIO = req.app.get('socketIo');
            socketIO.emit('trip_'+id, {title, message});
            await NotificationRepository.tripNotification(req.user.id, id, 
                title, message);
        }
        const updated = await TripRepository.getTrip(id);
        return successResponse(res, 200,  'trip updated',  updated)
    } catch (error) {
        return errorResponse(res, 400, error.message, error);
    }
}

exports.requestPayment = async function(req, res){
    let {id} = req.params;
    
    try {
        const trip = await TripRepository.getTrip(id);

        if(trip && !trip.isPaid) {
            if (trip.payment_method === 'cash') {
                return successResponse(res, 200, 'cash payment, rider has to confirm payment', trip)
            }
            const userChargeable = await CardRepository.getChargeableCard(req.user.id);
            const transaction = await TransactionRepository.logTransaction(
                req.user.id,
                trip.amount,
                'trip payment',
                null,
                trip.id
            );
            let user_email = req.user.email ? req.user.email: 'admin.izigo.ng';
            const payment = await paystackService.chargeCustomer(trip.amount, 
                userChargeable.authorization_code,
                user_email
            );
            if(payment['status']) {
                await TripRepository.updateTrip({
                    isPaid: true
                }, trip.id)
                await TransactionRepository.updateTransaction(transaction.id, {
                    is_paid: true,
                    status: 'success',
                    response: JSON.stringify(payment['data'])
                })
                const title = "Payment Complete";
                const message = "Trip has been paid";
        
                const socketIO = req.app.get('socketIo');
                    socketIO.emit('trip_'+id, {title, message});
                    await NotificationRepository.tripNotification(req.user.id, id, 
                        title, message);
                return successResponse(res, 200, 'card transaction completed', trip)
            } else {
                return errorResponse(res, 400, "Issues Charging Card");
            }
        }
    } catch (error) {
        return errorResponse(res, 400, error.message);
    }
    
}

exports.markAsPaid = async(req, res) => {
    let {id} = req.params;

    try {
        const trip = await TripRepository.getTrip(id);
        await TripRepository.updateTrip({
            isPaid: true
        }, trip.id);
        const title = "Payment Complete";
        const message = "Trip has been marked as paid";

        const socketIO = req.app.get('socketIo');
            socketIO.emit('trip_'+id, {title, message});
            await NotificationRepository.tripNotification(req.user.id, id, 
                title, message);
        return successResponse(res, 200, 'Trip marked as Paid');
    } catch (error) {
        return errorResponse(res, 400, error.message, error);
    }
}