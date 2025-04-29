async function delay(time) {
    return new Promise((resolve) => {
        setTimeout(resolve, time * 1000);
    });
}

module.exports = { delay };