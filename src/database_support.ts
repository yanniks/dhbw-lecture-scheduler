import * as Sequelize from "sequelize";

const sequelize = new Sequelize(process.env.db || "lecturescheduler", process.env.user || "dhbw",
    process.env.password || "dhbw", {
        dialect: "mysql",
        host: process.env.dbhost || "db",

        pool: {
            acquire: 30000,
            idle: 10000,
            max: 5,
            min: 0,
        },

        // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
        operatorsAliases: false,
    });

sequelize
    .authenticate()
    .then(() => {
        console.info("Connection has been established successfully.");
    })
    .catch((err) => {
        console.error("Unable to connect to the database:", err);
    });

const LectureRequest = sequelize.define("request", {
        ipAddress: {
            type: Sequelize.STRING,
        },
        requestIdentifier: {
            type: Sequelize.STRING,
        },
        userAgent: {
            type: Sequelize.STRING,
        },
    },
    {
        timestamps: true,
    });

const PushToken = sequelize.define("pushtoken", {
    requestIdentifier: {
        type: Sequelize.STRING,
    },
    token: {
        type: Sequelize.STRING,
    },
});

LectureRequest.sync({force: false});
PushToken.sync({force: false});

export function documentRequest(identifier: string, ipAddress: string, userAgent: string) {
    LectureRequest.create({ipAddress, requestIdentifier: identifier, userAgent});
}

export function unregisterToken(token: string) {
    PushToken.findOne({token}).then((pushToken) => {
        pushToken.destroy();
    });
}

export function registerPushToken(identifier: string, token: string) {
    PushToken.findOrCreate({where: {requestIdentifier: identifier, token}});
}

export function getPushTokens(identifier: string, callback: any) {
    PushToken.findAll({where: {requestIdentifier: identifier}}).then(callback);
}

export function deleteStoredPushToken(identifier: string, token: string) {
    PushToken.findOne({requestIdentifier: identifier, token}).then((pushToken) => {
        pushToken.destroy();
    });
}
