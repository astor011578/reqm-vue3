import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer'
//import.meta.glob 進行全部引入
const modulesFiles = import.meta.globEager('../mock/*.js')
let modules = []
for (const path in modulesFiles) {
  modules = modules.concat(modulesFiles[path].default)
}
export const setupProdMockServer = () => createProdMockServer([...modules])
