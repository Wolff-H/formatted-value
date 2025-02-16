import { createApp } from "vue"
import Playground from './Playground.vue'
import "@/assets/stylesheets/overall/index.styl"
import "@/assets/stylesheets/colorset/define-css-variables.styl"

const app = createApp(Playground)

app.mount('body')
