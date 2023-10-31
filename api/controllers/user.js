exports.user_sign_up = (req, res, next) => {
    User.findOne({ email: req.body.email })
      .exec()
      .then((user) => {
        if (user) {
          return res.status(409).json({
            message: "email already exist",
          });
        } else {
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
              return res.status(500).json({
                error: err,
              });
            } else {
              const user = new User({
                _id: new mongoose.Types.ObjectId(),
                email: req.body.email,
                password: hash,
              });
  
              user
                .save()
                .then((result) => {
                  console.log(result);
                  res.status(201).json({
                    message: "User created successfully",
                    user: result,
                  });
                })
                .catch((err) => {
                  console.log(err);
                  res.status(500).json({
                    error: err,
                  });
                });
            }
          });
        }
      })
      .catch();
  }