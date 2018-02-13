<template>
    <div class="card">
      <div class="card-image" @click="$emit('cover')">
        <figure class="image is-square">
          <img :src="img" :alt="title">
        </figure>
      </div>
      <div class="card-content" v-if="title || subtitle">
        <div class="title is-5 truncate" @click="$emit('title')">{{ title }}</div>
        <div v-if="subtitle" class="subtitle is-6 truncate" @click="$emit('subtitle')">{{ subtitle }}</div>
      </div>
    </div>
</template>
<script>
export default {
  props: {
    img: String,
    title: String,
    subtitle: String
  }
}
</script>
<style scoped>
.title:hover, .subtitle:hover {
  cursor: pointer;
  text-decoration: underline;
}

.card-image {
  cursor: pointer;
}
</style>
