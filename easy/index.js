const readline = require('readline'),
    fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function run(){
    var name, age, username;
    
    prompt('name')
    .then((resultName) => {
        name = resultName;
        return prompt('age');
    })
    .then((resultAge) => {
        age = resultAge;
        return prompt('username');
    })
    .then((resultUsername) => {
        username = resultUsername;
        rl.close();
        return storeData({
            name: name,
            age: age,
            username: username
        }); 
    })
    .then(() => {
        console.log('your name is '+name+', you are '+age+' years old, and your username is '+username);
    })
    .catch((e) => {
        throw e;
    });
}

function prompt(promptType){
    console.log('Prompting: '+promptType);
    var promptString;
    switch(promptType){
        case 'age':
            promptString = 'What is your age?'; 
            break;
        case 'name':
            promptString = 'What is your name?';
            break;
        case 'username':
            promptString = 'What is your reddit username?';
            break;
        default:
            throw new Error('Invalid Prompt Type');
    }
    return new Promise( function (resolve, reject) {
        rl.question(promptString, (answer) => {
            resolve(answer);
        });
    });
}

function storeData(newUser){
    return new Promise( function (resolve, reject) {
        fs.readFile('./output.json', (err, data) => {
            var userData;
            if( err ){
                if( err.code == 'ENOENT' ){
                    //assume the file doesn't exist
                    userData = {names:{},ages:{},usernames:{}};
                }
                else{
                    throw err;
                }
            }
            else{
                userData = JSON.parse(data);
            }
            
            //add to the names bucket
            if( !userData.names[newUser.name] ){
                userData.names[newUser.name] = [];
            }
            userData.names[newUser.name].push(newUser);
            
            //add to the ages bucket
            if( !userData.ages[newUser.age] ){
                userData.ages[newUser.age] = [];
            }
            userData.ages[newUser.age].push(newUser);
            
            //add to the usernames bucket
            if( !userData.usernames[newUser.username] ){
                userData.usernames[newUser.username] = [];
            }
            userData.usernames[newUser.username].push(newUser);
            
            //write back to file
            fs.writeFile(process.env.NODE_PATH+'/easy/output.json', JSON.stringify(userData), 'utf8', (err) =>{
                if( err ){
                    throw err;
                }
                resolve();
            });
        })
    });
}

run();