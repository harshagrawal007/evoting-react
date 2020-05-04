const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

var otp;
const high = 999999;
const low = 111111;
var email;
class Router {
    constructor(app,db){
        this.login(app,db);
        this.isLoggedIn(app,db);
        this.otpPost(app,db);
        this.registerPost(app,db);
        this.voterInfoPost(app,db);
        this.getVoterId(app,db);
        this.candidateList(app,db);
        this.candidatePost(app,db);
        this.candidateMaxId(app,db);
    }

    registerPost(app,db)
    {
        app.post('/registerpost', function(req, res) {
            email = req.body.email;
            // var salt = bcrypt.genSaltSync(10);
            // var encryptedpassword = bcrypt.hashSync(req.body.password, salt);
            // console.log(email,username, encryptedpassword, fname, lname, dob, gender);
            // var sql = `INSERT INTO users(username,gender, password, firstname, lastname, emailid, dob, emailverified) VALUES(?,?,?,?,?,?,?,?)`;
        
            otp = Math.floor(Math.random() * (high - low) + low);
            console.log(otp);
            const data = 'Please Verify your email with the the One-time password given: '.concat(otp.toString());
            console.log(data);
            var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'electronicballet@gmail.com',
                            pass: '25623360'
                        }
            });
        
            var mailOptions = {
                        from: 'electronicballet@gmail.com',
                        to: email,
                        subject: 'Email Verification - ElectronicBallet',
                        text: data
            };
            var successflag = true;
            transporter.sendMail(mailOptions, function(error, info) {
                        if (error) {
                            console.log(error);
                            successflag=false;
                        } else {
                            console.log('Email sent: ' + info.response);
                            res.json({
                                code: 200,
                                success:true,
                                msg: 'success'
                            });
                            console.log('Success sign-up');
    
                            return;    
                        }
            });
            if(successflag){
                res.json({
                    code: 200,
                    success:true,
                    msg: 'success'
                });
                console.log('Success sign-up');

                return;
            }else{
                res.json({
                    code: 400,
                    success:false,
                    msg: 'An error occured'
                });
                console.log('an error occured sign-up');
                return;
            }
        });
    }
    candidateList(app,db)
    {
        app.get('/candidatelist', function(req, res) {
            var sql = `SELECT * From Candidates`;
            db.query(sql, function (err, result, fields) {
                if (err) throw err;

                console.log("voter id: "+result);
                //var candidates=[];
                //candidates= result
                res.json({
                    code: 200,
                    success:true,
                    data: result
                });
                return;
            });


        });
    }
    candidateMaxId(app,db)
    {
        app.get('/candidateMaxId', function(req, res) {
            var sql = `Select max(candidate_id) as max_id
            from Candidates` ;
            db.query(sql, function (err, result, fields) {
                if (err) throw err;

                console.log("voter id: "+result);
                //var candidates=[];
                //candidates= result
                //var max= result;
                //console.log(max);
                res.json({
                    code: 200,
                    success:true,
                    data: result
                });
                return;
            });
        });
    }
    candidatePost(app,db)
    {
        app.post('/newcandidate', function(req, res) {
           // var candidate_id = req.body.candidate_id,
            var first_name= req.body.first_name;
            var last_name = req.body.last_name;
            var candidate_info= req.body.candidate_info;
            var candidate_desc= req.body.candidate_desc;
            var voteCount = req.body.voteCount;

            console.log (first_name, last_name, candidate_info, candidate_desc, voteCount);
            var sql = `INSERT INTO Candidates (first_name, last_name, candidate_info, candidate_desc, voteCount) VALUES(?,?,?,?,?)`;


            db.query(sql, [ first_name, last_name, candidate_info, candidate_desc, voteCount], function(error, result) 
            {
                let candidate_id;
                if (error) 
                {
                    console.log('An error ocurred...', error);
                    res.json({
                        code: 400,
                        sucees:false,
                        msg: 'An error ocurred..'
                    });
                    return;
                } 
                else{
                    console.log('Success saved in DB');

                    console.log('insertid ', result.insertId);

                    res.json({
                                code: 200,
                                success:true,
                                candidate_id: result.insertId
                            });
                            return;
                }
           });
        });
    }
    voterInfoPost(app,db)
    {
        app.post('/voterinfopost', function(req, res) {
            var username = req.body.username;
            var password = req.body.password;
            var metaaddrss = req.body.metamaskaddrss
            var salt = bcrypt.genSaltSync(10);
            var encryptedpassword = bcrypt.hashSync(password, salt);
            console.log(username, encryptedpassword, metaaddrss);
            var sql = `INSERT INTO Voters(username, password, metamaskaddrs) VALUES(?,?,?)`;

            let cols= [username];
            db.query('SELECT * FROM Voters where username = ? LIMIT 1', cols, (err, data, fields)=> 
            {
                if(data && data.length===1)
                {
                    res.json({
                        code: 400,
                        sucees:false,
                        msg: 'Username already taken'
                    });
                    return;
                }
            });

            db.query(sql, [ username, encryptedpassword, metaaddrss], function(error, results) 
            {
                let voterid;
                if (error) 
                {
                    console.log('An error ocurred...', error);
                    res.json({
                        code: 400,
                        sucees:false,
                        msg: 'An error ocurred..'
                    });
                    return;
                } 
                else{
                    console.log('Success saved in DB');
                    var q = "SELECT id FROM Voters where username = '" + username + "'";
                    db.query(q, function (err, result, fields) {
                        if (err) throw err;

                        console.log("voter id: "+result[0].id);

                        res.json({
                            code: 200,
                            success:true,
                            voterid: result[0].id
                        });
                        return;
                    });
                }
           });
        });
    }

    otpPost(app,db){
        app.post('/otppost', function(req, res) {
            var otpposted = req.body.otp;
            if (otpposted == otp) {
                console.log('here');
        
                var sql = `UPDATE users SET emailverified = '1' WHERE emailid = ?`;
                email =req.body.email
                db.query(sql, [ email ], function(error, results) {
                    if (error) {
                        console.log('error occurred', error);
                        res.json({
                            code:400,
                            success: false,
                           msg: 'An error occured..'
                       });
                       return;
                    } else {
                        console.log("username"+req.body.username);
                        res.json({
                            code:200,
                            success: true,
                            username: req.body.username,
                            msg: 'Otp successfully verified..'
                       });
                        console.log('Success sign-up');
                        return;
                    }
                });
               
            } else {
                res.json({
                    success: false,
                   msg: 'An error occured..'
               });
               return;
            }
        });
    }

    isLoggedIn(app,db)
    {
        app.post('/isLoggedIn', (req,res) => {
            if(req.session.userID){
                let cols = [req.session.userID];
                db.query('select * from users where id =? LIMIT 1', (err,data,fields) => {
                    if(data && data.length===1)
                    {
                        res.json({
                            success: true,
                            username: data[0].username
                        });
                       return true;
                    }
                    else{
                        res.json({
                            success: false,
                           msg: 'An error occured..'
                       });
                       return;
                    }
                });
            }
            else{
                res.json({
                    success: false,
                   msg: 'An error occured..'
               });
               return;
            }
        });
    }
    
    getVoterId(app,db)
    {
        app.post('/getVoterId', (req,res) => {
            console.log("Looking for voter: " + req.body.username);
            var sqlquery = "SELECT id FROM Voters where username = '" + req.body.username + "'";
            db.query(sqlquery, function (err, result, fields) 
            {
                if (err) throw err;
                console.log("voter id: "+result[0].id);

                res.json({
                    code: 200,
                    success:true,
                    voterid: result[0].id
                });
                return;
            });
        });
    }

    login(app,db)
    {
        app.post('/login', (req,res) => {
            let username = req.body.username;
            let password = req.body.password;
            console.log("In login");
            username = username.toLowerCase();

            let cols= [username];
             db.query('SELECT * FROM Voters where username = ? LIMIT 1', cols, (err, data, fields)=> 
             {
                if(err)
                {
                    console.log("error");
                    res.json({
                         success: false,
                        msg: 'An error occured..'
                    });
                    return;
                }
                if(data && data.length===1)
                {
                    console.log("found data.."); 
                    bcrypt.compare(password, data[0].password, (bcryptErr, verfied) => {
                        if(verfied){
                            req.session.userID = data[0].id;
                            res.json({
                                success: true,
                                username: data[0].username
                            });
                            return;
                        }
                        else
                        {
                            res.json({
                                success: false,
                                msg: 'Invalid password'
                            });
                            return;
                        }
                    });
                }
                else{
                    console.log("not found..");
                    res.json({
                        success: false,
                        msg: 'User not found'
                    });
                    console.log("User not found");
                    return;
                }
            });
        });
    }
}
module.exports = Router;
