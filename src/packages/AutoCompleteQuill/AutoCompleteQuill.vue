<template>
  <div class="auto-complete-quill-editor">
    <slot name="toolbar"></slot>
    <div ref="editor"></div>
    <div
      v-if="debounce && listShow"
      :class="customerListClassName+' quill_recommend_list'+ ' '+size"
      :style="listWrapStyle">
      <div v-if="fetchLoading"
           style="height: 60px;display: flex;align-items: center;justify-content: center;text-align: center">
        <slot name="loading">loading...</slot>
      </div>
      <ul class="recommendListUl" v-if="!fetchLoading&&recommendList.length">
        <li
          v-for="(item,dex) in recommendList"
          :class="itemClassName+ (selectedDex === dex?' active':'')"
          :key="dex"
          @click="selectLi(dex)">{{itemTextKey?item[itemTextKey]:item}}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import _Quill from 'quill'
  import defaultOptions from './options'

  const Quill = window.Quill || _Quill
  export default {
    name: "auto-complete-quill",
    props: {
      content: String,
      value: String,
      disabled: {
        type: Boolean,
        default: false
      },
      options: {
        type: Object,
        required: false,
        default: () => ({})
      },

      debounce: {
        type: Number,
        default: () => 3000,
      },
      customerListClassName: {
        type: String,
        default: () => 'quill-recommend-list'
      },
      fineTuning: {
        type: Object,
        default: () => ({left: 20, top: 80})
      },
      listWidth: {
        type: Number,
        default: () => 400
      },
      listZIndex: {
        type: Number,
        default: () => 50
      },
      fetchList: {
        type: Function,
        default: () => {
          return Promise.resolve([])
        }
      },
      size: {
        type: String,
        default: () => ''
      },
      sequent: {
        type: Boolean,
        default: () => true
      },
      itemClassName: {
        type: String,
        default: () => ''
      },
      itemTextKey: {
        type: String,
        default: () => ''
      }

    },
    data() {
      return {
        quill: null,
        _options: {},
        _content: '',
        defaultOptions,
        listShow: false,
        listPosition: {
          left: 0 + 'px',
          top: 0 + 'px'
        },
        timeoutInstance: null,
        lastFocus: 0,
        fetchLoading: false,
        recommendList: [],
        selectedDex: -1,
      }
    },
    computed: {
      listWrapStyle() {
        return Object.assign(this.listPosition, {width: this.listWidth + 'px', zIndex: this.listZIndex})
      }
    },
    mounted() {
      this.initialize()
    },
    beforeDestroy() {
      this.quill = null
      delete this.quill
    },
    methods: {

      initialize() {
        if (!this.$el) return
        // Options
        let keyOptions = {
          modules: {
            keyboard: {
              bindings: {
                tabKey: {
                  key: 9,
                  handler: console.log
                },
                leftKey: {
                  key: 37,
                  handler: () => !this.listShow,
                },
                upKey: {
                  key: 38,
                  handler: this.toggleSelectLi(-1)
                },
                rightKey: {
                  key: 39,
                  handler: () => !this.listShow,
                },
                downKey: {
                  key: 40,
                  handler: this.toggleSelectLi(1)
                },

                spaceKey: {
                  key: 32,
                  handler: this.keySelectConfirm
                },
                enterKey: {
                  key: 13,
                  handler: this.keySelectConfirm
                },
                escKey: {
                  key: 27,
                  handler: this.escKey
                }
              }
            }
          }
        }
        this._options = Object.assign({}, this.defaultOptions, this.options, keyOptions)
        // Instance
        this.quill = new Quill(this.$refs.editor, this._options)
        console.log(this.quill)
        this.quill.enable(false)
        // Set editor content
        if (this.value || this.content) {
          this.quill.pasteHTML(this.value || this.content)
        }
        // Disabled editor
        if (!this.disabled) {
          this.quill.enable(true)
        }
        // Mark model as touched if editor lost focus
        this.quill.on('selection-change', range => {
          if (!range) {
            this.$emit('blur', this.quill)
          } else {
            this.$emit('focus', this.quill)
          }
          if (!range) return
          let {index} = range
          this.lastFocus = index
        })
        // Update model if text changes
        this.quill.on('text-change', (delta, oldDelta, source) => {
          let html = this.$refs.editor.children[0].innerHTML
          const quill = this.quill
          const text = this.quill.getText()
          // console.log(text);
          if (html === '<p><br></p>') html = ''
          this._content = html
          this.$emit('input', this._content)
          this.$emit('change', {html, text, quill})

          let range = quill.getSelection()
          if (range) {
            let {index} = range
            this.lastFocus = index

            if (this.debounce && (source !== 'recommend' || this.sequent)) {
              clearTimeout(this.timeoutInstance)
              this.timeoutInstance = setTimeout(() => {
                let bounds = quill.getBounds(index)
                let editorWidth = this.$el.getBoundingClientRect().width
                let orL = (bounds.left + (this.fineTuning.left || 0))
                let orT = (bounds.top + (this.fineTuning.top || 0))
                this.listPosition = {
                  left: ((orL + this.listWidth) > editorWidth ? (editorWidth - this.listWidth) : orL) + 'px',
                  top: orT + 'px'
                }

                this.listShow = true
                this.$emit('recommendShow',this.quill)
                let cursorIndex = quill.getSelection().index
                let textBeforeCurse = quill.getText(0, cursorIndex)
                let wordBeforeCursor = 'word'
                let sentenceBeforeCursor = 'sentence'
                this.fetchLoading = true
                this.fetchList(textBeforeCurse, cursorIndex, wordBeforeCursor, sentenceBeforeCursor).then(res => {
                  this.fetchLoading = false
                  this.recommendList = res
                })
              }, this.debounce)
            }

          }

        })
        // Emit ready event
        this.$emit('ready', this.quill)

      },
      selectLi(dex) {
        let item = this.recommendList[dex]
        if (!item) return
        let text = this.itemTextKey ? item[this.itemTextKey] : item
        if (!text) {
          throw new Error('itemTextKey for auto-complete-quill is error')
        }
        this.quill.insertText(this.lastFocus, text, 'recommend')
        this.quill.setSelection(this.lastFocus + text.length)
        this.listShow = false
        this.selectedDex = -1
        this.$emit('select', item, dex)
      },
      toggleSelectLi(sign) {
        return function () {
          if (!this.listShow) return true
          else if (this.fetchLoading) return false
          else {
            this.selectedDex += sign
            if (this.selectedDex < 0) this.selectedDex = this.recommendList.length - 1
            if (this.selectedDex > this.recommendList.length - 1) this.selectedDex = 0
          }
        }.bind(this)

      },
      keySelectConfirm() {
        if (!this.listShow) return true
        else if (this.fetchLoading) return false
        else {
          this.selectLi(this.selectedDex)
        }
      },
      escKey() {
        clearTimeout(this.timeoutInstance)
        this.listShow = false
        this.fetchLoading = false
        this.quill.setSelection(this.lastFocus)
        this.$emit('recommendHide',this.quill)
      }
    },
    watch: {
      // Watch content change
      content(newVal, oldVal) {
        if (!this.quill) return
        if (newVal && newVal !== this._content) {
          this._content = newVal
          this.quill.pasteHTML(newVal)
        }
        else if (!newVal) {
          this.quill.setText('')
        }

      },
      // Watch content change
      value(newVal, oldVal) {
        if (!this.quill) return
        if (newVal && newVal !== this._content) {
          this._content = newVal
          this.quill.pasteHTML(newVal)
        } else if (!newVal) {
          this.quill.setText('')
        }
      },
      // Watch disabled change
      disabled(newVal, oldVal) {
        if (this.quill) {
          this.quill.enable(!newVal)
        }
      }
    }
  }
</script>

<style lang="scss" type="text/scss">
  .auto-complete-quill-editor {
    position: relative;
    .ql-container {
      min-height: 60px;
    }

    .quill_recommend_list {
      min-height: 60px;
      background-color: rgba(240, 245, 248, 0.8);
      padding: 4px;
      box-sizing: border-box;
      border-radius: 6px;
      position: absolute;
      top: 0;
      left: 0;
      border: solid 1px #ddd;
    }

    .recommendListUl {
      margin: 0;
      padding: 0;
      font-size: 16px;
      list-style: square;
      li {
        margin: 4px 0;
        padding: 4px 12px;
        display: block;
        cursor: pointer;
        list-style: square;
        background-color: rgba(255, 255, 255, 0);
        transition: all 0.3s;
        &:hover, &.active {
          background-color: #dfdfdf;
        }
      }
    }
    .mini .recommendListUl {
      font-size: 12px;
    }

    .small .recommendListUl {
      font-size: 14px;
    }

    .large .recommendListUl {
      font-size: 18px;
    }

    .xLarge .recommendListUl {
      font-size: 20px;
    }

  }

</style>
