// 引入组件
import AutoCompleteQuill from './AutoCompleteQuill'

AutoCompleteQuill.install = Vue => Vue.component(AutoCompleteQuill.name, AutoCompleteQuill)
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(AutoCompleteQuill)
}
export default AutoCompleteQuill
