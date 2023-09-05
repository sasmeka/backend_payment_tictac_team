const { uploader } = require('cloudinary').v2
const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: process.env.CLNAME,
    api_key: process.env.CLKEY,
    api_secret: process.env.CLSECRET
});

async function upload(pathFile) {
    try {
        let result = await uploader.upload(pathFile, {
            folder: 'assets',
            use_filename: true
        })
        return result.url
    } catch (error) {
        return error
    }
}

module.exports = upload