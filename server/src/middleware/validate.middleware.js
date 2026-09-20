
export function validate(schema){
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        // console.log(result);

        if(!result.success){
           return res.status(400).json({success: false, message: result.error.issues[0].message})
        };
        req.body = result.data; //clean up req.body by taking result.data
        next();
    }
}

//this check if the input is approve by zod's schema 
//if YES : give the result data or input to req.body and pass to next controller
//if NO : Showing error