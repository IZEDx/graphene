
const graphene = require("../packages/api/dist");

console.log(graphene);
graphene.GrapheneServer.create({
    demoMode: true
})
.then(server => server.listen(1234))
.then(() => {
    console.log("Graphene listening on 0.0.0.0:1234");
});
 