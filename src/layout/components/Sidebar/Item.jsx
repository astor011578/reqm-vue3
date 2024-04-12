/* 使用 vue3.0 jsx 語法書寫 */
export default defineComponent({
  props: {
    icon: {
      type: String,
      default: ''
    },
    meta: {
      type: Object,
      default: null
    },
    title: {
      type: String,
      default: ''
    },
    elIcon: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const renderItem = () => {
      if (props.meta?.icon) {
        return <font-awesome-icon icon={props.meta?.icon} class="nav-icon" />
      }
    }
    return () => {
      return renderItem()
    }
  }
})
