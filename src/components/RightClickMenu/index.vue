<template>
  <div class="right_menu_wrap">
    <div v-show="menuVisible">
      <ul :id="menuId" class="menu">
        <slot />
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    menuVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      menuId: 'menu'
    }
  },
  mounted() {
    this.$on('rightClickMenu', (event, menuId) => {
      if (menuId) {
        this.menuId = menuId
      }
      this.$nextTick(() => {
        this.rightClickMenu(event)
      })
    })
  },
  methods: {
    rightClickMenu(event) {
      this.$emit('update:menuVisible', false)
      const menu = document.querySelector(`#${this.menuId}`)
      if (menu) {
        if (document.body.clientHeight - event.clientY > 200) {
          menu.style.top = event.clientY + 10 + 'px'
          menu.style.bottom = 'auto'
        } else {
          menu.style.bottom = document.body.clientHeight - event.clientY + 'px'
          menu.style.top = 'auto'
        }
        menu.style.left = event.clientX + 10 + 'px'
        document.addEventListener('click', this.foo) // 给整个document添加监听鼠标事件，点击任何位置执行foo方法
        this.$emit('update:menuVisible', true)
      }
    },
    foo() {
      // 取消鼠标监听事件 菜单栏
      this.$emit('update:menuVisible', false)
      document.removeEventListener('click', this.foo) // 要及时关掉监听，不关掉的是一个坑，不信你试试，虽然前台显示的时候没有啥毛病，加一个alert你就知道了
    }
  }
}
</script>

<style lang="scss" scoped>
.menu__item {
  display: block;
  line-height: 40px;
  text-align: center;
  padding: 0px 30px;
  margin: 0px 0;
  height: 40px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  white-space: nowrap;
  &:hover {
    background: #efefef;
  }
  &.color_red {
    color: #f56c6c;
  }
  &.color_green {
    color: #67c23a;
  }
}
.menu {
  position: fixed;
  border: 1px solid rgba(243, 243, 243, 1);
  box-shadow: 0px 4px 14px 0px rgba(4, 0, 0, 0.22);
  background-color: #fff;
  z-index: 99999;
  padding-inline-start: 0px;
}
</style>
