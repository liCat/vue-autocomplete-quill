<template>
  <div id="app">
    <auto-complete-quill
      :disabled="false"
      :list-width="300"
      :debounce="1000"
      size="small"
      @input="handleInput"
      @fetch-list="fetchList"
      :recommendListLoading="recommendListLoading"
      :fetchList="fetchList"
      :recommendList="recommendList"
      item-class-name="listItem"
      item-text-key="text"
      :list-z-index='50'
      v-model="msg">
      <div slot="loading"><i class="fa fa-spinner fa-spin" aria-hidden="true"></i></div>
    </auto-complete-quill>
  </div>
</template>

<script>
  import AutoCompleteQuill from '../packages/AutoCompleteQuill/AutoCompleteQuill'
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'


  export default {
    name: 'app',
    components: {AutoCompleteQuill},
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
