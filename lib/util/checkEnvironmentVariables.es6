function checkEnvironmentVariables(environmentVariables) {

  let missingEnvVariables = [];

  if (environmentVariables) {
    Object.keys(environmentVariables).forEach(key => {

      if (!(process.env.hasOwnProperty(key) && process.env[key])) {
        missingEnvVariables.push(key);
      }
    });

    if (missingEnvVariables.length > 0) {
      console.log("There are some environment variables missing in the system: ", missingEnvVariables);
      throw new Error("There are some environment variables missing in the system: " + missingEnvVariables);
    }
  }
}

export default checkEnvironmentVariables;
