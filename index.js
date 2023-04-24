import express from 'express';
import multer from 'multer';
import path from 'path';
import { sendMail, isValidEmail } from './function.js';
import fs from 'fs';
import xlsx from 'xlsx';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());
const upload = multer({
    dest: 'uploads/'
});

const port = 2222;

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.post('/upload', upload.array('files'), function (req, res, next) {
    const databin = [];
    console.log(upload.array('files'))
    for (let i = 0; i < req.files.length; i++) {
        let workbook = xlsx.readFile(req.files[i].path);
        let worksheet = workbook.Sheets[workbook.SheetNames[0]];
        let data = xlsx.utils.sheet_to_json(worksheet);
        data.forEach((array) => {
            if (databin.indexOf(array.Email) === -1 && isValidEmail(array.Email)) {
                databin.push(array.Email);
            }
        });
        fs.unlink(req.files[i].path, (err) => {
            if (err) throw err;
        });
    }
    console.log(databin)
    res.status(200).json({
        message: 'success',
        valid_email: databin,
    })
});


app.post('/send', async function (req, res, next) {
    if (!req.body || !req.body.email || !req.body.content) {
        res.status(400).json({
            message: 'Bad request'
        });
        console.log(req.body)
        return;
    }

    let done = [];
    for (const email of req.body.email) {
        if (await sendMail(email, {
            subject: req.body.content.subject,
            text: req.body.content.text,
            html: req.body.content.text
        })) {
            done.push(email)
        }
    }

    res.status(200).json({
        message: 'success',
        success: done,
    });
});




app.listen(port, function () {
    console.log('Server listening on port ' + port);
});
