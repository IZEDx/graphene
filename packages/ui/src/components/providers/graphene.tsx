import { Component, h, Prop, Watch, Listen, Event, EventEmitter } from "@stencil/core";
import { graphene } from "../../global/context";
import { Graphene } from "../../libs/graphene";
import { GrapheneAPI, APIQueries } from "../../global/api";
import { API } from "../../libs/api";

@Component({
    tag: 'graphene-provider'
})
export class GrapheneProvider 
{
    @Event() toggleBackground: EventEmitter<boolean>;
    @Event() errorToast: EventEmitter<string>;
    @Event() successToast: EventEmitter<string>;

    @graphene.Provide("api") api: GrapheneAPI;
    @graphene.Provide("graphene") graphene: Graphene;
    @graphene.Provide("connected") isConnected = false;
    @graphene.Provide("token") _token: string;
    @graphene.Provide("isAuthorized") isAuthorized = false;

    @Prop() endPoint: string;
    @Prop() token?: string;
    
    @Watch("token")
    async componentWillLoad()
    {
        this._token = this.token ?? localStorage.getItem("token");
    }


    @Listen("apiError")
    onApiError(e: {detail: any})
    {
        if (e.detail?.response?.errors)
        {
            for (const _error of e.detail.response.errors)
            {
                if (_error?.message) 
                {
                    this.errorToast.emit(_error.message);
                }
            }
        }
    }


    @Listen("login")
    async onLogin({detail}: CustomEvent<{name: string, password: string}>)
    {
        const query = `
            mutation {
                login(data: {
                    name: "${detail.name}",
                    password: "${detail.password}"
                })
            }
        `;

        try
        {
            const result = await this.api.client.request(query);
            const token = result?.login;
            this._token = token || this._token;
            this.successToast.emit("Login successful");
        }
        catch(e)
        { 
            this.onApiError({detail: e});
            this.isAuthorized = this.isAuthorized;
        }
    }

    @Listen("logout")
    async onLogout() 
    {
        const query = `
            mutation {
                logout
            }
        `;

        try
        {
            await this.api.client.request(query);
            this._token = undefined;
            this.successToast.emit("Logout successful");
        }
        catch(e)
        { 
            this.onApiError({detail: e});
            this.isAuthorized = this.isAuthorized;
        }
    }

    @graphene.Observe("token")
    async connectToAPI(token?: string)
    {
        console.log("Connecting...", token);

        this.isConnected = false;
        this.toggleBackground.emit(false);

        if (token) localStorage.setItem("token", token);
        else localStorage.removeItem("token");

        if (!this.api)
        {
            this.api = new API(this.endPoint, APIQueries, token);
            this.graphene = new Graphene(this.api, {}, {});
        }
        else
        {
            this.api.setToken(token);
        }

        try
        {
            await this.graphene.load();
        } catch(e) {
            if (e?.response?.status === 401 && token)
            {
                this._token = undefined;
                return;
            }
        }

        this.graphene = this.graphene; 

        try
        {
            const meField = this.graphene.getQuery("me");
            console.log(meField);
            const me = (await meField?.request())[meField?.name];
            if (me) this.isAuthorized = true;
            else this.isAuthorized = false;
        } 
        catch(err)
        {
            console.log(err)
            this.isAuthorized = false;
        }

        this.isConnected = true;
        this.toggleBackground.emit(true);
    }

    render()
    {
        return <slot />;
    }
}
