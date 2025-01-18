export default {
  name: "metaphor-monster-name",
  description:
    "Provides info on a monster within Methaphor Refantazio",
  //options: Object[],
  //deleted: Boolean,
  // permissionsRequired: Boolean,
  // botPermissions: Boolnea
  callback: (client, interaction) => {
    interaction.reply(`Haha I got ur ping ${client.ws.ping}ms`);
  },
};
