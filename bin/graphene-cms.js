
const graphene = require("../api/dev");

console.log(graphene);
graphene.GrapheneServer.create({
    demoMode: false,
})
.then(server => server.listen(1234))
.then(() => {
    console.log("Graphene listening on 0.0.0.0:1234");
});
 