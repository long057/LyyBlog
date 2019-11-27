
function getNowTime() {
    return parseInt(new Date().getTime() / 1000);
}

module.exports.getNowTime = getNowTime;