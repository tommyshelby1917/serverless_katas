const zxcvbn = require('zxcvbn');

module.exports = (password) => {
    const { score } = zxcvbn(password);

    if (score < 2) {
        return Promise.reject({
            message: `The password: ${password} is too weak with an score ${score}`,
        });
    }

    return Promise.resolve({
        message: 'Password validated',
        score,
    });
};
