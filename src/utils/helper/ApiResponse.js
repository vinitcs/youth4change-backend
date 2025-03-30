class ApiResponse {
  // default message = "Success"
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    //  (this.data = data); // response data will be share

    // If data is an object with a single key, extract it directly
    // if (data && typeof data === "object" && Object.keys(data).length === 1) {
    //   const key = Object.keys(data)[0];
    //   this[key] = data[key]; // Assign the key-value pair directly
    // } else {
    //   this.data = data; // Fallback to assigning the entire data object
    // }

    // Spread the data object directly into the response
    if (data && typeof data === "object") {
      Object.assign(this, data); // Add each property from the data object directly to the instance
    }

    this.message = message;
    this.success = statusCode < 400;
  }
}

export { ApiResponse };
