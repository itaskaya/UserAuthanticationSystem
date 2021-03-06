const jwt = require("jsonwebtoken")
const User = require("../model/user")

const jwtSecret = "51f0e4ab6f1a7555e21550596e6b658159838601c4fdd2f8e1a8043f4c70b0fdfa728a"

exports.adminAuth = (req, res, next) => {
    const token = req.cookies.jwt
    if (token) {
        jwt.verify(token, jwtSecret, (err, decodedToken) => {
            if (err) {
                return res.status(401).json({
                    message: "Yetkili değil"
                })
            } else {
                if (decodedToken.role !== "admin") {
                    return res.status(401).json({
                        message: "Yetkili değil"
                    })
                } else {
                    next()
                }
            }
        })
    } else {
        return res
            .status(401)
            .json({
                message: "Yetkili değil, token uygun değil"
            })
    }
}
exports.userAuth = (req, res, next) => {
    const token = req.cookies.jwt
    if (token) {
        jwt.verify(token, jwtSecret, (err, decodedToken) => {
            if (err) {
                return res.status(401).json({
                    message: "Yetkili değil"
                })
            } else {
                if (decodedToken.role !== "Basic") {
                    return res.status(401).json({
                        message: "Yetkili değil"
                    })
                } else {
                    next()
                }
            }
        })
    } else {
        return res
            .status(401)
            .json({
                message: "Yetkili değil, token uygun değil"
            })
    }
}
exports.getUsers = async (req, res, next) => {
    await User.find({

    }).then(users => {
        const userFunction = users.map(user => {
            const container = {}
            container.username = user.username
            container.role = user.role
            return container
        })
        res.status(200).json({ user: userFunction })
    }).catch (err => res.status(401).json({
        message: "Başarısız",
        error: err.message
    }))
}