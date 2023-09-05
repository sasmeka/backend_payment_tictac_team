const { uploader } = require('cloudinary').v2
const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: 'deaia7unw',
    api_key: '531495937919258',
    api_secret: '65vXPn4FpOdSRbn4G35QdM05U6M'
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