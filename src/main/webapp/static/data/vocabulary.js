var prefix = {
    adlnet: 'http://adlnet.gov/expapi/verbs/',
    forge: 'http://ict-forge.eu/vocab/activities/',
    activity: 'http://activitystrea.ms/schema/1.0/',
    ext: 'http://pt-anywhere.kmi.open.ac.uk/extensions/',
};


var activity = {
    device: prefix.forge + 'device',
    port: prefix.forge + 'port',
    link: prefix.forge + 'link',
    commandLine: prefix.forge + 'command-line',
};

var verb = {
    initialized: prefix.adlnet + 'initialized',
    terminated: prefix.adlnet + 'terminated',
    create: prefix.activity + 'create',
    delete: prefix.activity + 'delete',
    update: prefix.activity + 'update',
    opened: prefix.activity + 'open',
    closed: prefix.activity + 'close',
    use: prefix.activity + 'use',
    read: prefix.activity + 'read',
};


var extension = {
    device: {
        name: prefix.ext + 'device/name',
        position: prefix.ext + 'device/position',
        type: prefix.ext + 'device/type',
        defaultGateway: prefix.ext + 'device/defaultGateway',
        uri: prefix.ext + 'device/uri'
    },
    port: {
        name: prefix.ext + 'port/name',
        ipAddress: prefix.ext + 'port/ipAddress',
        subnetMask: prefix.ext + 'port/subnetMask',
        uri: prefix.ext + 'port/uri'
    },
    endpoints: prefix.ext + 'endpoints',
};


var devices = {
    any: prefix.forge + 'device/',
    cloud: prefix.forge + 'device/cloudDevice',
    router: prefix.forge + 'device/routerDevice',
    switch: prefix.forge + 'device/switchDevice',
    pc: prefix.forge + 'device/pcDevice',
};