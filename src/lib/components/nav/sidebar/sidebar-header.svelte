<script lang="ts">
  import * as Sidebar from '$lib/components/ui/sidebar';
  import Snowflake from '@lucide/svelte/icons/snowflake';
  import PanelLeftOpen from '@lucide/svelte/icons/panel-left-open';
  import PanelLeftClose from '@lucide/svelte/icons/panel-left-close';

  interface Props {
    version: string;
    app_name: string;
  }

  let { version, app_name }: Props = $props();

  let sidebar = Sidebar.useSidebar();
  let isOpen = $derived(sidebar.props.open());
</script>

<Sidebar.Menu>
  <Sidebar.MenuItem class="flex flex-row">
    <Sidebar.MenuButton
      size="lg"
      class="overflow-hidden transition-all ease-linear data-[open=true]:max-w-54 md:max-w-0 md:data-[open=true]:max-w-42"
      data-open={isOpen}
    >
      {#snippet child({ props })}
        <a href="/" {...props}>
          <div
            class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
          >
            <Snowflake class="size-4 text-[#9db6ed]" />
          </div>
          <div class="flex flex-col gap-0.5 leading-none">
            <span class="font-medium text-nowrap">{app_name}</span>
            <span class="text-nowrap">{version}</span>
          </div>
        </a>
      {/snippet}
    </Sidebar.MenuButton>
    <Sidebar.MenuButton
      size="lg"
      class="ml-auto size-12 cursor-pointer"
      onclick={sidebar.toggle}
      aria-label="Open/Close Sidebar"
      tooltipContent={app_name}
    >
      <div
        data-open={!isOpen}
        class="data-[open=true]:bg-sidebar-primary data-[open=true]:text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
      >
        {#if isOpen}
          <PanelLeftClose class="size-6!" />
        {:else}
          <PanelLeftOpen />
        {/if}
      </div>
    </Sidebar.MenuButton>
  </Sidebar.MenuItem>
</Sidebar.Menu>
