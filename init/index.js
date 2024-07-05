const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");
mongoose.set("strictQuery", true);

const Mongo_URL = "mongodb://127.0.0.1:27017/wonderLust";

async function main() {
  await mongoose.connect(Mongo_URL);
}

main()
  .then(() => {
    console.log("Databace connected");
  })
  .catch((err) => {
    console.log(err);
  });

const init = async () => {
  await Listing.deleteMany({}); // delete the existing data
  console.log(initData.data);

  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "6685686081be3e0b9095d0f3",
  }));
  await Listing.insertMany(initData.data);
  console.log("saved");
};

init();
