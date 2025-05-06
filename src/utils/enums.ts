import { ChannelType } from "discord.js";

export enum ChannelTypes {
  "Text" = ChannelType.GuildText,
  "DM" = ChannelType.DM,
  "GuildVoice" = ChannelType.GuildVoice,
  "GroupDM" = ChannelType.GroupDM,
  "GuildCategory" = ChannelType.GuildCategory,
  "GuildAnnouncement" = ChannelType.GuildAnnouncement,
  "AnnouncementThread" = ChannelType.AnnouncementThread,
  "PublicThread" = ChannelType.PublicThread,
  "PrivateThread" = ChannelType.PrivateThread,
  "GuildStageVoice" = ChannelType.GuildStageVoice,
  "GuildDirectory" = ChannelType.GuildDirectory,
  "GuildForum" = ChannelType.GuildForum,
  "GuildMedia" = ChannelType.GuildMedia,
  /** @deprecated*/ "GuildNews" = ChannelType.GuildNews,
  /** @deprecated*/ "GuildNewsThread" = ChannelType.GuildNewsThread,
  /** @deprecated*/ "GuildPublicThread" = ChannelType.GuildPublicThread,
  /** @deprecated*/ "GuildPrivateThread" = ChannelType.GuildPrivateThread,
}
