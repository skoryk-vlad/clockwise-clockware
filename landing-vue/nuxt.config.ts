export default defineNuxtConfig({
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: '@import "@/assets/scss/reset.scss"; @import "@/assets/scss/constants.scss";',
                }
            }
        }
    },
    plugins: ['@/plugins/page-routing.js'],
    app: {
        head: {
            charset: 'utf-8',
            viewport: 'width=device-width,initial-scale=1.0',
            title: 'Clockwise Software'
        }
    }
});
