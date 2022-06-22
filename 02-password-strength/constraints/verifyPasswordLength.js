module.exports = (password) => {
    if (password.length < 6) {
        return Promise.reject({
            message: `The password: ${password} is too short`,
        });
    }

    return Promise.resolve('Password validated');
};
