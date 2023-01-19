const DiscordRPC = require('discord-rpc')
const fs = require('fs')
const { uIOhook, UiohookKey } = require('uiohook-napi')

var triggeredKey = []

const client = new DiscordRPC.Client({ transport: 'ipc' })

const jsonFile = __dirname + '/config.json'
const jsonData = JSON.parse(fs.readFileSync(jsonFile, 'utf8'))

const rpcLoginOptions = {
    clientId: jsonData.clientId,
    clientSecret: jsonData.clientSecret,
    scopes: ['rpc', 'rpc.voice.read', 'rpc.voice.write'],
    redirectUri: "http://localhost/",
}

const tokenSet = () => {
    if (jsonData.accessToken == "") {
        console.log("no access token")
        rpcLoginOptions.accessToken = false
    } else {
        rpcLoginOptions.accessToken = jsonData.accessToken
    }
}

tokenSet()

client.authenticate = (accessToken) => {
    return client.request('AUTHENTICATE', { access_token: accessToken })
        .then(({ application, user }) => {
            client.accessToken = accessToken;
            client.application = application;
            client.user = user;
            client.emit('ready');
            return client;
        }).catch((data) => {
            throw data
        })
}

client.login = async (options = {}) => {
    let { clientId, accessToken } = options;
    await client.connect(clientId);
    if (!options.scopes) {
        client.emit('ready');
        return client;
    }
    if (!accessToken) {
        accessToken = await client.authorize(options);
        fs.writeFileSync(jsonFile, JSON.stringify({
            "clientId": jsonData.clientId,
            "clientSecret": jsonData.clientSecret,
            "accessToken": accessToken
        }))
    }
    return client.authenticate(accessToken)
}

client.login(rpcLoginOptions).catch((e) => {
    console.log(e)
    delete rpcLoginOptions['accessToken']
    return client.login(rpcLoginOptions)
})

client.on('ready', () => {

    console.log('RPC Client Connected')

    uIOhook.on('keydown', (e) => {
        if (!triggeredKey.includes(e.keycode)) triggeredKey.push(e.keycode)
    })

    uIOhook.on('keyup', async (e) => {
        if (triggeredKey.includes(e.keycode)) {
            const index = triggeredKey.indexOf(e.keycode)
            if (index > -1)
                triggeredKey.splice(index, 1)
        }
        if (e.keycode == 92) {
            client.emit('deaf')
        }
        else if (e.keycode == 93) {
            client.emit('mute')
        }
    })

    uIOhook.start()

})

client.on('mute', async () => {
    client.getVoiceSettings().then(({ mute }) => {
        console.log('mute called, state: ', mute)
        client.setVoiceSettings({ mute: !mute })
    })
})

client.on('deaf', async () => {
    client.getVoiceSettings().then(({ deaf }) => {
        console.log('deaf called, state: ', deaf)
        client.setVoiceSettings({ deaf: !deaf })
    })
})