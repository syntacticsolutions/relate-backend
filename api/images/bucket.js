const { Storage } = require('@google-cloud/storage');

// Creates a client
const storage = new Storage();

exports.listImages = async (bucketName, folder) => {

    try {
        let [files] = await storage
            .bucket(bucketName)
            .getFiles({
                prefix: `${folder}/`,
                delimiter: '/'
            })
        return files.map(file => ({ url: `https://storage.cloud.google.com/${bucketName}/${file.name}`}))
    } catch (err) {
        Promise.reject(err)
    }
}

exports.uploadImage = (bucketName, fileName, imageBuffer, mimeType) => {
    return new Promise((resolve, reject) => {

        let bucket = storage.bucket(bucketName);

        let file = bucket.file(`${fileName}.${mimeType}`);
        file.save(imageBuffer,
            {
                metadata: { contentType: `image/${mimeType}` },
            },
            ((error) => {
                error ? reject(error) : resolve(`https://storage.cloud.google.com/${bucketName}/${fileName}.${mimeType}`)
            })
        );
    })
}