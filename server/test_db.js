const mongoose = require('mongoose');

const variations = [
    'mongodb+srv://elumugamelumugam_db_user:%40Magumule@ishare.255xjmo.mongodb.net/?appName=ishare',
    'mongodb+srv://elumugamelumugam_db_user:@Magumule@ishare.255xjmo.mongodb.net/?appName=ishare',
    'mongodb+srv://elumugamelumugam_db_user:%3C%40Magumule%3E@ishare.255xjmo.mongodb.net/?appName=ishare',
    'mongodb+srv://elumugamelumugam_db_user:Magumule@ishare.255xjmo.mongodb.net/?appName=ishare'
];

async function test() {
    for (const uri of variations) {
        console.log(`Testing: ${uri.replace(/:[^@]+@/, ':PASSWORD@')}`);
        try {
            const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
            console.log('SUCCESS!');
            await conn.disconnect();
            return;
        } catch (err) {
            console.log(`Failed: ${err.message}`);
        }
    }
}

test();
