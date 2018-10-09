<template>
    <div>
        <span v-for="(i,k) in locations" :key="k">
            {{i}}>
        </span>
    </div>
</template>

<script>
export default {
    props:{
        locations:["工作台","添加新文章"]
    }
}
</script>

<style>

</style>
