const models = require('../../../db/models');
const { User, Company, Role, Trip, CompanyReview } = models;
const {getPagination, formatPagination} = require('../../../utils/helpers');
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

/**
 * create a company(logistic)
 * 
 * @param {Object} data 
 * @param {Integer} owner_id 
 */
exports.createCompany = async(data, owner_id) => {
    data.owner_id = owner_id;
    if (data.image) {
        let upload = await cloudinary.uploader
            .upload(data.image[0].path)
            .then(result => {
                return result;
            })
            .catch(err => {
                throw new Error(err.message);
            });
        data.image_url = upload.secure_url
    }
    return await Company.create({...data});
}

/**
 * 
 * @param {string} company_id 
 */
exports.getRiders = async(id) => {
    const role = await Role.findOne({ where: { name: 'rider' } });
    const company = await Company.findOne({where: {id}});
    let user = await company.getUsers({where: {
        role_id: role.id
    }});
    return user.map(user => user.toJSON());
}


/**
 * 
 * @param {*} page 
 * @param {*} perPage 
 * @returns 
 */
exports.listCompanies = async(page=1, perPage=15, data={}) => {
    let searchData = {};
    if (data.name) {
        searchData = { ...searchData, 'name': {[Op.iLike]: `%${data.name}%`}};
    }
    if (data.rating) {
        searchData = { ...searchData, 'rating': data.rating }
    }
    if (data.address) {
        searchData = { ...searchData, 'address': {[Op.iLike]: `%${data.address}%`}}
    }


    const query = {
        where: searchData,

    };

    let {limit, offset} = getPagination(page, perPage)
    let companies =  await Company.findAndCountAll({
        ...query,
        limit,
        offset,
    })
    let tasks = [];
    
    companies.rows.map((company) => {
        tasks.push(CompanyReview.count({
            where: {
                company_id: company.dataValues.id
            }
        }).then((reviews) => {
        return {...company.dataValues, reviewsCount: reviews};
        }));
    });
    companies.rows = await Promise.all(tasks).then((res) => {
        return res;
    });
    return {companies: companies.rows,...formatPagination(companies, perPage, page)};    
}

/**
 * 
 * @param {*} id 
 * @returns 
 */
exports.getCompany = async(id) => {
    let company = await Company.findOne({where: {id}});
    if (company === null) {
        throw new Error('Company does not exist');
    }

    return company;
}

/**
 * 
 * @param {*} data 
 * @param {*} id 
 * @returns 
 */
exports.updateCompany = async(data, id) => {
    if (data.image) {
        let upload = await cloudinary.uploader
            .upload(data.image[0].path)
            .then(result => {
                return result;
            })
            .catch(err => {
                throw new Error(err.message);
            });
        data.image_url = upload.secure_url
    }
    return await Company.update({ ...data }, { where: { id } });
}

/**
 * 
 * @param {*} id 
 * @returns 
 */
 exports.deleteCompany = async(id) => {
    const company = await Company.findOne({where: { id }});
    if (company === null) {
        throw new Error('Company does not exist');
    }
    const users = await company.getUsers();
    users.map(async (user) => {
        await user.destroy();
    });
    await company.destroy();
    return true;
}

exports.getCompanyReviews = async(id, page=1, perPage=15) => {
    let {limit, offset} = getPagination(page, perPage)
    let reviews =  await CompanyReview.findAndCountAll({
        where: {
            company_id: id
        },
        limit,
        offset,
    });

    return {reviews: reviews.rows,...formatPagination(reviews, perPage, page)};
}

exports.getCompanyDetail = async(id) => {
    let rides = await Trip.count({
        where: {
            company_id: id
        }
    });
    let reviews = await CompanyReview.count({
        where: {
            company_id: id
        }
    });
    const role = await Role.findOne({ where: { name: 'rider' } });
    const company = await Company.findByPk(id);
    let riders = await User.count({where: {
        company_id: id,
        role_id: role.id
    }});
    let carrier = await User.count({
        distinct: true,
        col: 'vehicle_id',
        where: {
            company_id: id,
            role_id: role.id
        }
    });
    return {
        'company': company,
        'riders' : riders,
        'rider' : rides,
        'carriers': carrier,
        'reviews': reviews
    }
}