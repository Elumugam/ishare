const { MongoClient } = require('mongodb');

const variations = [
    'mongodb+srv://elumugamelumugam_db_user:%40Magumule@ishare.255xjmo.mongodb.net/?appName=ishare',
    'mongodb+srv://elumugamelumugam_db_user:%3C%40Magumule%3E@ishare.255xjmo.mongodb.net/?appName=ishare',
    'mongodb+srv://elumugamelumugam_db_user:Magumule@ishare.255xjmo.mongodb.net/?appName=ishare'
];

async function run() {
    for (const uri of variations) {
        console.log(`Testing URI beginning with ${uri.substring(0, 45)}...`);
        const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
        try {
            await client.connect();
            console.log('SUCCESS!');
            await client.close();
            console.log(`THE CORRECT CONNECTION STRING IS: ${uri}`);
            return;
        } catch (e) {
            console.log(`Error: ${e.message}`);
        }
    }
    console.log('Failed all variations.');
}
run();
