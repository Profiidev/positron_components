import Bubble from '$lib/components/ui-extra/chat/chat-bubble.svelte';
import BubbleMessage from '$lib/components/ui-extra/chat/chat-bubble-message.svelte';
import BubbleAvatar from '$lib/components/ui-extra/chat/chat-bubble-avatar.svelte';
import List from '$lib/components/ui-extra/chat/chat-list.svelte';
import * as Avatar from '$lib/components/ui-extra/avatar';

const BubbleAvatarImage = Avatar.Image;
const BubbleAvatarFallback = Avatar.Fallback;

export {
  List,
  Bubble,
  BubbleMessage,
  BubbleAvatar,
  BubbleAvatarImage,
  BubbleAvatarFallback
};

export type * from '$lib/components/ui-extra/chat/types';
