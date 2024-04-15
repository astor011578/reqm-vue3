import path from 'path'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import viteSvgIcons from 'vite-plugin-svg-icons'
//inject title
import { createHtmlPlugin } from 'vite-plugin-html'
//setup name
// import VueSetupExtend from 'vite-plugin-vue-setup-extend-plus'
import Components from 'unplugin-vue-components/vite'
import UnoCSS from 'unocss/vite'
import { presetAttributify, presetIcons, presetUno } from 'unocss'
import mkcert from 'vite-plugin-mkcert'
import DefineOptions from 'unplugin-vue-define-options/vite'
//auto import vue https://www.npmjs.com/package/unplugin-auto-import
import AutoImport from 'unplugin-auto-import/vite'
import setting from './src/settings'

// import packageJson from './package.json'
// import { loadEnv } from 'vite'
// import { optimizeDependencies, optimizeElementPlus } from './optimize-include'
const pathSrc = path.resolve(__dirname, 'src')
export default ({ command, mode }) => {
  return {
    //to get details please refer: https://vitejs.cn/config/#base
    base: setting.viteBasePath,
    //define global variables
    define: {
      //fix "path" module issue
      'process.platform': null,
      'process.version': null,
      GLOBAL_STRING: JSON.stringify('testing global variable defined in vite.config.js'),
      GLOBAL_VAR: {
        test: 'testing global variable defined in vite.config.js'
      }
    },
    clearScreen: false,
    server: {
      hmr: true,                  //停用或配置 HMR 熱更新
      // hmr: { overlay: false }, //若 server.hmr.overlay 為 false 可停用錯誤遮罩層
      port: 7070,                 //服務器接口埠號
      open: false,                //是否在服務器啟動後自動在瀏覽器開啟應用程式
      cors: true,                 //是否同意任何異域資源共享 (CORS)
      host: true,
      https: true                 //是否使用 https 通訊協定 (若使用, 首次運行會比較慢, 並且會有個輸入密碼的步驟
      //proxy look for https://vitejs.cn/config/#server-proxy
      // proxy: {
      //   '/api': {
      //     target: loadEnv(mode, process.cwd()).VITE_APP_PROXY_URL,
      //     changeOrigin: true,
      //     rewrite: (path) => path.replace(/^\/api/, '')
      //   }
      // }
    },
    preview: {
      port: 7071,
      host: true,
      strictPort: true
    },
    plugins: [
      vue({ reactivityTransform: true }),
      // Icons({
      //   autoInstall: true,
      // }),
      vueJsx(),
      UnoCSS({
        presets: [presetUno(), presetAttributify(), presetIcons()]
      }),
      DefineOptions(),
      mkcert(),
      //compatible with old browsers
      // legacy({
      //   targets: ['chrome 52'],
      //   additionalLegacyPolyfills: ['regenerator-runtime/runtime']
      // }),
      viteSvgIcons({
        //config svg dir that can config multi
        iconDirs: [path.resolve(process.cwd(), 'src/icons/common'), path.resolve(process.cwd(), 'src/icons/nav-bar')],
        //appoint svg icon using mode
        symbolId: 'icon-[dir]-[name]'
      }),
      //VueSetupExtend(), using DefineOptions instantance
      //https://github.com/antfu/unplugin-auto-import/blob/HEAD/src/types.ts
      Components({
        resolvers: [
          //on-demand element-plus has some issue
          //  ElementPlusResolver({
          //    importStyle: 'sass'
          //  })
          //import icons
          //https://github.com/antfu/unplugin-icons
          //  IconsResolver(),
        ]
      }),
      AutoImport({
        // resolvers: [ElementPlusResolver()],
        imports: [
          'vue',
          'pinia',
          'vue-router',
          {
            '@/hooks/global/useCommon': ['useCommon'],
            '@/hooks/global/useElement': ['useElement'],
            '@/hooks/global/useVueRouter': ['useVueRouter'],
            '@/utils/axiosReq': ['axiosReq']
          }
        ],
        eslintrc: {
          enabled: true,                            //default `false`
          filepath: './.eslintrc-auto-import.json', //default `./.eslintrc-auto-import.json`
          globalsPropValue: true                    //default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
        },
        dts: true                                   //auto generation auto-imports.d.ts file
      }),
      //auto config of index.html title
      createHtmlPlugin({
        inject: {
          //inject data into ejs template
          data: {
            title: setting.title
          }
        }
      })
    ],
    build: {
      //target: 'es2015',
      minify: 'terser',
      brotliSize: false,
      //消除 bundle up 大小超過 500kb 警告
      chunkSizeWarningLimit: 5000,
      terserOptions: {
        //to get details please refer: https://terser.org/docs/api-reference#compress-options
        compress: {
          drop_console: false,
          pure_funcs: ['console.log', 'console.info'],
          drop_debugger: true
        }
      },
      //build assets
      assetsDir: 'static/assets',
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
        }
      }
    },
    resolve: {
      alias: {
        '~/': `${pathSrc}/`,
        '@/': `${pathSrc}/`
      }
      //the reason why it's removed, please refer: https://github.com/vitejs/vite/issues/6026
      //extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.vue', '.mjs']
    },
    css: {
      //  postcss: {
      //   //remove build charset warning
      //    plugins: [
      //      {
      //        postcssPlugin: 'internal:charset-removal',
      //        AtRule: {
      //          charset: (atRule) => {
      //            if (atRule.name === 'charset') {
      //              atRule.remove()
      //            }
      //          }
      //        }
      //      }
      //    ]
      //  },
      //  preprocessorOptions: {
      //    //define global scss variable  import
      //    scss: {
      //      additionalData: `@use '@/theme/index.scss' as * ;`
      //    }
      //  }
    },
    optimizeDeps: {
      // include: [...optimizeDependencies,...optimizeElementPlus] //on-demand element-plus use this
      // include: [...optimizeDependencies]
    }
  }
}
