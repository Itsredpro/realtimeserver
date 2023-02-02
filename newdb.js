const reddb = require("reddbv6.5")




reddb.CreateDb(process.argv[2], function(suc){
    console.log("Created db: " + suc)
    process.exit()
})