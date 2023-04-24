import { sendMail, isValidEmail } from './function.js';
import fs from 'fs';
import xlsx from 'xlsx';

const directoryPath = './data/excel';
const databin = [];

fs.readdir(directoryPath, (error, files) => {
    if (error) {
        console.error(error);
    } else {
        const excelFiles = files.filter(file => file.endsWith('.xlsx'));
        excelFiles.forEach((filename) => {
            let filePath = `${directoryPath}/${filename}`;
            let workbook = xlsx.readFile(filePath);
            let worksheet = workbook.Sheets[workbook.SheetNames[0]];
            let data = xlsx.utils.sheet_to_json(worksheet);
            console.log(`Total ${data.length} rows`);
            data.forEach((array) => {
                if (databin.indexOf(array.Email) === -1 && isValidEmail(array.Email)) {
                    databin.push(array.Email);
                }
            });
        });
        console.log(`${databin.length} invalid email..\nSending email...`);
        console.log(databin);
        databin.forEach((email) => sendMail(email, {
            'subject': 'Xin chào djtmemay',
            'text': 'cmm',
            'html': '<h1> ĐỊT MẸ MÀY</h1>'
        }))
    }
});
