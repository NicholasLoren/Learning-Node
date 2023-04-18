console.log("Start")
// getUser(1,(user)=>{
//     console.log(user) 
//         getRepositories(user.username,(repos)=>{
//             console.log(repos)
//             getCommits(repos[0],(commits)=>{
//                 console.log(commits)
//             })
//         })
// })
console.log("End")

getUser(1)
    .then(user=> getRepositories(user.username))
    .then(repos => getCommits(repos[0]))
    .then(commits => console.log(commits))
    .catch(err => console.log("Errors",err))






function getUser(id){

    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            console.log("Fetching user from the database...")
            resolve({id,username:'Nicholas'})
        },2000)
    })
}


function getRepositories(username){
    return new Promise((resolve,reject)=>{
        setTimeout(() => {
            console.log("Calling the github API...")
            resolve(['repo1','repo2','repo3','repo4'])
        }, 2000);
    })
}

function getCommits(repo){
    return new Promise((resolve,reject)=>{
        setTimeout(() => {
            console.log("Fetching repo commits...")
            resolve(['commit1','commit2','commit3'])
        }, 2000);
    })
}