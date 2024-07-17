<template>
  <div class="min-h-screen bg-background font-sans antialiased">
    <div class="relative flex min-h-screen flex-col">
      <header
        class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div class="container flex h-14 items-center">
          <div class="mr-4 hidden md:flex">
            <NuxtLink to="/" class="mr-6 flex items-center space-x-2">
              <span class="hidden font-bold sm:inline-block">TODO App</span>
            </NuxtLink>
          </div>
        </div>
      </header>
      <main class="flex-1">
        <slot />
      </main>
      <footer class="py-6 md:px-8 md:py-0">
        <div
          class="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row"
        >
          <p
            class="text-center text-sm leading-loose text-muted-foreground md:text-left"
          >
            Built with Nuxt, Shadcn, and Rails.
          </p>
        </div>
      </footer>
    </div>
  </div>
</template>
