import { Client, ClientOptions, Intents } from "discord.js";
import { token, welcomeChannel } from "./config";

import type { GuildMember, ClientUser, Interaction, CommandInteraction, InteractionReplyOptions } from "discord.js";

const client: Client = new Client({
    intents: Intents.FLAGS.GUILDS | Intents.FLAGS.GUILD_MESSAGES | Intents.FLAGS.DIRECT_MESSAGES,
    presence: {
        status: "online",
        activities: [
            {
                name: "Silent Star",
                type: "LISTENING",
                url: "https://www.youtube.com/watch?v=4fal-KITvSs"
            }
        ]
    }
} as ClientOptions);

client.login(token);

client.once("ready", (): void => {
    console.log("Logged in as", (client.user as ClientUser).tag);
});

client.on("guildMemberAdd", (targetMember: GuildMember): void => {
    targetMember.send(`こんにちは!<#${welcomeChannel}>で学年、名前等の自己紹介をしてください。`);
});

client.on("interactionCreate", (interaction: Interaction): void => {
    if (!interaction.inCachedGuild()) return;
    const targetMember = (interaction as CommandInteraction<"cached">).options.getMember("member", true);
    const targetRole = (interaction as CommandInteraction<"cached">).options.getRole("role", true);

    targetMember.roles
        .add(targetRole)
        .then(() =>
            (interaction as CommandInteraction<"cached">).reply({
                content: `正常にロール(<@&${targetRole.id}>)が追加されました。`,
                allowedMemtions: {
                    parse: []
                },
                ephemeral: false
            } as InteractionReplyOptions)
        )
        .catch(() =>
            (interaction as CommandInteraction<"cached">).reply({
                content: "ロールの付与に失敗しました。",
                ephemeral: false
            } as InteractionReplyOptions)
        );
});
