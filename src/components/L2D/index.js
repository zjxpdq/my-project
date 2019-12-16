import {L2Dwidget} from 'live2d-widget'

export default {
  name: 'L2DWidget',
  function: true,
  data() {
    return {
      init: {
        pluginRootPath: 'live2dw/',
        pluginJsPath: 'lib/',
        // pluginModelPath: 'assets/',
        pluginModelPath: `live2d-widget-model-${this.model}/assets/`,
        tagMode: false,
        debug: false,
        model: {
          // use: 'live2d-widget-model-chitose'
          jsonPath: `/live2dw/live2d-widget-model-${this.model}/assets/${this.model}.model.json`
        },
        display: {},
        mobile: {
          show: true
        },
        dialog: {
          enable: true,
          hitokoto: true
        },
        log: false
      }
    }
  },
  props: {
    model: {
      type: String,
      default: 'hibiki'
    },
    styles: {
      type: Object,
      default() {
        return {
          position: 'left',
          hOffset: 100,
          vOffset: 30,
          width: 300,
          height: 700
        }
      }
    }
  },
  watch: {
    styles: {
      handler() {
        this.initL2D()
      },
      deep: true
    },
    model: {
      handler() {
        this.initL2D()
      },
      deep: true
    }
  },
  methods: {
    initL2D() {
      let init = this.init
      Object.assign(init.display, this.styles)
      L2Dwidget.init(init)
    }
  },
  mounted() {
    this.initL2D()
  },
  render(h) {
    return h('span')
  }
}
