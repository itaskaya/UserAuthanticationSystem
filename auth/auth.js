const bcrypt = require("bcryptjs/dist/bcrypt")
const User = require("../model/user")


exports.register = async (req, res, next) => {
    const { username, password } = req.body
    if (password.length < 6) {
        return res.status(400).json({ message: "Password less than 6 characters"})
    }
    bcrypt.hash(password, 10).then(async (hash) => {
        await User.create({
            username,
            password: hash,
        }).then(user => {
            const maxAge = 3 * 60 * 60 // saniye
            const token = jwt.sign(
                { id: user._id, username, role: user.role },
                jwtSecret,
                {
                    expiresIn: macAge,
                }
            )
            res.cookie("jwt", token, {
                httpOnly: true,
                maxAge: maxAge * 1000 // milisaniye
            })
            res.status(201).json({
                message: "User successfully created",
                user: user._id,
            })
        }) .catch ((error) =>
            res.status(400).json({
            message: "User not successfully created",
            error: error.message,
            })
        )
    })
}

exports.login = async (req, res, next) => {
    const { username, password } = req.body
    // Burada if bloğu gereksiz olabilir kontrol et
    if (!username || !password) {
        return res.status(400).json({
            message: "Kullanıcı adı veya şifre bulunamadı.",
        })
    }
    try {
        const user = await User.findOne({ username })
        if (!user) {
            res.status(401).json({
                message: "Kullanıcı girişi başarısız",
                error: "Kullanıcı bulunamadı",
            })
        } else {
            bcrypt.compare(password, user.password).then(function (result) {
                if (result) {
                    const maxAge = 3 * 60 * 60
                    const token = jwt.sign(
                        { id: user._id, username, role: user.role },
                        jwtSecret,
                        {
                            expiresIn: maxAge,
                        }
                    )
                    res.cookie("jwt", token, {
                        httpOnly: true,
                        maxAge: maxAge * 1000
                    })
                    res.status(201).json({
                        message: "Kullanıcı girişi başarılı",
                        user: user._id
                    })
                } else {
                    res.status(400).json({
                        message: "Kullanıcı girişi başarısız"
                    })
                }
            })
        }
    } catch (error) {
        res.status(400).json({
            message: "Bir hata oluştu.",
            error: error.message,
        })
    }
}

exports.update = async (req, res, next) => {
    const { role, id } = req.body
    if (role && id) {
        if (role === "admin") {
            await User.findById(id)
                .then((user) => {
                    if (user.role !== "admin") {
                        user.role = role;
                        user.save((err) => {
                            if (err) {
                                res
                                    .status("400")
                                    .json({
                                        message: "Bir hata oluştu",
                                        error: err.message
                                    })
                                process.exit(1)
                            }
                            res.status("201").json({
                                message: "Güncelleme başarılı",
                                user,
                            })
                        })
                    } else {
                        res.status(400).json({
                            message: "Kullanıcı zaten Admin"
                        })
                    }
                })
                .catch((error) => {
                    res
                        .status(400)
                        .json({
                            message: "Bir hata oluştu",
                            error: error.message
                        })
                })
        } else {
            res.status(400).json({
                message: "Role is not admin",
            })
        }
    } else {
        res.status(400).json({
            message: "Role or Id not present"
        })
    }
}

exports.deleteUser = async (req, res, next) => {
    const { id } = req.body
    await User.findById(id)
        .then(user => user.remove())
        .then(user =>
            res.status(201).json({
                message: "Kullanıcı kaydı başarıyla silindi",
                user
            })
        )
        .catch(error =>
            res
                .status(400)
                .json({
                    message: "Bir hata oluştu",
                    error: error.message
                })
        )
}