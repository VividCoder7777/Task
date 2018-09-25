class Env{

    constructor(){
        let env = process.env.NODE_ENV;

        if (env === 'production'){
            this.SERVER = process.env.REACT_APP_PROD_SERVER;
            this.PROXY = process.env.REACT_APP_PROD_PROXY;
        } else if (env === 'development'){
            this.SERVER = process.env.REACT_APP_DEV_SERVER;
            this.PROXY = process.env.REACT_APP_DEV_PROXY;
        }
    }
}

export default new Env();