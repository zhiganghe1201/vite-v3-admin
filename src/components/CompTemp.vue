<script lang="ts" setup>
  import { useUserStore } from '@/store/modules/user';

  const store = useUserStore();
</script>
<template>
  <div>
    <h1>CompTemp</h1>
    <div>{{ store.count }}</div>
    <div>{{ store.doubleCount }}</div>
    <button @click="store.increment">+</button>
  </div>
</template>
