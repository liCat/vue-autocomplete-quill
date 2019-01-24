# vue-auto-complete-quill

> 一个支持自动补全功能的vue 富文本编辑器。

## install

``` bash
npm install vue-auto-complete-quill --save
```
或
```
yarn add vue-auto-complete-quill --save
```

## quick start
### 用法1：
in main.js
``` javascript
// in main.js
import Vue from 'vue'

import 'quill/dist/quill.core.css' // quill 样式文件
import 'quill/dist/quill.snow.css'// quill 样式文件
import 'quill/dist/quill.bubble.css'// quill 样式文件

import vueAutoCompleteQuill from 'vue-auto-complete-quill'



Vue.use(vueAutoCompleteQuill)
//... others
```
in component
```html
// in component
<template>
  <div id="app">
    <auto-complete-quill
      :disabled="false"
      :list-width="300"
      :auto-complete-timeout="1000"
      size="small"
      @input="handleInput"
      @fetch-list="fetchList"
      :recommendListLoading="recommendListLoading"
      :fetchList="fetchList"
      :recommendList="recommendList"
      item-class-name="listItem"
      item-text-key="text"
      :list-z-index='50'
      :content="msg">
      <div slot="loading"><i class="fa fa-spinner fa-spin" aria-hidden="true"></i></div>
    </auto-complete-quill>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data() {
      return {
        msg: 'Welcome to quill auto complete component',
        recommendListLoading: false,
        recommendList: [],
        fetchList(textBeforeCursor, cursorIndex, wordBeforeCursor, sentenceBeforeCursor) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve([
                {
                  id: 1,
                  text: 'The Tottenham outrage of 23 January 1909 was a theft of wages from the Schnurmann rubber factory in Tottenham, North London, followed by a two-hour, six-mile (10 km) police chase. '
                },
                {
                  id: 2,
                  text: 'The armed robbers, Paul Helfeld and Jacob Lepidus, killed themselves at the end of the pursuit. The bravery of the police led to the creation of the King\'s Police Medal, awarded to several of those involved in the pursuit.'
                },
                {
                  id: 3,
                  text: 'A joint funeral for the two shooting victims—Police Constable William Tyler and Ralph Joscelyne, a ten-year-old boy—was attended by a crowd of up to half a million mourners, including 2,000 policemen. '
                },
                {
                  id: 4,
                  text: 'The deaths exacerbated ill feelings towards immigrants in London, and much of the press coverage was anti-Semitic in nature; Helfeld and Lepidus were Jewish Latvian Socialists'
                },
              ])
            }, 3000)
          })
        },
      }
    },
    methods: {
      handleInput(val) {
        this.msg = val
      },

    }
  }
</script>

<style lang="scss">
  #app {
  }

  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }

  .listItem {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    &:before {
      content: '*  '
    }
  }
</style>

```

用法2：
直接在组件中引入单个组件
```
<template>
  <div id="app">
    <auto-complete-quill
      :disabled="false"
      :list-width="300"
      :auto-complete-timeout="1000"
      size="small"
      @input="handleInput"
      @fetch-list="fetchList"
      :recommendListLoading="recommendListLoading"
      :fetchList="fetchList"
      :recommendList="recommendList"
      item-class-name="listItem"
      item-text-key="text"
      :list-z-index='50'
      :content="msg">
      <div slot="loading"><i class="fa fa-spinner fa-spin" aria-hidden="true"></i></div>
    </auto-complete-quill>
  </div>
</template>

<script>
  import {AutoCompleteQuill} from 'vue-auto-complete-quill'
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'


  export default {
    name: 'app',
    components: {AutoCompleteQuill},
    data() {
      return {
        // ...some data
      }
    },
    methods: {
     //...some method
    }
  }
</script>

<style lang="scss">
  /*...some style*/
</style>

```

## document
### props
|props | type| required | defaultValue|description|
|:---- |:----|:--------------|:-------| :---------|
| value | String | true |-- |可以使用v-model 双向绑定的html内容|
| content | String | false |-- |和v-model 即value 只能二选其一，content为单向绑定html内容，可以通过input事件取得编辑器内容|
| debounce | Number | true | 3000 | 触发自动补全弹窗的延迟数，如果为0则关闭补全功能。 |
| fetchList | Function | true |  (){return Promise.resolve([])}  | 触发补全的回调函数，在该函数中可以获取推荐列表。该函数的参数有：`textBeforeCurse`：位于光标前面的正文（纯文本，无html标签）, `cursorIndex`：光标位置, `wordBeforeCursor`：光标前的一个单词, `sentenceBeforeCursor`：光标前的一句话。该函数请返回一个Promise, resolve 的内容是一个数组，数组中可以是纯字符，也可以是对象。这个数组就是为推荐列表准备的数据。 |
| itemTextKey | String | false | '' |如果设置了此值，将取用推荐表列中单个元素item的item[itemTextKey]作为文本内容。如果不设置此值，默认将使用 item 作为文本内容。 |
| disabled | Boolean | false |false |是否禁用编辑，禁用时只起到解析html的作用|
| options | Object | false |{} |quill 编辑器的配置项|
| customerListClassName | String | false |'quill-recommend-list' | 补全推荐列表的className |
| fineTuning | Object | false |{left:20,top:80} |对补全推荐列表弹窗位置的微调|
| listWidth | Number | false | 400 | 补全推荐列表弹窗宽度 |
| listZIndex | Number | false | 50 |  补全推荐列表弹窗z-index |
| size | String | false | '' | 补全弹窗的尺寸，可选值有'mini','small','large','xLarge' ;为空时是正常大小|
| sequent | Boolean | false | true | 是否可以连续触发补全。为false时，上一次选择推荐内容后，需要用户键入内容后，才会触发新的补全推荐|



### event
|name | params | description|
|:---- |:----|:-------|
|ready |quill 编辑器|quill 编辑器初始化完毕时触发|
|blur |quill 编辑器| 编辑器失焦时触发|
|focus |quill 编辑器| 编辑器获取到焦时触发|
|input | 正文内空 | 输入文本时触发|
|change |{html,text,quill},html为正文，text为纯文本正文，quill为编辑器| 文本变化时触发 |
|recommendShow |quill 编辑器| 推荐窗弹出时触发|
|select |item,index 。item 为选择的推荐列表中的条目，index为其在数组中的下标| 选择推荐列表中的单条时触发 |
|recommendHide  |quill 编辑器| 推荐窗隐藏时触发|


### slot
|name | 说明 |
|:---- |:----|
|loading | 在获取推荐列表时的Loading插槽 |
