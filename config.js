module.exports = {
    port: 3000,
    hv_url: "qemu:///system",
    hv_domain: "hv.citizen.eu",
    bridge_ip: "192.168.122.1",
    templateName: "citizen-vm",
    sql: {
        host: '172.16.200.1',
        database: 'hv',
        username: 'citizen',
        password: 'password',
        dialect: 'postgres',
        timezone: '+00:00',
    },

};