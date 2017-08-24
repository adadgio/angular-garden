class QueryParamsModule {
    private url: string;

    constructor()
    {
        this.url = window.location.href;
    }
    
    getByName(name: string, defaultValue: any = null)
    {
        name = name.replace(/[\[\]]/g, '\\$&');

        let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(this.url);

        if (!results) { return defaultValue; }
        if (!results[2]) { return defaultValue; };

        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
}

export let QueryParams = new QueryParamsModule();
