const gStorage = require('./bucket')
const uuid = require('uuid')
const sharp = require('sharp')

exports.getDetails = (image) => {
    let [header, img] = image.split(','),
    mimeType = '.' + header.split(';')[0].split('/')[1]
    return [uuid.v4(), mimeType, img]
}

exports.uploadTo = (image, folder, fileName, mimeType) => {
    return new Promise((resolve, reject) => {

        sharp(Buffer.from(image, 'base64'))
            .resize(300, 300, {
                fit: 'inside'
            })
            .toBuffer(function(err, data) { 
                if (err) reject(err)
                return gStorage.uploadImage(process.env.STORAGE_BUCKET_URI, `${folder}/${fileName}`, data, mimeType)
                    .then(url => resolve(url))
                    .catch(err => reject(err))
            })
    })
}

// exports.uploadToUserSpace = (req, res) => {
//     let [fileName, mimeType, image] = getDetails(req.body.image)
//     return uploadTo(image, 'blog', fileName, mimeType)
//         .then((url) => res.status(200).send({ url }))
//         .catch(err => res.status(500).send(err))
// }


exports.uploadToUserSpace = (req, res) => {
    const {user} = res.locals

    if (!user) return res.status(403).send('Forbidden')

    let [, mimeType, image] = getDetails(req.body.image)

    return uploadTo(image, 'users', user.uid, mimeType)
        .then(url => knex('users').where({ id: user.uid }).update({ image: url }))
        .then(rows => { if (!rows[0]) return res.status('201').send('Updated')})
        .catch(err => deleteFile(err ,'users', user.uid, mimeType))
        .then(() => res.status('File Deleted, image not saved'))
}

// exports.uploadCompanyImage = (req, res) => {
//     if (!res.locals.user) return res.status(403).send('Forbidden')
//     let [fileName, mimeType, image] = getDetails(req.body.image)
//     return uploadTo(image, 'companies', fileName, mimeType)
//         .then(url => knex('users').where({ id: res.locals.user.uid }).update({ company_image: url }))
//         .then(rows => { if (!rows[0]) return res.status('201').send('Updated')})
//         .catch(err => deleteFile(err ,'companies', fileName, mimeType))
//         .then(() => res.status('File Deleted, image not saved'))
// }

// exports.uploadJobPostImage = (req, res) => {
//     if (!res.locals.user) return res.status(403).send('Forbidden')
//     let [fileName, mimeType, image] = getDetails(req.body.image)
//     return uploadTo(image, 'jobPosts', fileName, mimeType)
//         .then(url => knex('job_postings').where({ id: res.locals.user.uid }).update({ image: url }))
//         .then(rows => { if (!rows[0]) return res.status('201').send('Updated')})
//         .catch(err => deleteFile(err ,'jobPosts', fileName, mimeType))
//         .then(() => res.status('File Deleted, image not saved'))
// }