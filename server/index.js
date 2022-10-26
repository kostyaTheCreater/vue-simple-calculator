const express = require("express");
const cors = require('cors');

const PORT = process.env.PORT || 8081;
const app = express();
const jsonParser = express.json();

app.use(cors());


app.post("/api", jsonParser, function(request, response){
    const op = request.body.operation;
    const values = request.body.values + '';
    
    let arr = values.split(op);
    if(arr.length > 3){
        arr[0] += arr[1];
        arr.splice(1, 1);
    }
    console.log(arr);
    
    let result;
    switch(op){
        case '*':
            result = (+arr[0]) * (+arr[1]);
            break;
        case '/':
            result = ((+arr[0]) / (+arr[1]));
            break;
        case '-':
            result = (+arr[0]) - (+arr[1]);
            break; 
        case '+':
            result = (+arr[0]) + (+arr[1]);
            break;
    }
    
    response.json({
        result: result
     })

});

app.listen(PORT, () => {
    console.log(`Server starting on port ${PORT}`);
});