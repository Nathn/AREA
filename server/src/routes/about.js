const express = require("express");
const router = express.Router();

const Service = require("@/models/Service");

router.get("/about.json", async (req, res) => {
  var host = req.ip;
  if (host.startsWith("::ffff:")) host = host.substring(7);

  const current_time = Math.floor(Date.now() / 1000);

  const db_services = await Service.find({});
  let services = [];

  db_services.forEach((service) => {
    services.push({
      name: service.name_long.toLowerCase().replaceAll(" ", "_"),
      actions: service.actions.map((action) => {
        return {
          name: action.name_long.toLowerCase().replaceAll(" ", "_"),
          description: action.description,
        };
      }),
      reactions: service.reactions.map((reaction) => {
        return {
          name: reaction.name_long.toLowerCase().replaceAll(" ", "_"),
          description: reaction.description,
        };
      }),
    });
  });

  const data = {
    client: {
      host: host,
    },
    server: {
      current_time: current_time,
      services: services,
    },
  };

  res.json(data);
});

module.exports = router;
