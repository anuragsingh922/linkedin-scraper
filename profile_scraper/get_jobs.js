const env = require("../env/config");

const { ApifyClient } = require("apify-client");

const get_jobs = async (jobField, location) => {
    try{
  //   const jobField = req.body.job_field;
  //   const location = req.body.location;

  const client = new ApifyClient({
    token: "apify_api_BLorlURxm0chQkb6GrRGjD4UH0l9Jk3N9g53",
  });

  // Prepare Actor input
  const input = {
    title: jobField,
    location: location,
  };

  // Run the Actor and wait for it to finish
  const run = await client.actor("BHzefUZlZRKWxkTck").call(input);

  // Fetch and print Actor results from the run's dataset (if any)
  console.log("Results from dataset");
  const { items } = await client.dataset(run.defaultDatasetId).listItems();
  //   items.forEach((item) => {
  //     console.log(item);
  //   });
  console.log(items);
  return items;
}catch(err){
    console.log(err.message);
    return [];
}
};

// get_jobs();

module.exports = { get_jobs };
