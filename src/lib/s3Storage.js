import {
    prop, merge
} from 'ramda';
import AWS from 'aws-sdk';

const getDb = param => new AWS.S3(param.S3);

// Just for compability
const getUsers = db => true;  // eslint-disable-line
const setUsers = (db, data) => true; // eslint-disable-line

const getUser = (db, path, userId) =>
    db.getObject({
        Key: `${path}/${userId}.json`
    }).promise()
    .then(body => body.Body.toString())
    .catch(err => {
        console.log(err);
        return {};
    });

const setUser = (db, path, userId, nextUser) => {
    if (!nextUser) { return null; }
    console.log('db path ', path);
    return db.putObject({
        Key: `${path}/${userId}.json`,
        Body: JSON.stringify(nextUser)
    }).promise()
    .then(body => {
        console.log(body);
        return userId;
    })
    .catch(err => {
        console.log(err);
        return nextUser;
    });
};

const removeUser = (db, path, userId) => {
    if (!userId) { return null; }
    return db.deleteObject({
        Key: `${path}/${userId}.json`
    }).promise()
    .then(() => userId)
    .catch(err => {
        console.log(err);
        return undefined;
    });
};

const getUserProp = (db, path, userId, key) => {
    if (!userId) { return null; }
    return getUser(db, path, userId)
    .then(u => {
        if (!u || !key) { return undefined; }
        const user = JSON.parse(u);
        if (!key) {
            return '';
        }
        return prop(key, user);
    }).catch(err => {
        console.log(err);
        return undefined;
    });
};

const setUserProp = (db, path, userId, key, value) => {
    if (!userId) { return null; }
    return getUser(db, path, userId)
    .then(u => {
        if (!u || !key) { return undefined; }
        const user = JSON.parse(u);
        const newUser = merge(user, { [key]: value });
        return setUser(db, path, userId, newUser);
    })
    .catch(err => {
        console.log(err);
        return undefined;
    });
};

const removeUserProp = (db, path, userId, key) => {
    if (!userId || !key) { return null; }
    return getUser(db, path, userId)
    .then(u => {
        if (!u) { return undefined; }
        const { [key]: oldItem, ...other} = JSON.parse(u); // eslint-disable-line
        return setUser(db, path, userId, { ...other });
    })
    .catch(err => {
        console.log(err);
        return undefined;
    });
};


export {
    getDb,
    getUsers,
    setUsers,
    getUser,
    setUser,
    removeUser,
    getUserProp,
    setUserProp,
    removeUserProp
};
