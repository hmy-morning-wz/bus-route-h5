let apiHost = ''; // ENV参数没有时，使用mock地址
let jsHost = '';
let volumeLink = '';
let platformHost = '';
let templateId;
if (process.env.ENV === 'dev') {
    apiHost = 'https://sit-operation.allcitygo.com/';
    jsHost = 'https://sit-operation.allcitygo.com:8763/';
    volumeLink = 'https://sit-operation.allcitygo.com/hangzhoutong/#/index'
    platformHost = 'https://sit-basic-ug.allcitygo.com/'
    templateId = 57
}

if (process.env.ENV === 'test') {
    apiHost = 'http://marketing.allcitygo.com/';
    jsHost = 'http://datatrack.allcitygo.com/';
}

if (process.env.ENV === 'beta') {
    apiHost = '//gateway.beta.apitops.com/';
}

if (process.env.ENV === 'v5') {
    apiHost = 'http://marketing.allcitygo.com/';
    jsHost = 'http://datatrack.allcitygo.com/';
}

if (process.env.ENV === 'release') {
    apiHost = 'https://operation.allcitygo.com/';
    volumeLink = 'https://money.allcitygo.com/hangzhoutong/#/index';
    platformHost = 'https://ztmanage.allcitygo.com:8192'
    templateId = 17
}

export {jsHost, apiHost, volumeLink, platformHost,templateId};

