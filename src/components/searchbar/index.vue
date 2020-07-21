<template>
  <div class="main">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <div v-if="$route.meta.hasGoBack" class="go_back" @click="goBack">
      <i class="iconfont icon-fanhui" />
      返回
    </div>
    <slot />
  </div>
</template>

<script>
import Hamburger from '@/components/Hamburger'
import { mapGetters } from 'vuex'
export default {
  components: {
    // Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters(['sidebar'])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    goBack() {
      this.$router.back(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  background: #f8f5f5;
  height: 44px;
  align-items: center;
  display: flex;
}
.hamburger-container {
  line-height: 44px;
  height: 100%;
  float: left;
  cursor: pointer;
  transition: background 0.3s;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    background: rgba(0, 0, 0, 0.025);
  }
}
.go_back {
  cursor: pointer;
  width: 80px;
  height: 30px;
  background: rgba(69, 181, 76, 1);
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 14px;
  .iconfont {
    font-size: 22px;
    margin-right: 5px;
  }
  &:hover {
    opacity: .8;
  }
}
</style>
