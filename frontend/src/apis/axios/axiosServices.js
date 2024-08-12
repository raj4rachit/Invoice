import axios from 'apis/axios/axios';

export const AxiosAuthServices = {
    get(url, params) {
        return this.handleGetRequest(url, params);
    },

    post(url, data) {
        return this.handlePostRequest('post', url, data);
    },

    put(url, data) {
        return this.handlePostRequest('put', url, data);
    },

    delete(url) {
        return this.handlePostRequest('delete', url);
    },

    async handlePostRequest(method, url, data = null) {
        const serviceToken = JSON.parse(localStorage.getItem('serviceToken') || '');
        const companyData = localStorage.getItem('companyData');
        const response = await axios[method](url, data, { headers: { Authorization: serviceToken, Company: companyData } });
        return response;
    },

    async handleGetRequest(url, params = null) {
        const serviceToken = JSON.parse(localStorage.getItem('serviceToken') || '');
        const companyData = localStorage.getItem('companyData');
        const config = {
            headers: { Authorization: serviceToken, Company: companyData },
            params
        };
        const response = await axios.get(url, config);
        return response;
    }
};

export const AxiosServices = {
    get(url, params) {
        return this.handleRequest('get', url, params);
    },
    post(url, data) {
        return this.handleRequest('post', url, data);
    },

    put(url, data) {
        return this.handleRequest('put', url, data);
    },

    delete(url) {
        return this.handleRequest('delete', url);
    },

    async handleRequest(method, url, data = null) {
        const response = await axios[method](url, data);
        return response;
    }
};
