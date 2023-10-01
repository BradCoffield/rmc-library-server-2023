const testAsync = async (params) => {
  let swapi = `https://swapi.dev/api/peoplee/${params}`;
  const response = await fetch(swapi);
  //So, having this in here gets us more details in our error response. Commenting out still "works" in this sense of the error getting handled because the catch in the index caught it.
  if (!response.ok) {
    console.log("I'm this mfer right here.");
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }
  const info = await response.json();
  return info;
};
testAsync().catch((error) => {
  console.log("I'm the catch inside the module");
  error.message; // 'An error has occurred: 404'
});

export { testAsync };
