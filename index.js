const express = require("express")
const reddb = require("reddbv6.5")
const app = express()

var servers = {}
var changeslist = [
    {
        id:"1",
        changes:[
            {
                unqid:"18239492",
                type:"load",
                payload:{}
            }
        ]
    }
]

function randomnumber(max){
    return Math.floor(Math.random() * (max + 1))
}

function generateid(){
    var numbers = ""
    for (a=0; a < 8; a++){
        numbers = numbers + randomnumber(9).toLocaleString()
    }
    return numbers
}

async function getindexbyid(ida,array){
    for (a=0;a<array.length;a++){
        var c = array[a]
        var cs = ida.toLocaleString()
        //console.log(c)
        //console.log(cs)
        if (c.id == cs){
            return a
        }

    }
    return undefined
}


async function pushchanges(serverid=1, changetable={}){
    var index = await getindexbyid(serverid, changeslist)

    if (index != undefined){
        var obj = changeslist[index]

        obj.changes.push(changetable)
        return
    } else {
        var changesi = []
        changetable.unqid = generateid()
        changesi.push(changetable)
        changeslist.push({id:serverid, changes:changesi})
        return
    }
}


async function end(serverid,res){
    //console.log(servers)
    //console.log(changeslist)

    var ind = await getindexbyid(serverid,changeslist)
    

    if (ind == undefined){
        console.log("index undefined")
        return res.send(JSON.stringify({succes:true, changes:[]}))
    }

    var changesi = changeslist[ind]

    if (changesi.length == 0){
        console.log("length 0")
        return res.send(JSON.stringify({succes:true, changes:[]}))
    }

    return res.send(JSON.stringify({succes:true, changes:changesi.changes}))
}





app.get("/", (req,res) => {res.send("/")})

app.get("/http/:serverid/", (req,res) => {
    var serverid = req.params.serverid

    if (servers[serverid] == undefined){
        return res.send(JSON.stringify({succes: false, error: "Server_Not_Registered"}))
    }



    
})


app.get("/newserver", (req,res)=>{
    var serverid = req.query.id

    if (servers[serverid] != undefined){
        return res.send(JSON.stringify({succes: false, error: "Server_Already_Registered"}))
    }
    var serverstring = serverid.toLocaleString()

    servers[serverid] = {}
    
    pushchanges(serverid, {type:"load",payload:{}})

    newserver(serverid,res)
})
app.get("/ddos",(req,res)=>{
    var ip =req.connection.remoteAddress;
    res.send(ip)
})
app.get("/getchanges", (req,res)=>{
    var serverid = req.query.id

    if (servers[serverid] == undefined){
        return res.send(JSON.stringify({succes: false, error: "Server_Not_Registered"}))
    }

    end(serverid,res)
})


app.listen(3000)