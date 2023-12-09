
class MyOwnPromise {
    constructor(callback) {
        this.state = "pending";
        this.value = undefined;
        this.handlers = [];
        callback(this.resolve.bind(this), this.reject.bind(this));
    }

    resolve(value) {
        if (this.state === "pending") {
            this.state = "fulfilled";
            this.value = value;
            this.handle();
        }
    }

    reject(error) {
        if (this.state === "pending") {
            this.state = "rejected";
            this.value = error;
            this.handle();
        }
    }

    then(onFulfilled, onRejected) {
        return new MyOwnPromise((resolve, reject) => {
            const handler = () => {
                if (this.state === "fulfilled") {
                    if (typeof onFulfilled === "function") {
                        try {
                            const result = onFulfilled(this.value);
                            resolve(result);
                        } catch (error) {
                            reject(error);
                        }
                    } else {
                        resolve(this.value);
                    }
                } else if (this.state === "rejected") {
                    if (typeof onRejected === "function") {
                        try {
                            const result = onRejected(this.value);
                            resolve(result);
                        } catch (error) {
                            reject(error);
                        }
                    } else {
                        reject(this.value);
                    }
                }
            };
            this.handlers.push(handler);
            this.handle();
        });
    }

    catch(onRejected) {
        return this.then(null, onRejected);
    }

    finally(onFinally) {
        return new MyOwnPromise((resolve, reject) => {
            const handler = () => {
                try {
                    onFinally();
                } catch (error) {
                    reject(error);
                } finally {
                    resolve(this.value);
                }
            };
            this.handlers.push(handler);
            this.handle();
        });
    }

    handle() {
        if (this.state !== "pending") {
            while (this.handlers.length > 0) {
                const handler = this.handlers.shift();
                handler();
            }
        }
    }
}

const myPromise = new MyOwnPromise((resolve, reject) => {
    // Simulate an asynchronous operation using setTimeout
    setTimeout(() => {
        // Generate a random number between 0 and 1
        const randomNumber = Math.random();
        // If the random number is greater than 0.5, resolve the promise with the number
        if (randomNumber > 0.5) {
            resolve(randomNumber);
        } else {
            // If the random number is less than or equal to 0.5, reject the promise with an error message
            reject("The random number is too low!");
        }
    }, 1000); // Wait for 1 second
});

// Use the then method to handle the fulfillment of the promise
myPromise.then((value) => {
    // Log the value to the console
    console.log(`The random number is ${value}`);
    // Return the value multiplied by 2
    return value * 2;
})
    // Use the catch method to handle the rejection of the promise
    .catch((error) => {
        // Log the error to the console
        console.error(error);
        // Throw the error
        throw error;
    })
    // Use the finally method to perform some action regardless of the state of the promise
    .finally(() => {
        // Log a message to the console
        console.log("The promise is settled");
    });
