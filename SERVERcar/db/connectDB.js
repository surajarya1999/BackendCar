const mongoose = require('mongoose')

const connectdb = () => {
    return mongoose.connect(process.env.MONGO_live_URl)
        .then(() => {
            console.log('DataBase connected :)')
        })
        .catch((error) => {
            console.log(error)
        })
}
module.exports = connectdb